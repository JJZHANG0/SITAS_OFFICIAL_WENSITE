import { useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { useSite } from '../context/SiteContext'

export function Layout() {
  const { lang, theme } = useSite()
  const { pathname } = useLocation()
  // Instant (non-smooth) reset so the new page starts at top without fighting user input
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return (
    <main className="site" data-theme={theme} data-lang={lang}>
      <Header />
      <div className="page-shell">
        <Outlet />
      </div>
    </main>
  )
}
