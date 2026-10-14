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
 * IntersectionObserver entrance reveal — performant, respects reduced motion.
 * Above-the-fold nodes enter immediately (no blank flash).
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
    if (rect.top < vh * 0.92 && rect.bottom > vh * 0.02) {
      // Stagger via CSS --reveal-delay still applies once class is set
      if (delay > 0) {
        const id = window.setTimeout(revealNow, delay)
        return () => window.clearTimeout(id)
      }
      revealNow()
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            revealNow()
            io.unobserve(el)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delay])

  return (
    <Tag
      ref={ref as never}
      className={`reveal${className ? ` ${className}` : ''}`}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}
