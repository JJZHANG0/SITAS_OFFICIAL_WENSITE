import { TechRaster } from '../components/TechRaster'
import { Reveal } from '../components/Reveal'
import { useSite } from '../context/SiteContext'

export function CasesPage() {
  const { t } = useSite()
  return (
    <section className="slide page-deep cases visible" id="cases">
      <div className="page-no">03 / CASE STUDIES</div>

      <Reveal className="cases-copy page-hero">
        <p className="eyebrow">{t.caseKicker}</p>
        <h2>{t.caseTitle}</h2>
        <p className="page-lead">{t.caseLead}</p>
      </Reveal>

      <div className="cases-stage">
        <Reveal className="comparison" delay={80}>
          <div className="cell original">
            <span>{t.original}</span>
          </div>
          <div className="cell altered">
            <span>{t.altered}</span>
            <i />
          </div>
          <div className="scan-line" />
        </Reveal>

        <Reveal className="cases-side" delay={140}>
          <div className="result-card result-card--inline">
            <span>{t.caseStudiesLabel}</span>
            <strong>{t.result}</strong>
            <i>{t.continuity}</i>
          </div>
          <div className="metric-card">
            <span>{t.caseMetricLabel}</span>
            <strong>{t.caseMetricValue}</strong>
            <div className="metric-bar" aria-hidden="true">
              <i style={{ width: '62%' }} />
            </div>
          </div>
        </Reveal>
      </div>

      <div className="cases-detail">
        <Reveal className="deep-card" delay={60} as="article">
          <span className="deep-card-label">{t.caseLocalizeTitle}</span>
          <p>{t.caseLocalizeBody}</p>
        </Reveal>
        <Reveal className="deep-card deep-card--accent" delay={120} as="article">
          <span className="deep-card-label">{t.caseVerifyTitle}</span>
          <ol className="verify-steps">
            {t.caseVerifySteps.map((step, i) => (
              <li key={step}>
                <span>0{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>

      <TechRaster />
    </section>
  )
}
