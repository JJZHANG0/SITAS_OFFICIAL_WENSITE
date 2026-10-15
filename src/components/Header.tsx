import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Logo } from './Logo'
import { useSite } from '../context/SiteContext'
import type { Lang, Theme } from '../context/SiteContext'

const HOVER_OPEN_MS = 60
const HOVER_CLOSE_MS = 180

export function Header() {
  const { t, lang, theme, setLang, setTheme } = useSite()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [modeOpen, setModeOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const featuresTimer = useRef<number | null>(null)

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

  useEffect(
    () => () => {
      if (featuresTimer.current) window.clearTimeout(featuresTimer.current)
    },
    [],
  )

  const featuresActive =
    location.pathname === '/product' ||
    location.pathname.startsWith('/product/') ||
    location.pathname === '/cases'

  const openFeatures = () => {
    if (featuresTimer.current) window.clearTimeout(featuresTimer.current)
    featuresTimer.current = window.setTimeout(() => setFeaturesOpen(true), HOVER_OPEN_MS)
  }
  const closeFeatures = () => {
    if (featuresTimer.current) window.clearTimeout(featuresTimer.current)
    featuresTimer.current = window.setTimeout(() => setFeaturesOpen(false), HOVER_CLOSE_MS)
  }

  const pickLang = (next: Lang) => {
    setLang(next)
    setLangOpen(false)
  }
  const pickTheme = (next: Theme) => {
    setTheme(next)
    setModeOpen(false)
  }

  return (
    <header className="site-header site-header--split" ref={headerRef}>
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

      <nav
        className={`main-nav main-nav--center${menuOpen ? ' open' : ''}`}
        aria-label="Main navigation"
      >
        <NavLink to="/introduce" className={({ isActive }) => (isActive ? 'active' : '')}>
          {t.nav[0]}
        </NavLink>

        <div
          className="nav-drop"
          onMouseEnter={openFeatures}
          onMouseLeave={closeFeatures}
          onFocus={openFeatures}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) closeFeatures()
          }}
        >
          <button
            type="button"
            className={featuresActive ? 'active' : ''}
            aria-expanded={featuresOpen}
            aria-haspopup="true"
            onClick={() => setFeaturesOpen((v) => !v)}
          >
            {t.nav[1]} <span>+</span>
          </button>
          <div className={`drop-menu drop-menu--features${featuresOpen ? ' show' : ''}`}>
            <Link to="/product/basic" onClick={() => setFeaturesOpen(false)}>
              {t.navBasic}
              <small>{t.descBasic}</small>
            </Link>
            <Link to="/product/pro" onClick={() => setFeaturesOpen(false)}>
              {t.navPro}
              <small>{t.descPro}</small>
            </Link>
            <Link to="/product" onClick={() => setFeaturesOpen(false)}>
              {t.product}
              <small>{t.descProduct}</small>
            </Link>
            <Link to="/cases" onClick={() => setFeaturesOpen(false)}>
              {t.cases}
              <small>{t.descCases}</small>
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

      <div className={`utilities utilities--end${menuOpen ? ' open' : ''}`}>
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
    </header>
  )
}
