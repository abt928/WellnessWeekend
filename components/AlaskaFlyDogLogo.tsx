export default function AlaskaFlyDogLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 240"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Alaska Fly Dog – Massage · Adventures in Wellness"
    >
      <defs>
        <mask id="afd-moon-mask">
          <rect width="200" height="240" fill="white" />
          <circle cx="112" cy="70" r="50" fill="black" />
        </mask>
      </defs>

      {/* Crescent moon (coral/rust), opening to the right */}
      <circle cx="86" cy="70" r="62" fill="#C05540" mask="url(#afd-moon-mask)" />

      {/* Teal wave ribbon */}
      <path
        d="M 12 80 C 40 50, 76 50, 100 80 C 124 110, 160 110, 186 80"
        fill="none"
        stroke="#3DB8AF"
        strokeWidth="5.5"
        strokeLinecap="round"
      />

      {/* 8-pointed starburst in crescent opening (top-right area) */}
      <g transform="translate(140, 38)">
        <circle r="8" fill="#9A8230" />
        {/* 8 rays */}
        <line x1="8"    y1="0"     x2="17"   y2="0"    stroke="#9A8230" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="-8"   y1="0"     x2="-17"  y2="0"    stroke="#9A8230" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="0"    y1="-8"    x2="0"    y2="-17"  stroke="#9A8230" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="0"    y1="8"     x2="0"    y2="17"   stroke="#9A8230" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="5.7"  y1="-5.7"  x2="12"   y2="-12"  stroke="#9A8230" strokeWidth="2"   strokeLinecap="round" />
        <line x1="-5.7" y1="-5.7"  x2="-12"  y2="-12"  stroke="#9A8230" strokeWidth="2"   strokeLinecap="round" />
        <line x1="5.7"  y1="5.7"   x2="12"   y2="12"   stroke="#9A8230" strokeWidth="2"   strokeLinecap="round" />
        <line x1="-5.7" y1="5.7"   x2="-12"  y2="12"   stroke="#9A8230" strokeWidth="2"   strokeLinecap="round" />
      </g>

      {/* 4-pointed diamond sparkle (lower-left) */}
      <path
        d="M 48 95 L 52 107 L 64 111 L 52 115 L 48 127 L 44 115 L 32 111 L 44 107 Z"
        fill="#9A8230"
      />

      {/* "ALASKA" */}
      <text
        x="100"
        y="157"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="28"
        fill="#8B5FBF"
        letterSpacing="5"
      >
        ALASKA
      </text>

      {/* "FLY DOG" */}
      <text
        x="100"
        y="190"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="28"
        fontWeight="700"
        fill="#3DB8AF"
        letterSpacing="4"
      >
        FLY DOG
      </text>

      {/* Tagline */}
      <text
        x="100"
        y="211"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="7.8"
        fill="#8B5FBF"
        letterSpacing="1.8"
      >
        MASSAGE ✦ ADVENTURES IN WELLNESS
      </text>
    </svg>
  );
}
