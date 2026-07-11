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
| Signal/purple | `rgb(29 5 43 / 96%)` | `rgb(29 5 43 / 96%)` | `rgb(29 5 43 / 96%)` | Answered call signal |
| Broadcast/hot pink | `rgb(255 19 166 / 14%)` | `rgb(255 19 166 / 14%)` | `rgb(255 19 166 / 14%)` | Final love broadcast surface |

### Call Sequence CSS Tokens

| Token | Value | Role |
|---|---|---|
| `--call-color-text` | `#f7f3ee` | Primary call-state copy |
| `--call-color-surface` | `rgb(0 0 0 / 92%)` | Default masked CRT layer |
| `--call-color-answered` | `rgb(29 5 43 / 96%)` | Answered transmission |
| `--call-color-final` | `rgb(255 19 166 / 14%)` | Final broadcast surface |
| `--call-color-focus` | `rgb(255 255 255 / 76%)` | Keyboard focus outline |
| `--call-space-frame` | `clamp(24px, 4.6vw, 72px)` | Recorded-state frame inset |
| `--call-transition-state` | `opacity 180ms steps(2, end)` | Call-layer state cut |

Fine-grained call typography, glow, and local spacing literals remain accepted P3 maintenance debt; the principal palette, frame spacing, focus, and state motion values above are the required reusable contract.

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

- Primary and only generated-text face: `"Arial Narrow", Arial, sans-serif`
- Canvas glyphs: `"Arial Narrow", Arial, sans-serif`
- Raster asset lettering is exempt because it is baked into the supplied images.

### Rules

- Letter spacing stays at `0`; the stretched/narrow feeling comes from condensed fonts and scale transforms.
- Text should look like broadcast/printed doctrine, never polished SaaS copy.
- Do not copy or distribute a font file; use the locally installed macOS Arial Narrow system face.

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

### Call Sequence
- **Structure**: one `.call-sequence` container inside the broadcast scene with distinct dialing, answered, recorded, and final broadcast layers plus a separate polite live region.
- **States**: `is-call-dialing`, `is-call-answered`, `is-caller-recorded`, `is-love-broadcast`, and `is-love-news` on the archive stage.
- **Motion**: state layers use only opacity, transform, and filter. Dialing contracts the signal; answered becomes a dark purple transmission; recorded becomes a black archive terminal; final broadcast blooms into over-saturated pink and purple.
- **Content**: the girl remains audio/text only. Her face and silhouette are never shown. The final frame uses the existing ad plus one `assets/love-popup-80s-saranghaseyo-banner.png` banner; no popup barrage, coercion copy, or love pills appear in this milestone.
- **Interaction**: both call targets start the same opening timeline. The girl dialogue reveals automatically at a slower recorded-call pace; after it ends, the user clicks the TV signal to advance to the recorded state, clicks again to enter the final broadcast, then clicks once more for a short power-cut into the `LOVE WORLD` news-shopping host screen. Rapid clicks cannot duplicate the sequence. Back during any call state cancels timers and audio and restores the original broadcast; Back again returns to doctrine. Re-entry starts from dialing.
- **Accessibility**: call targets are disabled/inert while the timeline is active. The mute control is keyboard-operable with `aria-pressed`; state announcements use `aria-live="polite"`. Reduced motion removes motion/glitch animation while preserving all narrative dwell timings.
- **Audio**: three low Web Audio ring cues occur during dialing, followed by a short static cut before the recorded state. Audio failure never blocks visual progress.

## 6. Motion & Interaction

### Timing

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | 180-240ms | ease / cubic-bezier(0.2, 0.8, 0.2, 1) | Hover glow, prologue bump |
| Standard | 800-1400ms | ease-in-out | Scene fade |
| Emphasis | 4200ms + delayed 1300ms | cubic-bezier(0.76, 0, 0.24, 1) + linear | CRT pullback, full-TV static hold, then ad tune-in |
| Call prompt | 680ms after 920ms delay | steps(2, end) | Delayed `- call her` subtitle after the ad appears |
| Call dialing | 2800ms total | opacity / transform / filter | Three low ring cues and archive subject label |
| Call answered | 9600ms total | opacity / transform / filter | Four text fragments reveal slowly without a face, then wait for click |
| Caller recorded | Click-held | opacity / transform / filter | Static cut and account classification, then wait for click |
| Love broadcast | Persistent | opacity / filter | Existing ad plus one bright Korean love banner |
| Love news | Persistent | opacity / filter | Power-cut transition into host-led news-shopping broadcast |

### Rules

- Motion must signal a state change: entering the archive, moving through doctrine, or discovering the broadcast source.
- Reduced motion keeps visual state changes instant and avoids the zoom-out shock, but the call-sequence reading intervals and click gates remain intact.

## 7. Depth & Surface

### Strategy

Mixed media depth: raster images carry physical surface, while CSS overlays add scanlines, noise, glow, and vignette.

| Level | Value | Usage |
|-------|-------|-------|
| Stage vignette | layered radial gradients | Archive darkness |
| CRT glow | translucent blue/pink gradients and blend modes | Screen bloom |
| Noise | repeating linear/radial gradients | VHS and paper decay |
