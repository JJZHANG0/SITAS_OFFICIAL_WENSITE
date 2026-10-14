import { TechRaster } from '../components/TechRaster'
import { Reveal } from '../components/Reveal'
import { VisualSlot } from '../components/VisualSlot'
import { PageCta } from '../components/PageCta'
import { useSite } from '../context/SiteContext'

export function ProductPage() {
  const { t } = useSite()
  const logoSrc = `${import.meta.env.BASE_URL}sitas-logo-transparent.png`

  return (
    <section className="slide page-deep product-section visible" id="product">
      <div className="page-no">02 / PRODUCT</div>

      <div className="page-hero-row">
        <Reveal className="product-heading page-hero">
          <p className="eyebrow">{t.productKicker}</p>
          <h1 className="headline-oneline">{t.productTitle}</h1>
          <p className="page-lead">{t.productLead}</p>
        </Reveal>
      </div>

      <Reveal className="flow-block" delay={60}>
        <p className="eyebrow">{t.productFlowTitle}</p>
        <div className="flow-rail">
          {t.productFlow.map(([title, body], i) => (
            <article key={title} className="flow-step">
              <b>0{i + 1}</b>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <div className="flow-visual">
          <VisualSlot label="VISUAL / CAPTURE → ATTEST → VERIFY" ratio="wide" />
        </div>
      </Reveal>

      <div className="product-body-grid">
        <Reveal className="product-object" delay={80}>
          <div className="device-model">
            <img src={logoSrc} alt="" />
            <i />
            <b>SITAS / 01</b>
          </div>
        </Reveal>

        <Reveal className="feature-list" delay={120}>
          {t.features.map(([title, body], i) => (
            <article key={title}>
              <b>0{i + 1}</b>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </Reveal>
      </div>

      <div className="spec-grid">
        <Reveal className="deep-card" delay={40} as="article">
          <span className="deep-card-label">{t.productHwTitle}</span>
          <p>{t.productHwBody}</p>
        </Reveal>
        <Reveal className="deep-card" delay={100} as="article">
          <span className="deep-card-label">{t.productSwTitle}</span>
          <p>{t.productSwBody}</p>
        </Reveal>
        <Reveal className="deep-card" delay={160} as="article">
          <span className="deep-card-label">{t.productAlcoaTitle}</span>
          <p>{t.productAlcoaBody}</p>
        </Reveal>
        <Reveal className="deep-card deep-card--accent" delay={220} as="article">
          <span className="deep-card-label">{t.productSecureTitle}</span>
          <p>{t.productSecureBody}</p>
        </Reveal>
      </div>

      <Reveal className="page-cta-wrap" delay={120}>
        <PageCta
          secondary={{ to: '/cases', label: t.ctaSeeVerify }}
          tertiary={{ to: '/partnership', label: t.ctaSeePartner }}
        />
      </Reveal>

      <TechRaster />
    </section>
  )
}
