import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Logo } from './Logo'
import { useSite } from '../context/SiteContext'
import type { Lang, Theme } from '../context/SiteContext'

export function Header() {
  const { t, lang, theme, setLang, setTheme } = useSite()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [modeOpen, setModeOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setMenuOpen(false)
    setFeaturesOpen(false)
    setLangOpen(false)
    setModeOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) {
        setFeaturesOpen(false)
        setLangOpen(false)
        setModeOpen(false)
      }
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  const featuresActive =
    location.pathname === '/product' || location.pathname === '/cases'

  const pickLang = (next: Lang) => {
    setLang(next)
    setLangOpen(false)
  }
  const pickTheme = (next: Theme) => {
    setTheme(next)
    setModeOpen(false)
  }

  return (
    <header className="site-header site-header--right" ref={headerRef}>
      <Logo />
      <button
        className="menu-button"
        aria-label="Toggle navigation"
        onClick={() => setMenuOpen((v) => !v)}
        type="button"
      >
        <span />
        <span />
      </button>
      <div className={`header-cluster${menuOpen ? ' open' : ''}`}>
        <nav className={`main-nav${menuOpen ? ' open' : ''}`} aria-label="Main navigation">
          <NavLink to="/introduce" className={({ isActive }) => (isActive ? 'active' : '')}>
            {t.nav[0]}
          </NavLink>
          <div className="nav-drop">
            <button
              type="button"
              className={featuresActive ? 'active' : ''}
              onClick={() => setFeaturesOpen((v) => !v)}
            >
              {t.nav[1]} <span>+</span>
            </button>
            <div className={`drop-menu${featuresOpen ? ' show' : ''}`}>
              <Link to="/product" onClick={() => setFeaturesOpen(false)}>
                {t.product}
              </Link>
              <Link to="/cases" onClick={() => setFeaturesOpen(false)}>
                {t.cases}
              </Link>
            </div>
          </div>
          <NavLink to="/partnership" className={({ isActive }) => (isActive ? 'active' : '')}>
            {t.nav[2]}
          </NavLink>
          <NavLink to="/development" className={({ isActive }) => (isActive ? 'active' : '')}>
            {t.nav[3]}
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
            {t.nav[4]}
          </NavLink>
          <NavLink to="/verify" className={({ isActive }) => (isActive ? 'active' : '')}>
            {t.navVerify}
          </NavLink>
        </nav>
        <div className="utilities">
          <div className="utility">
            <button
              type="button"
              onClick={() => {
                setLangOpen((v) => !v)
                setModeOpen(false)
              }}
            >
              {t.language}
            </button>
            <div className={`utility-menu${langOpen ? ' show' : ''}`}>
              <button type="button" onClick={() => pickLang('en')}>
                English{lang === 'en' ? ' ·' : ''}
              </button>
              <button type="button" onClick={() => pickLang('zh')}>
                中文{lang === 'zh' ? ' ·' : ''}
              </button>
            </div>
          </div>
          <div className="utility">
            <button
              type="button"
              onClick={() => {
                setModeOpen((v) => !v)
                setLangOpen(false)
              }}
            >
              {t.mode}
            </button>
            <div className={`utility-menu${modeOpen ? ' show' : ''}`}>
              <button type="button" onClick={() => pickTheme('light')}>
                {t.light}
                {theme === 'light' ? ' ·' : ''}
              </button>
              <button type="button" onClick={() => pickTheme('dark')}>
                {t.dark}
                {theme === 'dark' ? ' ·' : ''}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
