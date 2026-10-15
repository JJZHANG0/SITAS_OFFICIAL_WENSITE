import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { VisualSlot } from '../components/VisualSlot'
import { PageCta } from '../components/PageCta'
import { useSite } from '../context/SiteContext'

export type ProductTier = 'basic' | 'pro'

export function ProductDetailPage({ tier }: { tier: ProductTier }) {
  const { t } = useSite()
  const d = tier === 'basic' ? t.detailBasic : t.detailPro
  const other = tier === 'basic'
    ? { to: '/product/pro', label: t.ctaLearnPro }
    : { to: '/product/basic', label: t.ctaLearnBasic }

  return (
    <section className="slide page-deep product-detail visible" id={`product-${tier}`}>
      <div className="page-no">{d.pageNo}</div>

      <div className="pd-hero">
        <Reveal className="pd-hero__copy">
          <p className="eyebrow">{d.kicker}</p>
          <h1 className="headline-oneline">{d.title}</h1>
          <p className="page-lead">{d.lead}</p>
          <div className="pd-hero__actions">
            <a className="cta-btn cta-btn--primary cta-btn--wide" href="mailto:partnerships@sitas.bio">
              {t.ctaPilot}
            </a>
            <Link className="cta-btn cta-btn--ghost" to={other.to}>
              {other.label}
            </Link>
          </div>
        </Reveal>
        <Reveal className="pd-hero__visual" delay={60}>
          <VisualSlot label={d.heroVisual} ratio="wide" />
        </Reveal>
      </div>

      <Reveal className="pd-section" delay={40}>
        <p className="eyebrow">{d.specsTitle}</p>
        <div className="pd-spec-grid">
          {d.specs.map(([label, value]) => (
            <article key={label} className="pd-spec">
              <span className="pd-spec__label">{label}</span>
              <strong className="pd-spec__value">{value}</strong>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal className="pd-section" delay={40}>
        <p className="eyebrow">{d.howTitle}</p>
        <div className="pd-how">
          {d.howSteps.map(([title, body], i) => (
            <article key={title} className="pd-how__step">
              <span className="pd-how__idx">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <div className="pd-how__visual">
          <VisualSlot label={d.howVisual} ratio="wide" />
        </div>
      </Reveal>

      <Reveal className="pd-section" delay={40}>
        <p className="eyebrow">{d.forTitle}</p>
        <div className="pd-for-grid">
          {d.forItems.map(([title, body]) => (
            <article key={title} className="deep-card">
              <span className="deep-card-label">{title}</span>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal className="page-cta-wrap pd-cta" delay={40}>
        <p className="pd-cta__lead">{d.ctaLead}</p>
        <PageCta
          primaryLabel={t.ctaTalk}
          secondary={{ to: '/verify', label: t.ctaVerifyImage }}
          tertiary={{ to: '/partnership', label: t.ctaSeePartner }}
        />
      </Reveal>
    </section>
  )
}
