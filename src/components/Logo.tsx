import { Link } from 'react-router-dom'

export function Logo({ to = '/' }: { to?: string }) {
  return (
    <Link className="logo" to={to} aria-label="SITAS home">
      <span className="logo-symbol">
        <img src="/sitas-logo-transparent.png" alt="" />
      </span>
      <span className="logo-word">SITAS</span>
    </Link>
  )
}
