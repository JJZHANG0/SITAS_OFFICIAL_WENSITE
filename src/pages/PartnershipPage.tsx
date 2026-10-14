import { Arrow } from '../components/Arrow'
import { Reveal } from '../components/Reveal'
import { useSite } from '../context/SiteContext'

export function PartnershipPage() {
  const { t } = useSite()
  return (
    <section className="slide page-deep partnership visible" id="partnership">
      <div className="page-no">04 / PARTNERSHIP</div>

      <Reveal className="page-hero">
        <p className="eyebrow">{t.partnerKicker}</p>
        <h2>{t.partnerTitle}</h2>
        <p className="page-lead">{t.partnerLead}</p>
      </Reveal>

      <div className="partner-grid partner-grid--rich">
        {t.partners.map(([title, body, detail], i) => (
          <Reveal key={title} as="article" delay={80 + i * 80}>
            <span>0{i + 1}</span>
            <h3>{title}</h3>
            <p className="partner-hook">{body}</p>
            <p className="partner-detail">{detail}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="partner-cta" delay={200}>
        <a className="outline-button" href="mailto:partnerships@sitas.bio">
          {t.contact} <Arrow />
        </a>
        <span className="contact-hint">{t.contactHint}</span>
      </Reveal>
    </section>
  )
}
