# Design System: RoboTec (2026 redesign)

**North star:** "Software that feels electric." Dark, premium studio site built around the RoboTec lightning bolt and the logo green.

## Colors
- Logo green `#22f603` — primary actions, accents, glows, bolt. Text on green uses ink `#11240b`.
- Dark theme (default): background `#050805`, alt section `#0a110a`, text `#eef6ec`, muted `#9aab96`.
- Light theme: background `#f5f8f3`, alt `#ffffff`, text `#0d1a0a`, muted `#55654f`, green text `#188a03` (readable on light).
- The visitor's theme choice is stored in `localStorage` (`robotec-theme`).

## Type
- Headings: Space Grotesk (variable, self-hosted, OFL). Body: Inter (variable, self-hosted, OFL).
- Arabic falls back to system Arabic fonts (Geeza Pro / Noto Sans Arabic / Tahoma).
- No Google Fonts or CDN requests (GDPR).

## Motion
- Hero: the bolt and the ROBOTEC wordmark are SVG strokes that draw themselves, then flicker like neon; a canvas particle network with "electric sparks" reacts to the pointer.
- Headings reveal word by word; sections fade/slide in on scroll; stat counters count up.
- Cards: cursor spotlight + glowing border (services), 3D tilt (portfolio), magnetic primary buttons, cursor glow.
- Scroll progress bar, auto-hiding glass nav with active-section dot, process line that fills on scroll.
- Logi phone mockup plays a looping AI chat.
- Everything is disabled or reduced under `prefers-reduced-motion`.

## Structure
Nav → Hero (+stats) → Tech marquee → Services (6) → Product: Logi → Process (4 steps) → Work (13, filterable) → Founder → Contact (email draft) → Footer (Impressum, Datenschutz).

## Rules
- Keep the green only as an accent; never introduce a second accent color.
- Email-only contact: Robotec.app@gmail.com. The form opens the visitor's mail app; the site sends nothing.
- 8 languages (en, de, ar RTL, fr, it, nl, ru, tr). Legal pages are German (binding version).
