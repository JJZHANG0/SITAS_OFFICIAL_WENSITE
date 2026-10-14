import { TechRaster } from '../components/TechRaster'
import { useSite } from '../context/SiteContext'

export function CasesPage() {
  const { t } = useSite()
  return (
    <section className="slide cases visible" id="cases">
      <div className="page-no">03 / CASE STUDIES</div>
      <div className="cases-copy entrance">
        <p className="eyebrow">{t.caseKicker}</p>
        <h2>{t.caseTitle}</h2>
      </div>
      <div className="comparison entrance">
        <div className="cell original">
          <span>{t.original}</span>
        </div>
        <div className="cell altered">
          <span>{t.altered}</span>
          <i />
        </div>
        <div className="scan-line" />
      </div>
      <div className="result-card entrance">
        <span>{t.caseStudiesLabel}</span>
        <strong>{t.result}</strong>
        <i>{t.continuity}</i>
      </div>
      <TechRaster />
    </section>
  )
}
