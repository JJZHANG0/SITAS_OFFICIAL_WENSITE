import type { CSSProperties } from 'react'
import type { Lang } from '../context/SiteContext'

type Props = {
  lang: Lang
  kicker: string
  line: string
}

type Drift = {
  dx: number
  dy: number
  dur: number
  delay: number
  marginTop: number
}

const DRIFT: Drift[] = [
  { dx: 4, dy: -3, dur: 11.2, delay: -1.3, marginTop: 0 },
  { dx: -5, dy: 4, dur: 14.6, delay: -6.4, marginTop: 16 },
  { dx: 2, dy: -3, dur: 16.4, delay: -2.2, marginTop: 0 },
  { dx: -3, dy: 5, dur: 9.8, delay: -4.1, marginTop: 10 },
  { dx: 5, dy: -2, dur: 12.7, delay: -8.6, marginTop: 0 },
  { dx: -4, dy: 3, dur: 15.1, delay: -0.6, marginTop: 18 },
  { dx: 3, dy: -5, dur: 10.4, delay: -5.5, marginTop: 6 },
  { dx: -2, dy: 4, dur: 13.3, delay: -3.7, marginTop: 14 },
]

function segmentKicker(kicker: string) {
  const parts = kicker.split(/\s+/).filter(Boolean)
  return parts.length ? parts : [kicker]
}

function segmentLine(lang: Lang, line: string) {
  if (lang === 'zh') {
    const core = line.replace(/。$/, '')
    if (core === '以技术守护科研诚信') return ['以技术', '守护', '科研诚信。']
    const chunks: string[] = []
    for (let i = 0; i < core.length; i += 3) chunks.push(core.slice(i, i + 3))
    if (line.endsWith('。') && chunks.length) chunks[chunks.length - 1] += '。'
    return chunks
  }
  return line.split(/\s+/).filter(Boolean)
}

function driftStyle(index: number): CSSProperties {
  const d = DRIFT[index % DRIFT.length]
  return {
    ['--dx' as string]: `${d.dx}px`,
    ['--dy' as string]: `${d.dy}px`,
    ['--dur' as string]: `${d.dur}s`,
    ['--delay' as string]: `${d.delay}s`,
    marginTop: d.marginTop,
  }
}

export function VerisciCluster({ lang, kicker, line }: Props) {
  const kickers = segmentKicker(kicker)
  const lines = segmentLine(lang, line)
  return (
    <div className="verisci-cluster">
      <div className="verisci-cluster__row">
        {kickers.map((word, i) => (
          <span key={`k-${word}-${i}`} className="verisci-cluster__kicker kw-drift" style={driftStyle(i)}>
            {word}
          </span>
        ))}
      </div>
      <h1 className="verisci-cluster__name kw-drift" style={driftStyle(2)}>
        Verisci<span>.</span>
      </h1>
      <div className="verisci-cluster__row verisci-cluster__row--line">
        {lines.map((word, i) => (
          <span key={`l-${word}-${i}`} className="verisci-cluster__line kw-drift" style={driftStyle(i + 3)}>
            {word}
          </span>
        ))}
      </div>
    </div>
  )
}
