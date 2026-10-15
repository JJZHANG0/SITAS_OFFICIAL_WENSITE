import { Link } from 'react-router-dom'
import { TechRaster } from '../components/TechRaster'
import { Reveal } from '../components/Reveal'
import { VisualSlot } from '../components/VisualSlot'
import { PageCta } from '../components/PageCta'
import { useSite } from '../context/SiteContext'

export function IntroducePage() {
  const { t } = useSite()

  const modules = [
    {
      key: 'basic',
      tone: 'dark' as const,
      flip: false,
      data: t.moduleBasic,
      cta: { to: '/product', label: t.ctaLearnBasic },
      secondary: { to: '/verify', label: t.ctaVerifyImage },
    },
    {
      key: 'pro',
      tone: 'light' as const,
      flip: true,
      data: t.modulePro,
      cta: { to: '/product', label: t.ctaLearnPro },
      secondary: { to: '/partnership', label: t.ctaSeePartner },
    },
    {
      key: 'app',
      tone: 'dark' as const,
      flip: false,
      data: t.moduleApp,
      cta: { to: '/verify', label: t.ctaVerifyImage },
      secondary: { to: '/cases', label: t.ctaSeeVerify },
    },
  ]

  return (
    <section className="slide page-deep introduce visible" id="introduce">
      <div className="page-no">01 / INTRODUCE</div>

      <div className="page-hero-row">
        <Reveal className="page-hero">
          <p className="eyebrow">{t.introKicker}</p>
          <h1 className="headline-oneline">{t.introTitle}</h1>
          <p className="page-lead">{t.introLead}</p>
        </Reveal>
      </div>

      <div className="intro-split">
        <Reveal className="intro-copy" delay={40}>
          <p>{t.introBody}</p>
          <ol>
            {t.introPoints.map((point, i) => (
              <li key={point}>
                <span>0{i + 1}</span>
                {point}
              </li>
            ))}
          </ol>
        </Reveal>

        <div className="intro-cards">
          <Reveal className="deep-card" delay={60} as="article">
            <span className="deep-card-label">{t.introProblemTitle}</span>
            <p>{t.introProblemBody}</p>
          </Reveal>
          <Reveal className="deep-card deep-card--accent" delay={80} as="article">
            <span className="deep-card-label">{t.introSolutionTitle}</span>
            <p>{t.introSolutionBody}</p>
          </Reveal>
          <Reveal delay={100}>
            <VisualSlot label="VISUAL / MANIFEST SCHEMA" ratio="wide" />
          </Reveal>
        </div>
      </div>

      <Reveal className="pillars-block" delay={40}>
        <p className="eyebrow">{t.introPillarsTitle}</p>
        <div className="pillar-grid">
          {t.introPillars.map(([title, tech, body], i) => (
            <article key={title} className="pillar-card">
              <span className="pillar-idx">0{i + 1}</span>
              <h3>{title}</h3>
              <code className="pillar-tech">{tech}</code>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </Reveal>

      <div className="product-modules" aria-label={t.modulesKicker}>
        <Reveal>
          <p className="eyebrow" style={{ padding: '0 7vw', marginBottom: 0 }}>
            {t.modulesKicker}
          </p>
        </Reveal>
        {modules.map((m) => (
          <Reveal
            key={m.key}
            as="section"
            className={`product-module product-module--${m.tone}${
              m.flip ? ' product-module--flip' : ''
            }`}
          >
            <div className="product-module__copy">
              <p className="product-module__kicker">{m.data.kicker}</p>
              <h2 className="product-module__title">{m.data.title}</h2>
              <p className="product-module__body">{m.data.body}</p>
              <p className="product-module__meta">{m.data.meta}</p>
              <div className="product-module__actions">
                <Link className="cta-btn cta-btn--primary" to={m.cta.to}>
                  {m.cta.label}
                </Link>
                <Link className="cta-btn cta-btn--ghost" to={m.secondary.to}>
                  {m.secondary.label}
                </Link>
              </div>
            </div>
            <div className="product-module__visual">
              <VisualSlot label={m.data.visual} ratio="wide" />
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="page-cta-wrap" delay={40}>
        <PageCta
          secondary={{ to: '/product', label: t.ctaSeeProduct }}
          tertiary={{ to: '/verify', label: t.ctaVerifyImage }}
        />
      </Reveal>

      <div className="pixel-field" aria-hidden="true">
        {Array.from({ length: 32 }).map((_, i) => (
          <i key={i} />
        ))}
      </div>
      <TechRaster />
    </section>
  )
}
