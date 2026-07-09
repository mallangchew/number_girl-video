# Love Cult Archive Design System

## 1. Atmosphere & Identity

A black-room archive intro that feels like a damaged analog transmission made from numeric light. The signature is a barely visible angel figure revealed through flickering digits, scanlines, and narrow condensed text.

## 2. Color

### Palette

| Role | Token | Value | Usage |
|------|-------|-------|-------|
| Surface/void | `--color-black` | `0 0 0` | Page background, frame masks, fade overlays |
| Text/primary | `--color-paper` | `244 241 236` | Intro title and active text |
| Text/secondary | `--color-paper-soft` | `236 231 221` | Main archive title tone |
| Glyph/muted | `--color-ink-muted` | `216 212 204` | Numeric rain and mask glyphs |
| Glyph/low | `--color-ash` | `201 197 189` | Caption-like marks |
| Light/glow | `--color-white` | `255 255 255` | Scanlines, glow, brightest glyphs |

### Rules

- The site is monochrome; contrast comes from opacity, density, and scanline layering.
- Black is structural, not decorative: it creates the crop, center split, and vignette.
- Do not introduce saturated accent colors. Interactive emphasis uses brighter paper glow only.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| Title | `clamp(22px, 2.35vw, 32px)` | 400 | 1 | 0 | Intro question |
| Action | `clamp(24px, 2.4vw, 34px)` | 400 | 1 | 0 | Enter link |
| Glyph | `max(5px, cellY * 0.86)` | 400 | Canvas-rendered | 0 | Numeric figure |
| Caption mark | `max(5px, cellY * 0.68)` | 400 | Canvas-rendered | 0 | Low footer marks |

### Font Stack

- Condensed: `--font-condensed`, used for the intro title and action.
- Mono: `--font-mono`, used for numeric canvas rendering and body fallback.

### Rules

- Letter spacing stays at `0` to preserve the archival reference feel.
- Text should not wrap; the visual depends on a single-line, center-balanced phrase.

## 4. Spacing & Layout

### Base Unit

The composition is fixed-format rather than content-flow based. DOM spacing is minimal; layout is driven by percentage anchors and aspect-ratio tokens.

| Token | Value | Usage |
|-------|-------|-------|
| `--frame-portrait-width-from-height` | `56.25vh` | Portrait width constraint |
| `--frame-portrait-height-from-width` | `177.7778vw` | Portrait height constraint |
| `--frame-landscape-width-from-height` | `177.7778vh` | Landscape width constraint |
| `--frame-landscape-height-from-width` | `56.25vw` | Landscape height constraint |
| `--frame-scanline` | `5px` | Scanline repeat cadence |

### Grid

- The main surface is a centered fixed-ratio frame constrained by `100vw` and `100vh`.
- The body uses `100dvh` so letterboxed routes stay centered on mobile browser chrome.
- Portrait route uses `9:16`; intro route uses `16:9`.
- HTML includes a small critical CSS block for first paint; `styles.css` is preloaded non-blocking for the full atmospheric layer.

### Rules

- Preserve the exact frame ratios. Do not stretch the art to arbitrary viewport proportions.
- Use percentage anchors for title blocks because they align to the underlying generated image.

## 5. Components

### Archive Frame

- **Structure**: `<main class="archive-intro">` with decorative image, canvas, scanlines, and paper noise.
- **Variants**: portrait default, landscape `archive-intro--wide`.
- **Spacing**: fixed-ratio frame tokens.
- **States**: static default; canvas responds to pointer movement and press.
- **Accessibility**: decorative image and canvas are hidden from assistive tech; main has an aria label.
- **Motion**: canvas digits animate at a capped frame cadence; reduced-motion users keep a stable figure.
- **Fallback**: the source image is only loaded inside `noscript`; the live figure uses embedded mask data to avoid making the decorative image the LCP element.

### Paint Mark

- **Structure**: one low-opacity numeric mark on the portrait route.
- **Variants**: portrait route only.
- **Spacing**: bottom-centered inside the fixed frame.
- **States**: static.
- **Accessibility**: hidden from assistive tech because it is decorative.
- **Motion**: none.

### Intro Title

- **Structure**: center title layer with question text and one `enter` anchor.
- **Variants**: intro route only.
- **Spacing**: percentage anchors preserve the reference composition.
- **States**: default, hover, focus-visible.
- **Accessibility**: the visible action is a real link.
- **Motion**: hover/focus changes glow and opacity only.

## 6. Motion & Interaction

### Timing

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Canvas frame | `1000 / 24ms` | requestAnimationFrame capped | Numeric flicker |
| Text hover | `160ms` | ease | Enter affordance |
| Pointer scatter | frame-based damping | physics easing | Digits move away from pointer |
| Boot | first paint | browser scheduled | Load mask and canvas script after the initial frame |

### Rules

- Motion must reveal or respond: flicker reveals the angel, pointer movement scatters glyphs, hover clarifies the entry action.
- Reduced motion disables image transform and text transition; canvas avoids moving rain and scattering.

## 7. Depth & Surface

### Strategy

Mixed tonal shift and glow.

| Layer | Treatment | Usage |
|-------|-----------|-------|
| Vignette | Black linear and radial overlays | Crops the figure and focuses attention |
| Scanline | Low-opacity repeating line | Adds analog display texture |
| Noise | Sparse radial particles | Softens the digital surface |
| Text glow | White shadow at low opacity | Makes title feel exposed by light |
