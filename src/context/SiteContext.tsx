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

export function SiteProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')
  const [theme, setThemeState] = useState<Theme>('dark')

  useEffect(() => {
    const storedLang = localStorage.getItem('sitas-language')
    const storedTheme = localStorage.getItem('sitas-theme')
    if (storedLang === 'en' || storedLang === 'zh') setLangState(storedLang)
    if (storedTheme === 'light' || storedTheme === 'dark') setThemeState(storedTheme)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('sitas-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
    localStorage.setItem('sitas-language', lang)
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
