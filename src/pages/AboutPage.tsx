import { Logo } from '../components/Logo'
import { Reveal } from '../components/Reveal'
import { useSite } from '../context/SiteContext'

export function AboutPage() {
  const { t } = useSite()
  return (
    <div className="about-stack">
      <section className="slide page-deep company visible" id="about-company">
        <div className="page-no">06 / ABOUT US · COMPANY</div>
        <Reveal className="company-title">
          <p className="eyebrow">{t.companyKicker}</p>
          <h2>
            Verisci<span>.</span>
          </h2>
          <p className="microcopy">{t.companyLine}</p>
        </Reveal>
        <Reveal className="company-statement" delay={100}>
          <p>{t.companyLead}</p>
          <span>{t.companyBody}</span>
        </Reveal>
        <Reveal className="orb" delay={180}>
          <i />
        </Reveal>
      </section>

      <section className="slide page-deep about visible" id="about-team">
        <div className="page-no">07 / ABOUT US · TEAM</div>
        <Reveal className="about-inner">
          <p className="eyebrow">{t.aboutKicker}</p>
          <h2>{t.aboutTitle}</h2>
          <p>{t.aboutBody}</p>
          <div className="principles">
            {t.principles.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
        </Reveal>

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
      </section>

      <footer className="slide final-slide visible" id="promise">
        <Reveal>
          <p className="eyebrow">{t.promise}</p>
          <h2>{t.footer}</h2>
          <p className="promise-body">{t.promiseBody}</p>
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
