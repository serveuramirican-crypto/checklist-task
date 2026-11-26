import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Flame,
  Radio,
  RefreshCw,
  ShieldAlert,
  Soup,
  Sparkles,
  Swords,
} from 'lucide-react';
import type { CharacterLoadout } from '../game/progression';
import type { UrgencyPhase } from '../game/time';
import { soundEngine } from '../game/audio';
import { useI18n } from '../i18n/I18nContext';
import {
  drawCampfire,
  drawCampShelter,
  drawDroneCompanion,
  drawNightstalker,
  drawSlashEffect,
  drawSurvivor,
  drawWolfCompanion,
  px,
  type SurvivorPose,
} from './sprites';

export interface CanvasEventBurst {
  id: number;
  kind: 'task' | 'level_up' | 'death';
  label: string;
}

interface SurvivalCanvasProps {
  loadout: CharacterLoadout;
  urgencyPhase: UrgencyPhase;
  hasTasksToday: boolean;
  isDead?: boolean;
  dayNumber: number;
  level: number;
  points: number;
  burst: CanvasEventBurst | null;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

interface Stalker {
  id: number;
  x: number;
  targetX: number;
  y: number;
  facingLeft: boolean;
  state: 'lurking' | 'creeping' | 'recoil' | 'fleeing';
  recoil: number;
}

const W = 320;
const H = 180;

// Deterministic star field with varying brightness and cross shapes
const STARS = Array.from({ length: 52 }, (_, idx) => ({
  x: (idx * 59 + 17) % W,
  y: (idx * 31 + 5) % 82,
  size: idx % 9 === 0 ? 2 : 1,
  cross: idx % 11 === 0,
  phase: idx % 7,
}));

export function SurvivalCanvas({
  loadout,
  urgencyPhase,
  hasTasksToday,
  isDead = false,
  dayNumber,
  level,
  points,
  burst,
}: SurvivalCanvasProps) {
  const { t, dir, isRtl } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Interactive gameplay state
  const [warmth, setWarmth] = useState(95);
  const [perimeterDefense, setPerimeterDefense] = useState(100);
  const [weatherMode, setWeatherMode] = useState<
    'auto' | 'clear' | 'blood_moon' | 'blizzard' | 'aurora'
  >('auto');

  const stateRef = useRef({
    loadout,
    urgencyPhase,
    hasTasksToday,
    isDead,
    dayNumber,
    level,
    points,
    isRtl,
    warmth,
    weatherMode,
  });

  stateRef.current = {
    loadout,
    urgencyPhase,
    hasTasksToday,
    isDead,
    dayNumber,
    level,
    points,
    isRtl,
    warmth,
    weatherMode,
  };

  const animRef = useRef<{
    poseOverride: SurvivorPose | null;
    poseUntil: number;
    particles: Particle[];
    popups: FloatingText[];
    flashAlpha: number;
    lastBurstId: number;
    slash: { active: boolean; progress: number; x: number; y: number } | null;
    isHowling: boolean;
    howlUntil: number;
    isScanning: boolean;
    scanUntil: number;
    stalkers: Stalker[];
    shootingStar: { x: number; y: number; vx: number; vy: number; life: number } | null;
  }>({
    poseOverride: null,
    poseUntil: 0,
    particles: [],
    popups: [],
    flashAlpha: 0,
    lastBurstId: 0,
    slash: null,
    isHowling: false,
    howlUntil: 0,
    isScanning: false,
    scanUntil: 0,
    stalkers: [
      { id: 1, x: 26, targetX: 42, y: 144, facingLeft: false, state: 'lurking', recoil: 0 },
      { id: 2, x: 294, targetX: 278, y: 144, facingLeft: true, state: 'lurking', recoil: 0 },
    ],
    shootingStar: null,
  });

  // Action: Defend / Strike
  const handleDefend = useCallback(() => {
    if (isDead) return;
    const now = performance.now();
    soundEngine.playSlash();

    animRef.current.poseOverride = 'strike';
    animRef.current.poseUntil = now + 420;
    animRef.current.slash = {
      active: true,
      progress: 0,
      x: 196,
      y: 132,
    };

    // Check hit on stalkers
    let hitAny = false;
    animRef.current.stalkers.forEach((s) => {
      // If stalker is creeping within reach
      if (Math.abs(s.x - 178) < 130) {
        hitAny = true;
        s.state = 'recoil';
        s.recoil = 8;
        soundEngine.playMonsterHit();
        animRef.current.popups.push({
          x: s.x,
          y: s.y - 14,
          text: 'DEFENDED! +15 DEF',
          color: '#facc15',
          life: 65,
        });
        setTimeout(() => {
          s.state = 'fleeing';
          s.recoil = 0;
        }, 300);
      }
    });

    if (!hitAny) {
      animRef.current.popups.push({
        x: 180,
        y: 110,
        text: 'SLASH!',
        color: '#e2e8f0',
        life: 40,
      });
    }

    setPerimeterDefense((prev) => Math.min(100, prev + 15));
  }, [isDead]);

  // Action: Stoke Campfire
  const handleStoke = useCallback(() => {
    if (isDead) return;
    const now = performance.now();
    soundEngine.playStokeFire();

    animRef.current.poseOverride = 'warm_hands';
    animRef.current.poseUntil = now + 650;

    // Burst fire particles
    for (let i = 0; i < 16; i++) {
      animRef.current.particles.push({
        x: 128 + (Math.random() - 0.5) * 10,
        y: 138,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -1.0 - Math.random() * 1.5,
        life: 40 + Math.floor(Math.random() * 20),
        maxLife: 60,
        color: Math.random() > 0.4 ? '#facc15' : '#f97316',
        size: 2,
      });
    }

    animRef.current.popups.push({
      x: 128,
      y: 120,
      text: '+WARMTH RESTORED',
      color: '#f97316',
      life: 60,
    });

    setWarmth(100);
  }, [isDead]);

  // Action: Pet Wolf
  const handlePetWolf = useCallback(() => {
    if (isDead) return;
    const hasWolf = loadout.companions.some((c) => c.id === 'wolf');
    if (!hasWolf) return;

    const now = performance.now();
    soundEngine.playWolfHowl();

    animRef.current.poseOverride = 'petting';
    animRef.current.poseUntil = now + 900;
    animRef.current.isHowling = true;
    animRef.current.howlUntil = now + 1200;

    animRef.current.popups.push({
      x: 214,
      y: 122,
      text: 'WOLF HOWL! LOYALTY +100%',
      color: '#38bdf8',
      life: 70,
    });
  }, [isDead, loadout.companions]);

  // Action: Drone Recon Scan
  const handleDroneScan = useCallback(() => {
    if (isDead) return;
    const hasDrone = loadout.companions.some((c) => c.id === 'drone');
    if (!hasDrone) return;

    const now = performance.now();
    soundEngine.playDroneScan();

    animRef.current.isScanning = true;
    animRef.current.scanUntil = now + 1400;

    animRef.current.popups.push({
      x: 154,
      y: 82,
      text: 'PERIMETER SCANNED: SECURE',
      color: '#4ade80',
      life: 75,
    });

    setPerimeterDefense(100);
  }, [isDead, loadout.companions]);

  // Action: Stir Stew Pot
  const handleStirPot = useCallback(() => {
    if (isDead) return;
    const hasPot = loadout.companions.some((c) => c.id === 'cooking_pot');
    if (!hasPot) return;

    const now = performance.now();
    soundEngine.playPotBubble();

    animRef.current.poseOverride = 'warm_hands';
    animRef.current.poseUntil = now + 600;

    animRef.current.popups.push({
      x: 128,
      y: 114,
      text: 'HEARTY STEW: WELL FED!',
      color: '#facc15',
      life: 60,
    });

    setWarmth((prev) => Math.min(100, prev + 10));
  }, [isDead, loadout.companions]);

  // Cycle weather mode
  const handleCycleWeather = useCallback(() => {
    setWeatherMode((curr) => {
      const modes: Array<'auto' | 'clear' | 'blood_moon' | 'blizzard' | 'aurora'> = [
        'auto',
        'clear',
        'blood_moon',
        'blizzard',
        'aurora',
      ];
      const nextIdx = (modes.indexOf(curr) + 1) % modes.length;
      const next = modes[nextIdx];
      animRef.current.popups.push({
        x: 160,
        y: 60,
        text: `WEATHER: ${next.toUpperCase().replace('_', ' ')}`,
        color: '#38bdf8',
        life: 50,
      });
      return next;
    });
  }, []);

  // Handle Canvas Click to interact or defend
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDead) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Click near campfire
    if (clickX >= 110 && clickX <= 145 && clickY >= 120 && clickY <= 150) {
      handleStoke();
      return;
    }
    // Click near wolf
    if (
      clickX >= 200 &&
      clickX <= 235 &&
      clickY >= 125 &&
      loadout.companions.some((c) => c.id === 'wolf')
    ) {
      handlePetWolf();
      return;
    }
    // Click near drone
    if (
      clickX >= 140 &&
      clickX <= 170 &&
      clickY >= 75 &&
      clickY <= 115 &&
      loadout.companions.some((c) => c.id === 'drone')
    ) {
      handleDroneScan();
      return;
    }
    // Click near pot
    if (
      clickX >= 115 &&
      clickX <= 140 &&
      clickY >= 105 &&
      clickY <= 130 &&
      loadout.companions.some((c) => c.id === 'cooking_pot')
    ) {
      handleStirPot();
      return;
    }

    // Otherwise, perform defensive strike towards click
    handleDefend();
  };

  // Process server bursts
  useEffect(() => {
    if (!burst || burst.id === animRef.current.lastBurstId) return;
    animRef.current.lastBurstId = burst.id;

    const now = performance.now();
    if (burst.kind === 'death') {
      animRef.current.poseOverride = 'perished';
      animRef.current.poseUntil = now + 6000;
      animRef.current.popups.push({
        x: 175,
        y: 105,
        text: burst.label,
        color: '#ef4444',
        life: 100,
      });
      return;
    }

    const isLevelUp = burst.kind === 'level_up';
    animRef.current.poseOverride = isLevelUp ? 'level_up' : 'celebrate';
    animRef.current.poseUntil = now + (isLevelUp ? 2800 : 1300);
    if (isLevelUp) {
      animRef.current.flashAlpha = 0.85;
    }

    const count = isLevelUp ? 46 : 22;
    const colors = isLevelUp
      ? ['#facc15', '#fef08a', '#f97316', '#38bdf8', '#4ade80']
      : ['#facc15', '#fb923c', '#4ade80'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (isLevelUp ? 2.0 : 1.2) * (0.4 + Math.random());
      animRef.current.particles.push({
        x: 184 + (Math.random() - 0.5) * 16,
        y: 126 + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (isLevelUp ? 1.5 : 1.0),
        life: 38 + Math.floor(Math.random() * 26),
        maxLife: 64,
        color: colors[i % colors.length],
        size: isLevelUp && i % 3 === 0 ? 3 : 2,
      });
    }

    animRef.current.popups.push({
      x: 168,
      y: 106,
      text: burst.label,
      color: isLevelUp ? '#facc15' : '#4ade80',
      life: isLevelUp ? 110 : 75,
    });
  }, [burst]);

  // Campfire warmth & perimeter passive decay
  useEffect(() => {
    const timer = setInterval(() => {
      setWarmth((prev) => Math.max(20, prev - 1));
      setPerimeterDefense((prev) => {
        const decay = urgencyPhase === 'critical' ? 2 : 1;
        return Math.max(15, prev - decay);
      });
    }, 4500);
    return () => clearInterval(timer);
  }, [urgencyPhase]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let tick = 0;
    let lastSpriteStep = 0;
    let spriteFrame = 0;

    const render = (now: number) => {
      tick += 1;
      if (now - lastSpriteStep > 170) {
        spriteFrame += 1;
        lastSpriteStep = now;
      }

      const {
        loadout: ld,
        urgencyPhase: phase,
        hasTasksToday: hasTasks,
        isDead: deadProp,
        isRtl: rtlMode,
        warmth: warmthVal,
        weatherMode: modeSetting,
      } = stateRef.current;
      const anim = animRef.current;

      ctx.imageSmoothingEnabled = false;

      // Determine active weather condition
      let activeWeather = modeSetting;
      if (activeWeather === 'auto') {
        if (deadProp) {
          activeWeather = 'blizzard';
        } else if (phase === 'critical' && hasTasks) {
          activeWeather = 'blood_moon';
        } else if (phase === 'survived') {
          activeWeather = 'aurora';
        } else {
          activeWeather = 'clear';
        }
      }

      // Check pose
      let pose: SurvivorPose = 'idle';
      if (deadProp) {
        pose = 'perished';
      } else if (anim.poseOverride && now < anim.poseUntil) {
        pose = anim.poseOverride;
      } else {
        anim.poseOverride = null;
        if (phase === 'critical' && hasTasks) {
          pose = 'stressed';
        }
      }

      const isDeadState = pose === 'perished';

      // 1. SKY GRADIENT (Dithered retro palette)
      let skyTop = '#050811';
      let skyMid = '#0c1322';
      let skyBot = '#1a2333';

      if (activeWeather === 'blood_moon') {
        skyTop = '#190408';
        skyMid = '#2b070e';
        skyBot = '#4c0e17';
      } else if (activeWeather === 'aurora') {
        skyTop = '#03111b';
        skyMid = '#06202d';
        skyBot = '#0c2e38';
      } else if (activeWeather === 'blizzard') {
        skyTop = '#090d16';
        skyMid = '#151d2c';
        skyBot = '#232d3f';
      }

      const skyGrad = ctx.createLinearGradient(0, 0, 0, 144);
      skyGrad.addColorStop(0, skyTop);
      skyGrad.addColorStop(0.55, skyMid);
      skyGrad.addColorStop(1, skyBot);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, 144);

      // Subtle sky dithering for 16-bit texture
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      for (let dy = 0; dy < 144; dy += 2) {
        for (let dx = dy % 4; dx < W; dx += 4) {
          ctx.fillRect(dx, dy, 1, 1);
        }
      }

      // 2. STARS & SHOOTING STARS
      STARS.forEach((star) => {
        const twinkle = (spriteFrame + star.phase) % 6 === 0 ? 0.35 : 0.9;
        ctx.fillStyle = `rgba(241, 245, 249, ${twinkle})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
        if (star.cross && (spriteFrame + star.phase) % 4 === 0) {
          px(ctx, star.x - 1, star.y, 3, 1, 'rgba(254, 240, 138, 0.7)');
          px(ctx, star.x, star.y - 1, 1, 3, 'rgba(254, 240, 138, 0.7)');
        }
      });

      // Occasional shooting star
      if (!anim.shootingStar && Math.random() < 0.005) {
        anim.shootingStar = {
          x: 20 + Math.random() * 200,
          y: 8 + Math.random() * 25,
          vx: 3.5 + Math.random() * 2,
          vy: 1.2 + Math.random() * 0.8,
          life: 20,
        };
      }
      if (anim.shootingStar) {
        const ss = anim.shootingStar;
        ctx.strokeStyle = `rgba(254, 240, 138, ${ss.life / 20})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * 3, ss.y - ss.vy * 3);
        ctx.stroke();
        px(ctx, ss.x, ss.y, 2, 2, '#ffffff');
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life -= 1;
        if (ss.life <= 0) anim.shootingStar = null;
      }

      // 3. CELESTIAL MOON & AURORA
      if (activeWeather === 'aurora') {
        // Northern lights ribbon
        const wave1 = Math.sin(tick * 0.03) * 6;
        const wave2 = Math.cos(tick * 0.025) * 8;
        ctx.fillStyle = 'rgba(52, 211, 153, 0.18)';
        ctx.fillRect(0, 24 + wave1, W, 18);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
        ctx.fillRect(0, 36 + wave2, W, 14);
        ctx.fillStyle = 'rgba(167, 139, 250, 0.09)';
        ctx.fillRect(0, 18 + wave1 * 0.5, W, 12);
      }

      // Detailed Pixel Moon (Craters + Aura)
      const moonX = 260;
      const moonY = 20;
      if (activeWeather === 'blood_moon') {
        // Pulsing blood moon corona
        const pulse = 0.2 + (Math.sin(tick * 0.08) + 1) * 0.12;
        ctx.fillStyle = `rgba(239, 68, 68, ${pulse})`;
        ctx.beginPath();
        ctx.arc(moonX + 8, moonY + 8, 14, 0, Math.PI * 2);
        ctx.fill();

        // Crimson moon disk
        px(ctx, moonX + 2, moonY, 12, 16, '#991b1b');
        px(ctx, moonX, moonY + 2, 16, 12, '#b91c1c');
        px(ctx, moonX + 2, moonY + 2, 12, 12, '#dc2626');
        // Dark craters
        px(ctx, moonX + 5, moonY + 5, 3, 3, '#7f1d1d');
        px(ctx, moonX + 9, moonY + 9, 2, 2, '#7f1d1d');
      } else {
        // Silver-Gold radiant moon
        ctx.fillStyle = 'rgba(254, 240, 138, 0.12)';
        ctx.beginPath();
        ctx.arc(moonX + 8, moonY + 8, 15, 0, Math.PI * 2);
        ctx.fill();

        px(ctx, moonX + 2, moonY, 12, 16, '#cbd5e1');
        px(ctx, moonX, moonY + 2, 16, 12, '#e2e8f0');
        px(ctx, moonX + 2, moonY + 2, 12, 12, '#f8fafc');
        // Craters
        px(ctx, moonX + 4, moonY + 4, 3, 3, '#94a3b8');
        px(ctx, moonX + 9, moonY + 8, 3, 2, '#94a3b8');
        px(ctx, moonX + 6, moonY + 11, 2, 2, '#94a3b8');
      }

      // 4. FAR POST-APOCALYPTIC SKYLINE (ruined buildings & radio tower)
      ctx.fillStyle = '#0a101d';
      for (let mx = 0; mx < W; mx += 16) {
        const peak = 28 + ((mx * 23) % 32);
        ctx.fillRect(mx, 144 - peak, 16, peak);
        // Ruined window dots
        if (mx % 32 === 0) {
          px(ctx, mx + 4, 144 - peak + 8, 2, 2, 'rgba(254, 240, 138, 0.4)');
          px(ctx, mx + 10, 144 - peak + 14, 2, 2, 'rgba(254, 240, 138, 0.3)');
        }
      }

      // Blinking Radio Tower beacon
      px(ctx, 224, 86, 2, 30, '#0a101d');
      px(ctx, 222, 94, 6, 2, '#0a101d');
      px(ctx, 221, 106, 8, 2, '#0a101d');
      if (spriteFrame % 4 < 2) {
        px(ctx, 224, 84, 2, 2, '#ef4444');
      }

      // 5. MIDGROUND WASTELAND TREES & BARRICADES
      ctx.fillStyle = '#060a12';
      for (let tx = 4; tx < W; tx += 18) {
        const th = 26 + ((tx * 13) % 18);
        ctx.fillRect(tx + 4, 144 - th, 4, th);
        ctx.fillRect(tx + 2, 144 - th + 6, 8, th - 6);
        ctx.fillRect(tx, 144 - th + 14, 12, th - 14);
      }

      // Low fog / mist rolling over the ruins
      ctx.fillStyle =
        activeWeather === 'blood_moon'
          ? 'rgba(185, 28, 28, 0.08)'
          : 'rgba(148, 163, 184, 0.08)';
      ctx.fillRect(0, 126, W, 18);

      // 6. LURKING NIGHTSTALKERS (Perimeter shadows)
      if (!isDeadState && hasTasksToday) {
        anim.stalkers.forEach((s) => {
          // Creep closer if critical or tasks remain
          if (s.state === 'lurking' && Math.random() < 0.02) {
            s.state = 'creeping';
          }
          if (s.state === 'creeping') {
            const stepDir = s.facingLeft ? -0.3 : 0.3;
            s.x += stepDir;
            if (s.facingLeft && s.x < 240) s.state = 'lurking';
            if (!s.facingLeft && s.x > 75) s.state = 'lurking';
          } else if (s.state === 'fleeing') {
            const fleeDir = s.facingLeft ? 1.2 : -1.2;
            s.x += fleeDir;
            if (s.x < 20 || s.x > 300) {
              s.state = 'lurking';
            }
          }
          drawNightstalker(ctx, s.x, s.y, spriteFrame, s.facingLeft, s.recoil);
        });
      }

      // 7. GROUND & TERRAIN
      ctx.fillStyle = '#17110e';
      ctx.fillRect(0, 144, W, 36);
      ctx.fillStyle = '#261b16';
      ctx.fillRect(0, 144, W, 4);

      // Grass tufts / rocks with wind sway
      ctx.fillStyle = activeWeather === 'aurora' ? '#166534' : '#3d2a20';
      const windSway = spriteFrame % 4 < 2 ? 0 : 1;
      for (let gx = 6; gx < W; gx += 22) {
        ctx.fillRect(gx, 142, 3, 3);
        ctx.fillRect(gx + windSway, 141, 1, 2);
      }

      // 8. DYNAMIC RADIAL CAMPFIRE LIGHTING
      const fireX = 128;
      const fireY = 142;
      const warmthFactor = Math.max(0.4, warmthVal / 100);
      const fireRadius = Math.round((70 + (spriteFrame % 2 === 0 ? 6 : -4)) * warmthFactor);

      if (!isDeadState) {
        const fireGrad = ctx.createRadialGradient(
          fireX,
          fireY,
          4,
          fireX,
          fireY,
          fireRadius
        );
        fireGrad.addColorStop(0, 'rgba(251, 146, 60, 0.42)');
        fireGrad.addColorStop(0.45, 'rgba(249, 115, 22, 0.22)');
        fireGrad.addColorStop(0.8, 'rgba(234, 88, 12, 0.08)');
        fireGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = fireGrad;
        ctx.beginPath();
        ctx.arc(fireX, fireY, fireRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 9. CAMP SHELTER
      const hasPot = ld.companions.some((c) => c.id === 'cooking_pot');
      const hasWolf = ld.companions.some((c) => c.id === 'wolf');
      const hasDrone = ld.companions.some((c) => c.id === 'drone');

      drawCampShelter(ctx, ld.camp.id, spriteFrame, isDeadState, hasPot);

      // 10. CAMPFIRE & EMBERS
      drawCampfire(
        ctx,
        fireX,
        144,
        ld.camp.id,
        spriteFrame,
        isDeadState,
        warmthFactor * 1.2
      );

      // Floating ember particles from fire
      if (!isDeadState && tick % 6 === 0) {
        anim.particles.push({
          x: fireX - 4 + Math.random() * 8,
          y: 136,
          vx: (Math.random() - 0.5) * 0.45,
          vy: -0.6 - Math.random() * 0.55,
          life: 36,
          maxLife: 36,
          color: Math.random() > 0.35 ? '#facc15' : '#f97316',
          size: 1,
        });
      }

      // Blizzard / Ash storm particles
      if (activeWeather === 'blizzard' && tick % 4 === 0) {
        anim.particles.push({
          x: Math.random() * W,
          y: 0,
          vx: -1.2 - Math.random() * 1.4,
          vy: 1.0 + Math.random() * 0.8,
          life: 80,
          maxLife: 80,
          color: 'rgba(226, 232, 240, 0.65)',
          size: 1,
        });
      }

      // 11. SURVIVOR
      const blink = spriteFrame % 21 === 0;
      drawSurvivor({
        ctx,
        x: 178,
        y: 132,
        armor: ld.armor.id,
        weapon: ld.weapon.id,
        pose,
        frame: spriteFrame,
        blink,
      });

      // 12. COMPANIONS
      if (hasWolf) {
        const isHowl = anim.isHowling && now < anim.howlUntil;
        drawWolfCompanion(ctx, 212, 144, spriteFrame, pose, isHowl);
      }
      if (hasDrone) {
        const isScan = anim.isScanning && now < anim.scanUntil;
        drawDroneCompanion(ctx, 154, 92, spriteFrame, pose, isScan);
      }

      // 13. COMBAT SLASH ARCS
      if (anim.slash && anim.slash.active) {
        anim.slash.progress += 0.14;
        drawSlashEffect(ctx, anim.slash.x, anim.slash.y, ld.weapon.id, anim.slash.progress);
        if (anim.slash.progress >= 1) anim.slash = null;
      }

      // 14. PARTICLES UPDATE
      anim.particles = anim.particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        if (p.life <= 0) return false;
        ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
        ctx.globalAlpha = 1;
        return true;
      });

      // 15. FLOATING TEXT POPUPS
      ctx.font = rtlMode ? 'bold 9px Cairo, sans-serif' : 'bold 8px monospace';
      anim.popups = anim.popups.filter((pop) => {
        pop.y -= 0.35;
        pop.life -= 1;
        if (pop.life <= 0) return false;
        ctx.globalAlpha = Math.min(1, pop.life / 22);
        ctx.fillStyle = '#000000';
        ctx.fillText(pop.text, Math.round(pop.x) + 1, Math.round(pop.y) + 1);
        ctx.fillStyle = pop.color;
        ctx.fillText(pop.text, Math.round(pop.x), Math.round(pop.y));
        ctx.globalAlpha = 1;
        return true;
      });

      // 16. FLASH ALPHA (level-up burst)
      if (anim.flashAlpha > 0.01) {
        ctx.fillStyle = `rgba(250, 204, 21, ${anim.flashAlpha})`;
        ctx.fillRect(0, 0, W, H);
        anim.flashAlpha *= 0.88;
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const hasWolf = loadout.companions.some((c) => c.id === 'wolf');
  const hasDrone = loadout.companions.some((c) => c.id === 'drone');
  const hasPot = loadout.companions.some((c) => c.id === 'cooking_pot');

  const nextHintText = loadout.nextUnlock
    ? loadout.nextUnlock.item.requiredPoints
      ? t('hint.collectSp', { points: loadout.nextUnlock.item.requiredPoints })
      : t('hint.reachLevel', { level: loadout.nextUnlock.item.requiredLevel })
    : null;

  return (
    <div className="overflow-hidden rounded border-2 border-slate-700/80 bg-black shadow-2xl">
      {/* 2D Canvas Viewport */}
      <div className="relative group cursor-crosshair select-none" dir="ltr">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          onClick={handleCanvasClick}
          className="pixelated block aspect-video h-auto w-full transition"
          aria-label={t('canvas.ariaLabel')}
          title={t('canvas.interactiveHelp')}
        />
        <div className="crt-scanlines pointer-events-none absolute inset-0 opacity-25" />

        {/* Top HUD overlay */}
        <div
          dir={dir}
          className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-2.5 sm:p-3"
        >
          <div className="flex items-center gap-2">
            <span className="border border-amber-500/40 bg-slate-950/85 px-2 py-1 font-pixel text-[9px] text-amber-300 shadow sm:px-2.5 sm:text-[10px]">
              {t('canvas.dayLevelBadge', { day: dayNumber, level })}
            </span>
            <span className="hidden border border-slate-700 bg-slate-950/85 px-2.5 py-1 text-[11px] font-bold text-slate-200 sm:inline-block">
              {t('canvas.pointsBadge', { points })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {urgencyPhase === 'survived' ? (
              <span className="border border-emerald-400/50 bg-emerald-950/90 px-2 py-1 font-pixel text-[8px] text-emerald-300 sm:px-2.5 sm:text-[9px]">
                {t('canvas.statusSecured')}
              </span>
            ) : urgencyPhase === 'critical' && hasTasksToday ? (
              <span className="animate-pulse border border-red-500/70 bg-red-950/90 px-2 py-1 font-pixel text-[8px] text-red-300 sm:px-2.5 sm:text-[9px]">
                {t('canvas.statusDanger')}
              </span>
            ) : (
              <span className="border border-amber-400/40 bg-slate-950/85 px-2 py-1 font-pixel text-[8px] text-amber-200 sm:px-2.5 sm:text-[9px]">
                {t('canvas.statusActive')}
              </span>
            )}
          </div>
        </div>

        {/* Floating Mini Interactive Tip on Hover */}
        <div className="pointer-events-none absolute bottom-2 left-2 hidden rounded border border-slate-800 bg-slate-950/85 px-2 py-1 text-[10px] text-slate-400 group-hover:block">
          ⚔️ {t('canvas.interactiveHelp')}
        </div>
      </div>

      {/* Interactive Survival Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 bg-slate-900/90 px-3 py-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Strike / Defend */}
          <button
            type="button"
            onClick={handleDefend}
            disabled={isDead}
            className="pixel-btn flex items-center gap-1 border-rose-500/70 bg-rose-950/40 px-2.5 py-1 text-[11px] font-bold text-rose-300 hover:bg-rose-900/50 disabled:opacity-40"
            title="Attack lurking night beasts"
          >
            <Swords className="h-3.5 w-3.5 shrink-0" />
            <span>{t('canvas.actionStrike')}</span>
          </button>

          {/* Stoke Fire */}
          <button
            type="button"
            onClick={handleStoke}
            disabled={isDead}
            className="pixel-btn flex items-center gap-1 border-amber-500/70 bg-amber-950/40 px-2.5 py-1 text-[11px] font-bold text-amber-300 hover:bg-amber-900/50 disabled:opacity-40"
            title="Feed campfire logs for warmth"
          >
            <Flame className="h-3.5 w-3.5 shrink-0 text-orange-400" />
            <span>{t('canvas.actionStoke')}</span>
          </button>

          {/* Pet Wolf (if unlocked) */}
          {hasWolf && (
            <button
              type="button"
              onClick={handlePetWolf}
              disabled={isDead}
              className="pixel-btn flex items-center gap-1 border-sky-500/70 bg-sky-950/40 px-2.5 py-1 text-[11px] font-bold text-sky-300 hover:bg-sky-900/50 disabled:opacity-40"
              title="Pet loyal Timber Wolf"
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span>{t('canvas.actionWolf')}</span>
            </button>
          )}

          {/* Drone Recon (if unlocked) */}
          {hasDrone && (
            <button
              type="button"
              onClick={handleDroneScan}
              disabled={isDead}
              className="pixel-btn flex items-center gap-1 border-emerald-500/70 bg-emerald-950/40 px-2.5 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-900/50 disabled:opacity-40"
              title="Drone reconnaissance scan"
            >
              <Radio className="h-3.5 w-3.5 shrink-0" />
              <span>{t('canvas.actionDrone')}</span>
            </button>
          )}

          {/* Stir Stew (if unlocked) */}
          {hasPot && (
            <button
              type="button"
              onClick={handleStirPot}
              disabled={isDead}
              className="pixel-btn flex items-center gap-1 border-yellow-500/70 bg-yellow-950/40 px-2.5 py-1 text-[11px] font-bold text-yellow-300 hover:bg-yellow-900/50 disabled:opacity-40"
              title="Stir cooking pot stew"
            >
              <Soup className="h-3.5 w-3.5 shrink-0" />
              <span>{t('canvas.actionPot')}</span>
            </button>
          )}

          {/* Atmosphere Toggle */}
          <button
            type="button"
            onClick={handleCycleWeather}
            className="flex items-center gap-1 border border-slate-700 bg-slate-950/80 px-2 py-1 text-[10px] text-slate-300 hover:border-slate-500 hover:text-slate-100"
            title="Cycle weather conditions"
          >
            <RefreshCw className="h-3 w-3 shrink-0 text-slate-400" />
            <span>{t('canvas.actionWeather', { mode: weatherMode })}</span>
          </button>
        </div>

        {/* Camp Status Gauges */}
        <div className="flex items-center gap-3 text-[11px]">
          {/* Campfire Warmth */}
          <div className="flex items-center gap-1.5" title="Camp warmth keeps the cold away">
            <Flame className="h-3 w-3 text-orange-400" />
            <span className="text-slate-400">{t('canvas.warmthLabel')}:</span>
            <div className="h-2 w-14 overflow-hidden rounded bg-slate-950 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-orange-600 to-amber-400 transition-all duration-300"
                style={{ width: `${warmth}%` }}
              />
            </div>
          </div>

          {/* Perimeter Defense */}
          <div className="flex items-center gap-1.5" title="Defend against creeping shadow beasts">
            <ShieldAlert className="h-3 w-3 text-rose-400" />
            <span className="text-slate-400">{t('canvas.defenseLabel')}:</span>
            <div className="h-2 w-14 overflow-hidden rounded bg-slate-950 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-rose-600 to-emerald-400 transition-all duration-300"
                style={{ width: `${perimeterDefense}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Loadout strip below canvas */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 bg-slate-950/95 px-3 py-2 text-[11px]">
        <div className="flex flex-wrap items-center gap-2 text-slate-300">
          <span className="rounded border border-slate-700/80 bg-slate-900/90 px-2 py-0.5">
            {t('canvas.armorLabel')}{' '}
            <strong className="text-amber-300" dir="ltr">
              {loadout.armor.name}
            </strong>
          </span>
          <span className="rounded border border-slate-700/80 bg-slate-900/90 px-2 py-0.5">
            {t('canvas.weaponLabel')}{' '}
            <strong className="text-sky-300" dir="ltr">
              {loadout.weapon.name}
            </strong>
          </span>
          <span className="rounded border border-slate-700/80 bg-slate-900/90 px-2 py-0.5">
            {t('canvas.campLabel')}{' '}
            <strong className="text-emerald-300" dir="ltr">
              {loadout.camp.name}
            </strong>
          </span>
        </div>
        {loadout.nextUnlock && nextHintText && (
          <span className="text-slate-400">
            {t('canvas.nextLabel')}{' '}
            <strong className="text-amber-200" dir="ltr">
              {loadout.nextUnlock.item.name}
            </strong>{' '}
            ({nextHintText})
          </span>
        )}
      </div>
    </div>
  );
}
