import { useEffect, useRef } from 'react';
import type { CharacterLoadout } from '../game/progression';
import type { UrgencyPhase } from '../game/time';
import { useI18n } from '../i18n/I18nContext';
import {
  drawCampShelter,
  drawDroneCompanion,
  drawSurvivor,
  drawWolfCompanion,
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

const W = 320;
const H = 180;

const STARS = Array.from({ length: 34 }, (_, idx) => ({
  x: (idx * 73 + 19) % W,
  y: (idx * 37 + 7) % 86,
  phase: idx % 5,
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
  const stateRef = useRef({
    loadout,
    urgencyPhase,
    hasTasksToday,
    isDead,
    dayNumber,
    level,
    points,
    isRtl,
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
  };

  const animRef = useRef<{
    poseOverride: SurvivorPose | null;
    poseUntil: number;
    particles: Particle[];
    popups: FloatingText[];
    flashAlpha: number;
    lastBurstId: number;
  }>({
    poseOverride: null,
    poseUntil: 0,
    particles: [],
    popups: [],
    flashAlpha: 0,
    lastBurstId: 0,
  });

  useEffect(() => {
    if (!burst || burst.id === animRef.current.lastBurstId) return;
    animRef.current.lastBurstId = burst.id;

    const now = performance.now();
    if (burst.kind === 'death') {
      animRef.current.poseOverride = 'perished';
      animRef.current.poseUntil = now + 5000;
      animRef.current.popups.push({
        x: 175,
        y: 105,
        text: burst.label,
        color: '#ef4444',
        life: 90,
      });
      return;
    }

    const isLevelUp = burst.kind === 'level_up';
    animRef.current.poseOverride = isLevelUp ? 'level_up' : 'celebrate';
    animRef.current.poseUntil = now + (isLevelUp ? 2600 : 1200);
    if (isLevelUp) {
      animRef.current.flashAlpha = 0.85;
    }

    const count = isLevelUp ? 42 : 20;
    const colors = isLevelUp
      ? ['#facc15', '#fef08a', '#f97316', '#38bdf8']
      : ['#facc15', '#fb923c', '#4ade80'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (isLevelUp ? 1.8 : 1.1) * (0.4 + Math.random());
      animRef.current.particles.push({
        x: 184 + (Math.random() - 0.5) * 14,
        y: 126 + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (isLevelUp ? 1.4 : 0.9),
        life: 36 + Math.floor(Math.random() * 24),
        maxLife: 60,
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
      if (now - lastSpriteStep > 180) {
        spriteFrame += 1;
        lastSpriteStep = now;
      }

      const {
        loadout: ld,
        urgencyPhase: phase,
        hasTasksToday: hasTasks,
        isDead: deadProp,
        isRtl: rtlMode,
      } = stateRef.current;
      const anim = animRef.current;

      ctx.imageSmoothingEnabled = false;

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

      const skyTop =
        phase === 'critical' && hasTasks
          ? '#1e080d'
          : phase === 'dusk' && hasTasks
            ? '#1c1026'
            : phase === 'survived'
              ? '#081826'
              : '#0c1322';
      const skyBot =
        phase === 'critical' && hasTasks
          ? '#450a0a'
          : phase === 'dusk' && hasTasks
            ? '#4c1d3d'
            : phase === 'survived'
              ? '#112a3d'
              : '#1b263b';

      ctx.fillStyle = skyTop;
      ctx.fillRect(0, 0, W, 90);
      ctx.fillStyle = skyBot;
      ctx.fillRect(0, 90, W, 56);

      STARS.forEach((star) => {
        const twinkle = (spriteFrame + star.phase) % 6 === 0 ? 0.35 : 0.85;
        ctx.fillStyle = `rgba(241, 245, 249, ${twinkle})`;
        ctx.fillRect(star.x, star.y, 1, 1);
      });

      const moonColor =
        phase === 'critical' && hasTasks
          ? '#ef4444'
          : phase === 'survived'
            ? '#fef08a'
            : '#e2e8f0';
      ctx.fillStyle = moonColor;
      ctx.fillRect(262, 22, 16, 16);
      ctx.fillStyle = skyTop;
      ctx.fillRect(272, 22, 8, 12);

      if (phase === 'survived' && !isDeadState) {
        ctx.fillStyle = 'rgba(34, 197, 94, 0.14)';
        ctx.fillRect(0, 26 + ((spriteFrame * 2) % 8), W, 14);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.1)';
        ctx.fillRect(0, 36 + ((spriteFrame * 2) % 6), W, 10);
      }

      ctx.fillStyle = '#0f172a';
      for (let mx = 0; mx < W; mx += 16) {
        const peak = 24 + ((mx * 17) % 28);
        ctx.fillRect(mx, 144 - peak, 16, peak);
      }

      ctx.fillStyle = '#09111a';
      for (let tx = 4; tx < W; tx += 18) {
        const h = 24 + ((tx * 11) % 16);
        ctx.fillRect(tx + 4, 144 - h, 4, h);
        ctx.fillRect(tx + 2, 144 - h + 6, 8, h - 6);
        ctx.fillRect(tx, 144 - h + 12, 12, h - 12);
      }

      if (phase === 'critical' && hasTasks && !isDeadState && spriteFrame % 5 !== 0) {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(284, 126, 2, 2);
        ctx.fillRect(289, 126, 2, 2);
        ctx.fillRect(16, 128, 2, 2);
        ctx.fillRect(21, 128, 2, 2);
      }

      ctx.fillStyle = '#1f1612';
      ctx.fillRect(0, 144, W, 36);
      ctx.fillStyle = '#2d2019';
      ctx.fillRect(0, 144, W, 4);
      ctx.fillStyle = phase === 'survived' ? '#166534' : '#3f2e24';
      for (let gx = 8; gx < W; gx += 26) {
        ctx.fillRect(gx, 143, 4, 2);
      }

      if (!isDeadState) {
        const flicker = spriteFrame % 2 === 0 ? 0 : 6;
        ctx.fillStyle = 'rgba(249, 115, 22, 0.14)';
        ctx.fillRect(88 - flicker / 2, 142, 82 + flicker, 14);
      }

      const hasPot = ld.companions.some((c) => c.id === 'cooking_pot');
      const hasWolf = ld.companions.some((c) => c.id === 'wolf');
      const hasDrone = ld.companions.some((c) => c.id === 'drone');

      drawCampShelter(ctx, ld.camp.id, spriteFrame, isDeadState, hasPot);

      if (!isDeadState && tick % 7 === 0) {
        anim.particles.push({
          x: 126 + Math.random() * 6,
          y: 132,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -0.45 - Math.random() * 0.4,
          life: 32,
          maxLife: 32,
          color: Math.random() > 0.4 ? '#f97316' : '#facc15',
          size: 1,
        });
      }

      const blink = spriteFrame % 19 === 0;
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

      if (hasWolf) {
        drawWolfCompanion(ctx, 212, 144, spriteFrame, pose);
      }
      if (hasDrone) {
        drawDroneCompanion(ctx, 154, 92, spriteFrame, pose);
      }

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

      ctx.font = rtlMode ? 'bold 9px Cairo, sans-serif' : 'bold 8px monospace';
      anim.popups = anim.popups.filter((pop) => {
        pop.y -= 0.32;
        pop.life -= 1;
        if (pop.life <= 0) return false;
        ctx.globalAlpha = Math.min(1, pop.life / 25);
        ctx.fillStyle = '#000000';
        ctx.fillText(pop.text, Math.round(pop.x) + 1, Math.round(pop.y) + 1);
        ctx.fillStyle = pop.color;
        ctx.fillText(pop.text, Math.round(pop.x), Math.round(pop.y));
        ctx.globalAlpha = 1;
        return true;
      });

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

  const nextHintText = loadout.nextUnlock
    ? loadout.nextUnlock.item.requiredPoints
      ? t('hint.collectSp', { points: loadout.nextUnlock.item.requiredPoints })
      : t('hint.reachLevel', { level: loadout.nextUnlock.item.requiredLevel })
    : null;

  return (
    <div className="overflow-hidden rounded border-2 border-slate-700/80 bg-black shadow-2xl">
      {/* Keep canvas world orientation strictly LTR (never mirrored in RTL mode) */}
      <div className="relative" dir="ltr">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="pixelated block aspect-video h-auto w-full"
          aria-label={t('canvas.ariaLabel')}
        />
        <div className="crt-scanlines pointer-events-none absolute inset-0 opacity-30" />

        {/* Top HUD overlay row follows UI direction */}
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
