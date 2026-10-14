import { Logo } from '../components/Logo'
import { Reveal } from '../components/Reveal'
import { VisualSlot } from '../components/VisualSlot'
import { PageCta } from '../components/PageCta'
import { useSite } from '../context/SiteContext'

export function AboutPage() {
  const { t } = useSite()
  return (
    <div className="about-stack">
      <section className="slide page-deep company visible" id="about-company">
        <div className="page-no">06 / ABOUT US · COMPANY</div>
        <Reveal className="company-title">
          <p className="eyebrow">{t.companyKicker}</p>
          <h1 className="headline-oneline">
            Verisci<span>.</span>
          </h1>
          <p className="microcopy">{t.companyLine}</p>
        </Reveal>
        <Reveal className="company-statement" delay={100}>
          <p>{t.companyLead}</p>
          <span>{t.companyBody}</span>
          <div className="company-visual">
            <VisualSlot label="VISUAL / LAB + LENS" ratio="wide" />
          </div>
        </Reveal>
        <Reveal className="orb" delay={180}>
          <i />
        </Reveal>
      </section>

      <section className="slide page-deep about visible" id="about-team">
        <div className="page-no">07 / ABOUT US · TEAM</div>
        <div className="page-hero-row">
          <Reveal className="about-inner">
            <p className="eyebrow">{t.aboutKicker}</p>
            <h1 className="headline-oneline">{t.aboutTitle}</h1>
            <p className="page-lead">{t.aboutBody}</p>
            <div className="principles">
              {t.principles.map((p) => (
                <span key={p}>{p}</span>
              ))}
            </div>
          </Reveal>
          <Reveal className="page-hero-visual" delay={80}>
            <VisualSlot label="VISUAL / TEAM / LAB" ratio="square" />
          </Reveal>
        </div>

        <Reveal className="about-team-block" delay={120}>
          <h3>{t.aboutTeamTitle}</h3>
          <p>{t.aboutTeamBody}</p>
          <div className="focus-grid">
            {t.aboutFocus.map(([title, body]) => (
              <article key={title} className="deep-card">
                <span className="deep-card-label">{title}</span>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal className="about-cta-block" delay={160}>
          <p className="eyebrow">{t.ctaPilot}</p>
          <p className="about-cta-lead">
            {t.promiseBody}
          </p>
          <PageCta
            primaryLabel={t.ctaPilot}
            showDownload
            secondary={{ to: '/partnership', label: t.ctaSeePartner }}
            tertiary={{ to: '/product', label: t.ctaSeeProduct }}
          />
        </Reveal>
      </section>

      <footer className="slide final-slide visible" id="promise">
        <Reveal>
          <p className="eyebrow">{t.promise}</p>
          <h1 className="headline-oneline">{t.footer}</h1>
          <p className="promise-body">{t.promiseBody}</p>
          <PageCta
            className="final-cta"
            primaryLabel={t.ctaTalk}
            secondary={{ to: '/partnership', label: t.ctaSeePartner }}
          />
          <Logo />
        </Reveal>
        <div className="footer-line">
          <span>{t.footerTag}</span>
          <span>{t.copyright}</span>
        </div>
      </footer>
    </div>
  )
}
