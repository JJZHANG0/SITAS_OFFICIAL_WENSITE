import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { useSite } from '../context/SiteContext'

export function Layout() {
  const { lang, theme } = useSite()
  return (
    <main className="site" data-theme={theme} data-lang={lang}>
      <Header />
      <div className="page-shell">
        <Outlet />
      </div>
    </main>
  )
}
