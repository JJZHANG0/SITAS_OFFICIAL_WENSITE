import { Reveal } from '../components/Reveal'
import { VisualSlot } from '../components/VisualSlot'
import { PageCta } from '../components/PageCta'
import { useSite } from '../context/SiteContext'

export function PartnershipPage() {
  const { t } = useSite()
  return (
    <section className="slide page-deep partnership visible" id="partnership">
      <div className="page-no">04 / PARTNERSHIP</div>

      <div className="page-hero-row">
        <Reveal className="page-hero">
          <p className="eyebrow">{t.partnerKicker}</p>
          <h1 className="headline-oneline">{t.partnerTitle}</h1>
          <p className="page-lead">{t.partnerLead}</p>
        </Reveal>
        <Reveal className="page-hero-visual" delay={80}>
          <VisualSlot label="VISUAL / ECOSYSTEM MAP" ratio="wide" />
        </Reveal>
      </div>

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

      <Reveal delay={160}>
        <VisualSlot label="VISUAL / PARTNERSHIP PATH" ratio="wide" />
      </Reveal>

      <Reveal className="page-cta-wrap" delay={200}>
        <PageCta
          primaryLabel={t.ctaPilot}
          secondary={{ to: '/product', label: t.ctaSeeProduct }}
          tertiary={{ to: '/about', label: t.nav[4] }}
        />
      </Reveal>
    </section>
  )
}
