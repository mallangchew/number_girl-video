# Love Cult Archive Design System

## 1. Atmosphere & Identity

An occult web archive that keeps slipping into late-night domestic broadcast. The signature is contaminated media: black religious image decay, condensed white doctrine type, pink-blue analog glow, and VHS noise that turns interaction into a ritual.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
|------|-------|-------|------|-------|
| Surface/black | `#000000` | `#000000` | `#000000` | Stage background and blackout |
| Text/primary | `#f7f3ee` | `#f7f3ee` | `#f7f3ee` | Doctrine and prologue text |
| Text/muted | `rgb(244 239 231 / 42%)` | `rgb(244 239 231 / 42%)` | `rgb(244 239 231 / 42%)` | Inactive navigation |
| Glow/pink | `rgb(255 174 223 / 28%)` | `rgb(255 174 223 / 28%)` | `rgb(255 174 223 / 28%)` | Hover glow and cult broadcast tint |
| Glow/CRT | `rgb(142 206 255 / 76%)` | `rgb(142 206 255 / 76%)` | `rgb(142 206 255 / 76%)` | Television static and screen bloom |

### Rules

- Color should feel sourced from damaged media: black, off-white, pale pink, and blue CRT bloom.
- New colors only appear as translucent media artifacts, not clean UI accents.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| Display | `clamp(30px, 4.35vw, 66px)` | 300 | 0.98 | 0 | Doctrine title |
| Body/lg | `clamp(16px, 1.75vw, 26px)` | 400 | 1.08 | 0 | Doctrine copy |
| Nav | `clamp(12px, 1.22vw, 18px)` | 400 | 1 | 0 | Top categories |
| Caption | `clamp(14px, 1.28vw, 19px)` | 400 | 1 | 0 | Click hint |

### Font Stack

- Primary: `"Arial Narrow", "Helvetica Neue Condensed", "Roboto Condensed", Arial, sans-serif`
- Mono: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`

### Rules

- Letter spacing stays at `0`; the stretched/narrow feeling comes from condensed fonts and scale transforms.
- Text should look like broadcast/printed doctrine, never polished SaaS copy.

## 4. Spacing & Layout

### Base Unit

All spacing uses a 4px base.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Scanline and tiny offset rhythm |
| `--space-2` | 8px | Inline hints |
| `--space-3` | 12px | Compact nav on small screens |
| `--space-6` | 24px | Stage-safe margins |
| `--space-10` | 40px | Top category band |

### Grid

- The main stage is fixed-format: portrait `9:16` or landscape `16:9`.
- Broadcast scene uses the same `16:9` frame as the supplied TV image.

### Rules

- Fixed-format image overlays must use percentage positioning so they scale with the stage.
- Top categories and back control stay above scene transitions.

## 5. Components

### Archive Stage
- **Structure**: `main.archive-intro` with image/canvas/scene layers.
- **States**: idle, ritual, prologue, doctrine, broadcast.
- **Motion**: scene changes use opacity, transform, and filter only.

### Prologue Choice
- **Structure**: two mirrored `button.prologue-copy` text blocks over the prologue image.
- **States**: entering, active, hover, focus-visible, active/pressed, disabled.
- **Motion**: hover/focus uses a small upward scale bump and brighter pink-white glow so the large story text reads as clickable; active/pressed settles back down.
- **Accessibility**: both text blocks are real buttons and stay disabled until the prologue scene is active.

### Doctrine Navigation
- **Structure**: four uppercase category spans.
- **States**: default, active.
- **Accessibility**: landmark `nav` with category text.
- **Motion**: fades in with doctrine and remains visible over broadcast.

### Broadcast Scene
- **Structure**: a full-stage camera layer containing the TV image, a masked TV advertisement image (`assets/love-charm-tv-ad-v1.png`), and a full-image static layer masked by the smoothed CRT glass alpha in `assets/love-tv-screen-mask.png`, with top navigation outside that camera layer.
- **States**: hidden, entering, active.
- **Accessibility**: decorative image and static are `aria-hidden`; the scene has a descriptive label.
- **Motion**: the camera layer starts inside the CRT screen and zooms out to reveal the full TV; the ad tunes in during the pullback while the masked static dims but stays on top as VHS interference.

### Broadcast Call Prompt
- **Structure**: a masked call layer inside the broadcast camera, with one transparent hit target over the ad's lower phone-number banner, plus a separate scene-level `- call her` subtitle set in `Arial Narrow` below the CRT screen.
- **States**: dormant during pullback, subtitle-active after the broadcast settles, called after the user clicks the lower call area.
- **Motion**: the subtitle appears like a late TV caption with a slight VHS flicker only; no scale pop, bounce, or glossy web-button behavior.
- **Layout**: the lower call hit area covers the TV ad's phone-number band without hiding the ad art. The subtitle stays centered on the lower black TV body, below the CRT glass and above the lower edge of the stage, matching a film subtitle placed just under the picture. It shares the same destination. The static layer remains above the television image only as the final CRT coating.
- **Accessibility**: both the lower call area and subtitle are real buttons with the same `aria-label`; the TV image, ad image, and static remain decorative.

## 6. Motion & Interaction

### Timing

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | 180-240ms | ease / cubic-bezier(0.2, 0.8, 0.2, 1) | Hover glow, prologue bump |
| Standard | 800-1400ms | ease-in-out | Scene fade |
| Emphasis | 4200ms + delayed 1300ms | cubic-bezier(0.76, 0, 0.24, 1) + linear | CRT pullback, full-TV static hold, then ad tune-in |
| Call prompt | 680ms after 920ms delay | steps(2, end) | Delayed `- call her` subtitle after the ad appears |

### Rules

- Motion must signal a state change: entering the archive, moving through doctrine, or discovering the broadcast source.
- Reduced motion keeps state changes instant and avoids the zoom-out shock.

## 7. Depth & Surface

### Strategy

Mixed media depth: raster images carry physical surface, while CSS overlays add scanlines, noise, glow, and vignette.

| Level | Value | Usage |
|-------|-------|-------|
| Stage vignette | layered radial gradients | Archive darkness |
| CRT glow | translucent blue/pink gradients and blend modes | Screen bloom |
| Noise | repeating linear/radial gradients | VHS and paper decay |
