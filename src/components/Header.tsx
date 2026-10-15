import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Logo } from './Logo'
import { useSite } from '../context/SiteContext'
import type { Lang, Theme } from '../context/SiteContext'

const HOVER_OPEN_MS = 60
const HOVER_CLOSE_MS = 180

export function Header() {
  const { t, lang, theme, setLang, setTheme } = useSite()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDrop, setOpenDrop] = useState<string | null>(null)
  const [langOpen, setLangOpen] = useState(false)
  const [modeOpen, setModeOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const featuresTimer = useRef<number | null>(null)

  useEffect(() => {
    setMenuOpen(false)
    setOpenDrop(null)
    setLangOpen(false)
    setModeOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) {
        setOpenDrop(null)
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

  const openMenu = (id: string) => {
    if (featuresTimer.current) window.clearTimeout(featuresTimer.current)
    featuresTimer.current = window.setTimeout(() => setOpenDrop(id), HOVER_OPEN_MS)
  }
  const closeMenu = () => {
    if (featuresTimer.current) window.clearTimeout(featuresTimer.current)
    featuresTimer.current = window.setTimeout(() => setOpenDrop(null), HOVER_CLOSE_MS)
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
        <NavDrop
          id="introduce"
          label={t.nav[0]}
          to="/introduce"
          active={location.pathname === '/introduce' || location.pathname.startsWith('/product/')}
          open={openDrop === 'introduce'}
          onOpen={openMenu}
          onClose={closeMenu}
          onToggle={(id) => setOpenDrop((v) => (v === id ? null : id))}
          items={[
            { to: '/product/basic', label: t.navBasic, desc: t.descBasic },
            { to: '/product/pro', label: t.navPro, desc: t.descPro },
          ]}
        />
        <NavDrop
          id="features"
          label={t.nav[1]}
          active={location.pathname === '/product' || location.pathname === '/cases'}
          open={openDrop === 'features'}
          onOpen={openMenu}
          onClose={closeMenu}
          onToggle={(id) => setOpenDrop((v) => (v === id ? null : id))}
          items={[
            { to: '/product', label: t.navHighlights, desc: t.descProduct },
            { to: '/cases', label: t.cases, desc: t.descCases },
          ]}
        />
        <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
          {t.nav[4]}
        </NavLink>
        <NavLink to="/partnership" className={({ isActive }) => (isActive ? 'active' : '')}>
          {t.nav[2]}
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

type DropItem = { to: string; label: string; desc: string }

function NavDrop({
  id, label, to, active, open, items, onOpen, onClose, onToggle,
}: {
  id: string
  label: string
  to?: string
  active: boolean
  open: boolean
  items: DropItem[]
  onOpen: (id: string) => void
  onClose: () => void
  onToggle: (id: string) => void
}) {
  const navigate = useNavigate()
  return (
    <div
      className="nav-drop"
      onMouseEnter={() => onOpen(id)}
      onMouseLeave={onClose}
      onFocus={() => onOpen(id)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) onClose()
      }}
    >
      <button
        type="button"
        className={active ? 'active' : ''}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => (to ? navigate(to) : onToggle(id))}
      >
        {label} <span aria-hidden="true">+</span>
      </button>
      <div className={`drop-menu drop-menu--features${open ? ' show' : ''}`}>
        {items.map((it) => (
          <Link key={it.to} to={it.to}>
            {it.label}
            <small>{it.desc}</small>
          </Link>
        ))}
      </div>
    </div>
  )
}
