import { useEffect, useRef, useState } from 'react'
import { useSite } from '../context/SiteContext'
import { LogoMark } from './LogoMark'

/**
 * Full-screen stroke-draw logo overlay (~1.5s) shown when leaving home via Enter / arc.
 */
export function LogoLoader() {
  const { loaderVisible } = useSite()
  const [exiting, setExiting] = useState(false)
  const seen = useRef(false)

  useEffect(() => {
    if (loaderVisible) {
      seen.current = true
      setExiting(false)
      return
    }
    if (!seen.current) return
    setExiting(true)
    const t = window.setTimeout(() => {
      setExiting(false)
      seen.current = false
    }, 200)
    return () => window.clearTimeout(t)
  }, [loaderVisible])

  if (!loaderVisible && !exiting) return null

  return (
    <div
      className={`logo-loader${exiting ? ' logo-loader--out' : ''} logo-loader--in`}
      aria-live="polite"
      aria-busy={loaderVisible}
      role="status"
    >
      <div className="logo-loader__inner">
        <LogoMark animate className="logo-loader__mark" />
        <span className="logo-loader__word">SITAS</span>
      </div>
    </div>
  )
}
