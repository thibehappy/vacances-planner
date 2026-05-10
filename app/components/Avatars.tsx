export function AvatarThibaud() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <circle cx="60" cy="60" r="58" fill="#dbeafe" />
      {/* Clouds */}
      <ellipse cx="25" cy="30" rx="12" ry="6" fill="#bfdbfe" />
      <ellipse cx="90" cy="22" rx="14" ry="7" fill="#bfdbfe" />
      {/* Airplane - top-down view, tilted for dynamism */}
      <g transform="translate(60,62) rotate(-20)">
        {/* Fuselage */}
        <ellipse cx="0" cy="0" rx="8" ry="30" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.2" />
        {/* Nose */}
        <ellipse cx="0" cy="-28" rx="5" ry="6" fill="#93c5fd" />
        {/* Wings */}
        <rect x="-32" y="-6" width="64" height="10" rx="3" fill="#3b82f6" />
        {/* Tail wings */}
        <rect x="-14" y="22" width="28" height="6" rx="2" fill="#2563eb" />
        {/* Tail fin */}
        <rect x="-2" y="18" width="4" height="14" rx="1" fill="#1d4ed8" />
        {/* Engines */}
        <ellipse cx="-18" cy="0" rx="4" ry="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
        <ellipse cx="18" cy="0" rx="4" ry="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
        {/* Windows */}
        <circle cx="0" cy="-14" r="2" fill="#60a5fa" />
        <circle cx="0" cy="-8" r="2" fill="#60a5fa" />
        <circle cx="0" cy="-2" r="2" fill="#60a5fa" />
        <circle cx="0" cy="4" r="2" fill="#60a5fa" />
      </g>
      {/* Contrail */}
      <path d="M72 78 Q85 88 95 105" stroke="white" strokeWidth="3" fill="none" opacity="0.6" strokeLinecap="round" />
      <path d="M68 80 Q80 92 88 108" stroke="white" strokeWidth="2.5" fill="none" opacity="0.4" strokeLinecap="round" />
    </svg>
  );
}

export function AvatarAlexander() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <circle cx="60" cy="60" r="58" fill="#d1fae5" />
      {/* Bar chart */}
      <rect x="25" y="70" width="12" height="25" rx="2" fill="#6ee7b7" />
      <rect x="42" y="55" width="12" height="40" rx="2" fill="#34d399" />
      <rect x="59" y="40" width="12" height="55" rx="2" fill="#10b981" />
      <rect x="76" y="28" width="12" height="67" rx="2" fill="#059669" />
      {/* Trend line */}
      <path d="M31 68 L48 53 L65 38 L82 26" stroke="#065f46" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Arrow up */}
      <path d="M82 26 L78 32 M82 26 L87 30" stroke="#065f46" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Dollar signs */}
      <text x="95" y="25" fontSize="14" fill="#065f46" fontWeight="bold">$</text>
      <text x="15" y="45" fontSize="10" fill="#6ee7b7">¥</text>
    </svg>
  );
}

export function AvatarAlix() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <circle cx="60" cy="60" r="58" fill="#fef3c7" />
      {/* Pasta bowl */}
      <ellipse cx="60" cy="72" rx="32" ry="12" fill="#fbbf24" />
      <path d="M28 72 Q28 95 60 95 Q92 95 92 72" fill="#f59e0b" />
      {/* Spaghetti */}
      <path d="M40 68 Q45 45 55 50 Q65 55 50 65" stroke="#eab308" strokeWidth="3" fill="none" />
      <path d="M55 66 Q60 42 70 48 Q80 54 65 64" stroke="#ca8a04" strokeWidth="3" fill="none" />
      <path d="M50 70 Q42 50 60 45 Q78 40 72 65" stroke="#eab308" strokeWidth="2.5" fill="none" />
      {/* Tomato sauce dots */}
      <circle cx="50" cy="58" r="4" fill="#ef4444" opacity="0.8" />
      <circle cx="65" cy="55" r="3" fill="#ef4444" opacity="0.7" />
      <circle cx="58" cy="63" r="3.5" fill="#dc2626" opacity="0.8" />
      {/* Steam */}
      <path d="M45 38 Q43 30 47 25" stroke="#d1d5db" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M60 35 Q58 27 62 22" stroke="#d1d5db" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M75 38 Q73 30 77 25" stroke="#d1d5db" strokeWidth="2" fill="none" opacity="0.5" />
      {/* Fork */}
      <line x1="80" y1="30" x2="72" y2="60" stroke="#9ca3af" strokeWidth="2.5" />
      <line x1="77" y1="30" x2="73" y2="40" stroke="#9ca3af" strokeWidth="1.5" />
      <line x1="80" y1="29" x2="76" y2="39" stroke="#9ca3af" strokeWidth="1.5" />
      <line x1="83" y1="30" x2="79" y2="40" stroke="#9ca3af" strokeWidth="1.5" />
    </svg>
  );
}

export function AvatarAntoine() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <circle cx="60" cy="60" r="58" fill="#ede9fe" />
      {/* Bitcoin symbol */}
      <circle cx="60" cy="62" r="28" fill="#8b5cf6" opacity="0.15" />
      <text x="60" y="74" textAnchor="middle" fontSize="40" fill="#7c3aed" fontWeight="bold">₿</text>
      {/* Crown */}
      <path d="M38 30 L42 18 L50 26 L60 14 L70 26 L78 18 L82 30Z" fill="#eab308" />
      <rect x="38" y="30" width="44" height="6" rx="1" fill="#ca8a04" />
      {/* Gems on crown */}
      <circle cx="50" cy="33" r="2" fill="#a78bfa" />
      <circle cx="60" cy="33" r="2" fill="#c084fc" />
      <circle cx="70" cy="33" r="2" fill="#a78bfa" />
      {/* Sparkles */}
      <text x="25" y="50" fontSize="10" fill="#a78bfa">✦</text>
      <text x="90" y="45" fontSize="8" fill="#c084fc">✦</text>
      <text x="85" y="90" fontSize="12" fill="#a78bfa">✦</text>
      <text x="20" y="85" fontSize="7" fill="#c084fc">✦</text>
      {/* Chart line going up */}
      <path d="M30 100 L45 92 L55 95 L70 80 L85 70 L95 55" stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function AvatarBaptiste() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      {/* Tricolor background */}
      <clipPath id="clip-baptiste">
        <circle cx="60" cy="60" r="58" />
      </clipPath>
      <g clipPath="url(#clip-baptiste)">
        <rect x="0" y="0" width="40" height="120" fill="#2563eb" />
        <rect x="40" y="0" width="40" height="120" fill="#f8fafc" />
        <rect x="80" y="0" width="40" height="120" fill="#ef4444" />
      </g>
      <circle cx="60" cy="60" r="58" fill="none" stroke="#1e3a5f" strokeWidth="2" />
      {/* Napoleon bicorne hat */}
      <path d="M25 55 Q60 20 95 55 L85 58 Q60 42 35 58Z" fill="#1e293b" />
      <path d="M35 58 Q60 46 85 58" fill="#334155" />
      {/* Cockade (rosette) */}
      <circle cx="60" cy="46" r="5" fill="#2563eb" />
      <circle cx="60" cy="46" r="3.5" fill="white" />
      <circle cx="60" cy="46" r="2" fill="#ef4444" />
      {/* Crossed swords below */}
      <line x1="38" y1="72" x2="82" y2="100" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="82" y1="72" x2="38" y2="100" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
      {/* Fleur de lys */}
      <text x="60" y="92" textAnchor="middle" fontSize="16" fill="#eab308">⚜</text>
    </svg>
  );
}

export function AvatarChristian() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <circle cx="60" cy="60" r="58" fill="#cffafe" />
      {/* Water */}
      <path d="M0 80 Q20 75 40 80 Q60 85 80 80 Q100 75 120 80 L120 120 L0 120Z" fill="#67e8f9" opacity="0.4" />
      <path d="M0 88 Q20 83 40 88 Q60 93 80 88 Q100 83 120 88 L120 120 L0 120Z" fill="#22d3ee" opacity="0.3" />
      {/* Fishing rod */}
      <line x1="30" y1="25" x2="30" y2="80" stroke="#92400e" strokeWidth="3" strokeLinecap="round" />
      <line x1="30" y1="25" x2="75" y2="35" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />
      {/* Fishing line */}
      <path d="M75 35 Q80 55 70 72" stroke="#9ca3af" strokeWidth="1" fill="none" />
      {/* Float */}
      <ellipse cx="70" cy="72" rx="3" ry="5" fill="#ef4444" />
      <ellipse cx="70" cy="77" rx="3" ry="3" fill="white" />
      {/* Fish */}
      <g transform="translate(65, 50) rotate(-15)">
        <ellipse cx="0" cy="0" rx="14" ry="7" fill="#f59e0b" />
        <path d="M12 0 L22 -7 L22 7Z" fill="#f59e0b" />
        <circle cx="-6" cy="-2" r="2" fill="#1e293b" />
        <circle cx="-6" cy="-2" r="1" fill="white" />
        <path d="M-2 3 Q2 5 6 3" stroke="#92400e" strokeWidth="1" fill="none" />
      </g>
      {/* Splashes */}
      <text x="50" y="68" fontSize="8" fill="#06b6d4">💧</text>
    </svg>
  );
}

export function AvatarYanis() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <circle cx="60" cy="60" r="58" fill="#e0f2fe" />
      {/* Football pitch lines */}
      <ellipse cx="60" cy="60" rx="40" ry="40" fill="none" stroke="#7dd3fc" strokeWidth="1.5" opacity="0.4" />
      <line x1="20" y1="60" x2="100" y2="60" stroke="#7dd3fc" strokeWidth="1" opacity="0.3" />
      {/* Football */}
      <circle cx="60" cy="52" r="20" fill="white" stroke="#1e293b" strokeWidth="1.5" />
      <path d="M60 32 L54 40 L42 42 L44 54 L54 62 L66 62 L76 54 L78 42 L66 40Z" fill="none" stroke="#1e293b" strokeWidth="1.2" />
      <polygon points="60,32 54,40 66,40" fill="#1e293b" />
      <polygon points="42,42 44,54 54,48" fill="#1e293b" />
      <polygon points="78,42 76,54 66,48" fill="#1e293b" />
      <polygon points="54,62 60,56 66,62" fill="#1e293b" />
      {/* OM shield shape */}
      <path d="M50 78 L50 90 Q60 100 70 90 L70 78Z" fill="#2aa7e0" stroke="#1e293b" strokeWidth="1.2" />
      <text x="60" y="92" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">OM</text>
      {/* Stars */}
      <text x="22" y="30" fontSize="10" fill="#2aa7e0">★</text>
      <text x="90" y="85" fontSize="8" fill="#2aa7e0">★</text>
      <text x="85" y="28" fontSize="7" fill="#7dd3fc">★</text>
    </svg>
  );
}

export function AvatarOther() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <circle cx="60" cy="60" r="58" fill="#f3f4f6" />
      <circle cx="60" cy="45" r="18" fill="#d1d5db" />
      <ellipse cx="60" cy="95" rx="30" ry="22" fill="#d1d5db" />
      <text x="60" y="60" textAnchor="middle" fontSize="28" fill="#9ca3af" dy="-15">?</text>
    </svg>
  );
}

export const PROFILES = [
  { name: "Alexander", tagline: "Wall Street", Avatar: AvatarAlexander, color: "#10b981" },
  { name: "Alix", tagline: "Pasta Entrepreneur", Avatar: AvatarAlix, color: "#f59e0b" },
  { name: "Antoine", tagline: "Crypto King", Avatar: AvatarAntoine, color: "#8b5cf6" },
  { name: "Baptiste", tagline: "Vive la France", Avatar: AvatarBaptiste, color: "#ef4444" },
  { name: "Christian", tagline: "Gone Fishing", Avatar: AvatarChristian, color: "#06b6d4" },
  { name: "Thibaud", tagline: "Fly Safe !", Avatar: AvatarThibaud, color: "#3b82f6" },
  { name: "Yanis", tagline: "Allez Marseille !", Avatar: AvatarYanis, color: "#2aa7e0" },
] as const;
