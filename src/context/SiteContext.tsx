import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
  // Default language = English when localStorage is unset
  const [lang, setLangState] = useState<Lang>(readLang)
  const [theme, setThemeState] = useState<Theme>(readTheme)

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

  const setLang = useCallback((next: Lang) => setLangState(next), [])
  const setTheme = useCallback((next: Theme) => setThemeState(next), [])

  const value = useMemo(
    () => ({ lang, theme, t: copy[lang], setLang, setTheme }),
    [lang, theme, setLang, setTheme],
  )

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be used within SiteProvider')
  return ctx
}
