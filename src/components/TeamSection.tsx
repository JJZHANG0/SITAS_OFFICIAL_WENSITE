import { useState, type CSSProperties } from 'react'
import { Reveal } from './Reveal'
import { useSite } from '../context/SiteContext'
import { team } from '../data/team'

export function TeamSection() {
  const { t, lang } = useSite()
  const [flipped, setFlipped] = useState<number | null>(null)
  return (
    <Reveal className="team-section">
      <p className="eyebrow">{t.teamKicker}</p>
      <h3 className="team-title">{t.teamTitle}</h3>
      <p className="team-lead">{t.teamLead}</p>
      <ul className="team-grid">
        {team.map((m, i) => {
          const zh = lang === 'zh'
          const name = zh ? m.nameZh : m.nameEn
          const title = zh ? m.titleZh : m.titleEn
          const bio = zh ? m.bioZh : m.bioEn
          return (
            <li key={i} className="team-card" style={{ '--i': i } as CSSProperties}>
              <button
                type="button"
                className={`team-flip${flipped === i ? ' is-flipped' : ''}`}
                aria-pressed={flipped === i}
                aria-label={`${name} · ${title}`}
                onClick={() => setFlipped((v) => (v === i ? null : i))}
              >
                <span className="team-face team-face--front">
                  <img src={m.photo} alt="" loading="lazy" />
                  <span className="team-caption">
                    <span className="team-name">{name}</span>
                    <span className="team-role">{title}</span>
                  </span>
                </span>
                <span className="team-face team-face--back">
                  <span className="team-idx">0{i + 1}</span>
                  <span className="team-role">{title}</span>
                  <span className="team-name">{name}</span>
                  <span className="team-bio">{bio}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </Reveal>
  )
}
