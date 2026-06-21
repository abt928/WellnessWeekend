/**
 * Clean, minimal SVG icons for the Wellness Weekend site.
 * Replace all emoji usage with these for a premium, cohesive look.
 */

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

const defaults: IconProps = { size: 24, color: "currentColor" };

/* ── Pillar Icons ── */

export function FlameIcon({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C12 2 5 9 5 14.5C5 18.09 8.13 21 12 21C15.87 21 19 18.09 19 14.5C19 9 12 2 12 2ZM12 19C9.24 19 7 16.76 7 14.5C7 11.5 10 7 12 4.5C14 7 17 11.5 17 14.5C17 16.76 14.76 19 12 19ZM12 17C13.66 17 15 15.66 15 14.5C15 12.5 12 9 12 9C12 9 9 12.5 9 14.5C9 15.66 10.34 17 12 17Z" fill={color} />
    </svg>
  );
}

export function LeafIcon({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8.17 20C12.59 20 16.31 16.74 19.28 11.5C20.7 8.97 21 5 21 3C18 3 14.97 3.41 12.5 4.28C7 6.28 4 10 3 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M8 17C10.41 14.59 13 12.5 17 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function CommunityIcon({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="7" r="3" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="5" cy="9" r="2.5" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="19" cy="9" r="2.5" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M8 14C8 14 9.5 12.5 12 12.5C14.5 12.5 16 14 16 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M16 14.5C16 14.5 17 16 16 18C15 20 9 20 8 18C7 16 8 14.5 8 14.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M2 15C2 15 2.5 13 5 13C6 13 6.5 13.5 7 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M22 15C22 15 21.5 13 19 13C18 13 17.5 13.5 17 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* ── Get Involved Icons ── */

export function MeditateIcon({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="5" r="2" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M12 9C12 9 8 11 6 14C5 15.5 5 17 7 17L10 17L10 21L14 21L14 17L17 17C19 17 19 15.5 18 14C16 11 12 9 12 9Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function StorefrontIcon({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7L2 12V14H3V20H13V14H17V20H19V14H20V12L18 7H4Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <rect x="6" y="14" width="5" height="6" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M3 4H19" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function HandsIcon({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21C12 21 8 17 8 14V6C8 5 8.5 4 10 4C11 4 11.5 4.5 12 5C12.5 4.5 13 4 14 4C15.5 4 16 5 16 6V14C16 17 12 21 12 21Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <path d="M8 10H5C4 10 3 10.5 3 12V14C3 16 5 18 7 19" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M16 10H19C20 10 21 10.5 21 12V14C21 16 19 18 17 19" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function DiamondIcon({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M6 3H18L21 8L12 21L3 8L6 3Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <path d="M3 8H21" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M9 3L7 8L12 21L17 8L15 3" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* ── Partner Icons ── */

export function SoundWaveIcon({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12H5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M7 8V16" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M11 5V19" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M15 8V16" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M19 10V14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function PlaneIcon({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill={color} />
    </svg>
  );
}

/* ── Store Tab Icons ── */

export function TicketIcon({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M22 10V6C22 5.45 21.55 5 21 5H3C2.45 5 2 5.45 2 6V10C3.1 10 4 10.9 4 12C4 13.1 3.1 14 2 14V18C2 18.55 2.45 19 3 19H21C21.55 19 22 18.55 22 18V14C20.9 14 20 13.1 20 12C20 10.9 20.9 10 22 10Z" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M10 5V7M10 17V19M10 11V13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="0 4" />
    </svg>
  );
}

export function SparkleIcon({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function CupIcon({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M18 8H19C20.1 8 21 8.9 21 10C21 11.1 20.1 12 19 12H18" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M4 8H18V14C18 17 15.5 19 11 19C6.5 19 4 17 4 14V8Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <path d="M6 21H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 2V4M12 2V5M15 2V4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ShirtIcon({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M16 3H8L4 7L7 9V20H17V9L20 7L16 3Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <path d="M8 3C8 3 9 5 12 5C15 5 16 3 16 3" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function WaterDropIcon({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C12 2 5 10.5 5 15A7 7 0 0019 15C19 10.5 12 2 12 2Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill={color} fillOpacity="0.12" />
    </svg>
  );
}

export function WindIcon({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M3 8H14C15.66 8 17 6.66 17 5C17 3.34 15.66 2 14 2C12.34 2 11 3.34 11 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 12H19C20.66 12 22 13.34 22 15C22 16.66 20.66 18 19 18C17.34 18 16 16.66 16 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 16H12C13.1 16 14 16.9 14 18C14 19.1 13.1 20 12 20C10.9 20 10 19.1 10 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ── Misc ── */

export function SparklesIcon({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill={color} fillOpacity="0.2" />
      <path d="M19 15L19.75 17.25L22 18L19.75 18.75L19 21L18.25 18.75L16 18L18.25 17.25L19 15Z" stroke={color} strokeWidth="1" strokeLinejoin="round" fill={color} fillOpacity="0.3" />
      <path d="M5 2L5.5 3.5L7 4L5.5 4.5L5 6L4.5 4.5L3 4L4.5 3.5L5 2Z" stroke={color} strokeWidth="1" strokeLinejoin="round" fill={color} fillOpacity="0.3" />
    </svg>
  );
}

/* ── UI Icons ── */

export function CloseIcon({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CalendarIcon({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M16 2V6M8 2V6M3 10H21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="15" r="1.5" fill={color} />
    </svg>
  );
}

export function MapPinIcon({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21C12 21 19 14.5 19 9.5C19 5.36 15.87 2 12 2C8.13 2 5 5.36 5 9.5C5 14.5 12 21 12 21Z" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="9.5" r="2.5" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function EnvelopeIcon({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M2 7L12 13L22 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MoonIcon({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill={color} fillOpacity="0.1" />
    </svg>
  );
}

export function LotusIcon({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21C12 21 12 14 12 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 11C12 7 9 3 9 3C9 3 6 7 6 11C6 14 8.5 16 12 16C15.5 16 18 14 18 11C18 7 15 3 15 3C15 3 12 7 12 11Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill={color} fillOpacity="0.1" />
      <path d="M3 14C3 14 5 11 8 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M21 14C21 14 19 11 16 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SunIcon({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.15" />
      <path d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
