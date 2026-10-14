import { Reveal } from '../components/Reveal'
import { VisualSlot } from '../components/VisualSlot'
import { PageCta } from '../components/PageCta'
import { useSite } from '../context/SiteContext'

export function DevelopmentPage() {
  const { t } = useSite()
  return (
    <section className="slide page-deep development visible" id="development">
      <div className="page-no">05 / DEVELOPMENT PLAN</div>

      <div className="page-hero-row">
        <Reveal className="page-hero">
          <p className="eyebrow">{t.planKicker}</p>
          <h1 className="headline-oneline">{t.planTitle}</h1>
          <p className="page-lead">{t.planLead}</p>
        </Reveal>
        <Reveal className="page-hero-visual" delay={80}>
          <VisualSlot label="VISUAL / ROADMAP DIAGRAM" ratio="wide" />
        </Reveal>
      </div>

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

      <Reveal className="page-cta-wrap" delay={160}>
        <PageCta
          primaryLabel={t.ctaPilot}
          secondary={{ to: '/partnership', label: t.ctaSeePartner }}
          tertiary={{ to: '/introduce', label: t.ctaSeeIntroduce }}
        />
      </Reveal>
    </section>
  )
}
