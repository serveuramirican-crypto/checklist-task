import type { ArmorId, CampId, WeaponId } from '../game/progression';

export type SurvivorPose = 'idle' | 'celebrate' | 'level_up' | 'stressed' | 'perished';

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

const px = (
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

export function drawCampShelter(
  ctx: CanvasRenderingContext2D,
  camp: CampId,
  frame: number,
  isDead: boolean,
  hasCookingPot: boolean
): void {
  const groundY = 144;

  // Shelter structures behind hero (left-center x=38..135)
  if (camp === 'tent') {
    // Supply crate
    px(ctx, 42, groundY - 12, 14, 12, '#78350f');
    px(ctx, 43, groundY - 11, 12, 10, '#92400e');
    px(ctx, 42, groundY - 7, 14, 2, '#451a03');
    px(ctx, 48, groundY - 12, 2, 12, '#451a03');

    // Canvas lean-to tent
    for (let i = 0; i < 24; i++) {
      const rowW = 48 - i * 2;
      px(ctx, 64 + i, groundY - 1 - i, rowW, 1, i % 4 === 0 ? '#3f6212' : '#4d7c0f');
    }
    // Tent dark opening
    for (let i = 0; i < 16; i++) {
      px(ctx, 74 + i, groundY - 1 - i, 28 - i * 2, 1, '#111827');
    }
    // Tent poles & lantern
    px(ctx, 87, groundY - 27, 2, 27, '#78350f');
    if (!isDead) {
      px(ctx, 88, groundY - 16, 2, 3, frame % 4 < 2 ? '#facc15' : '#f97316');
    }
  } else if (camp === 'outpost') {
    // Timber watch outpost
    px(ctx, 46, groundY - 34, 58, 34, '#5c3317');
    px(ctx, 48, groundY - 32, 54, 32, '#78350f');
    // Planks
    for (let py = 0; py < 32; py += 5) {
      px(ctx, 48, groundY - 32 + py, 54, 1, '#451a03');
    }
    // Pitched roof
    for (let i = 0; i < 14; i++) {
      px(ctx, 40 + i, groundY - 34 - i, 70 - i * 2, 1, i % 2 === 0 ? '#334155' : '#1e293b');
    }
    // Door
    px(ctx, 56, groundY - 22, 14, 22, '#3b1d0a');
    px(ctx, 67, groundY - 12, 2, 2, '#facc15');
    // Warm lit window
    px(ctx, 78, groundY - 24, 14, 12, '#1e293b');
    px(ctx, 80, groundY - 22, 10, 8, isDead ? '#0f172a' : '#f59e0b');
    px(ctx, 84, groundY - 22, 2, 8, '#451a03');
    px(ctx, 80, groundY - 19, 10, 2, '#451a03');
    // Hanging oil lantern
    px(ctx, 104, groundY - 28, 6, 2, '#475569');
    if (!isDead) {
      const sway = frame % 6 < 3 ? 0 : 1;
      px(ctx, 108 + sway, groundY - 26, 3, 5, '#facc15');
    }
  } else if (camp === 'bunker' || camp === 'citadel') {
    // Reinforced stone & steel bunker
    const isCitadel = camp === 'citadel';
    px(ctx, 36, groundY - 40, 74, 40, '#334155');
    px(ctx, 38, groundY - 38, 70, 38, '#475569');
    // Concrete blocks & battlements
    for (let bx = 36; bx < 110; bx += 12) {
      px(ctx, bx, groundY - 44, 7, 4, '#64748b');
    }
    // Steel door
    px(ctx, 52, groundY - 26, 18, 26, '#1e293b');
    px(ctx, 54, groundY - 24, 14, 24, '#0f172a');
    px(ctx, 56, groundY - 14, 10, 2, '#f97316');
    // Glowing viewport slit
    px(ctx, 76, groundY - 28, 22, 6, '#0f172a');
    px(ctx, 78, groundY - 26, 18, 2, isDead ? '#1e293b' : isCitadel ? '#38bdf8' : '#f59e0b');

    // Citadel watchtower & beacon
    if (isCitadel) {
      px(ctx, 64, groundY - 70, 24, 30, '#334155');
      px(ctx, 66, groundY - 68, 20, 28, '#475569');
      px(ctx, 61, groundY - 74, 30, 4, '#64748b');
      if (!isDead) {
        // Eternal golden sky beacon
        const pulse = frame % 4 < 2 ? 0.25 : 0.4;
        ctx.fillStyle = `rgba(250, 204, 21, ${pulse})`;
        ctx.fillRect(72, 0, 8, groundY - 74);
        px(ctx, 71, groundY - 80, 10, 6, '#facc15');
        px(ctx, 73, groundY - 79, 6, 4, '#fef08a');
      }
    }

    // Fluttering survival banner
    px(ctx, 98, groundY - 62, 2, 22, '#94a3b8');
    const wave = frame % 4 < 2 ? 0 : 1;
    px(ctx, 100, groundY - 61, 12, 7, '#dc2626');
    px(ctx, 110, groundY - 60 + wave, 5, 5, '#ef4444');
    px(ctx, 103, groundY - 59, 4, 3, '#facc15');
  }

  // Campfire pit (center-left x=118..142)
  const fireX = 128;
  // Stone ring or ashes
  if (camp === 'embers') {
    px(ctx, fireX - 7, groundY - 2, 14, 2, '#374151');
    if (!isDead) {
      px(ctx, fireX - 4, groundY - 3, 3, 2, frame % 2 === 0 ? '#dc2626' : '#f97316');
      px(ctx, fireX + 1, groundY - 3, 4, 2, frame % 3 === 0 ? '#f97316' : '#991b1b');
    }
  } else {
    // Log bench
    px(ctx, fireX - 24, groundY - 5, 12, 5, '#78350f');
    px(ctx, fireX - 23, groundY - 4, 10, 2, '#92400e');

    // Crossed logs + stones
    px(ctx, fireX - 8, groundY - 3, 16, 3, '#78350f');
    px(ctx, fireX - 10, groundY - 2, 4, 3, '#64748b');
    px(ctx, fireX - 3, groundY - 2, 6, 3, '#475569');
    px(ctx, fireX + 6, groundY - 2, 4, 3, '#64748b');

    if (!isDead) {
      const f = frame % 3;
      px(ctx, fireX - 6, groundY - 8 - f, 12, 6 + f, '#ea580c');
      px(ctx, fireX - 4, groundY - 11 + (f % 2), 8, 8, '#f97316');
      px(ctx, fireX - 2, groundY - 9 - (f % 2), 4, 6, '#facc15');
      px(ctx, fireX - 1, groundY - 6, 2, 3, '#fef08a');
    }
  }

  // Cooking pot tripod unlocked at 150+ SP
  if (hasCookingPot && camp !== 'embers') {
    px(ctx, fireX - 9, groundY - 18, 2, 18, '#78350f');
    px(ctx, fireX + 7, groundY - 18, 2, 18, '#78350f');
    px(ctx, fireX - 9, groundY - 19, 18, 2, '#475569');
    px(ctx, fireX - 4, groundY - 15, 8, 6, '#1e293b');
    px(ctx, fireX - 3, groundY - 14, 6, 4, '#334155');
    if (!isDead && frame % 4 < 2) {
      px(ctx, fireX - 2, groundY - 22, 2, 2, 'rgba(226,232,240,0.45)');
      px(ctx, fireX + 1, groundY - 24, 2, 2, 'rgba(226,232,240,0.35)');
    }
  }
}

export function drawWolfCompanion(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  pose: SurvivorPose
): void {
  if (pose === 'perished') return;
  const bounce = pose === 'celebrate' || pose === 'level_up' ? (frame % 2 === 0 ? -2 : 0) : 0;
  const wy = y + bounce;
  const tailWag = frame % 4 < 2 ? -1 : 1;

  // Tail
  px(ctx, x - 4, wy - 7 + tailWag, 4, 3, '#64748b');
  // Body
  px(ctx, x, wy - 8, 12, 6, '#94a3b8');
  px(ctx, x + 1, wy - 5, 10, 3, '#cbd5e1');
  // Legs
  px(ctx, x + 1, wy - 2, 2, 2, '#64748b');
  px(ctx, x + 9, wy - 2, 2, 2, '#64748b');
  // Head & Ears
  px(ctx, x + 8, wy - 13, 6, 6, '#94a3b8');
  px(ctx, x + 8, wy - 15, 2, 2, '#64748b');
  px(ctx, x + 11, wy - 15, 2, 2, '#64748b');
  // Snout & Eye
  px(ctx, x + 14, wy - 10, 3, 3, '#cbd5e1');
  px(ctx, x + 16, wy - 10, 1, 1, '#0f172a');
  px(ctx, x + 11, wy - 11, 2, 1, pose === 'stressed' ? '#ef4444' : '#facc15');
}

export function drawDroneCompanion(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  pose: SurvivorPose
): void {
  if (pose === 'perished') return;
  const hover = Math.round(Math.sin(frame * 0.35) * 3);
  const dy = y + hover;

  // Hover thruster glow
  px(ctx, x + 3, dy + 7, 4, 2, frame % 2 === 0 ? '#38bdf8' : '#0ea5e9');
  // Chassis
  px(ctx, x, dy + 1, 10, 6, '#334155');
  px(ctx, x + 1, dy, 8, 2, '#94a3b8');
  // Glowing eye
  px(ctx, x + 6, dy + 3, 3, 2, pose === 'stressed' ? '#ef4444' : '#38bdf8');
  // Antenna
  px(ctx, x + 2, dy - 3, 1, 3, '#cbd5e1');
  px(ctx, x + 2, dy - 4, 1, 1, frame % 4 < 2 ? '#facc15' : '#ef4444');
}

function getArmorColors(armor: ArmorId) {
  switch (armor) {
    case 'rags':
      return {
        body: '#78716c',
        trim: '#57534e',
        legs: '#44403c',
        boots: '#d6a27b',
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
        boots: '#292524',
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
        trim: '#e2e8f0',
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
        body: '#0f172a',
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
  const raised = pose === 'celebrate' || pose === 'level_up';
  const wx = raised ? x + 13 : x + 12;
  const wy = raised ? y - 10 : y - 2;

  switch (weapon) {
    case 'stick':
      px(ctx, wx, wy - 6, 2, 14, '#78350f');
      px(ctx, wx + 1, wy - 8, 2, 3, '#92400e');
      break;
    case 'spear':
      px(ctx, wx, wy - 10, 2, 20, '#92400e');
      px(ctx, wx - 1, wy - 14, 4, 4, '#cbd5e1');
      px(ctx, wx, wy - 16, 2, 2, '#f8fafc');
      break;
    case 'machete':
      px(ctx, wx, wy + 2, 2, 4, '#451a03');
      px(ctx, wx, wy - 8, 3, 10, '#cbd5e1');
      px(ctx, wx + 1, wy - 10, 3, 3, '#f8fafc');
      break;
    case 'bow':
      px(ctx, wx + 1, wy - 9, 2, 18, '#b45309');
      px(ctx, wx + 3, wy - 11, 2, 3, '#d97706');
      px(ctx, wx + 3, wy + 8, 2, 3, '#d97706');
      px(ctx, wx, wy - 9, 1, 18, '#e2e8f0');
      // Quiver on back
      px(ctx, x - 2, y - 6, 3, 9, '#78350f');
      px(ctx, x - 2, y - 8, 1, 2, '#ef4444');
      px(ctx, x, y - 8, 1, 2, '#facc15');
      break;
    case 'greatsword': {
      px(ctx, wx - 2, wy + 2, 6, 2, '#f59e0b');
      px(ctx, wx, wy + 4, 2, 4, '#451a03');
      px(ctx, wx - 1, wy - 13, 4, 15, '#e2e8f0');
      // Animated flame tip
      const f = frame % 3;
      px(ctx, wx - 1, wy - 16 - f, 4, 4 + f, '#f97316');
      px(ctx, wx, wy - 15, 2, 3, '#facc15');
      break;
    }
    case 'halberd': {
      px(ctx, wx, wy - 12, 2, 24, '#64748b');
      px(ctx, wx - 1, wy - 16, 4, 5, '#38bdf8');
      px(ctx, wx + 2, wy - 14, 5, 6, frame % 2 === 0 ? '#38bdf8' : '#7dd3fc');
      px(ctx, wx + 3, wy - 13, 3, 3, '#fef08a');
      break;
    }
  }
}

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
    // Fallen survivor kneeling/collapsed in ash
    px(ctx, x - 2, y + 6, 16, 5, palette.body);
    px(ctx, x + 2, y + 1, 8, 6, '#d6a27b');
    px(ctx, x + 3, y + 3, 2, 1, '#1e293b');
    px(ctx, x + 7, y + 3, 2, 1, '#1e293b');
    // Dropped stick/weapon on dirt
    px(ctx, x + 15, y + 10, 9, 2, '#64748b');
    return;
  }

  const bob =
    pose === 'celebrate' || pose === 'level_up'
      ? frame % 2 === 0
        ? -3
        : 0
      : frame % 6 < 3
        ? 0
        : -1;

  const sy = y + bob;

  // Apex mythic aura
  if (armor === 'apex') {
    const auraAlpha = frame % 4 < 2 ? 0.35 : 0.6;
    ctx.fillStyle = `rgba(250, 204, 21, ${auraAlpha})`;
    ctx.fillRect(x - 3, sy - 16 + (frame % 3), 2, 2);
    ctx.fillRect(x + 15, sy - 10 - (frame % 3), 2, 2);
  }

  // Cape / Cloak behind body
  if (palette.cape) {
    const flutter = frame % 4 < 2 ? 0 : -1;
    px(ctx, x - 3 + flutter, sy - 7, 5, 14, palette.cape);
    px(ctx, x - 5 + flutter, sy + 1, 3, 7, palette.cape);
  }

  // Legs & Boots
  px(ctx, x + 2, sy + 3, 3, 6, palette.legs);
  px(ctx, x + 7, sy + 3, 3, 6, palette.legs);
  px(ctx, x + 1, sy + 9, 4, 3, palette.boots);
  px(ctx, x + 7, sy + 9, 4, 3, palette.boots);

  // Torso
  px(ctx, x + 1, sy - 7, 10, 10, palette.body);
  px(ctx, x + 2, sy - 5, 8, 2, palette.trim);
  px(ctx, x + 1, sy + 1, 10, 2, palette.trim); // Belt

  // Shoulder pauldrons
  if (palette.shoulder) {
    px(ctx, x - 1, sy - 7, 3, 4, palette.shoulder);
    px(ctx, x + 10, sy - 7, 3, 4, palette.shoulder);
  }

  // Arms
  if (pose === 'celebrate' || pose === 'level_up') {
    px(ctx, x - 2, sy - 10, 3, 6, '#d6a27b');
    px(ctx, x + 11, sy - 10, 3, 6, palette.body);
  } else {
    px(ctx, x - 1, sy - 4, 2, 6, '#d6a27b');
    px(ctx, x + 11, sy - 4, 2, 6, '#d6a27b');
  }

  // Head
  px(ctx, x + 2, sy - 15, 8, 8, '#e5b892');

  // Hair / Helmets
  if (!palette.helm) {
    // Messy castaway hair
    px(ctx, x + 1, sy - 17, 10, 3, '#451a03');
    px(ctx, x + 1, sy - 14, 2, 3, '#451a03');
  } else if (palette.helm === 'bandana') {
    px(ctx, x + 1, sy - 17, 10, 3, '#451a03');
    px(ctx, x + 2, sy - 15, 8, 2, palette.visor ?? '#ef4444');
    px(ctx, x - 1, sy - 14, 3, 2, palette.visor ?? '#ef4444');
  } else if (palette.helm === 'hood') {
    px(ctx, x + 1, sy - 17, 10, 4, '#15803d');
    px(ctx, x + 1, sy - 14, 2, 6, '#166534');
    px(ctx, x + 9, sy - 14, 2, 6, '#166534');
  } else if (palette.helm === 'steel') {
    px(ctx, x + 1, sy - 17, 10, 4, '#cbd5e1');
    px(ctx, x + 1, sy - 14, 2, 5, '#94a3b8');
    px(ctx, x + 9, sy - 14, 2, 5, '#94a3b8');
  } else if (palette.helm === 'visor') {
    px(ctx, x + 1, sy - 17, 10, 10, '#1e293b');
    px(ctx, x + 3, sy - 13, 7, 3, palette.visor ?? '#38bdf8');
  } else if (palette.helm === 'crown') {
    px(ctx, x + 1, sy - 17, 10, 10, '#0f172a');
    px(ctx, x + 2, sy - 19, 2, 2, '#facc15');
    px(ctx, x + 5, sy - 20, 2, 3, '#facc15');
    px(ctx, x + 8, sy - 19, 2, 2, '#facc15');
    px(ctx, x + 3, sy - 13, 7, 3, '#fde047');
  }

  // Eyes (unless visor/crown covers face)
  if (palette.helm !== 'visor' && palette.helm !== 'crown') {
    if (!blink) {
      px(ctx, x + 4, sy - 12, 1, 2, '#0f172a');
      px(ctx, x + 8, sy - 12, 1, 2, '#0f172a');
    } else {
      px(ctx, x + 4, sy - 11, 1, 1, '#0f172a');
      px(ctx, x + 8, sy - 11, 1, 1, '#0f172a');
    }
  }

  // Sweat pixel when stressed before midnight
  if (pose === 'stressed' && frame % 4 < 2) {
    px(ctx, x, sy - 15, 2, 2, '#38bdf8');
  }

  // Weapon
  drawWeapon(ctx, x, sy, weapon, pose, frame);
}
