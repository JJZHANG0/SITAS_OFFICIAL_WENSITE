import { Link } from 'react-router-dom'
import { Arrow } from './Arrow'
import { useSite } from '../context/SiteContext'

type Props = {
  /** Extra class on the wrap */
  className?: string
  /** Override primary mailto label */
  primaryLabel?: string
  /** Show download overview placeholder */
  showDownload?: boolean
  /** Secondary in-app link */
  secondary?: { to: string; label: string }
  tertiary?: { to: string; label: string }
}

export function PageCta({
  className = '',
  primaryLabel,
  showDownload = false,
  secondary,
  tertiary,
}: Props) {
  const { t } = useSite()
  return (
    <div className={`page-cta${className ? ` ${className}` : ''}`}>
      <a className="cta-btn cta-btn--primary" href="mailto:partnerships@sitas.bio">
        {primaryLabel ?? t.ctaPrimary} <Arrow />
      </a>
      {secondary ? (
        <Link className="cta-btn cta-btn--ghost" to={secondary.to}>
          {secondary.label}
        </Link>
      ) : null}
      {tertiary ? (
        <Link className="cta-btn cta-btn--ghost" to={tertiary.to}>
          {tertiary.label}
        </Link>
      ) : null}
      {showDownload ? (
        <a className="cta-btn cta-btn--ghost" href="#overview" onClick={(e) => e.preventDefault()}>
          {t.ctaDownload}
        </a>
      ) : null}
      <span className="contact-hint">{t.contactHint}</span>
    </div>
  )
}
