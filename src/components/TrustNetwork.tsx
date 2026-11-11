import { useId, useLayoutEffect, useRef } from 'react'
import './TrustNetwork.css'

const REGIONS = [
  {
    id: 'acquisition',
    index: '01',
    name: 'Image Acquisition',
    meta: 'Original Scientific Images',
    tip: 'Linked to SITAS · 01 / 04',
    place: 'nw',
  },
  {
    id: 'authentication',
    index: '02',
    name: 'Cryptographic Authentication',
    meta: 'SHA-256 · Digital Signatures',
    tip: 'Linked to SITAS · 02 / 04',
    place: 'ne',
  },
  {
    id: 'provenance',
    index: '03',
    name: 'Digital Provenance',
    meta: 'C2PA Content Credentials',
    tip: 'Linked to SITAS · 03 / 04',
    place: 'se',
  },
  {
    id: 'verification',
    index: '04',
    name: 'Independent Verification',
    meta: 'Integrity & Image Analysis',
    tip: 'Linked to SITAS · 04 / 04',
    place: 'sw',
  },
] as const

/** ViewBox 1040×500. Dots sit on the corners; spokes stop at the outer ring. */
const SPOKES = [
  'M262.2 102.9 L401.9 182.6',
  'M777.8 102.9 L638.1 182.6',
  'M777.8 397.1 L638.1 317.4',
  'M262.2 397.1 L401.9 317.4',
] as const

const FLOW = ['M266 96 H774', 'M790 112 V388', 'M774 404 H266'] as const

function ringTicks(cx: number, cy: number, inner: number, outer: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return {
      x1: cx + cos * inner,
      y1: cy + sin * inner,
      x2: cx + cos * outer,
      y2: cy + sin * outer,
    }
  })
}

const DESK_TICKS = ringTicks(520, 250, 136, 144, 12)
const HUB_TICKS = ringTicks(100, 100, 78, 86, 12)

function Particle({ path, dur, begin }: { path: string; dur: string; begin?: string }) {
  return (
    <circle r="2.15" className="trust-net__particle">
      <animateMotion dur={dur} begin={begin} repeatCount="indefinite" path={path} />
    </circle>
  )
}

function CenterCopy() {
  return (
    <>
      <span className="trust-net__brand">SITAS</span>
      <span className="trust-net__center-title">
        Scientific Image
        <br />
        Trust Network
      </span>
      <span className="trust-net__center-tag">
        Trust from acquisition
        <br />
        to verification
      </span>
    </>
  )
}

/**
 * Conceptual architecture diagram for the partnership page.
 * HTML type stays at a readable size; SVG is hairlines, rings, and particles only.
 */
export function TrustNetwork() {
  const rootRef = useRef<HTMLElement>(null)
  const titleId = useId()
  const centerTipId = useId()

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const svgs = root.querySelectorAll('svg')
    let visible = false

    const apply = () => {
      const live = visible && !motion.matches
      root.classList.toggle('is-live', live)
      svgs.forEach((svg) => {
        if (live) svg.unpauseAnimations()
        else svg.pauseAnimations()
      })
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        apply()
      },
      { threshold: 0 },
    )

    apply()
    observer.observe(root)
    motion.addEventListener('change', apply)
    return () => {
      observer.disconnect()
      motion.removeEventListener('change', apply)
    }
  }, [])

  return (
    <section
      ref={rootRef}
      className="trust-net"
      lang="en"
      aria-labelledby={titleId}
    >
      <p className="trust-net__sr">
        Conceptual diagram of the SITAS architecture. Four regions connect to the center and follow
        the path from image acquisition to independent verification. No external system is shown as
        connected.
      </p>

      <header className="trust-net__head">
        <h2 id={titleId} className="trust-net__title">
          Scientific Image Trust Network
        </h2>
        <p className="trust-net__dek">
          Connecting Image Acquisition, Cryptographic Authentication, and Independent Verification.
        </p>
      </header>

      <div className="trust-net__radial">
        <div className="trust-net__frame">
          <svg
            className="trust-net__svg"
            viewBox="0 0 1040 500"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <marker
                id="trust-net-arrow"
                viewBox="0 0 8 8"
                refX="6.2"
                refY="4"
                markerWidth="7"
                markerHeight="7"
                orient="auto"
                markerUnits="userSpaceOnUse"
              >
                <path d="M1.2 1.4 L6.2 4 L1.2 6.6" fill="none" stroke="#6e8aa3" strokeWidth="1" />
              </marker>
            </defs>

            <g className="trust-net__rings trust-net__rings--desk">
              <circle className="trust-net__ring" cx="520" cy="250" r="136" />
              <circle className="trust-net__ring trust-net__ring--mid" cx="520" cy="250" r="124" />
              <circle className="trust-net__ring" cx="520" cy="250" r="112" />
              {DESK_TICKS.map((tick) => (
                <line key={`${tick.x1}-${tick.y1}`} className="trust-net__tick" {...tick} />
              ))}
            </g>

            {SPOKES.map((d) => (
              <path key={d} className="trust-net__spoke" d={d} />
            ))}
            {FLOW.map((d) => (
              <path key={d} className="trust-net__flow" d={d} markerEnd="url(#trust-net-arrow)" />
            ))}

            <Particle path={FLOW[0]} dur="14s" begin="-2s" />
            <Particle path={FLOW[1]} dur="12s" begin="-5s" />
            <Particle path={FLOW[2]} dur="14s" begin="-9s" />
            <Particle path={SPOKES[0]} dur="16s" begin="-1s" />
            <Particle path={SPOKES[1]} dur="16s" begin="-6s" />
            <Particle path={SPOKES[2]} dur="16s" begin="-11s" />
            <Particle path={SPOKES[3]} dur="16s" begin="-14s" />
          </svg>

          <button type="button" className="trust-net__center" aria-describedby={centerTipId}>
            <CenterCopy />
            <span className="trust-net__tip" id={centerTipId} role="tooltip">
              Trust from acquisition to verification
            </span>
          </button>

          {REGIONS.map((region) => (
            <button
              key={region.id}
              type="button"
              className={`trust-net__region trust-net__region--${region.place}`}
              aria-describedby={`${titleId}-${region.id}`}
            >
              <span className="trust-net__dot" aria-hidden="true" />
              <span className="trust-net__idx">{region.index}</span>
              <span className="trust-net__name">{region.name}</span>
              <span className="trust-net__meta">{region.meta}</span>
              <span className="trust-net__tip" id={`${titleId}-${region.id}`} role="tooltip">
                {region.tip}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="trust-net__stack">
        <button type="button" className="trust-net__hub" aria-describedby={`${titleId}-hub`}>
          <span className="trust-net__hub-mark" aria-hidden="true">
            <svg viewBox="0 0 200 200" focusable="false">
              <g className="trust-net__rings trust-net__rings--hub">
                <circle className="trust-net__ring" cx="100" cy="100" r="78" />
                <circle className="trust-net__ring trust-net__ring--mid" cx="100" cy="100" r="68" />
                <circle className="trust-net__ring" cx="100" cy="100" r="58" />
                {HUB_TICKS.map((tick) => (
                  <line key={`${tick.x2}-${tick.y2}`} className="trust-net__tick" {...tick} />
                ))}
              </g>
            </svg>
          </span>
          <span className="trust-net__hub-copy">
            <CenterCopy />
          </span>
          <span className="trust-net__tip" id={`${titleId}-hub`} role="tooltip">
            Trust from acquisition to verification
          </span>
        </button>

        <ol className="trust-net__steps">
          <span className="trust-net__rail" aria-hidden="true">
            <span className="trust-net__mover" />
            <span className="trust-net__mover trust-net__mover--late" />
          </span>
          {REGIONS.map((region, index) => (
            <li key={region.id} className="trust-net__step">
              <button
                type="button"
                className="trust-net__stepbtn"
                aria-describedby={`${titleId}-m-${region.id}`}
              >
                <span className="trust-net__dot" aria-hidden="true" />
                <span className="trust-net__stepcopy">
                  <span className="trust-net__idx">{region.index}</span>
                  <span className="trust-net__name">{region.name}</span>
                  <span className="trust-net__meta">{region.meta}</span>
                </span>
                {index < REGIONS.length - 1 ? (
                  <span className="trust-net__chev" aria-hidden="true" />
                ) : null}
                <span className="trust-net__tip" id={`${titleId}-m-${region.id}`} role="tooltip">
                  {region.tip}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
