# DESIGN.md — Wellness Weekend

## Creative north star

An Alaskan field poster pinned to a cedar lodge door at midnight: documentary,
tactile, bright, and a little unruly. Real people carry the story. The design
should feel like the gathering itself, not like a generic luxury retreat.

## Voice

Sacred. Wild. Intentional.

## Color strategy

Committed. Deep black-spruce and cool off-white form the ground. Fireweed orange
is the single purchase color; glacial blue is reserved for emotional emphasis.

| Token | OKLCH | Use |
| --- | --- | --- |
| `--ww-ink` | `oklch(0.22 0.035 155)` | Hero, schedule, footer, primary text |
| `--ww-paper` | `oklch(0.975 0.006 155)` | Main light surface |
| `--ww-fire` | `oklch(0.69 0.205 39)` | Ticket actions and one proof section |
| `--ww-lake` | `oklch(0.84 0.09 184)` | Select emphasis on dark surfaces |
| `--ww-moss` | `oklch(0.74 0.08 135)` | Quiet supporting accents |

No gradient text. Photo scrims are allowed only when they make overlaid text
readable. Body text must meet WCAG AA contrast.

## Type

- Display: Bricolage Grotesque, variable 200–800
- Body: Manrope, 400–700
- Display letter spacing never tighter than `-0.04em`
- Headings balance; paragraphs use pretty wrapping and stay under 70ch

The display face should read like sturdy festival-poster type, not editorial
luxury. Serif italics are no longer part of the brand system.

## Imagery

Use only real Wellness Weekend photography on the purchase path. Crops should
feel documentary and full-bleed, with square or lightly rounded geometry.

Preferred assets:

- `Woman-Harmonium-Gong.jpg` for the hero
- `Group-Circle-Arms-Raised.jpg` for community proof and social sharing
- `Woman-Dancing-Laughing.jpg` for joy and movement
- `Crystal-Bowls-Sound-Healing.jpg` for practice detail
- `Evening-Campfire.jpg` for place and evening atmosphere

Do not use `hero.png`, `alaska.png`, `movement.png`, or `sound-healing.png` on
public marketing surfaces. They read as synthetic and weaken trust.

## Conversion hierarchy

The homepage order is fixed unless current funnel data shows a better sequence:

1. Real-photo hero with date, place, offer, and one ticket action
2. Short experience proof
3. Live Square pass selector
4. Three-day schedule preview
5. Real-photo community proof
6. Travel and lodging facts
7. FAQ and policy clarity
8. Final ticket action and secondary email capture

Practitioner directories, vendors, applications, packages, and full add-on
education do not interrupt the cold-ad purchase path.

## Components and geometry

- Buttons may be pills; content containers stay at 12px radius or less
- Ticket cards are a real selection affordance and may use a responsive grid
- Avoid card grids for narrative content
- Use full borders or surface changes, never thick colored side stripes
- Touch targets are at least 44px
- Fixed mobile actions respect `env(safe-area-inset-bottom)`

## Motion

Use one restrained hero entrance and subtle photo scale on pointer hover. Never
hide readable content behind JavaScript-driven reveal animations. All motion has
a reduced-motion path.

## Hard bans

- Animated tie-dye or aurora gradients
- Decorative sparkles, emojis, sacred-geometry filler, or ghost animals
- Initial-only practitioner cards on the landing page
- Repeated uppercase eyebrow labels
- Gradient text, glass cards, oversized soft shadows, and over-rounded sections
- Synthetic landscape imagery presented as a real place
- Competing popups, message buttons, exit intent, and ticket actions on mobile
