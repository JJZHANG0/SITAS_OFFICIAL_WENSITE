import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'

export type ArcDestination = {
  id: string
  label: string
  path: string
}

type Props = {
  items: ArcDestination[]
  enterLabel: string
  onEnter: (item: ArcDestination) => void
  disabled?: boolean
}

/**
 * Half-arc destination wheel. Mouse wheel / trackpad rotates selection;
 * click or Enter commits the selected route.
 *
 * Geometry: circle center sits near the right edge; selected item sits
 * at the leftmost point of the arc (toward the screen center / seam).
 */
export function ArcPicker({ items, enterLabel, onEnter, disabled }: Props) {
  const [index, setIndex] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const accum = useRef(0)

  const n = items.length
  const selected = items[((index % n) + n) % n]

  const rotate = useCallback(
    (delta: number) => {
      if (disabled || n === 0) return
      setIndex((i) => {
        let next = i + delta
        while (next < 0) next += n
        while (next >= n) next -= n
        return next
      })
    },
    [disabled, n],
  )

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (disabled) return
      accum.current += e.deltaY
      const step = 48
      while (accum.current >= step) {
        rotate(1)
        accum.current -= step
      }
      while (accum.current <= -step) {
        rotate(-1)
        accum.current += step
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [rotate, disabled])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (disabled) return
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        rotate(1)
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        rotate(-1)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (selected) onEnter(selected)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [rotate, disabled, selected, onEnter])

  const positions = useMemo(() => {
    return items.map((item, i) => {
      let offset = i - (((index % n) + n) % n)
      if (offset > n / 2) offset -= n
      if (offset < -n / 2) offset += n
      // ~20° per step; θ=0 → due west (toward seam)
      const rad = (offset * 20 * Math.PI) / 180
      const x = -Math.cos(rad) // -1 at selection (leftward)
      const y = Math.sin(rad)
      const active = offset === 0
      const dist = Math.abs(offset)
      return { item, x, y, active, dist }
    })
  }, [items, index, n])

  return (
    <div
      className="arc-picker"
      ref={wrapRef}
      tabIndex={0}
      role="listbox"
      aria-label="Destinations"
    >
      <div className="arc-stage">
        <div className="arc-rail" aria-hidden="true" />
        {positions.map(({ item, x, y, active, dist }) => (
          <button
            key={item.id}
            type="button"
            role="option"
            aria-selected={active}
            className={`arc-item${active ? ' is-active' : ''}${dist > 2 ? ' is-far' : ''}`}
            style={{ '--ax': x, '--ay': y, '--dist': dist } as CSSProperties}
            onClick={() => {
              if (disabled) return
              if (active) onEnter(item)
              else {
                const target = items.findIndex((it) => it.id === item.id)
                if (target >= 0) setIndex(target)
              }
            }}
          >
            <span className="arc-label">{item.label}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="arc-enter"
        disabled={disabled || !selected}
        onClick={() => selected && onEnter(selected)}
      >
        <span>{enterLabel}</span>
        <i className="arc-enter-arrow" aria-hidden="true" />
      </button>
    </div>
  )
}
