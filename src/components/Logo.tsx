import { Link } from 'react-router-dom'

export function Logo({ to = '/' }: { to?: string }) {
  const src = `${import.meta.env.BASE_URL}sitas-logo-transparent.png`
  return (
    <Link className="logo" to={to} aria-label="SITAS home">
      <span className="logo-symbol">
        <img src={src} alt="" />
      </span>
      <span className="logo-word">SITAS</span>
    </Link>
  )
}
