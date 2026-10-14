import { Link } from 'react-router-dom'
import { Arrow } from '../components/Arrow'
import { useSite } from '../context/SiteContext'

export function HomePage() {
  const { t } = useSite()
  return (
    <section className="slide hero visible" id="hero">
      <div className="hero-visual" />
      <div className="hero-copy entrance">
        <p className="eyebrow">{t.heroKicker}</p>
        <h1>
          {t.heroA}
          <br />
          <em>{t.heroB}</em>
        </h1>
        <div className="reserved-copy">
          <span />
          <span />
        </div>
        <Link className="text-link" to="/introduce">
          {t.discover} <Arrow />
        </Link>
      </div>
      <div className="scroll-cue">
        <span>{t.scroll}</span>
        <i />
      </div>
    </section>
  )
}
