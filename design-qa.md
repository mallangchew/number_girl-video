# Design QA — Call Her Sequence

## Findings

No actionable P0, P1, or P2 findings remain in the rendered call sequence.

Remaining P3: fine-grained call-state values beyond the new principal palette/spacing/motion token block could be normalized further. This is non-blocking maintenance rather than a visible defect.

## Source and implementation

- Source visual truth: `/Users/mallangchew/Documents/New project/.codex-audit/final-figma-storyboard.png` (Figma storyboard node `5:2`).
- Implementation: `http://127.0.0.1:8766/landscape.html` from `/Users/mallangchew/Downloads/number_girl-video-main 2`.
- Browser-rendered evidence: `/Users/mallangchew/Documents/New project/.omo/evidence/call-her-sequence/visual-qa/`.
- Added runtime asset deliverable: `/Users/mallangchew/Downloads/number_girl-video-main 2/assets/love-popup-80s-saranghaseyo-banner.png` (existing authorized untracked asset, preserved unstaged as required; verified HTTP 200).
- Full combined comparison: `/Users/mallangchew/Documents/New project/.omo/evidence/call-her-sequence/visual-qa/comparison-full-storyboard-actual.png`.
- Focused dialing/answered/recorded/final comparison: `/Users/mallangchew/Documents/New project/.omo/evidence/call-her-sequence/visual-qa/comparison-focused-call-states.png`.
- Comparison mode: intent/fidelity and responsive extrapolation. The 3200×958 storyboard is an interaction contract, not a same-size page frame, so no fabricated similarity score or pixel-pass claim was used.
- Browser surface: in-app Browser was attempted first; its runtime browser list was empty after required recovery checks. QA used a fresh isolated agent-browser managed Chromium session without Chrome profile or authentication.

## Viewport and state matrix

| Viewport | State / condition | Evidence |
|---|---|---|
| 1280×720 | broadcast rest | `1280-broadcast-rest.png` |
| 1280×720 | phone-band keyboard focus-visible | `1280-broadcast-focus-visible.png` |
| 1280×720 | dialing at 100ms | `1280-dialing-mid-100ms.png` |
| 1280×720 | dialing settled | `1280-dialing-settled.png` |
| 1280×720 | answered rest | `1280-answered-rest.png` |
| 1280×720 | answered settled | `1280-answered-settled.png` |
| 1280×720 | caller recorded | `1280-recorded-rest.png` |
| 1280×720 | persistent love broadcast | `1280-love-broadcast-settled.png` |
| 1280×720 | reduced-motion final | `1280-reduced-motion-final.png` |
| 768×1024 | broadcast / caller recorded / final | `768-broadcast-rest.png`, `768-recorded-text-heavy.png`, `768-love-broadcast-settled.png` |
| 375×812 | broadcast / caller recorded / final | `375-broadcast-rest.png`, `375-recorded-text-heavy.png`, `375-love-broadcast-settled.png` |

The complete narrative matrix was captured after the visual-state repairs. The later terminal/focus/token changes do not materially alter the earlier dialing/answered/recorded visuals; the affected final and focus evidence plus combined comparisons were recaptured after those focused repairs.

## Five required fidelity surfaces

### Fonts and typography

- Representative DOM nodes compute to `"Arial Narrow", Arial, sans-serif`.
- `document.fonts.check('16px "Arial Narrow"')` returned `true`.
- The live canvas context reports `6.02px "Arial Narrow", Arial, sans-serif` between frames.
- Dialing, answered, recorded, final, navigation, and call-prompt hierarchy remain legible and untruncated at required widths.

### Spacing and layout rhythm

- The fixed 16:9 CRT stage remains centered without horizontal overflow at 1280, 768, and 375 widths.
- The 375 caller-recorded state now contains the complete thanks copy and all three classification rows.
- Navigation, Back, subtitle, mute, CRT mask, and final banner do not collide or leave the stage.

### Colors and visual tokens

- The sequence follows the storyboard progression: cool CRT broadcast, blue dialing signal, dark-purple answered transmission, black recorded terminal, and saturated pink/purple final broadcast.
- The answered-state static coating was retinted after focused comparison so the purple transmission remains dominant.
- CRT scanlines, noise, bloom, and vignetting remain present without adding unrelated glossy UI.

### Image quality and asset fidelity

- The implementation uses the supplied TV scene, ad, CRT mask, and real RGBA Korean banner asset.
- Images retain their intended crop, mask, and sharpness at all tested widths.
- The final state contains exactly one banner image. No placeholder, CSS-drawn substitute, popup barrage, pill art, face, or silhouette was introduced.

### Copy and content

- Exact narrative beats are present: `CALLING...`, `ARCHIVE SUBJECT 001`, `THE GIRL`, the four interrupted answer fragments, `SIGNAL LOST`, the three recorded status rows, and `LOVE IS CALLING!`.
- The girl remains audio/text-only.
- The Korean banner preserves both lines without clipped glyphs, tofu, or broken syllables at 1280, 768, and 375.

## Interaction and accessibility checks

- Mouse and keyboard activation both start the call.
- Rapid duplicate activation leaves one `is-call-dialing` state and disables both call targets with `disabled` and `aria-disabled="true"`.
- Mute receives focus when the call starts; toggling updates `aria-pressed`, label, and visible text for MUTE/UNMUTE.
- Back during answered cancels timers/audio, hides mute, restores broadcast, restores call targets, and leaves the same broadcast state after the former timer window.
- The final state is terminal and persistent: call targets are disabled and `- call her` is hidden. Back restores the original broadcast and re-enables the call controls, enabling replay from the broadcast as required.
- `aria-hidden` and `inert` track the active sequence; inactive layers remain hidden. `aria-live="polite"` announces each state.
- Both call targets are natively disabled with `aria-disabled="true"` while the broadcast scene is hidden at idle, prologue, doctrine, and final. Focused tab-order smoke reached Enter at idle, a doctrine closer in doctrine, and the phone-band target only after broadcast became active.
- The transparent phone-band target remains visually transparent at rest and now shows a solid keyboard focus outline; computed focus evidence is `opacity: 1`, transparent background, `1px` solid white outline, `3px` offset.
- Under reduced motion, ring indicators, CRT field/snow/bar, and the account mark compute to `animation-name: none`. Narrative dwell timing remains 2801ms / 4403ms / 2796ms.
- In reduced-motion final, the call subtitle computes to `opacity: 0` and `pointer-events: none`; both call targets remain disabled and focus is on Back.
- Persistent final check found one banner, zero dialog/modal/popup nodes, disabled call targets, hidden mute, focus on Back, and no later state change.

## Console and network

- Browser console: no messages or errors.
- Page errors: none.
- Network: document, stylesheet, scripts, mask, scene, ad, and banner returned HTTP 200; the reloaded script returned 304 from the same current local source. No failed request was observed.

## Comparison history

1. **P2 — 375 caller-recorded content clipped.** Pre-fix runtime geometry showed a 121.27px layer with 24px layer padding, 24px copy margin, and 24px status padding; only 15.70px of the 68px status block remained inside `overflow: hidden`. Added small-viewport recorded-state spacing/type overrides. Post-fix evidence: `375-recorded-text-heavy.png` shows every row.
2. **P2 — canvas font contract was not inspectable between frames.** Drawing used Arial Narrow, but restored context state reported `10px sans-serif`. Initialized the base context font during resize. Post-fix runtime result: `6.02px "Arial Narrow", Arial, sans-serif`.
3. **P2 — answered transmission read green/blue.** The focused source/actual comparison exposed static overlay drift from the storyboard's purple state. Reduced and retinted only the answered static coating. Post-fix evidence: `1280-answered-settled.png` and `comparison-focused-call-states.png`.
4. **P1 — reduced-motion infinite loops were compressed to 1ms.** Replaced looping ring/field/snow/bar/account animations with static `animation: none` rules while keeping JavaScript dwell timers. Focused computed check passes.
5. **P2 — phone-band focus ring was suppressed by element opacity.** Kept the control's background transparent but restored element opacity so `:focus-visible` paints. Post-fix evidence: `1280-broadcast-focus-visible.png` and computed outline values.
6. **P1/P2 — final was replayable in-place and hid the focused MUTE control.** Made `love-broadcast` terminal until Back, disabled both call targets, hid the call prompt, restricted starts to broadcast, and moved focus to Back before hiding MUTE. Post-fix evidence: fresh `1280-love-broadcast-settled.png` and focused runtime state checks.
7. **P2 — principal call-layer values were orphan literals.** Added and used a concise `--call-*` token block for text/surface/answered/final/focus colors, frame spacing, and state transition.
8. **P2 — reduced-motion cascade restored the final call prompt.** Added a later reduced-motion terminal override for zero opacity and no pointer events. Direct current-build check passes.
9. **P1 — hidden broadcast call targets remained keyboard-focusable.** Made call controls default to disabled outside active broadcast, enabled them only when broadcast settles or Back restores it, and disabled them again on doctrine/final. Focused current-build tab-order smoke passes across idle, doctrine, broadcast, final, Back-to-broadcast, and Back-to-doctrine.

## Independent review

- Visual/CJK fidelity reviewer: PASS, high confidence, no P0/P1/P2 findings.
- Functional reviewer initially requested the two accessibility repairs above; both were applied and verified with fresh focused runtime evidence.
- The code-fidelity reviewer requested terminal-final, focus restoration, and token fixes; all were applied and verified. The seven principal tokens are documented in `DESIGN.md` with exact values and roles; remaining fine-grained literals are accepted P3 maintenance debt. Its banner-packaging note does not block this local no-commit task: the authorized asset exists, returned HTTP 200, and was intentionally preserved unstaged.

## Implementation checklist

- [x] Complete 2.8s → 4.4s → 2.8s sequence and persistent final.
- [x] Responsive 1280 / 768 / 375 layouts.
- [x] Mouse, keyboard, mute, Back, replay, duplicate-click, and reduced-motion behavior.
- [x] Arial Narrow DOM and canvas contract.
- [x] One final banner, girl unseen, no popup barrage.
- [x] Empty console/page-error logs and successful local assets.
- [x] Focused and full combined storyboard comparisons opened and reviewed.

final result: passed
