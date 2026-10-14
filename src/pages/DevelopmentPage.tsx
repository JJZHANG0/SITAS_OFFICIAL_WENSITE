import { useSite } from '../context/SiteContext'

export function DevelopmentPage() {
  const { t } = useSite()
  return (
    <section className="slide development visible" id="development">
      <div className="page-no">05 / DEVELOPMENT PLAN</div>
      <div className="entrance">
        <p className="eyebrow">{t.planKicker}</p>
        <h2>{t.planTitle}</h2>
      </div>
      <ol className="timeline entrance">
        {t.plans.map(([when, title, body]) => (
          <li key={title}>
            <span>{when}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
