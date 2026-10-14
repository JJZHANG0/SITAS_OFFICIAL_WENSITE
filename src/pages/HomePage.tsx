import { useCallback, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArcPicker, type ArcDestination } from '../components/ArcPicker'
import { PixelMagnifier } from '../components/PixelMagnifier'
import { useSite } from '../context/SiteContext'

export function HomePage() {
  const { t, lang, theme, setLang, setTheme } = useSite()
  const navigate = useNavigate()
  const [leaving, setLeaving] = useState(false)
  const sampleRef = useRef<HTMLElement>(null)

  const heroSrc = useMemo(() => {
    const file =
      theme === 'light' ? 'sitas-hero-light-v9.png' : 'sitas-hero-dark-v9.png'
    return `${import.meta.env.BASE_URL}${file}`
  }, [theme])

  const destinations: ArcDestination[] = useMemo(
    () => [
      { id: 'introduce', label: t.navHome[0], path: '/introduce' },
      { id: 'product', label: t.navHome[1], path: '/product' },
      { id: 'cases', label: t.navHome[2], path: '/cases' },
      { id: 'partnership', label: t.navHome[3], path: '/partnership' },
      { id: 'development', label: t.navHome[4], path: '/development' },
      { id: 'about', label: t.navHome[5], path: '/about' },
    ],
    [t],
  )

  const onEnter = useCallback(
    (item: ArcDestination) => {
      if (leaving) return
      setLeaving(true)
      window.setTimeout(() => {
        navigate(item.path)
      }, 780)
    },
    [leaving, navigate],
  )

  return (
    <main
      className={`home-immersive${leaving ? ' is-leaving' : ''}`}
      data-theme={theme}
      data-lang={lang}
    >
      <div className={`home-bloom${leaving ? ' active' : ''}`} aria-hidden="true" />

      <section className="home-left">
        <PixelMagnifier sampleTargetRef={sampleRef} imageSrc={heroSrc} />
        <div className="home-brand">
          <p className="eyebrow">{t.heroKicker}</p>
          <h1>
            {t.heroA}
            <br />
            <em>{t.heroB}</em>
          </h1>
        </div>
        <div className="home-seam" />
      </section>

      <section className="home-right" ref={sampleRef}>
        <div
          className="home-hero-bg"
          style={{ backgroundImage: `url(${heroSrc})` }}
          aria-hidden="true"
        />
        <div className="home-right-veil" aria-hidden="true" />
        <ArcPicker
          items={destinations}
          enterLabel={t.enter}
          onEnter={onEnter}
          disabled={leaving}
        />
      </section>

      <div className="home-utils">
        <button type="button" onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}>
          {lang === 'en' ? '中文' : 'EN'}
        </button>
        <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? t.light : t.dark}
        </button>
      </div>
    </main>
  )
}
