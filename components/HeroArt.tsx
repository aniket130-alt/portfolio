/** Decorative laptop + code glyph illustration for the hero (original SVG, no assets). */
export function HeroArt() {
  return (
    <svg viewBox="0 0 520 420" className="h-auto w-full" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="ha-glow" cx="50%" cy="42%" r="55%">
          <stop offset="0" stopColor="#2589ff" stopOpacity="0.55" />
          <stop offset="0.55" stopColor="#2589ff" stopOpacity="0.12" />
          <stop offset="1" stopColor="#2589ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ha-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#12203a" />
          <stop offset="1" stopColor="#07101e" />
        </linearGradient>
        <linearGradient id="ha-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b2b48" />
          <stop offset="1" stopColor="#0b1526" />
        </linearGradient>
        <linearGradient id="ha-code" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2589ff" />
          <stop offset="1" stopColor="#62b4ff" />
        </linearGradient>
        <linearGradient id="ha-rim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#62b4ff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#62b4ff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#62b4ff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <ellipse cx="260" cy="190" rx="250" ry="190" fill="url(#ha-glow)" />
      {/* orbit arcs */}
      <path d="M40 250 C 120 60, 400 40, 490 210" fill="none" stroke="#62b4ff" strokeOpacity="0.25" strokeWidth="1.5" />
      <path d="M70 300 C 170 140, 380 120, 470 280" fill="none" stroke="#2589ff" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="4 6" />

      {/* screen */}
      <g transform="translate(260 205) skewX(-6) translate(-260 -205)">
        <rect x="118" y="78" width="284" height="186" rx="14" fill="url(#ha-body)" stroke="#62b4ff" strokeOpacity="0.35" />
        <rect x="130" y="90" width="260" height="162" rx="8" fill="url(#ha-screen)" />
        {/* code lines */}
        <g strokeLinecap="round" strokeWidth="5">
          <path d="M150 112h46M206 112h70" stroke="#62b4ff" strokeOpacity="0.35" />
          <path d="M150 230h90M250 230h40" stroke="#62b4ff" strokeOpacity="0.25" />
        </g>
        {/* </> glyph */}
        <g fill="none" stroke="url(#ha-code)" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round">
          <path d="M218 140 L186 171 L218 202" />
          <path d="M302 140 L334 171 L302 202" />
          <path d="M272 132 L248 210" />
        </g>
      </g>

      {/* base */}
      <path d="M78 286 H442 L470 312 H50 Z" fill="url(#ha-body)" stroke="#62b4ff" strokeOpacity="0.3" />
      <rect x="50" y="311" width="420" height="9" rx="4.5" fill="#0b1526" />
      <rect x="120" y="286" width="280" height="2" fill="url(#ha-rim)" />
      <rect x="226" y="292" width="68" height="6" rx="3" fill="#62b4ff" fillOpacity="0.18" />

      {/* floating dots */}
      <circle cx="455" cy="120" r="4" fill="#62b4ff" fillOpacity="0.8" />
      <circle cx="70" cy="170" r="3" fill="#2589ff" fillOpacity="0.8" />
      <circle cx="420" cy="350" r="2.5" fill="#62b4ff" fillOpacity="0.6" />
    </svg>
  );
}
