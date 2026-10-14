import { TechRaster } from '../components/TechRaster'
import { useSite } from '../context/SiteContext'

export function IntroducePage() {
  const { t } = useSite()
  return (
    <section className="slide introduce visible" id="introduce">
      <div className="page-no">01 / INTRODUCE</div>
      <div className="intro-grid entrance">
        <div>
          <p className="eyebrow">{t.introKicker}</p>
          <h2>{t.introTitle}</h2>
        </div>
        <div className="intro-copy">
          <p>{t.introBody}</p>
          <ol>
            {t.introPoints.map((point, i) => (
              <li key={point}>
                <span>0{i + 1}</span>
                {point}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="pixel-field" aria-hidden="true">
        {Array.from({ length: 32 }).map((_, i) => (
          <i key={i} />
        ))}
      </div>
      <TechRaster />
    </section>
  )
}
