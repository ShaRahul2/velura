'use client'

import type { BuilderVisualSpec } from '@/lib/builderVisualSpec'

// ── Color system ──────────────────────────────────────────────────────────────

const FILL_MAP: Record<string, string> = {
  // Neutrals
  ivory:     '#F5EFE6',
  blush:     '#F8F6F3',
  nude:      '#C9B4A0',
  cream:     '#EDE9E4',
  champagne: '#D8C4A0',
  rose:      '#B8A898',
  smoke:     '#9A8878',
  mauve:     '#6B6058',
  slate:     '#5A5550',
  deep:      '#0F0D0B',
  black:     '#181818',
  // Pinks & Reds
  pink:      '#EDAFC0',
  blushrose: '#E07890',
  red:       '#B02030',
  burgundy:  '#7A1C2E',
  // Blues & Greens
  lavender:  '#C5B2D5',
  navy:      '#1A2E52',
  cobalt:    '#2555A0',
  sage:      '#8DB09A',
  forest:    '#2D5C44',
}

// Stroke is darker on light fills, lighter on dark fills
const STROKE_MAP: Record<string, string> = {
  // Neutrals
  ivory:     '#C9B4A0',
  blush:     '#B8A898',
  nude:      '#9A7860',
  cream:     '#9A8878',
  champagne: '#8C7250',
  rose:      '#8C7868',
  smoke:     '#6B6058',
  mauve:     '#EDE9E4',
  slate:     '#EDE9E4',
  deep:      '#EDE9E4',
  black:     '#9A8878',
  // Pinks & Reds
  pink:      '#B85070',
  blushrose: '#8C2040',
  red:       '#F5D0D5',
  burgundy:  '#D4A0A8',
  // Blues & Greens
  lavender:  '#7A6090',
  navy:      '#8898C0',
  cobalt:    '#9AB0D8',
  sage:      '#4A7058',
  forest:    '#90C4A0',
}

// ── Cup geometry ──────────────────────────────────────────────────────────────
// All coordinates are for the LEFT cup in a 200×155 viewBox (center X = 100).
// The right cup is rendered via transform="translate(200,0) scale(-1,1)".

interface CupParams {
  goreTopY:     number   // highest point of centre gore
  outerTopX:    number   // outer-top corner x (left cup)
  outerTopY:    number   // outer-top corner y
  outerMidX:    number   // widest outer point x
  outerMidY:    number   // widest outer point y
  goreBottomY:  number   // bottom of gore / top of band
  bandEdgeX:    number   // where left band edge starts
  strapAttachX: number   // strap attachment x on left cup
  strapAttachY: number   // strap attachment y
}

const CUP_PARAMS: Record<string, CupParams> = {
  everyday:   { goreTopY: 60, outerTopX: 62, outerTopY: 44, outerMidX: 39, outerMidY: 73, goreBottomY: 99, bandEdgeX: 52, strapAttachX: 68, strapAttachY: 46 },
  balconette: { goreTopY: 67, outerTopX: 60, outerTopY: 56, outerMidX: 38, outerMidY: 76, goreBottomY: 99, bandEdgeX: 50, strapAttachX: 65, strapAttachY: 58 },
  padded:     { goreTopY: 54, outerTopX: 60, outerTopY: 39, outerMidX: 37, outerMidY: 71, goreBottomY: 99, bandEdgeX: 52, strapAttachX: 66, strapAttachY: 41 },
  sports:     { goreTopY: 58, outerTopX: 64, outerTopY: 48, outerMidX: 42, outerMidY: 72, goreBottomY: 99, bandEdgeX: 54, strapAttachX: 70, strapAttachY: 50 },
  lace:       { goreTopY: 60, outerTopX: 62, outerTopY: 44, outerMidX: 39, outerMidY: 73, goreBottomY: 99, bandEdgeX: 52, strapAttachX: 68, strapAttachY: 46 },
  wirefree:   { goreTopY: 62, outerTopX: 63, outerTopY: 47, outerMidX: 40, outerMidY: 75, goreBottomY: 99, bandEdgeX: 52, strapAttachX: 68, strapAttachY: 49 },
  strapless:  { goreTopY: 65, outerTopX: 58, outerTopY: 54, outerMidX: 37, outerMidY: 75, goreBottomY: 99, bandEdgeX: 48, strapAttachX: 0,  strapAttachY: 0  },
  bridal:     { goreTopY: 58, outerTopX: 61, outerTopY: 43, outerMidX: 38, outerMidY: 72, goreBottomY: 99, bandEdgeX: 52, strapAttachX: 67, strapAttachY: 45 },
}

/**
 * Generate the SVG path for the LEFT cup.
 * Three smooth cubic bezier segments: gore-top → outer-top → outer-mid → band-edge.
 * The right cup is drawn using a mirror transform in the caller.
 */
function leftCupPath(p: CupParams): string {
  const { goreTopY: gty, outerTopX: otx, outerTopY: oty,
          outerMidX: omx, outerMidY: omy,
          goreBottomY: gby, bandEdgeX: bex } = p
  const cx = 100
  return [
    `M ${cx} ${gty}`,
    // Segment 1: gore-top → outer-top  (curve left & upward)
    `C ${cx - 3} ${gty - 2} ${((otx + cx) / 2 + 5).toFixed(1)} ${oty + 1} ${otx} ${oty}`,
    // Segment 2: outer-top → outer-mid  (curve outward & downward)
    `C ${otx - 10} ${oty + 4} ${omx - 2} ${omy - 14} ${omx} ${omy}`,
    // Segment 3: outer-mid → band edge  (curve inward & down to band)
    `C ${omx} ${omy + 12} ${bex - 8} ${gby - 2} ${bex} ${gby}`,
    `L ${cx} ${gby}`,
    'Z',
  ].join(' ')
}

// ── Component ─────────────────────────────────────────────────────────────────

interface BraSVGProps {
  spec:      BuilderVisualSpec
  className?: string
}

export function BraSVG({ spec, className }: BraSVGProps) {
  const params = CUP_PARAMS[spec.braType] ?? CUP_PARAMS.everyday
  const fill   = FILL_MAP[spec.colorId]   ?? '#EDE9E4'
  const stroke = STROKE_MAP[spec.colorId] ?? '#9A8878'

  const cupPath = leftCupPath(params)
  const {
    goreTopY, outerTopX, outerTopY,
    goreBottomY, bandEdgeX,
    strapAttachX, strapAttachY,
  } = params

  const bandEdgeR    = 200 - bandEdgeX
  const strapAttachXR = 200 - strapAttachX

  // Flags derived from spec
  const isStrapless  = spec.strapStyle === 'none'
  const isCrossback  = spec.strapStyle === 'crossback'
  const isWideStrap  = spec.strapStyle === 'wide'
  const isAdjustable = spec.strapStyle === 'adjustable'
  const isWired      = spec.underwire  === 'wired'
  const isFrontClose = spec.closure    === 'front'
  const isBackClose  = spec.closure    === 'back'
  const isHighSupport = spec.support   === 'high'
  const isMedSupport  = spec.support   === 'medium'
  const hasLaceOverlay = spec.fabric === 'lace' || spec.braType === 'lace'
  const hasSilkSheen   = spec.fabric === 'silk'
  const hasSmoothGrad  = spec.fabric === 'microfiber' || spec.fabric === 'smooth'
  const isBridal       = spec.braType === 'bridal'

  const strapWidth = isWideStrap ? 7 : 2

  // Padding overlay opacity
  const padOpacity =
    spec.padding === 'light'  ? 0.18 :
    spec.padding === 'medium' ? 0.30 :
    spec.padding === 'high'   ? 0.44 :
    0

  // Mirror transform that reflects the left cup to create the right cup
  const mirror = 'translate(200,0) scale(-1,1)'

  // Cup-top reference points for lace trim arc
  const laceTrimMidX = ((outerTopX + 100) / 2).toFixed(1)
  const laceTrimMidY = ((goreTopY + outerTopY) / 2 - 4).toFixed(1)

  return (
    <svg
      viewBox="0 0 200 155"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className ?? 'w-full h-full'}
      aria-hidden="true"
    >
      <defs>
        {/* Padding depth — radial highlight centred upper-inner portion of cup */}
        <radialGradient id="svgPadGrad" cx="48%" cy="40%" r="58%" fx="45%" fy="35%">
          <stop offset="0%"   stopColor="white" stopOpacity={padOpacity}/>
          <stop offset="65%"  stopColor="white" stopOpacity={padOpacity * 0.25}/>
          <stop offset="100%" stopColor="white" stopOpacity={0}/>
        </radialGradient>
        {/* Padding shadow for high-padding depth illusion */}
        <linearGradient id="svgPadShadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="black" stopOpacity={0}/>
          <stop offset="100%" stopColor="black" stopOpacity={spec.padding === 'high' ? 0.09 : 0}/>
        </linearGradient>
        {/* Silk diagonal sheen */}
        <linearGradient id="svgSilkSheen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="white" stopOpacity={0}/>
          <stop offset="40%"  stopColor="white" stopOpacity={hasSilkSheen ? 0.22 : 0}/>
          <stop offset="52%"  stopColor="white" stopOpacity={hasSilkSheen ? 0.30 : 0}/>
          <stop offset="64%"  stopColor="white" stopOpacity={hasSilkSheen ? 0.22 : 0}/>
          <stop offset="100%" stopColor="white" stopOpacity={0}/>
        </linearGradient>
        {/* Microfiber / smooth-knit top highlight */}
        <linearGradient id="svgSmoothGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="white" stopOpacity={hasSmoothGrad ? 0.14 : 0}/>
          <stop offset="100%" stopColor="white" stopOpacity={0}/>
        </linearGradient>
      </defs>

      {/* ── LEFT cup base ───────────────────────────────── */}
      <path d={cupPath} fill={fill} stroke={stroke} strokeWidth="1.4"/>

      {/* ── RIGHT cup (mirror of left) ───────────────────── */}
      <g transform={mirror}>
        <path d={cupPath} fill={fill} stroke={stroke} strokeWidth="1.4"/>
      </g>

      {/* ── Padding overlay — both cups ──────────────────── */}
      {spec.padding !== 'none' && (
        <>
          <path d={cupPath} fill="url(#svgPadGrad)"/>
          <g transform={mirror}><path d={cupPath} fill="url(#svgPadGrad)"/></g>
          {spec.padding === 'high' && (
            <>
              <path d={cupPath} fill="url(#svgPadShadow)"/>
              <g transform={mirror}><path d={cupPath} fill="url(#svgPadShadow)"/></g>
            </>
          )}
        </>
      )}

      {/* ── Silk sheen ───────────────────────────────────── */}
      {hasSilkSheen && (
        <>
          <path d={cupPath} fill="url(#svgSilkSheen)"/>
          <g transform={mirror}><path d={cupPath} fill="url(#svgSilkSheen)"/></g>
        </>
      )}

      {/* ── Smooth / microfiber top-edge highlight ─────────── */}
      {hasSmoothGrad && (
        <>
          <path d={cupPath} fill="url(#svgSmoothGrad)"/>
          <g transform={mirror}><path d={cupPath} fill="url(#svgSmoothGrad)"/></g>
        </>
      )}

      {/* ── Lace fabric overlay ──────────────────────────── */}
      {hasLaceOverlay && (
        <>
          {/* Dashed cup outline */}
          <path d={cupPath} fill="none" stroke={stroke} strokeWidth="0.5" strokeDasharray="3 2" opacity="0.42"/>
          <g transform={mirror}>
            <path d={cupPath} fill="none" stroke={stroke} strokeWidth="0.5" strokeDasharray="3 2" opacity="0.42"/>
          </g>
          {/* Scallop-style trim along cup top edge */}
          <path
            d={`M 100 ${goreTopY} C ${laceTrimMidX} ${laceTrimMidY} ${outerTopX + 4} ${outerTopY - 2} ${outerTopX} ${outerTopY}`}
            fill="none" stroke={stroke} strokeWidth="1.2" strokeDasharray="1.5 1.5" opacity="0.55"
          />
          <g transform={mirror}>
            <path
              d={`M 100 ${goreTopY} C ${laceTrimMidX} ${laceTrimMidY} ${outerTopX + 4} ${outerTopY - 2} ${outerTopX} ${outerTopY}`}
              fill="none" stroke={stroke} strokeWidth="1.2" strokeDasharray="1.5 1.5" opacity="0.55"
            />
          </g>
        </>
      )}

      {/* ── Bridal decorative detail ─────────────────────── */}
      {isBridal && (
        <>
          {/* Scallop dot trim along cup top (left side) */}
          {[0, 1, 2, 3].map((i) => {
            const t  = i / 3
            const bx = 100 - (100 - outerTopX) * t
            const by = goreTopY + (outerTopY - goreTopY) * t - 4
            return <circle key={i} cx={bx} cy={by} r="1.4" fill={stroke} opacity="0.32"/>
          })}
          {/* Scallop dot trim (right side — mirror positions) */}
          {[0, 1, 2, 3].map((i) => {
            const t  = i / 3
            const bx = 100 + (200 - outerTopX - 100) * t
            const by = goreTopY + (outerTopY - goreTopY) * t - 4
            return <circle key={i} cx={bx} cy={by} r="1.4" fill={stroke} opacity="0.32"/>
          })}
          {/* Tiny bow at centre gore */}
          <path
            d={`M 100 ${goreBottomY - 22} C 97 ${goreBottomY - 27} 94 ${goreBottomY - 25} 96 ${goreBottomY - 21}`}
            stroke={stroke} strokeWidth="1.1" fill="none" opacity="0.48"
          />
          <path
            d={`M 100 ${goreBottomY - 22} C 103 ${goreBottomY - 27} 106 ${goreBottomY - 25} 104 ${goreBottomY - 21}`}
            stroke={stroke} strokeWidth="1.1" fill="none" opacity="0.48"
          />
          <circle cx="100" cy={goreBottomY - 22} r="1.6" fill={stroke} opacity="0.42"/>
        </>
      )}

      {/* ── Underwire arches ─────────────────────────────── */}
      {isWired && (
        <>
          <path
            d={`M 100 ${goreBottomY} C 88 ${goreBottomY + 8} 68 ${goreBottomY + 9} ${bandEdgeX} ${goreBottomY}`}
            stroke={stroke} strokeWidth="1.2" strokeLinecap="round" opacity="0.50"
          />
          <path
            d={`M 100 ${goreBottomY} C 112 ${goreBottomY + 8} 132 ${goreBottomY + 9} ${bandEdgeR} ${goreBottomY}`}
            stroke={stroke} strokeWidth="1.2" strokeLinecap="round" opacity="0.50"
          />
        </>
      )}

      {/* ── Support panel seams ───────────────────────────── */}
      {isHighSupport && (
        <>
          <line
            x1={outerTopX + 10} y1={outerTopY + 5}
            x2={bandEdgeX + 4}  y2={goreBottomY - 2}
            stroke={stroke} strokeWidth="0.7" opacity="0.35"
          />
          <line
            x1={200 - outerTopX - 10} y1={outerTopY + 5}
            x2={bandEdgeR - 4}        y2={goreBottomY - 2}
            stroke={stroke} strokeWidth="0.7" opacity="0.35"
          />
        </>
      )}
      {isMedSupport && !isHighSupport && (
        <>
          <line
            x1={outerTopX + 12} y1={outerTopY + 7}
            x2={bandEdgeX + 5}  y2={goreBottomY - 2}
            stroke={stroke} strokeWidth="0.5" opacity="0.22"
          />
          <line
            x1={200 - outerTopX - 12} y1={outerTopY + 7}
            x2={bandEdgeR - 5}        y2={goreBottomY - 2}
            stroke={stroke} strokeWidth="0.5" opacity="0.22"
          />
        </>
      )}

      {/* ── Band ─────────────────────────────────────────── */}
      <path
        d={`M ${bandEdgeX} ${goreBottomY} L ${bandEdgeR} ${goreBottomY} L ${bandEdgeR + 2} ${goreBottomY + 18} L ${bandEdgeX - 2} ${goreBottomY + 18} Z`}
        fill={fill} stroke={stroke} strokeWidth="1" opacity="0.72"
      />
      {/* Band channel seam */}
      <line
        x1={bandEdgeX - 1} y1={goreBottomY + 10}
        x2={bandEdgeR + 1} y2={goreBottomY + 10}
        stroke={stroke} strokeWidth="0.5" opacity="0.28"
      />

      {/* ── Centre gore line ─────────────────────────────── */}
      <line
        x1="100" y1={goreTopY + 5}
        x2="100" y2={goreBottomY - 2}
        stroke={stroke} strokeWidth="0.8" opacity="0.38"
      />

      {/* ── Front closure clasp ──────────────────────────── */}
      {isFrontClose && (
        <g opacity="0.85">
          <rect
            x="97" y={goreBottomY - 15}
            width="6" height="8" rx="1"
            fill={fill} stroke={stroke} strokeWidth="0.9"
          />
          <line x1="100" y1={goreBottomY - 17} x2="100" y2={goreBottomY - 15}
                stroke={stroke} strokeWidth="1.1"/>
          <circle cx="100" cy={goreBottomY - 11} r="1" fill={stroke} opacity="0.9"/>
        </g>
      )}

      {/* ── Back closure hook-and-eye dots ───────────────── */}
      {isBackClose && (
        <>
          {[4, 7.5, 11].map((dy) => (
            <g key={dy}>
              <circle cx={bandEdgeX - 2} cy={goreBottomY + dy} r="1.2" fill={stroke} opacity="0.48"/>
              <circle cx={bandEdgeR + 2} cy={goreBottomY + dy} r="1.2" fill={stroke} opacity="0.48"/>
            </g>
          ))}
        </>
      )}

      {/* ── Strapless silicone grip line ─────────────────── */}
      {isStrapless && (
        <path
          d={`M ${bandEdgeX + 6} ${goreTopY + 2} Q 100 ${goreTopY - 3} ${bandEdgeR - 6} ${goreTopY + 2}`}
          stroke={stroke} strokeWidth="1.2" strokeDasharray="2 1.5" fill="none" opacity="0.48"
        />
      )}

      {/* ── Straps ───────────────────────────────────────── */}
      {!isStrapless && !isCrossback && (
        <>
          <path
            d={`M ${strapAttachX} ${strapAttachY} L ${strapAttachX + 2} 16`}
            stroke={stroke} strokeWidth={strapWidth} strokeLinecap="round" opacity="0.80"
          />
          <path
            d={`M ${strapAttachXR} ${strapAttachY} L ${strapAttachXR - 2} 16`}
            stroke={stroke} strokeWidth={strapWidth} strokeLinecap="round" opacity="0.80"
          />
          {/* Adjustable slider hardware */}
          {isAdjustable && (
            <>
              <rect x={strapAttachX - 1.5} y={32} width={4} height={5} rx="1"
                    fill={fill} stroke={stroke} strokeWidth="0.8" opacity="0.72"/>
              <rect x={strapAttachXR - 2.5} y={32} width={4} height={5} rx="1"
                    fill={fill} stroke={stroke} strokeWidth="0.8" opacity="0.72"/>
            </>
          )}
        </>
      )}
      {!isStrapless && isCrossback && (
        <>
          {/* Left cup → right shoulder and right cup → left shoulder */}
          <path
            d={`M ${strapAttachX} ${strapAttachY} L ${strapAttachXR - 2} 16`}
            stroke={stroke} strokeWidth={strapWidth} strokeLinecap="round" opacity="0.80"
          />
          <path
            d={`M ${strapAttachXR} ${strapAttachY} L ${strapAttachX + 2} 16`}
            stroke={stroke} strokeWidth={strapWidth} strokeLinecap="round" opacity="0.80"
          />
          {/* Cross-point ring indicator */}
          <circle cx="100" cy="31" r="2.8" fill={fill} stroke={stroke} strokeWidth="0.9" opacity="0.70"/>
        </>
      )}
    </svg>
  )
}
