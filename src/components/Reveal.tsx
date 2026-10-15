import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react'

type Props = {
  children: ReactNode
  className?: string
  /** Stagger delay in ms */
  delay?: number
  as?: 'div' | 'section' | 'article' | 'li' | 'header' | 'footer'
}

/**
 * Light IntersectionObserver entrance — no scroll-jacking.
 * Soft motion; above-the-fold enters immediately.
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: Props) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in')
      return
    }

    const revealNow = () => el.classList.add('is-in')

    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight || document.documentElement.clientHeight
    // Generous viewport check so content is rarely "stuck" invisible mid-scroll
    if (rect.top < vh * 0.98 && rect.bottom > 0) {
      if (delay > 0) {
        const id = window.setTimeout(revealNow, Math.min(delay, 120))
        return () => window.clearTimeout(id)
      }
      revealNow()
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (delay > 0) {
              window.setTimeout(revealNow, Math.min(delay, 120))
            } else {
              revealNow()
            }
            io.unobserve(el)
          }
        }
      },
      // Early trigger; no negative rootMargin that delays visibility
      { threshold: 0.01, rootMargin: '48px 0px 48px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delay])

  return (
    <Tag
      ref={ref as never}
      className={`reveal${className ? ` ${className}` : ''}`}
      style={
        delay
          ? ({ '--reveal-delay': `${Math.min(delay, 120)}ms` } as CSSProperties)
          : undefined
      }
    >
      {children}
    </Tag>
  )
}
