import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { copy, type Copy, type Lang } from '../i18n/copy'

export type { Lang }
export type Theme = 'dark' | 'light'

type SiteContextValue = {
  lang: Lang
  theme: Theme
  t: Copy
  setLang: (lang: Lang) => void
  setTheme: (theme: Theme) => void
  /** Logo stroke loader overlay (home → inner page) */
  loaderVisible: boolean
  /** Show ~1.5s logo loader, run action early so destination mounts under overlay */
  runWithLogoLoader: (action: () => void) => void
}

const SiteContext = createContext<SiteContextValue | null>(null)

function readLang(): Lang {
  try {
    const stored = localStorage.getItem('sitas-language')
    if (stored === 'en' || stored === 'zh') return stored
  } catch {
    /* ignore */
  }
  return 'en'
}

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem('sitas-theme')
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* ignore */
  }
  return 'dark'
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readLang)
  const [theme, setThemeState] = useState<Theme>(readTheme)
  const [loaderVisible, setLoaderVisible] = useState(false)
  const loaderTimer = useRef<number | null>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('sitas-theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
    try {
      localStorage.setItem('sitas-language', lang)
    } catch {
      /* ignore */
    }
  }, [lang])

  useEffect(
    () => () => {
      if (loaderTimer.current) window.clearTimeout(loaderTimer.current)
    },
    [],
  )

  const setLang = useCallback((next: Lang) => setLangState(next), [])
  const setTheme = useCallback((next: Theme) => setThemeState(next), [])

  const runWithLogoLoader = useCallback((action: () => void) => {
    if (loaderTimer.current) window.clearTimeout(loaderTimer.current)
    setLoaderVisible(true)
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Navigate quickly so the destination mounts under the overlay
    window.setTimeout(() => {
      action()
    }, reduce ? 40 : 90)
    // Hide after draw + brief hold (~1.5–1.8s total)
    loaderTimer.current = window.setTimeout(
      () => {
        setLoaderVisible(false)
        loaderTimer.current = null
      },
      reduce ? 280 : 1520,
    )
  }, [])

  const value = useMemo(
    () => ({
      lang,
      theme,
      t: copy[lang],
      setLang,
      setTheme,
      loaderVisible,
      runWithLogoLoader,
    }),
    [lang, theme, setLang, setTheme, loaderVisible, runWithLogoLoader],
  )

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be used within SiteProvider')
  return ctx
}
