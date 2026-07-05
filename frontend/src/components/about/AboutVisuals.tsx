import type { CSSProperties } from "react";

const toneColors: Record<string, string> = {
  blue: "#3c79ff",
  green: "#41b883",
  violet: "#8a63ff",
  amber: "#ff9a3d",
  cyan: "#26b6d9",
};

export function aboutToneStyle(tone: string): CSSProperties {
  return {
    "--about-tone": toneColors[tone] ?? toneColors.blue,
  } as CSSProperties;
}

export function AboutIcon({ name, className }: { name: string; className?: string }) {
  const classes = className ?? "";

  switch (name) {
    case "user":
      return (
        <svg aria-hidden="true" className={classes} fill="none" viewBox="0 0 24 24">
          <path d="M12 13c2.76 0 5-2.46 5-5.5S14.76 2 12 2 7 4.46 7 7.5 9.24 13 12 13Z" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <path d="M4.5 21c1.54-3.2 4.3-4.8 7.5-4.8s5.96 1.6 7.5 4.8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    case "book":
      return (
        <svg aria-hidden="true" className={classes} fill="none" viewBox="0 0 24 24">
          <path d="M4.5 5.5A2.5 2.5 0 0 1 7 3h11a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H7a2.5 2.5 0 0 0-2.5 2V5.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M7 3v18" stroke="currentColor" strokeWidth="1.8" />
          <path d="M10.5 7.5h5M10.5 11h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    case "code":
      return (
        <svg aria-hidden="true" className={classes} fill="none" viewBox="0 0 24 24">
          <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    case "search":
      return (
        <svg aria-hidden="true" className={classes} fill="none" viewBox="0 0 24 24">
          <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="m16 16 4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    case "shield":
      return (
        <svg aria-hidden="true" className={classes} fill="none" viewBox="0 0 24 24">
          <path d="M12 3c2.5 2 5.3 3 8 3v5c0 5.2-3.4 8.9-8 10-4.6-1.1-8-4.8-8-10V6c2.7 0 5.5-1 8-3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    case "trophy":
      return (
        <svg aria-hidden="true" className={classes} fill="none" viewBox="0 0 24 24">
          <path d="M8 4h8v2a4 4 0 0 1-8 0V4ZM9 16h6M12 10v6M8 20h8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M6 5H3v1a4 4 0 0 0 4 4M18 5h3v1a4 4 0 0 1-4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    case "leaf":
      return (
        <svg aria-hidden="true" className={classes} fill="none" viewBox="0 0 24 24">
          <path d="M18.5 5.5c-5.5-.2-9 2.1-10.7 6.3-1.3 3.4-.7 6.3-.7 6.3s2.9.6 6.3-.7c4.2-1.7 6.5-5.2 6.3-10.7Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M8 16c2-2.2 4.5-4 7.5-5.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    case "cap":
      return (
        <svg aria-hidden="true" className={classes} fill="none" viewBox="0 0 24 24">
          <path d="m3 9 9-4 9 4-9 4-9-4ZM6 10.5V15c0 1.5 3 3 6 3s6-1.5 6-3v-4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    case "star":
      return (
        <svg aria-hidden="true" className={classes} fill="none" viewBox="0 0 24 24">
          <path d="m12 3 2.8 5.6 6.2.9-4.5 4.4 1.1 6.2L12 17.1l-5.6 3 1.1-6.2L3 9.5l6.2-.9L12 3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    case "school":
      return (
        <svg aria-hidden="true" className={classes} fill="none" viewBox="0 0 24 24">
          <path d="M3 20h18M5 20V9l7-4 7 4v11M9 20v-5h6v5M8 11h.01M12 11h.01M16 11h.01" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    case "users":
      return (
        <svg aria-hidden="true" className={classes} fill="none" viewBox="0 0 24 24">
          <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16.5 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3 19c.8-3 2.8-4.5 5-4.5s4.2 1.5 5 4.5M13 19c.5-2.1 1.8-3.4 3.5-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    case "bot":
      return (
        <svg aria-hidden="true" className={classes} fill="none" viewBox="0 0 24 24">
          <rect height="10" rx="3" stroke="currentColor" strokeWidth="1.8" width="14" x="5" y="8" />
          <path d="M12 4v4M8.5 12h.01M15.5 12h.01M9 18v2M15 18v2M5 13H3M21 13h-2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    case "spark":
      return (
        <svg aria-hidden="true" className={classes} fill="none" viewBox="0 0 24 24">
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case "chart":
      return (
        <svg aria-hidden="true" className={classes} fill="none" viewBox="0 0 24 24">
          <path d="M4 19h16M7 16V9M12 16V5M17 16v-7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <path d="m6 8 4-3 3 2 5-3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    default:
      return (
        <svg aria-hidden="true" className={classes} fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
  }
}

export function AboutCurve({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 360 500">
      <path
        d="M245 18c-52 44-82 89-96 137-14 48-21 88-53 126-32 38-55 88-36 157"
        stroke="rgba(110, 154, 235, 0.72)"
        strokeDasharray="5 9"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function AboutMountainScene({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  if (compact) {
    return <CompactMountainScene className={className} />;
  }

  return <HeroMountainScene className={className} />;
}

function HeroMountainScene({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 760 560">
      <defs>
        <radialGradient id="about-hero-glow" cx="0" cy="0" r="1" gradientTransform="translate(540 248) rotate(90) scale(200 220)" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#eef5ff" stopOpacity="0.96" />
          <stop offset="70%" stopColor="#dfeaff" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#dfeaff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="about-hero-range-back" x1="366" x2="734" y1="350" y2="522" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e3ecff" />
          <stop offset="100%" stopColor="#c9dbff" />
        </linearGradient>
        <linearGradient id="about-hero-range-mid" x1="396" x2="744" y1="322" y2="536" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c8d9ff" />
          <stop offset="100%" stopColor="#7ea5fb" />
        </linearGradient>
        <linearGradient id="about-hero-peak" x1="468" x2="758" y1="254" y2="558" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#b6ccff" />
          <stop offset="46%" stopColor="#7fa4fb" />
          <stop offset="100%" stopColor="#3e72ea" />
        </linearGradient>
        <linearGradient id="about-hero-peak-shadow" x1="536" x2="774" y1="286" y2="558" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5d89ef" />
          <stop offset="100%" stopColor="#2f63dd" />
        </linearGradient>
        <linearGradient id="about-hero-ridge-front" x1="420" x2="652" y1="388" y2="560" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8bb0ff" />
          <stop offset="100%" stopColor="#3d6fe5" />
        </linearGradient>
        <linearGradient id="about-hero-rock" x1="470" x2="610" y1="430" y2="530" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5e7fbe" />
          <stop offset="100%" stopColor="#2f4f94" />
        </linearGradient>
        <linearGradient id="about-hero-person" x1="494" x2="540" y1="336" y2="480" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4d6fb6" />
          <stop offset="100%" stopColor="#274885" />
        </linearGradient>
      </defs>

      <ellipse cx="544" cy="244" fill="url(#about-hero-glow)" rx="228" ry="214" />

      <g opacity="0.9">
        <ellipse cx="576" cy="150" fill="#eef4ff" rx="146" ry="76" />
        <ellipse cx="680" cy="160" fill="#edf4ff" rx="108" ry="66" />
        <ellipse cx="496" cy="182" fill="#f5f9ff" rx="92" ry="58" />
        <ellipse cx="626" cy="116" fill="#eff5ff" rx="70" ry="48" />
        <ellipse cx="710" cy="118" fill="#eef4ff" rx="54" ry="38" />
        <ellipse cx="444" cy="214" fill="#f7fbff" rx="72" ry="46" />
        <ellipse cx="540" cy="228" fill="#eaf3ff" rx="170" ry="62" opacity="0.76" />
      </g>

      <g opacity="0.62" stroke="#bccffa" strokeLinecap="round" strokeWidth="3">
        <path d="M173 140c10-8 18-8 28 0M181 133c5-4 9-4 14 0" />
        <path d="M267 92c10-8 18-8 28 0M275 85c5-4 9-4 14 0" />
        <path d="M600 63c10-8 18-8 28 0M608 56c5-4 9-4 14 0" />
        <path d="M684 172c10-8 18-8 28 0M692 165c5-4 9-4 14 0" />
      </g>

      <g opacity="0.42">
        <circle cx="690" cy="88" fill="#b7ccfa" r="2.2" />
        <circle cx="704" cy="88" fill="#b7ccfa" r="2.2" />
        <circle cx="718" cy="88" fill="#b7ccfa" r="2.2" />
        <circle cx="732" cy="88" fill="#b7ccfa" r="2.2" />
        <circle cx="690" cy="102" fill="#b7ccfa" r="2.2" />
        <circle cx="704" cy="102" fill="#b7ccfa" r="2.2" />
        <circle cx="718" cy="102" fill="#b7ccfa" r="2.2" />
        <circle cx="732" cy="102" fill="#b7ccfa" r="2.2" />
        <circle cx="690" cy="116" fill="#b7ccfa" r="2.2" />
        <circle cx="704" cy="116" fill="#b7ccfa" r="2.2" />
        <circle cx="718" cy="116" fill="#b7ccfa" r="2.2" />
        <circle cx="732" cy="116" fill="#b7ccfa" r="2.2" />
      </g>

      <g opacity="0.28">
        <circle cx="300" cy="430" fill="#bfd0f7" r="2" />
        <circle cx="316" cy="430" fill="#bfd0f7" r="2" />
        <circle cx="332" cy="430" fill="#bfd0f7" r="2" />
        <circle cx="348" cy="430" fill="#bfd0f7" r="2" />
        <circle cx="300" cy="446" fill="#bfd0f7" r="2" />
        <circle cx="316" cy="446" fill="#bfd0f7" r="2" />
        <circle cx="332" cy="446" fill="#bfd0f7" r="2" />
        <circle cx="348" cy="446" fill="#bfd0f7" r="2" />
        <circle cx="300" cy="462" fill="#bfd0f7" r="2" />
        <circle cx="316" cy="462" fill="#bfd0f7" r="2" />
        <circle cx="332" cy="462" fill="#bfd0f7" r="2" />
        <circle cx="348" cy="462" fill="#bfd0f7" r="2" />
        <circle cx="300" cy="478" fill="#bfd0f7" r="2" />
        <circle cx="316" cy="478" fill="#bfd0f7" r="2" />
        <circle cx="332" cy="478" fill="#bfd0f7" r="2" />
        <circle cx="348" cy="478" fill="#bfd0f7" r="2" />
      </g>

      <path d="M334 488 448 426l52 18 58-30 56 18 78-38 68 26v140H334V488Z" fill="url(#about-hero-range-back)" opacity="0.84" />
      <path d="M380 524 516 426l56 30 74-88 114 68v124H380V524Z" fill="url(#about-hero-range-mid)" opacity="0.86" />

      <path d="M446 560 560 418l64 44 78-160 58 44v214H446V560Z" fill="url(#about-hero-peak)" />
      <path d="M588 560 640 470l26-56-22-42 52-76 64 48v216H588V560Z" fill="url(#about-hero-peak-shadow)" />
      <path d="M360 560 474 472l46 22 76-80 32 36 24 58 108 52H360V560Z" fill="url(#about-hero-ridge-front)" />

      <path
        d="M505 519c24-14 42-32 52-54 10-21 12-42 25-63 13-22 40-45 55-77 10-22 8-44-3-68"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.96"
        strokeWidth="22"
      />
      <path
        d="M509 520c25-14 43-31 53-52 11-22 12-42 25-62 13-21 39-43 53-74 10-21 7-42-3-65"
        stroke="#edf4ff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.92"
        strokeWidth="10"
      />

      <path d="M636 294v66" stroke="#4e7df4" strokeLinecap="round" strokeWidth="4" />
      <path d="m636 296 35 11-35 12v-23Z" fill="#4e7df4" />

      <ellipse cx="532" cy="448" fill="#6f8fcf" opacity="0.16" rx="34" ry="10" />
      <path d="M489 474c23-12 43-31 51-48 17 10 30 23 36 37-20 16-53 22-87 11Z" fill="url(#about-hero-rock)" />

      <g>
        <circle cx="516" cy="372" fill="#264a86" r="9" />
        <path d="M505 386c4-10 10-16 18-16 10 0 15 8 18 18l4 38-31 3-9-43Z" fill="url(#about-hero-person)" />
        <path d="M516 390c9 2 15 10 18 23" stroke="#152d58" strokeLinecap="round" strokeWidth="3.2" />
        <path d="M510 429c-4 19-7 34-6 53M530 428c3 20 6 35 7 54" stroke="#294978" strokeLinecap="round" strokeWidth="4.2" />
        <path d="M507 388c-7 4-12 10-15 18" stroke="#7ea7f7" strokeLinecap="round" strokeWidth="3" />
      </g>
    </svg>
  );
}

function CompactMountainScene({ className }: { className?: string }) {
  const prefix = "about-quote";
  const skyId = `${prefix}-sky`;
  const peakId = `${prefix}-peak`;
  const ridgeId = `${prefix}-ridge`;
  const pathId = `${prefix}-path`;

  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 760 560">
      <defs>
        <linearGradient id={skyId} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#f7fbff" />
          <stop offset="70%" stopColor="#dceaff" />
          <stop offset="100%" stopColor="#cfe0ff" />
        </linearGradient>
        <linearGradient id={peakId} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#adc7ff" />
          <stop offset="100%" stopColor="#4f84f7" />
        </linearGradient>
        <linearGradient id={ridgeId} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#c8dafd" />
          <stop offset="100%" stopColor="#86aaf6" />
        </linearGradient>
        <linearGradient id={pathId} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ebf3ff" />
        </linearGradient>
      </defs>

      <ellipse cx="530" cy="160" fill={`url(#${skyId})`} opacity="0.6" rx="180" ry="95" />
      <ellipse cx="640" cy="135" fill={`url(#${skyId})`} opacity="0.48" rx="100" ry="60" />
      <ellipse cx="470" cy="116" fill={`url(#${skyId})`} opacity="0.38" rx="80" ry="44" />

      <g opacity={0.65}>
        <path d="M94 126c10-8 18-8 28 0M102 119c5-4 9-4 14 0" stroke="#b7cbf8" strokeLinecap="round" strokeWidth="3" />
        <path d="M228 86c10-8 18-8 28 0M236 79c5-4 9-4 14 0" stroke="#b7cbf8" strokeLinecap="round" strokeWidth="3" />
        <path d="M684 52c10-8 18-8 28 0M692 45c5-4 9-4 14 0" stroke="#b7cbf8" strokeLinecap="round" strokeWidth="3" />
      </g>

      <path d="M352 472 498 412l72 26 102-96 88 52v116H352V472Z" fill="#d8e5ff" opacity="0.62" />
      <path d="M314 506 462 438l90 18 88-104 120 64v94H314v-4Z" fill={`url(#${ridgeId})`} opacity="0.68" />
      <path d="M240 560 432 424l84 40 126-122 118 62v156H240V560Z" fill={`url(#${peakId})`} />
      <path d="M420 560 520 470l44 22 78-78 46 20 72-26v152H420V560Z" fill="#2f6fff" opacity="0.86" />

      <path
        d="M586 396c-16 16-36 38-42 53 12 9 28 28 29 39-14 14-26 34-28 46 16-7 31-22 44-42-3-14 7-35 23-56-6-13-19-24-26-40Z"
        fill={`url(#${pathId})`}
        opacity="0.96"
      />

      <path d="M611 250v62" stroke="#4f84f7" strokeLinecap="round" strokeWidth="4" />
      <path d="m611 252 34 10-34 11v-21Z" fill="#4f84f7" />

      <g>
        <ellipse cx="510" cy="460" fill="#7fa0e8" opacity="0.16" rx="32" ry="10" />
        <path d="M503 428c6-18 18-30 26-30 8 0 16 10 18 22 2 13-2 26-6 40h-33c-6-14-10-22-5-32Z" fill="#3f6db5" />
        <path d="M514 404c7 7 14 16 18 26" stroke="#2c4f86" strokeLinecap="round" strokeWidth="3" />
      </g>
    </svg>
  );
}
