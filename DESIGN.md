---
name: RoboTec
description: Existing RoboTec website visual system, preserved with the logo-green accent.
colors:
  brand-green: "#22f603"
  brand-ink: "#11240b"
  white: "#fff"
  section-soft: "#fafafa"
  heading: "#222222"
  body-muted: "#888888"
  hero-muted: "#bcbcbc"
  card-dark: "#172017"
  card-border: "#d8e4d6"
  card-media: "#f0f4ee"
  card-description: "#c7dac3"
  filter-surface: "#eff3ed"
  filter-text: "#31422e"
  email-surface: "#eff4ed"
  field-border: "#ccc"
  field-text: "#333"
  field-placeholder: "#666"
  submit-hover: "#111"
typography:
  headline:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "34px"
    fontWeight: 700
    letterSpacing: "-1px"
  title:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "16px"
    fontWeight: 400
  body:
    fontFamily: "Open Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "24px"
  label:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "12px"
  card-title:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.4
  card-description:
    fontFamily: "Open Sans, sans-serif"
    fontSize: "13px"
    lineHeight: 1.5
rounded:
  hero-button: "3px"
  field: "4px"
  filter: "6px"
  panel: "12px"
  circle: "50%"
spacing:
  container-inline: "15px"
  portfolio-gap: "28px"
  portfolio-gap-tablet: "22px"
  portfolio-gap-mobile: "24px"
  card-caption: "22px"
  card-caption-mobile: "20px"
components:
  hero-button:
    backgroundColor: "{colors.brand-green}"
    textColor: "{colors.brand-ink}"
    rounded: "{rounded.hero-button}"
    padding: "15px 30px"
  hero-button-hover:
    backgroundColor: "{colors.white}"
    textColor: "{colors.brand-ink}"
  submit-button:
    backgroundColor: "{colors.brand-green}"
    textColor: "{colors.brand-ink}"
    rounded: "{rounded.field}"
    width: "175px"
  submit-button-hover:
    backgroundColor: "{colors.submit-hover}"
    textColor: "{colors.white}"
  filter-button:
    backgroundColor: "{colors.filter-surface}"
    textColor: "{colors.filter-text}"
    rounded: "{rounded.filter}"
    padding: "13px 21px"
  filter-button-selected:
    backgroundColor: "{colors.brand-green}"
    textColor: "{colors.brand-ink}"
  portfolio-card:
    backgroundColor: "{colors.card-dark}"
    textColor: "{colors.white}"
    rounded: "{rounded.panel}"
  contact-field:
    textColor: "{colors.field-text}"
    rounded: "{rounded.field}"
    padding: "15px 16px"
    height: "50px"
  email-panel:
    backgroundColor: "{colors.email-surface}"
    rounded: "{rounded.panel}"
    padding: "30px"
---

# Design System: RoboTec

## Overview

**Creative North Star: "Preserve the existing RoboTec style and logo-green"**

This document records the implemented website, rather than proposing a new visual identity. Preserve the original black textured hero, lightning and wordmark imagery, Montserrat headings, Open Sans body text, and white content sections. The owner specifically requested that the accent match the logo; the sampled logo-green and dark green ink are the current brand variables.

The portfolio currently contains 13 responsive image cards with dark caption bands and green arrow circles. The owner said the cards are still not nice but are “ok for now” until projects are replaced. Their implementation is documented as temporary acceptance, not a final endorsed card aesthetic.

**Key Characteristics:**

- Existing textured black hero and footer with original RoboTec identity assets.
- White and pale neutral content sections, uppercase section headings, and logo-green actions.
- Responsive portfolio imagery with dark captions; current card styling remains provisional.
- Eight language variants, including an Arabic RTL layout, and email-only contact.

Source evidence: `src/index.html`; `assets/css/style.css`, `responsive.css`, and `site.css`; `assets/js/site.js`. Container widths are inherited from `assets/css/bootstrap.css`. The cascade loads the base theme before responsive and site corrections. These files remain the implementation authority; not every legacy selector is a current component. This document does not change the original private Laravel repository's privacy.

## Colors

A single vivid logo-green accent sits against black texture, white sections, muted text, and pale green support surfaces. The frontmatter preserves the source CSS color notation.

### Primary

- **Logo Green** (`brand-green`): the sampled lightning accent, used for primary actions, selected filters, arrow circles, and focus rules.
- **Dark Green Ink** (`brand-ink`): text on vivid green actions and underlined contact links.

### Neutral

- **White** and **Soft Section**: the main content canvas and alternating featured-work section.
- **Heading** and **Muted Body**: dark headings and quieter explanatory copy.
- **Muted Hero**: supporting uppercase text on the black hero texture.
- **Dark Card**, **Card Border**, **Media Surface**, and **Card Description**: the current portfolio band, edge, image canvas, and secondary caption.
- **Filter Surface** and **Filter Text**: unselected native filter buttons.
- **Email Surface**: the soft green contact panel.
- **Field Border**, **Field Text**, **Field Placeholder**, and **Submit Hover**: existing form treatments; placeholder opacity is 1.

**The Logo Accent Rule.** Keep the primary accent aligned with the existing lightning asset; do not introduce a replacement palette as part of routine page work.

## Typography

**Heading Font:** Montserrat, with sans-serif fallback; the page requests weights 400 and 700.
**Body Font:** Open Sans, with sans-serif fallback.

Section headings are centered, uppercase, bold, and tightly spaced. Body text is lighter and quieter. Portfolio titles are sentence case and left/start aligned. No separate display typeface or monospaced role is established.

### Hierarchy

- **Headline:** the frontmatter headline role applies to section headings and the actual hero slogan, now a semantic `h1.hero-title` explicitly styled to retain the former `h2` appearance (34px, weight 700, uppercase, 15px bottom margin; 26px below 768px), with white text. Do not apply the older generic hero `h1` sizing to it.
- **Title:** uppercase service and team headings; card titles override casing and line height as recorded in `card-title`.
- **Body:** desktop paragraphs use the body role. At 768–991px, the body becomes 13px with 20px paragraph line height; below 768px, 12px with 18px paragraph line height.
- **Label:** native portfolio filter labels are uppercase. Hero action text is 16px; the email-draft action is 14px.
- **Responsive headline:** section `h2` sizes reduce to 30px at 768–991px and 26px below 768px. The business banner uses 42px, reducing to 36px below 768px.

## Layout

The incumbent Bootstrap container is centered with 15px side padding and widths of 750px from 768px, 970px from 992px, and 1170px from 1200px. Preserve its existing service, featured-work, and contact columns instead of applying the portfolio grid globally.

Main sections use 90px top and 110px bottom padding on desktop; tablet sections use 70px vertical padding; mobile sections use 60px top and 70px bottom padding. Contact has its own desktop bottom padding of 100px. The black hero retains the original repeated texture and centered identity image (`robotec.png`, intrinsic 627 × 391); its figure has an inline 100% width override. The footer repeats the same texture.

The portfolio grid is independently capped at 1140px and uses `calc(100% - 40px)` width. It has three columns and the desktop gap token; at 991px and below it has two columns and the tablet gap; at 599px and below it has one column and the mobile gap. Images use a 16:10 media box and `object-fit: contain`, preserving the whole existing screenshot or logo.

At 992px and above, navigation uses a seven-column grid: three equal cells, the 130px logo cell, and three equal cells. Services, Portfolio, and Team sit before the centered logo; Technologies, Contact, and the language selector sit after it. Below 992px, navigation becomes a collapsed button-controlled list; a separate 130px brand remains exactly centered in a strip at least 76px tall, with the menu button at the inline end. The eight variants are en, de, ar, fr, it, nl, ru, and tr. Arabic sets RTL direction; service/contact alignment and portfolio arrows are adjusted, while the email address remains isolated LTR. Let translated labels wrap naturally within the existing responsive layout.

## Elevation & Depth

Depth primarily comes from the black texture, alternating section tones, and dark portfolio captions. Portfolio cards have no resting box shadow. The navigation uses a shallow lower shadow (`0 4px 5px -3px #ececec`); focused inputs retain the original inset highlight plus green glow. Circular team imagery has a pale seven-pixel ring and a dark inset overlay on hover. Exact shadows and motion are recorded in the sidecar.

## Shapes

Small rectangular action buttons, subtly rounded fields and filters, and circular team portraits coexist with the current larger rounded portfolio and email panels. The frontmatter records each observed radius by role; this is not a uniform radius scale to apply everywhere. Portfolio media clips within its card boundary. Green portfolio arrow circles measure 34px square.

## Components

### Buttons

The hero action uses the hero-button tokens, uppercase Montserrat, and a white hover background; mobile padding becomes 10px 25px and text becomes 14px. The form action uses submit-button tokens, a minimum height of 50px, and dark hover background with white text. Its label is **Open email draft**: submission opens the user's mail client rather than displaying a server-delivery promise.

### Filters

Portfolio categories are real `button` elements with `aria-pressed`, one selected state, and the selected filter's green surface. At widths below 768px their padding becomes 12px 15px. Selection hides nonmatching articles through the native `hidden` attribute.

Visible filtered articles reveal using WAAPI opacity (0.4 to 1) and a bottom inset clip (14% to 0), lasting 360ms with 35ms stagger capped at 140ms. Existing animations are cancelled before each filter change. Reduced motion skips the reveal.

### Cards / Containers

Each portfolio item is an article containing one full-card link, a contained image, and a dark caption row. Captions use a 16px gap, a 106px minimum height, and the caption spacing tokens. The title has an 8px bottom margin. The green circular arrow uses an accessible hidden action label.

On hover-capable devices, cards lift 5px, images scale to 1.035, and arrows shift 3px; RTL arrows reverse direction. Reduced motion disables these transforms and preserves the RTL orientation. Focus-visible card links use the final important dark-green-ink three-pixel anchor outline. Their more specific card rule retains its five-pixel outline offset; other links use a four-pixel offset. The final important focus rule overrides the legacy anchor-outline reset. Hero, footer, and team-overlay links use logo-green outlines on their dark surfaces.

**Temporary acceptance:** keep this implementation available while the owner replaces projects. Do not describe its current card aesthetic as final or owner-endorsed.

### Inputs / Fields

Single-line fields use the contact-field tokens, a one-pixel neutral border, and 15px bottom spacing. Entered text uses the current Field Text color and placeholders use Field Placeholder at full opacity (1). Focus changes the border to logo-green and adds the incumbent glow. The message field is 165px high and vertically resizable. Native required/email validity remains in place; the form includes localized status text. No custom error or disabled visual system is established.

### Navigation

A white horizontal strip carries uppercase Montserrat links, the centered small logo, and a native language select. At 992px and above, links use 12px text and 24px 8px padding within the balanced seven-column grid. The logo link uses 14px 0 padding. Hovered links use dark green ink with a green underline. Below 992px, the menu button toggles the list and `aria-expanded`, menu links use 12px 24px padding, and the centered mobile logo remains visible. Native buttons and the select have green focus-visible rules in the site stylesheet; navigation links use the final dark-green-ink three-pixel outline with four-pixel offset. Preserve the original textured hero and identity assets above it.

### Email panel

The contact panel uses email-panel tokens and the single address `Robotec.app@gmail.com`, rendered as a `mailto:` link. The link uses dark green ink, a green underline, and `clamp(16px, 2vw, 22px)` text. Contact remains email-only across languages; no phone, postal address, or social-contact channel is established.

## Do's and Don'ts

### Do:

- **Do** preserve the original textured black hero, lightning, wordmark, and Montserrat/Open Sans pairing.
- **Do** use the existing logo-green and dark green ink for the current accent roles.
- **Do** preserve contained project images, responsive grid behavior, native filter buttons, and reduced-motion handling.
- **Do** keep email-only contact at Robotec.app@gmail.com and support all eight established language variants, including RTL Arabic.
- **Do** treat the current portfolio card aesthetic as temporarily accepted pending project replacement.

### Don't:

- **Don't** invent a new visual identity, palette, or product claims from this documentation.
- **Don't** claim the current portfolio card appearance is a final owner-endorsed design.
- **Don't** add phone, address, or social-contact channels or claim the email-draft form sends mail through a server.
- **Don't** publish or expose the original private Laravel repository as part of static-site work.
