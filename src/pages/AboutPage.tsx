import { Logo } from '../components/Logo'
import { useSite } from '../context/SiteContext'

export function AboutPage() {
  const { t } = useSite()
  return (
    <div className="about-stack">
      <section className="slide company visible" id="about-company">
        <div className="page-no">06 / ABOUT US · COMPANY</div>
        <div className="company-title entrance">
          <p className="eyebrow">{t.companyKicker}</p>
          <h2>
            Verisci<span>.</span>
          </h2>
          <p className="microcopy">{t.companyLine}</p>
        </div>
        <div className="company-statement entrance">
          <p>{t.companyLead}</p>
          <span>{t.companyBody}</span>
        </div>
        <div className="orb entrance">
          <i />
        </div>
      </section>

      <section className="slide about visible" id="about-team">
        <div className="page-no">07 / ABOUT US · TEAM</div>
        <div className="about-inner entrance">
          <p className="eyebrow">{t.aboutKicker}</p>
          <h2>{t.aboutTitle}</h2>
          <p>{t.aboutBody}</p>
          <div className="principles">
            {t.principles.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
        </div>
      </section>

      <footer className="slide final-slide visible" id="promise">
        <div className="entrance">
          <p className="eyebrow">{t.promise}</p>
          <h2>{t.footer}</h2>
          <Logo />
        </div>
        <div className="footer-line">
          <span>{t.footerTag}</span>
          <span>{t.copyright}</span>
        </div>
      </footer>
    </div>
  )
}
