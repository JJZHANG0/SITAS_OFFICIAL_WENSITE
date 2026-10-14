import { Reveal } from '../components/Reveal'
import { useSite } from '../context/SiteContext'

export function DevelopmentPage() {
  const { t } = useSite()
  return (
    <section className="slide page-deep development visible" id="development">
      <div className="page-no">05 / DEVELOPMENT PLAN</div>

      <Reveal className="page-hero">
        <p className="eyebrow">{t.planKicker}</p>
        <h2>{t.planTitle}</h2>
        <p className="page-lead">{t.planLead}</p>
      </Reveal>

      <ol className="timeline timeline--rich">
        {t.plans.map(([when, title, body, tech, deliver], i) => (
          <Reveal key={title} as="li" delay={80 + i * 100}>
            <span className="timeline-when">{when}</span>
            <div className="timeline-main">
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
            <div className="timeline-meta">
              <code>{tech}</code>
              <span>{deliver}</span>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}
