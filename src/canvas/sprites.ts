import type { ArmorId, CampId, WeaponId } from '../game/progression';

export type SurvivorPose =
  | 'idle'
  | 'celebrate'
  | 'level_up'
  | 'stressed'
  | 'perished'
  | 'strike'
  | 'warm_hands'
  | 'petting';

export interface DrawSurvivorParams {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  armor: ArmorId;
  weapon: WeaponId;
  pose: SurvivorPose;
  frame: number;
  blink: boolean;
}

export const px = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
};

/**
 * Draw campfire pit, logs, flames, dynamic ember sparks, and ashes
 */
export function drawCampfire(
  ctx: CanvasRenderingContext2D,
  x: number,
  groundY: number,
  camp: CampId,
  frame: number,
  isDead: boolean,
  warmthLevel = 1.0 // 1.0 normal, up to 1.8 boosted by stoking
): void {
  // Shadow under fire pit
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(x, groundY + 1, 16, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  if (camp === 'embers') {
    // Charred ash circle + stone ring
    px(ctx, x - 10, groundY - 2, 20, 3, '#1e293b');
    px(ctx, x - 8, groundY - 3, 16, 2, '#334155');
    // Charred blackened branch
    px(ctx, x - 6, groundY - 3, 12, 2, '#0f172a');
    px(ctx, x - 2, groundY - 4, 4, 2, '#1c1917');

    if (!isDead) {
      // Small glowing ember veins
      const f = frame % 4;
      px(ctx, x - 4, groundY - 3, 3, 2, f % 2 === 0 ? '#ef4444' : '#f97316');
      px(ctx, x + 1, groundY - 3, 4, 2, f % 3 === 0 ? '#f97316' : '#b91c1c');
      px(ctx, x - 1, groundY - 4, 2, 2, f === 1 ? '#facc15' : '#ea580c');
    }
    return;
  }

  // Stone ring with depth
  px(ctx, x - 13, groundY - 3, 5, 4, '#475569');
  px(ctx, x - 12, groundY - 4, 3, 2, '#64748b');
  px(ctx, x + 8, groundY - 3, 5, 4, '#475569');
  px(ctx, x + 9, groundY - 4, 3, 2, '#64748b');
  px(ctx, x - 6, groundY - 2, 12, 3, '#334155');

  // Sitting log bench for camp
  px(ctx, x - 28, groundY - 5, 14, 5, '#5c3317');
  px(ctx, x - 27, groundY - 6, 12, 2, '#78350f');
  px(ctx, x - 28, groundY - 1, 3, 2, '#451a03');
  px(ctx, x - 17, groundY - 1, 3, 2, '#451a03');

  // Crossed burning firewood logs
  px(ctx, x - 10, groundY - 4, 20, 3, '#451a03');
  px(ctx, x - 8, groundY - 5, 16, 2, '#78350f');
  px(ctx, x - 4, groundY - 6, 8, 2, '#291407');

  if (isDead) {
    // Extinguished ash & smoke
    px(ctx, x - 5, groundY - 5, 10, 3, '#334155');
    px(ctx, x - 2, groundY - 6, 4, 2, '#1e293b');
    return;
  }

  // Animated Multi-Stage Flames
  const boost = Math.min(2.0, Math.max(0.8, warmthLevel));
  const f = frame % 4;
  const flameH = Math.round((9 + (f % 3) * 2) * boost);

  // Outer red-orange flame
  px(ctx, x - 7, groundY - 5 - flameH, 14, flameH, '#ea580c');
  px(ctx, x - 8 + (f % 2), groundY - 7 - Math.round(flameH * 0.7), 4, 6, '#dc2626');
  px(ctx, x + 4 - (f % 2), groundY - 7 - Math.round(flameH * 0.7), 4, 6, '#dc2626');

  // Mid vibrant orange-gold flame
  const midH = Math.round(flameH * 0.85);
  px(ctx, x - 5, groundY - 6 - midH, 10, midH, '#f97316');
  px(ctx, x - 3, groundY - 8 - Math.round(flameH * 0.6), 6, 8, '#f59e0b');

  // Hot yellow-white core
  const coreH = Math.round(flameH * 0.55);
  px(ctx, x - 3, groundY - 6 - coreH, 6, coreH, '#facc15');
  px(ctx, x - 1, groundY - 7 - Math.round(flameH * 0.35), 2, 4, '#fef08a');

  // Licking flame tip
  const tipX = x - 1 + ((frame % 3) - 1);
  px(ctx, tipX, groundY - 6 - flameH - 2, 2, 3, '#facc15');
}

/**
 * Draw camp shelters (tents, outpost, bunker, citadel, pot)
 */
export function drawCampShelter(
  ctx: CanvasRenderingContext2D,
  camp: CampId,
  frame: number,
  isDead: boolean,
  hasCookingPot: boolean
): void {
  const groundY = 144;

  if (camp === 'embers') {
    // Survivor bedroll & knapsack
    px(ctx, 48, groundY - 5, 20, 5, '#57534e');
    px(ctx, 50, groundY - 6, 16, 2, '#78716c');
    px(ctx, 48, groundY - 4, 2, 4, '#292524');
    px(ctx, 66, groundY - 4, 2, 4, '#292524');
    // Leather knapsack with canteen
    px(ctx, 72, groundY - 10, 10, 10, '#78350f');
    px(ctx, 73, groundY - 11, 8, 2, '#92400e');
    px(ctx, 76, groundY - 7, 2, 6, '#451a03');
    px(ctx, 83, groundY - 7, 3, 5, '#0284c7'); // Blue canteen
  } else if (camp === 'campfire') {
    // Supply crate & drying rack
    px(ctx, 44, groundY - 14, 16, 14, '#78350f');
    px(ctx, 46, groundY - 12, 12, 10, '#92400e');
    px(ctx, 44, groundY - 8, 16, 2, '#451a03');
    px(ctx, 51, groundY - 14, 2, 14, '#451a03');
    // Meat drying rack
    px(ctx, 68, groundY - 24, 2, 24, '#78350f');
    px(ctx, 92, groundY - 24, 2, 24, '#78350f');
    px(ctx, 67, groundY - 22, 28, 2, '#92400e');
    px(ctx, 73, groundY - 20, 3, 7, '#b91c1c');
    px(ctx, 81, groundY - 20, 4, 8, '#b91c1c');
  } else if (camp === 'tent') {
    // Reinforced canvas lean-to tent with guy-ropes
    px(ctx, 38, groundY - 14, 16, 14, '#78350f');
    px(ctx, 40, groundY - 12, 12, 10, '#92400e');
    px(ctx, 38, groundY - 8, 16, 2, '#451a03');

    // Guy-ropes pegged to ground
    px(ctx, 52, groundY - 2, 2, 2, '#78350f');
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(53, groundY - 2);
    ctx.lineTo(84, groundY - 28);
    ctx.stroke();

    // Canvas lean-to structure
    for (let i = 0; i < 26; i++) {
      const rowW = 54 - i * 2;
      px(ctx, 58 + i, groundY - 1 - i, rowW, 1, i % 3 === 0 ? '#3f6212' : '#4d7c0f');
      px(ctx, 58 + i, groundY - 1 - i, 2, 1, '#365314'); // shading
    }
    // Tent dark interior opening
    for (let i = 0; i < 17; i++) {
      px(ctx, 72 + i, groundY - 1 - i, 26 - i * 2, 1, '#090d16');
    }
    // Tent main pole & hanging warm oil lantern
    px(ctx, 84, groundY - 29, 2, 29, '#78350f');
    px(ctx, 82, groundY - 28, 6, 2, '#451a03');
    if (!isDead) {
      const glow = frame % 4 < 2 ? '#facc15' : '#f59e0b';
      px(ctx, 86, groundY - 17, 3, 4, glow);
      px(ctx, 87, groundY - 18, 1, 1, '#fef08a');
    }
  } else if (camp === 'outpost') {
    // Timber Watch Outpost with lookout platform & barricades
    // Wooden spike barricade on left edge
    for (let bx = 32; bx <= 42; bx += 5) {
      px(ctx, bx, groundY - 10, 2, 10, '#5c3317');
      px(ctx, bx - 1, groundY - 12, 2, 4, '#78350f');
    }

    // Cabin main body
    px(ctx, 46, groundY - 36, 62, 36, '#451a03');
    px(ctx, 48, groundY - 34, 58, 34, '#78350f');
    // Horizontal wood plank slats
    for (let py = 0; py < 34; py += 5) {
      px(ctx, 48, groundY - 34 + py, 58, 1, '#3b1d0a');
      px(ctx, 50, groundY - 33 + py, 54, 1, '#92400e');
    }
    // Pitched tile roof
    for (let i = 0; i < 16; i++) {
      px(ctx, 42 + i, groundY - 36 - i, 70 - i * 2, 1, i % 2 === 0 ? '#334155' : '#1e293b');
    }
    // Brick chimney + animated smoke
    px(ctx, 94, groundY - 52, 6, 14, '#78350f');
    px(ctx, 93, groundY - 54, 8, 2, '#451a03');
    if (!isDead) {
      const sf = frame % 6;
      px(ctx, 96 + (sf % 2), groundY - 56 - sf * 2, 3, 2, 'rgba(203, 213, 225, 0.45)');
      px(ctx, 97 + (sf % 3), groundY - 60 - sf * 2, 4, 3, 'rgba(148, 163, 184, 0.3)');
    }

    // Solid timber door
    px(ctx, 56, groundY - 24, 16, 24, '#3b1d0a');
    px(ctx, 58, groundY - 22, 12, 22, '#5c3317');
    px(ctx, 67, groundY - 13, 2, 2, '#facc15'); // Brass handle

    // Lit window with warm cross panes
    px(ctx, 80, groundY - 26, 16, 14, '#1e293b');
    px(ctx, 82, groundY - 24, 12, 10, isDead ? '#090d16' : '#f59e0b');
    if (!isDead) {
      px(ctx, 84, groundY - 22, 8, 6, '#fef08a');
    }
    px(ctx, 87, groundY - 24, 2, 10, '#451a03');
    px(ctx, 82, groundY - 20, 12, 2, '#451a03');

    // Hanging brass lantern
    px(ctx, 108, groundY - 30, 6, 2, '#475569');
    if (!isDead) {
      const sway = frame % 6 < 3 ? 0 : 1;
      px(ctx, 110 + sway, groundY - 28, 3, 6, '#facc15');
      px(ctx, 111 + sway, groundY - 26, 1, 2, '#ffffff');
    }
  } else if (camp === 'bunker' || camp === 'citadel') {
    const isCitadel = camp === 'citadel';

    // Heavy reinforced concrete & steel bunker
    px(ctx, 32, groundY - 42, 80, 42, '#1e293b');
    px(ctx, 34, groundY - 40, 76, 40, '#334155');
    px(ctx, 36, groundY - 38, 72, 38, '#475569');

    // Concrete battlements / crenellations
    for (let bx = 34; bx < 112; bx += 10) {
      px(ctx, bx, groundY - 46, 6, 6, '#64748b');
      px(ctx, bx + 1, groundY - 45, 4, 1, '#94a3b8');
    }

    // Heavy vault steel blast door with hazard stripes
    px(ctx, 48, groundY - 28, 20, 28, '#0f172a');
    px(ctx, 50, groundY - 26, 16, 26, '#1e293b');
    for (let hy = 0; hy < 24; hy += 4) {
      px(ctx, 52, groundY - 24 + hy, 12, 2, hy % 8 === 0 ? '#facc15' : '#0f172a');
    }

    // Reinforced glowing viewport slit
    px(ctx, 76, groundY - 30, 24, 7, '#0f172a');
    px(ctx, 78, groundY - 28, 20, 3, isDead ? '#1e293b' : isCitadel ? '#38bdf8' : '#f59e0b');

    // Sandbags along base
    for (let sx = 30; sx < 48; sx += 6) {
      px(ctx, sx, groundY - 6, 7, 6, '#78716c');
      px(ctx, sx + 1, groundY - 5, 5, 4, '#a8a29e');
    }

    // Rotating Radar Dish & Communications Antenna
    px(ctx, 102, groundY - 56, 2, 14, '#94a3b8');
    const dishTurn = frame % 6 < 3 ? 0 : 1;
    px(ctx, 99 + dishTurn, groundY - 60, 8, 4, '#cbd5e1');
    px(ctx, 102, groundY - 62, 2, 2, frame % 4 < 2 ? '#ef4444' : '#22c55e');

    // Citadel: Towering Spire & Eternal Golden Beacon
    if (isCitadel) {
      px(ctx, 60, groundY - 76, 28, 34, '#1e293b');
      px(ctx, 62, groundY - 74, 24, 32, '#334155');
      px(ctx, 58, groundY - 80, 32, 6, '#64748b');
      px(ctx, 64, groundY - 70, 8, 8, '#0f172a');
      px(ctx, 66, groundY - 68, 4, 4, '#38bdf8');

      if (!isDead) {
        // Skyward Beacon Beam
        const pulse = frame % 4 < 2 ? 0.35 : 0.55;
        const beamGrad = ctx.createLinearGradient(74, 0, 74, groundY - 80);
        beamGrad.addColorStop(0, 'rgba(250, 204, 21, 0.05)');
        beamGrad.addColorStop(0.5, `rgba(250, 204, 21, ${pulse * 0.7})`);
        beamGrad.addColorStop(1, `rgba(254, 240, 138, ${pulse})`);
        ctx.fillStyle = beamGrad;
        ctx.fillRect(70, 0, 12, groundY - 80);

        // Core beacon sphere
        px(ctx, 72, groundY - 86, 8, 8, '#facc15');
        px(ctx, 74, groundY - 84, 4, 4, '#ffffff');
      }

      // Automated defense kinetic turret
      px(ctx, 98, groundY - 50, 8, 6, '#1e293b');
      px(ctx, 104, groundY - 48, 6, 2, '#64748b');
    }

    // Fluttering Crimson Survival Flag
    px(ctx, 104, groundY - 72, 2, 26, '#94a3b8');
    const wave = frame % 4 < 2 ? 0 : 1;
    px(ctx, 106, groundY - 71, 14, 8, '#b91c1c');
    px(ctx, 118, groundY - 70 + wave, 6, 6, '#dc2626');
    px(ctx, 110, groundY - 69, 5, 4, '#facc15'); // Star emblem
  }

  // Cooking pot tripod (center x=128)
  if (hasCookingPot && camp !== 'embers') {
    const potX = 128;
    px(ctx, potX - 11, groundY - 22, 2, 22, '#475569');
    px(ctx, potX + 9, groundY - 22, 2, 22, '#475569');
    px(ctx, potX - 11, groundY - 23, 22, 2, '#64748b');

    // Hanging chain + iron cauldron
    px(ctx, potX - 1, groundY - 21, 2, 4, '#334155');
    px(ctx, potX - 6, groundY - 17, 12, 8, '#0f172a');
    px(ctx, potX - 5, groundY - 16, 10, 6, '#1e293b');
    px(ctx, potX - 4, groundY - 15, 8, 3, isDead ? '#334155' : '#f59e0b'); // Stew

    if (!isDead) {
      // Steam curls
      const st = frame % 5;
      px(ctx, potX - 2 + (st % 3), groundY - 24 - st * 2, 2, 2, 'rgba(241, 245, 249, 0.45)');
      px(ctx, potX + 1 - (st % 2), groundY - 27 - st * 2, 3, 2, 'rgba(226, 232, 240, 0.3)');
    }
  }
}

/**
 * Draw loyal wolf companion with breathing, tail wag, howl
 */
export function drawWolfCompanion(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  pose: SurvivorPose,
  isHowling = false
): void {
  if (pose === 'perished') return;

  // Ground shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(x + 7, y + 1, 10, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  const bounce =
    pose === 'celebrate' || pose === 'level_up' || isHowling
      ? frame % 2 === 0
        ? -2
        : 0
      : frame % 6 < 3
        ? 0
        : -1;
  const wy = y + bounce;
  const tailWag = frame % 4 < 2 ? -2 : 2;

  // Bushy Tail
  px(ctx, x - 5, wy - 9 + tailWag, 5, 4, '#475569');
  px(ctx, x - 8, wy - 11 + tailWag, 4, 3, '#64748b');
  px(ctx, x - 9, wy - 12 + tailWag, 2, 2, '#cbd5e1'); // white tip

  // Furry Body
  px(ctx, x - 1, wy - 10, 14, 8, '#64748b');
  px(ctx, x, wy - 9, 12, 6, '#94a3b8');
  px(ctx, x + 2, wy - 6, 8, 4, '#cbd5e1'); // chest fur

  // Paws & Legs
  px(ctx, x, wy - 2, 3, 3, '#475569');
  px(ctx, x + 9, wy - 2, 3, 3, '#475569');

  if (isHowling) {
    // Wolf tilted head howling at the sky
    px(ctx, x + 9, wy - 17, 7, 7, '#94a3b8');
    px(ctx, x + 8, wy - 19, 2, 3, '#475569'); // ears
    px(ctx, x + 12, wy - 18, 3, 3, '#cbd5e1');
    px(ctx, x + 14, wy - 21, 4, 4, '#94a3b8'); // open snout
    px(ctx, x + 16, wy - 20, 2, 2, '#0f172a'); // howling mouth
    // Musical / howl wave particles
    if (frame % 4 < 2) {
      px(ctx, x + 19, wy - 23, 2, 2, '#facc15');
      px(ctx, x + 22, wy - 25, 2, 2, '#fef08a');
    }
  } else {
    // Alert Wolf Head & Ears
    px(ctx, x + 9, wy - 14, 7, 7, '#94a3b8');
    px(ctx, x + 9, wy - 17, 2, 3, '#475569');
    px(ctx, x + 13, wy - 17, 2, 3, '#475569');
    // Snout & Nose
    px(ctx, x + 15, wy - 11, 4, 4, '#cbd5e1');
    px(ctx, x + 18, wy - 11, 2, 2, '#0f172a');
    // Glowing loyal eye
    px(ctx, x + 12, wy - 12, 2, 2, pose === 'stressed' ? '#ef4444' : '#facc15');
  }
}

/**
 * Draw recon drone companion with hovering thrust & scanning beam
 */
export function drawDroneCompanion(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  pose: SurvivorPose,
  isScanning = false
): void {
  if (pose === 'perished') return;

  const hover = Math.round(Math.sin(frame * 0.3) * 3);
  const dy = y + hover;

  // Ground shadow beneath drone
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.beginPath();
  ctx.ellipse(x + 6, 144, 8, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Dual hover thruster glow & flame particles
  px(ctx, x + 2, dy + 8, 3, 3, frame % 2 === 0 ? '#38bdf8' : '#0284c7');
  px(ctx, x + 8, dy + 8, 3, 3, frame % 2 === 0 ? '#38bdf8' : '#0284c7');
  if (frame % 3 === 0) {
    px(ctx, x + 3, dy + 11, 1, 2, '#7dd3fc');
    px(ctx, x + 9, dy + 11, 1, 2, '#7dd3fc');
  }

  // Aerodynamic chassis & metallic armor
  px(ctx, x - 1, dy + 2, 14, 6, '#1e293b');
  px(ctx, x + 1, dy + 1, 10, 7, '#334155');
  px(ctx, x + 2, dy, 8, 2, '#94a3b8');

  // Glowing cybernetic optics visor
  const eyeColor = pose === 'stressed' ? '#ef4444' : isScanning ? '#22c55e' : '#38bdf8';
  px(ctx, x + 7, dy + 3, 4, 3, eyeColor);
  px(ctx, x + 8, dy + 4, 2, 1, '#ffffff');

  // Comm antenna with flashing avionics beacon
  px(ctx, x + 3, dy - 4, 1, 4, '#cbd5e1');
  px(ctx, x + 3, dy - 5, 1, 1, frame % 4 < 2 ? '#facc15' : '#ef4444');

  // Scanning radar cone sweep
  if (isScanning) {
    ctx.save();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
    ctx.beginPath();
    ctx.moveTo(x + 8, dy + 6);
    ctx.lineTo(x - 24, 144);
    ctx.lineTo(x + 40, 144);
    ctx.closePath();
    ctx.fill();

    // Scan grid line
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
    ctx.lineWidth = 1;
    const scanLineY = dy + 10 + ((frame * 3) % (144 - dy - 10));
    ctx.beginPath();
    ctx.moveTo(x - 14, scanLineY);
    ctx.lineTo(x + 30, scanLineY);
    ctx.stroke();
    ctx.restore();
  }
}

/**
 * Draw lurking wasteland nightstalker beast at perimeter
 */
export function drawNightstalker(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  facingLeft: boolean,
  recoil: number
): void {
  const nx = x + (facingLeft ? -recoil : recoil);
  const ny = y;

  // Dark shadow body creeping in the bushes
  px(ctx, nx - 6, ny - 7, 14, 7, '#070a12');
  px(ctx, nx - 4, ny - 9, 10, 4, '#0f172a');

  // Creeping claws
  const step = frame % 4 < 2 ? 0 : 1;
  px(ctx, nx - 4 + step, ny - 1, 3, 2, '#090d16');
  px(ctx, nx + 4 - step, ny - 1, 3, 2, '#090d16');

  // Twitching predatory tail
  const tailTwitch = frame % 4 < 2 ? -1 : 1;
  px(ctx, facingLeft ? nx + 8 : nx - 8, ny - 6 + tailTwitch, 4, 2, '#070a12');

  // Glowing beast eyes (pulsing red or dark purple)
  const eyeColor = recoil > 0 ? '#ffffff' : frame % 6 < 3 ? '#ef4444' : '#dc2626';
  if (facingLeft) {
    px(ctx, nx - 5, ny - 6, 2, 2, eyeColor);
    px(ctx, nx - 1, ny - 6, 2, 2, eyeColor);
  } else {
    px(ctx, nx + 1, ny - 6, 2, 2, eyeColor);
    px(ctx, nx + 5, ny - 6, 2, 2, eyeColor);
  }
}

/**
 * Draw dynamic curved weapon slash effect
 */
export function drawSlashEffect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  weapon: WeaponId,
  progress: number // 0 to 1
): void {
  ctx.save();
  ctx.lineWidth = 2.5;

  let strokeColor = '#facc15';
  let sparkColor = '#fef08a';
  if (weapon === 'greatsword') {
    strokeColor = '#f97316';
    sparkColor = '#ea580c';
  } else if (weapon === 'halberd') {
    strokeColor = '#38bdf8';
    sparkColor = '#7dd3fc';
  }

  const arcRadius = 16;
  const startAngle = -Math.PI * 0.4 + progress * Math.PI * 0.2;
  const endAngle = Math.PI * 0.5 + progress * Math.PI * 0.4;

  ctx.strokeStyle = strokeColor;
  ctx.beginPath();
  ctx.arc(x, y, arcRadius, startAngle, endAngle);
  ctx.stroke();

  // Spark sparks
  for (let i = 0; i < 4; i++) {
    const spAngle = startAngle + (endAngle - startAngle) * (i / 3);
    const sx = x + Math.cos(spAngle) * (arcRadius + (i % 2 === 0 ? 3 : -2));
    const sy = y + Math.sin(spAngle) * (arcRadius + (i % 2 === 0 ? 3 : -2));
    px(ctx, sx, sy, 2, 2, sparkColor);
  }

  ctx.restore();
}

function getArmorColors(armor: ArmorId) {
  switch (armor) {
    case 'rags':
      return {
        body: '#78716c',
        trim: '#57534e',
        legs: '#44403c',
        boots: '#292524',
        cape: null as string | null,
        helm: null as string | null,
        visor: null as string | null,
        shoulder: null as string | null,
      };
    case 'scavenger':
      return {
        body: '#92400e',
        trim: '#b45309',
        legs: '#451a03',
        boots: '#1c1917',
        cape: null,
        helm: 'bandana',
        visor: '#ef4444',
        shoulder: '#78350f',
      };
    case 'ranger':
      return {
        body: '#166534',
        trim: '#eab308',
        legs: '#14532d',
        boots: '#451a03',
        cape: '#15803d',
        helm: 'hood',
        visor: '#22c55e',
        shoulder: '#14532d',
      };
    case 'vanguard':
      return {
        body: '#94a3b8',
        trim: '#f8fafc',
        legs: '#475569',
        boots: '#1e293b',
        cape: '#b91c1c',
        helm: 'steel',
        visor: '#cbd5e1',
        shoulder: '#cbd5e1',
      };
    case 'warden':
      return {
        body: '#1e293b',
        trim: '#38bdf8',
        legs: '#0f172a',
        boots: '#334155',
        cape: '#c2410c',
        helm: 'visor',
        visor: '#38bdf8',
        shoulder: '#475569',
      };
    case 'apex':
      return {
        body: '#090d16',
        trim: '#facc15',
        legs: '#1e1b4b',
        boots: '#f59e0b',
        cape: '#f59e0b',
        helm: 'crown',
        visor: '#fde047',
        shoulder: '#facc15',
      };
  }
}

function drawWeapon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  weapon: WeaponId,
  pose: SurvivorPose,
  frame: number
): void {
  const isAttack = pose === 'strike';
  const isCelebrate = pose === 'celebrate' || pose === 'level_up';
  const wx = isAttack ? x + 16 : isCelebrate ? x + 14 : x + 12;
  const wy = isAttack ? y + 2 : isCelebrate ? y - 10 : y - 2;

  switch (weapon) {
    case 'stick':
      px(ctx, wx, wy - 6, 2, 14, '#78350f');
      px(ctx, wx + 1, wy - 8, 2, 4, '#92400e');
      px(ctx, wx - 1, wy - 2, 1, 2, '#451a03'); // knot
      break;
    case 'spear':
      px(ctx, wx, wy - 10, 2, 22, '#92400e');
      px(ctx, wx - 1, wy - 14, 4, 5, '#cbd5e1');
      px(ctx, wx, wy - 17, 2, 3, '#f8fafc'); // sharpened tip
      px(ctx, wx - 1, wy - 9, 4, 2, '#78350f'); // sinew lashings
      break;
    case 'machete':
      px(ctx, wx, wy + 2, 2, 4, '#451a03'); // hilt
      px(ctx, wx - 1, wy + 1, 4, 1, '#78350f'); // guard
      px(ctx, wx, wy - 8, 3, 10, '#cbd5e1');
      px(ctx, wx + 1, wy - 10, 3, 3, '#f8fafc');
      px(ctx, wx - 1, wy - 6, 1, 6, '#64748b'); // sawback
      break;
    case 'bow':
      px(ctx, wx + 1, wy - 10, 2, 20, '#b45309');
      px(ctx, wx + 3, wy - 12, 2, 3, '#d97706');
      px(ctx, wx + 3, wy + 9, 2, 3, '#d97706');
      px(ctx, wx, wy - 10, 1, 20, '#e2e8f0'); // tight bowstring
      if (isAttack) {
        // Nocked arrow
        px(ctx, wx - 4, wy - 1, 10, 1, '#78350f');
        px(ctx, wx + 6, wy - 2, 2, 3, '#cbd5e1');
      }
      // Quiver on back
      px(ctx, x - 2, y - 6, 3, 9, '#78350f');
      px(ctx, x - 2, y - 8, 1, 2, '#ef4444');
      px(ctx, x, y - 8, 1, 2, '#facc15');
      break;
    case 'greatsword': {
      px(ctx, wx - 2, wy + 2, 6, 2, '#f59e0b'); // golden crossguard
      px(ctx, wx, wy + 4, 2, 4, '#451a03');
      px(ctx, wx - 1, wy - 14, 4, 16, '#e2e8f0');
      // Full blade flame animation
      const f = frame % 3;
      px(ctx, wx - 2, wy - 16 - f, 6, 5 + f, '#ea580c');
      px(ctx, wx - 1, wy - 17 - f, 4, 4 + f, '#f97316');
      px(ctx, wx, wy - 15, 2, 3, '#facc15');
      break;
    }
    case 'halberd': {
      px(ctx, wx, wy - 14, 2, 26, '#64748b'); // shaft
      px(ctx, wx - 2, wy - 18, 6, 6, '#38bdf8');
      px(ctx, wx + 3, wy - 16, 5, 7, frame % 2 === 0 ? '#38bdf8' : '#7dd3fc');
      px(ctx, wx + 4, wy - 15, 3, 3, '#fef08a');
      // Animated electric plasma spark
      if (frame % 3 === 0) {
        px(ctx, wx - 3, wy - 14, 2, 2, '#ffffff');
        px(ctx, wx + 8, wy - 12, 2, 2, '#38bdf8');
      }
      break;
    }
  }
}

/**
 * Draw animated survivor with armor, weapons, breathing, and expressions
 */
export function drawSurvivor({
  ctx,
  x,
  y,
  armor,
  weapon,
  pose,
  frame,
  blink,
}: DrawSurvivorParams): void {
  const palette = getArmorColors(armor);

  if (pose === 'perished') {
    // Fallen survivor kneeling in ash
    px(ctx, x - 2, y + 6, 16, 5, palette.body);
    px(ctx, x + 2, y + 1, 8, 6, '#d6a27b');
    px(ctx, x + 3, y + 3, 2, 1, '#1e293b');
    px(ctx, x + 7, y + 3, 2, 1, '#1e293b');
    px(ctx, x + 15, y + 10, 10, 2, '#64748b'); // dropped weapon
    return;
  }

  // Soft ground shadow beneath survivor
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(x + 5, y + 12, 8, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Natural breathing & action bob
  const isAttack = pose === 'strike';
  const isCelebrate = pose === 'celebrate' || pose === 'level_up';
  const isWarmHands = pose === 'warm_hands';
  const isPetting = pose === 'petting';

  const bob = isCelebrate
    ? frame % 2 === 0
      ? -3
      : 0
    : isAttack
      ? 1
      : frame % 6 < 3
        ? 0
        : -1;
  const sy = y + bob + (isPetting ? 3 : 0);
  const sx = x + (isAttack ? 3 : 0);

  // Mythic Apex fiery aura
  if (armor === 'apex') {
    const auraAlpha = frame % 4 < 2 ? 0.4 : 0.7;
    ctx.fillStyle = `rgba(250, 204, 21, ${auraAlpha})`;
    px(ctx, sx - 4, sy - 17 + (frame % 3), 2, 2, '#facc15');
    px(ctx, sx + 15, sy - 11 - (frame % 3), 2, 2, '#f97316');
    px(ctx, sx + 5, sy - 21, 2, 2, '#fef08a');
  }

  // Flowing Cloak / Cape behind torso
  if (palette.cape) {
    const flutter = frame % 4 < 2 ? 0 : -1;
    px(ctx, sx - 4 + flutter, sy - 7, 5, 15, palette.cape);
    px(ctx, sx - 6 + flutter, sy + 1, 3, 8, palette.cape);
  }

  // Legs & Boots
  if (isPetting) {
    // Crouching legs
    px(ctx, sx + 1, sy + 4, 5, 5, palette.legs);
    px(ctx, sx + 6, sy + 5, 5, 4, palette.legs);
    px(ctx, sx, sy + 9, 6, 3, palette.boots);
    px(ctx, sx + 6, sy + 9, 6, 3, palette.boots);
  } else {
    px(ctx, sx + 2, sy + 3, 3, 6, palette.legs);
    px(ctx, sx + 7, sy + 3, 3, 6, palette.legs);
    px(ctx, sx + 1, sy + 9, 4, 3, palette.boots);
    px(ctx, sx + 7, sy + 9, 4, 3, palette.boots);
  }

  // Torso
  px(ctx, sx + 1, sy - 7, 10, 10, palette.body);
  px(ctx, sx + 2, sy - 5, 8, 2, palette.trim);
  px(ctx, sx + 1, sy + 1, 10, 2, palette.trim); // Survival belt

  // Shoulder pauldrons
  if (palette.shoulder) {
    px(ctx, sx - 1, sy - 7, 3, 4, palette.shoulder);
    px(ctx, sx + 10, sy - 7, 3, 4, palette.shoulder);
  }

  // Arms according to action
  if (isCelebrate) {
    px(ctx, sx - 2, sy - 11, 3, 7, '#d6a27b');
    px(ctx, sx + 11, sy - 11, 3, 7, palette.body);
  } else if (isAttack) {
    px(ctx, sx - 2, sy - 3, 3, 5, '#d6a27b');
    px(ctx, sx + 10, sy - 2, 7, 3, palette.body); // Forward thrust arm
  } else if (isWarmHands) {
    px(ctx, sx - 4, sy - 4, 6, 3, '#d6a27b'); // Extended warming hands towards fire
    px(ctx, sx + 8, sy - 4, 3, 5, '#d6a27b');
  } else if (isPetting) {
    px(ctx, sx + 9, sy - 2, 7, 3, '#d6a27b'); // Reaching arm to pet
  } else {
    px(ctx, sx - 1, sy - 4, 2, 6, '#d6a27b');
    px(ctx, sx + 11, sy - 4, 2, 6, '#d6a27b');
  }

  // Head
  px(ctx, sx + 2, sy - 15, 8, 8, '#e5b892');

  // Hairstyles & Helmets
  if (!palette.helm) {
    // Castaway messy survivor hair
    px(ctx, sx + 1, sy - 17, 10, 3, '#451a03');
    px(ctx, sx + 1, sy - 14, 2, 4, '#451a03');
  } else if (palette.helm === 'bandana') {
    px(ctx, sx + 1, sy - 17, 10, 3, '#451a03');
    px(ctx, sx + 2, sy - 15, 8, 2, palette.visor ?? '#ef4444');
    px(ctx, sx - 2, sy - 14, 4, 2, palette.visor ?? '#ef4444'); // Swaying bandana tail
  } else if (palette.helm === 'hood') {
    px(ctx, sx + 1, sy - 17, 10, 4, '#15803d');
    px(ctx, sx + 1, sy - 14, 2, 6, '#166534');
    px(ctx, sx + 9, sy - 14, 2, 6, '#166534');
  } else if (palette.helm === 'steel') {
    px(ctx, sx + 1, sy - 17, 10, 4, '#cbd5e1');
    px(ctx, sx + 1, sy - 14, 2, 5, '#94a3b8');
    px(ctx, sx + 9, sy - 14, 2, 5, '#94a3b8');
  } else if (palette.helm === 'visor') {
    px(ctx, sx + 1, sy - 17, 10, 10, '#1e293b');
    px(ctx, sx + 3, sy - 13, 7, 3, palette.visor ?? '#38bdf8');
  } else if (palette.helm === 'crown') {
    px(ctx, sx + 1, sy - 17, 10, 10, '#0f172a');
    px(ctx, sx + 2, sy - 19, 2, 2, '#facc15');
    px(ctx, sx + 5, sy - 21, 2, 4, '#facc15');
    px(ctx, sx + 8, sy - 19, 2, 2, '#facc15');
    px(ctx, sx + 3, sy - 13, 7, 3, '#fde047');
  }

  // Eyes (unless visor / crown)
  if (palette.helm !== 'visor' && palette.helm !== 'crown') {
    if (!blink) {
      px(ctx, sx + 4, sy - 12, 1, 2, '#0f172a');
      px(ctx, sx + 8, sy - 12, 1, 2, '#0f172a');
    } else {
      px(ctx, sx + 4, sy - 11, 1, 1, '#0f172a');
      px(ctx, sx + 8, sy - 11, 1, 1, '#0f172a');
    }
  }

  // Sweat drop when stressed before deadline
  if (pose === 'stressed' && frame % 4 < 2) {
    px(ctx, sx, sy - 15, 2, 2, '#38bdf8');
  }

  // Weapon
  drawWeapon(ctx, sx, sy, weapon, pose, frame);
}
