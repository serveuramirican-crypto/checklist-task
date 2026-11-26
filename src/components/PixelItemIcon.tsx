import type { ArmorId, CampId, CompanionId, WeaponId } from '../game/progression';

type AnyItemId = ArmorId | WeaponId | CampId | CompanionId | 'level';

interface PixelItemIconProps {
  itemId: AnyItemId;
  className?: string;
}

export function PixelItemIcon({ itemId, className = 'h-8 w-8' }: PixelItemIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      className={`pixelated shrink-0 border border-slate-700 bg-slate-950 p-0.5 ${className}`}
      aria-hidden="true"
    >
      {renderPixels(itemId)}
    </svg>
  );
}

function renderPixels(id: AnyItemId) {
  switch (id) {
    // Weapons
    case 'stick':
      return (
        <>
          <rect x="7" y="2" width="2" height="12" fill="#92400e" />
          <rect x="9" y="4" width="2" height="2" fill="#78350f" />
        </>
      );
    case 'spear':
      return (
        <>
          <rect x="7" y="1" width="2" height="2" fill="#f8fafc" />
          <rect x="6" y="3" width="4" height="2" fill="#cbd5e1" />
          <rect x="7" y="5" width="2" height="10" fill="#92400e" />
        </>
      );
    case 'machete':
      return (
        <>
          <rect x="8" y="2" width="3" height="8" fill="#cbd5e1" />
          <rect x="7" y="3" width="1" height="7" fill="#f8fafc" />
          <rect x="6" y="10" width="4" height="1" fill="#475569" />
          <rect x="7" y="11" width="2" height="3" fill="#78350f" />
        </>
      );
    case 'bow':
      return (
        <>
          <rect x="5" y="2" width="2" height="12" fill="#e2e8f0" />
          <rect x="7" y="2" width="3" height="2" fill="#b45309" />
          <rect x="9" y="4" width="2" height="8" fill="#d97706" />
          <rect x="7" y="12" width="3" height="2" fill="#b45309" />
          <rect x="4" y="7" width="8" height="1" fill="#facc15" />
        </>
      );
    case 'greatsword':
      return (
        <>
          <rect x="7" y="1" width="2" height="3" fill="#facc15" />
          <rect x="6" y="2" width="4" height="3" fill="#f97316" />
          <rect x="7" y="4" width="2" height="7" fill="#e2e8f0" />
          <rect x="4" y="11" width="8" height="2" fill="#f59e0b" />
          <rect x="7" y="13" width="2" height="2" fill="#78350f" />
        </>
      );
    case 'halberd':
      return (
        <>
          <rect x="6" y="1" width="3" height="4" fill="#38bdf8" />
          <rect x="9" y="3" width="4" height="4" fill="#7dd3fc" />
          <rect x="10" y="4" width="2" height="2" fill="#fef08a" />
          <rect x="6" y="5" width="2" height="10" fill="#64748b" />
        </>
      );

    // Armor
    case 'rags':
      return (
        <>
          <rect x="4" y="4" width="8" height="8" fill="#78716c" />
          <rect x="6" y="4" width="4" height="2" fill="#1e293b" />
          <rect x="5" y="9" width="6" height="2" fill="#57534e" />
        </>
      );
    case 'scavenger':
      return (
        <>
          <rect x="3" y="4" width="10" height="8" fill="#92400e" />
          <rect x="6" y="4" width="4" height="2" fill="#1e293b" />
          <rect x="4" y="9" width="8" height="2" fill="#ef4444" />
          <rect x="6" y="6" width="4" height="2" fill="#b45309" />
        </>
      );
    case 'ranger':
      return (
        <>
          <rect x="5" y="2" width="6" height="3" fill="#15803d" />
          <rect x="3" y="5" width="10" height="8" fill="#166534" />
          <rect x="5" y="9" width="6" height="2" fill="#eab308" />
        </>
      );
    case 'vanguard':
      return (
        <>
          <rect x="2" y="4" width="12" height="3" fill="#cbd5e1" />
          <rect x="4" y="6" width="8" height="6" fill="#94a3b8" />
          <rect x="5" y="12" width="6" height="2" fill="#b91c1c" />
        </>
      );
    case 'warden':
      return (
        <>
          <rect x="5" y="2" width="6" height="4" fill="#1e293b" />
          <rect x="6" y="3" width="4" height="2" fill="#38bdf8" />
          <rect x="3" y="6" width="10" height="7" fill="#334155" />
          <rect x="6" y="8" width="4" height="2" fill="#38bdf8" />
        </>
      );
    case 'apex':
      return (
        <>
          <rect x="5" y="1" width="6" height="3" fill="#facc15" />
          <rect x="3" y="4" width="10" height="9" fill="#0f172a" />
          <rect x="4" y="6" width="8" height="2" fill="#facc15" />
          <rect x="6" y="9" width="4" height="2" fill="#f59e0b" />
        </>
      );

    // Camp
    case 'embers':
      return (
        <>
          <rect x="3" y="12" width="10" height="2" fill="#374151" />
          <rect x="5" y="10" width="3" height="2" fill="#dc2626" />
          <rect x="9" y="10" width="2" height="2" fill="#f97316" />
        </>
      );
    case 'campfire':
      return (
        <>
          <rect x="6" y="4" width="4" height="4" fill="#facc15" />
          <rect x="5" y="7" width="6" height="4" fill="#f97316" />
          <rect x="3" y="11" width="10" height="2" fill="#78350f" />
          <rect x="3" y="13" width="3" height="2" fill="#64748b" />
          <rect x="10" y="13" width="3" height="2" fill="#64748b" />
        </>
      );
    case 'tent':
      return (
        <>
          <rect x="7" y="3" width="2" height="10" fill="#78350f" />
          <rect x="5" y="5" width="6" height="8" fill="#4d7c0f" />
          <rect x="3" y="9" width="10" height="4" fill="#3f6212" />
          <rect x="6" y="9" width="4" height="4" fill="#111827" />
        </>
      );
    case 'outpost':
      return (
        <>
          <rect x="3" y="4" width="10" height="3" fill="#334155" />
          <rect x="4" y="7" width="8" height="6" fill="#78350f" />
          <rect x="6" y="9" width="3" height="4" fill="#3b1d0a" />
          <rect x="10" y="8" width="2" height="2" fill="#f59e0b" />
        </>
      );
    case 'bunker':
      return (
        <>
          <rect x="11" y="2" width="3" height="2" fill="#dc2626" />
          <rect x="10" y="2" width="1" height="4" fill="#94a3b8" />
          <rect x="3" y="6" width="10" height="8" fill="#475569" />
          <rect x="5" y="9" width="6" height="5" fill="#1e293b" />
          <rect x="6" y="7" width="4" height="1" fill="#f59e0b" />
        </>
      );
    case 'citadel':
      return (
        <>
          <rect x="7" y="1" width="2" height="3" fill="#fef08a" />
          <rect x="5" y="4" width="6" height="4" fill="#facc15" />
          <rect x="4" y="8" width="8" height="6" fill="#475569" />
          <rect x="6" y="10" width="4" height="4" fill="#38bdf8" />
        </>
      );

    // Companions
    case 'cooking_pot':
      return (
        <>
          <rect x="3" y="4" width="10" height="2" fill="#475569" />
          <rect x="5" y="6" width="6" height="5" fill="#1e293b" />
          <rect x="6" y="3" width="1" height="2" fill="#cbd5e1" />
          <rect x="9" y="2" width="1" height="2" fill="#cbd5e1" />
          <rect x="6" y="12" width="4" height="2" fill="#f97316" />
        </>
      );
    case 'wolf':
      return (
        <>
          <rect x="4" y="4" width="2" height="2" fill="#64748b" />
          <rect x="8" y="4" width="2" height="2" fill="#64748b" />
          <rect x="4" y="6" width="7" height="5" fill="#94a3b8" />
          <rect x="11" y="8" width="3" height="3" fill="#cbd5e1" />
          <rect x="8" y="7" width="2" height="1" fill="#facc15" />
          <rect x="4" y="11" width="2" height="2" fill="#64748b" />
          <rect x="9" y="11" width="2" height="2" fill="#64748b" />
        </>
      );
    case 'drone':
      return (
        <>
          <rect x="7" y="2" width="2" height="3" fill="#cbd5e1" />
          <rect x="3" y="5" width="10" height="5" fill="#334155" />
          <rect x="4" y="4" width="8" height="2" fill="#94a3b8" />
          <rect x="6" y="7" width="4" height="2" fill="#38bdf8" />
          <rect x="6" y="11" width="4" height="2" fill="#0ea5e9" />
        </>
      );

    case 'level':
    default:
      return (
        <>
          <rect x="7" y="2" width="2" height="12" fill="#facc15" />
          <rect x="5" y="4" width="6" height="2" fill="#facc15" />
          <rect x="3" y="6" width="10" height="2" fill="#f59e0b" />
        </>
      );
  }
}
