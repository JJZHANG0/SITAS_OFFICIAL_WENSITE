import { Arrow } from '../components/Arrow'
import { useSite } from '../context/SiteContext'

export function PartnershipPage() {
  const { t } = useSite()
  return (
    <section className="slide partnership visible" id="partnership">
      <div className="page-no">04 / PARTNERSHIP</div>
      <div className="entrance">
        <p className="eyebrow">{t.partnerKicker}</p>
        <h2>{t.partnerTitle}</h2>
      </div>
      <div className="partner-grid entrance">
        {t.partners.map(([title, body], i) => (
          <article key={title}>
            <span>0{i + 1}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
      <a className="outline-button entrance" href="mailto:partnerships@sitas.bio">
        {t.contact} <Arrow />
      </a>
    </section>
  )
}
