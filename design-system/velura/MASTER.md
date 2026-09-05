# Velura — Design System Master

Source of truth for storefront UI. Brand file: `CLAUDE.md`. Theme: **Onyx & Pearl**.

## Product

Premium Indian women's lingerie. Editorial fashion house, not a catalog. Audience: women 22–45. Market: India, INR.

## Style

**Exaggerated minimalism + editorial magazine.** Photography carries the page. Type is architecture. One accent only (pearl). No glassmorphism, no tape-measure motifs, no graph paper, no playful color.

## Tokens

| Role | Hex | Token |
|------|-----|-------|
| Pearl accent | `#B8A898` | `rose` |
| Warm stone | `#EDE9E4` | `blush` |
| Near black | `#0F0D0B` | `deep` |
| Warm white | `#F8F6F3` | `cream` |
| Warm grey | `#6B6058` | `mauve` |
| Muted stone | `#9A8878` | `gold` |
| Stone border | `#D8D4CE` | `lm` |

Typography: Cormorant Garamond (headings, 300) + DM Sans (UI, 300–500).
Radius: 3px buttons, 4px cards, 2px badges. Size selectors only may be pills.
Prices: `deep`, never `rose`.
Nav: always dark chrome. Never cream.

## Motion

Ease-out `cubic-bezier(0.23, 1, 0.32, 1)`. UI under 300ms. Press scale 0.97. Hover gated to `(hover: hover) and (pointer: fine)`. Respect `prefers-reduced-motion`.

## Signature

Cinematic full-bleed campaign hero with a ghost wordmark and vertical season index. Horizontal lookbook film. Asymmetric collection mosaic.

## Anti-patterns

Liquid glass, vibrant blocks, rose-pink (`#C9717A`, `#B9746A`), green shipping bars, pill buttons, emoji icons, generic “Shop Now”.
