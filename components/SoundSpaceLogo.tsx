export default function SoundSpaceLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Sound Space"
    >
      <defs>
        {/* Clip to the light (left) half */}
        <clipPath id="ss-light">
          <path d="M 100 5 A 95 95 0 0 0 100 195 A 47.5 47.5 0 0 0 100 100 A 47.5 47.5 0 0 1 100 5 Z" />
        </clipPath>
        {/* Clip to the dark (right) half */}
        <clipPath id="ss-dark">
          <path d="M 100 5 A 95 95 0 0 1 100 195 A 47.5 47.5 0 0 1 100 100 A 47.5 47.5 0 0 0 100 5 Z" />
        </clipPath>
      </defs>

      {/* Light half background */}
      <path
        d="M 100 5 A 95 95 0 0 0 100 195 A 47.5 47.5 0 0 0 100 100 A 47.5 47.5 0 0 1 100 5 Z"
        fill="#F0EBE0"
      />
      {/* Dark half background */}
      <path
        d="M 100 5 A 95 95 0 0 1 100 195 A 47.5 47.5 0 0 1 100 100 A 47.5 47.5 0 0 0 100 5 Z"
        fill="#111017"
      />

      {/* — LIGHT HALF: mountains + sun — */}
      <g clipPath="url(#ss-light)">
        {/* Sun */}
        <circle cx="68" cy="60" r="12" fill="#111017" />
        {/* Sun rays */}
        <line x1="68" y1="42" x2="68" y2="50" stroke="#111017" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="68" y1="70" x2="68" y2="78" stroke="#111017" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="60" x2="58" y2="60" stroke="#111017" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="78" y1="60" x2="86" y2="60" stroke="#111017" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="55" y1="47" x2="61" y2="53" stroke="#111017" strokeWidth="2" strokeLinecap="round" />
        <line x1="75" y1="47" x2="81" y2="53" stroke="#111017" strokeWidth="2" strokeLinecap="round" />
        <line x1="55" y1="73" x2="61" y2="67" stroke="#111017" strokeWidth="2" strokeLinecap="round" />
        <line x1="75" y1="73" x2="81" y2="67" stroke="#111017" strokeWidth="2" strokeLinecap="round" />

        {/* Mountain range */}
        <path
          d="M 5 175 L 45 105 L 72 148 L 58 148 L 45 120 L 28 148 Z"
          fill="#111017"
        />
        <path
          d="M 52 175 L 82 112 L 105 175 Z"
          fill="#111017"
          opacity="0.75"
        />
      </g>

      {/* — DARK HALF: dragon / wave — */}
      <g clipPath="url(#ss-dark)">
        {/* Dragon body — flowing S-curve */}
        <path
          d="M 158 38 C 178 52, 182 72, 166 84 C 150 96, 136 86, 144 102 C 152 118, 176 126, 162 148 C 150 168, 132 170, 128 158"
          fill="none"
          stroke="#F0EBE0"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Dragon head curl */}
        <path
          d="M 148 35 C 162 28, 175 38, 170 52 C 165 65, 152 60, 155 50"
          fill="none"
          stroke="#F0EBE0"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Wave lines at base */}
        <path
          d="M 115 158 C 130 150, 148 162, 165 152"
          fill="none"
          stroke="#F0EBE0"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 110 170 C 128 162, 148 175, 170 164"
          fill="none"
          stroke="#F0EBE0"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* Yin-yang dots */}
      <circle cx="100" cy="52.5"  r="11" fill="#111017" />  {/* dark dot in light half */}
      <circle cx="100" cy="147.5" r="11" fill="#F0EBE0" />  {/* light dot in dark half */}

      {/* Outer border */}
      <circle cx="100" cy="100" r="95" fill="none" stroke="#111017" strokeWidth="3.5" />
      {/* Inner ring accent */}
      <circle cx="100" cy="100" r="89" fill="none" stroke="#111017" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}
