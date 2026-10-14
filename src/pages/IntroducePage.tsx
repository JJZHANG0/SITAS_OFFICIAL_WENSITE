import { TechRaster } from '../components/TechRaster'
import { Reveal } from '../components/Reveal'
import { useSite } from '../context/SiteContext'

export function IntroducePage() {
  const { t } = useSite()
  return (
    <section className="slide page-deep introduce visible" id="introduce">
      <div className="page-no">01 / INTRODUCE</div>

      <Reveal className="page-hero">
        <p className="eyebrow">{t.introKicker}</p>
        <h2>{t.introTitle}</h2>
        <p className="page-lead">{t.introLead}</p>
      </Reveal>

      <div className="intro-split">
        <Reveal className="intro-copy" delay={80}>
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
          <Reveal className="deep-card" delay={120} as="article">
            <span className="deep-card-label">{t.introProblemTitle}</span>
            <p>{t.introProblemBody}</p>
          </Reveal>
          <Reveal className="deep-card deep-card--accent" delay={200} as="article">
            <span className="deep-card-label">{t.introSolutionTitle}</span>
            <p>{t.introSolutionBody}</p>
          </Reveal>
        </div>
      </div>

      <Reveal className="pillars-block" delay={100}>
        <p className="eyebrow">{t.introPillarsTitle}</p>
        <div className="pillar-grid">
          {t.introPillars.map(([title, tech, body], i) => (
            <article key={title} className="pillar-card" style={{ animationDelay: `${i * 80}ms` }}>
              <span className="pillar-idx">0{i + 1}</span>
              <h3>{title}</h3>
              <code className="pillar-tech">{tech}</code>
              <p>{body}</p>
            </article>
          ))}
        </div>
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
