import { TechRaster } from '../components/TechRaster'
import { useSite } from '../context/SiteContext'

export function ProductPage() {
  const { t } = useSite()
  return (
    <section className="slide product-section visible" id="product">
      <div className="page-no">02 / PRODUCT</div>
      <div className="product-heading entrance">
        <p className="eyebrow">{t.productKicker}</p>
        <h2>{t.productTitle}</h2>
      </div>
      <div className="product-object entrance">
        <div className="device-model">
          <img src="/sitas-logo-transparent.png" alt="" />
          <i />
          <b>SITAS / 01</b>
        </div>
      </div>
      <div className="feature-list entrance">
        {t.features.map(([title, body], i) => (
          <article key={title}>
            <b>0{i + 1}</b>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
      <TechRaster />
    </section>
  )
}
