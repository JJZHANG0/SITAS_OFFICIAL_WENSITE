import { Reveal } from './Reveal'
import { useSite } from '../context/SiteContext'
import { team } from '../data/team'

export function TeamSection() {
  const { t, lang } = useSite()
  return (
    <Reveal className="team-section">
      <p className="eyebrow">{t.teamKicker}</p>
      <h3 className="team-title">{t.teamTitle}</h3>
      <p className="team-lead">{t.teamLead}</p>
      <ul className="team-grid">
        {team.map((m, i) => {
          const name = lang === 'zh' ? m.nameZh : m.nameEn
          const title = lang === 'zh' ? m.titleZh : m.titleEn
          return (
            <li key={i} className="team-card">
              <div className="team-photo">
                {m.photo ? (
                  <img src={m.photo} alt={name} loading="lazy" />
                ) : (
                  <div className="visual-slot team-photo__slot" role="img" aria-label="Portrait TBD">
                    <span className="visual-slot__label">PORTRAIT TBD</span>
                    <span className="visual-slot__hint">0{i + 1}</span>
                  </div>
                )}
              </div>
              <span className="team-name">{name}</span>
              <span className="team-role">{title}</span>
            </li>
          )
        })}
      </ul>
    </Reveal>
  )
}
