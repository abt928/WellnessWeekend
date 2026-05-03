# DESIGN.md — Wellness Weekend Visual System

## Creative North Star
"Sacred geometry meets Alaskan wilderness — where earthy warmth and psychedelic energy coexist in intentional luxury."

## Color Palette

| Token               | Hex       | Name             | Role                              |
|---------------------|-----------|------------------|-----------------------------------|
| `--sage`            | `#7C9070` | Lichen Green     | Muted accent, labels, metadata    |
| `--forest`          | `#2D3A2E` | Old Growth       | Primary dark, text, nav, footer   |
| `--aurora`          | `#8B5FBF` | Amethyst Glow    | Primary brand accent              |
| `--gold`            | `#D4A853` | Midnight Gold    | CTAs, badges, urgency             |
| `--rose`            | `#C4847A` | Canyon Rose      | Secondary warm accent             |
| `--coral`           | `#E8956A` | Salmon Fire      | Gradient pairing with gold        |
| `--cream`           | `#FAF7F2` | Bone White       | Section bg (warm)                 |
| `--warm-white`      | `#FFFEF9` | Eggshell         | Card bg, alt sections             |
| `--charcoal`        | `#2B2D2B` | Forest Charcoal  | Body text                         |
| `--psyche-pink`     | `#E06BAC` | Ceremonial Pink  | Psychedelic gradient accent       |
| `--psyche-cyan`     | `#4ECDC4` | Spirit Teal      | Highlight, emphasis, hero em      |
| `--psyche-indigo`   | `#5B3E96` | Deep Ceremony    | Stat numbers, dark accent         |
| `--psyche-amber`    | `#F4A940` | Sun Ember        | Warm psychedelic accent           |

## Typography

| Lane       | Font               | Weight    | Usage                          |
|------------|--------------------|-----------|---------------------------------|
| Display    | Playfair Display   | 300, ital | Hero titles, section headings  |
| Body       | Inter              | 400, 600  | Paragraphs, labels, buttons    |
| Accent     | Cormorant Garamond | 300–600   | Subtitles, quotes, descriptions|

## Spacing Scale
Base unit: `1rem`. Sections use `7rem` vertical padding. Cards: `2.5rem` internal. Gaps: `1.5–2rem` grid.

## Border Radius
- Buttons/pills: `30px` (full-round)
- Cards: `20–24px` (large, soft)
- Stat items: `16px` (medium)
- Form inputs: `12px` (subtle)
- Images/masonry: `16px`

## Motion
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (spring-out) for transforms
- Durations: hover 0.3s, reveals 0.7s, modals 0.4s
- Scroll reveals: translateY(40px) → 0 with spring easing
- Hero CTA: aurora gradient shift animation (5s infinite)
- Active/press: scale(0.96) at 0.1s

## Gradient Patterns
- Dark sections: `var(--forest)` → `var(--psyche-indigo)` (135°)
- CTAs: `var(--gold)` → `var(--coral)` (warm urgency)
- Hero CTA: `var(--aurora)` → `var(--psyche-pink)` → `var(--gold)` (shifting)
- Overlays: radial gradients with 6–10% opacity for ambient glow

## Interaction States
- Hover: translateY(-6px) + shadow deepening
- Active: scale(0.96) at 0.1s (haptic feel)
- Focus: 3px box-shadow ring in `rgba(aurora, 0.1)`
- Disabled: opacity 0.6, cursor: not-allowed
