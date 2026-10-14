import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react'
import { useSite } from '../context/SiteContext'

export type RgbCell = { r: number; g: number; b: number }

const GRID = 8

function clamp(n: number, min: number, max: number) {
  return n < min ? min : n > max ? max : n
}

function luminance(r: number, g: number, b: number) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Calm idle blue/white diagonal like the reference mock. */
function buildIdleGrid(theme: 'dark' | 'light'): RgbCell[] {
  const cells: RgbCell[] = []
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const t = (x + y) / (GRID * 2 - 2)
      if (theme === 'light') {
        const v = 210 - t * 90
        cells.push({
          r: Math.round(v + 8),
          g: Math.round(v + 4),
          b: Math.round(v - 6 + t * 40),
        })
      } else {
        // light bottom-left → deep navy top-right
        const r = Math.round(200 - t * 175)
        const g = Math.round(210 - t * 160)
        const b = Math.round(230 - t * 90)
        cells.push({
          r: clamp(r, 8, 255),
          g: clamp(g, 12, 255),
          b: clamp(b, 40, 255),
        })
      }
    }
  }
  return cells
}

function mapCoverToImage(
  clientX: number,
  clientY: number,
  rect: DOMRect,
  natW: number,
  natH: number,
) {
  const elW = rect.width
  const elH = rect.height
  const scale = Math.max(elW / natW, elH / natH)
  const dispW = natW * scale
  const dispH = natH * scale
  const offX = (elW - dispW) / 2
  const offY = (elH - dispH) / 2
  const ix = (clientX - rect.left - offX) / scale
  const iy = (clientY - rect.top - offY) / scale
  return {
    x: clamp(Math.floor(ix), 0, natW - 1),
    y: clamp(Math.floor(iy), 0, natH - 1),
  }
}

type Props = {
  /** Element covering the hero image (right panel sample surface). */
  sampleTargetRef: RefObject<HTMLElement | null>
  imageSrc: string
}

/**
 * RGB pixel magnifier: samples the right-panel hero under the cursor and
 * renders an enlarged square grid (with per-cell RGB) on the left.
 */
export function PixelMagnifier({ sampleTargetRef, imageSrc }: Props) {
  const { theme } = useSite()
  const idle = useMemo(() => buildIdleGrid(theme), [theme])
  const [cells, setCells] = useState<RgbCell[]>(idle)
  const cellsRef = useRef(cells)
  cellsRef.current = cells

  const imgRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const readyRef = useRef(false)
  const rafRef = useRef(0)
  const pendingRef = useRef<{ x: number; y: number } | null>(null)

  // Reset to a calm idle grid when theme or source image changes.
  useEffect(() => {
    setCells(buildIdleGrid(theme))
  }, [theme, imageSrc])

  useEffect(() => {
    readyRef.current = false
    const img = new Image()
    img.decoding = 'async'
    img.src = imageSrc
    const onLoad = () => {
      const c = document.createElement('canvas')
      c.width = img.naturalWidth
      c.height = img.naturalHeight
      const ctx = c.getContext('2d', { willReadFrequently: true })
      if (!ctx) return
      ctx.drawImage(img, 0, 0)
      imgRef.current = img
      canvasRef.current = c
      readyRef.current = true
    }
    if (img.complete && img.naturalWidth > 0) onLoad()
    else img.addEventListener('load', onLoad)
    return () => {
      img.removeEventListener('load', onLoad)
      readyRef.current = false
      canvasRef.current = null
      imgRef.current = null
    }
  }, [imageSrc])

  const sampleAt = useCallback((imgX: number, imgY: number) => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img || !readyRef.current) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    const half = Math.floor(GRID / 2)
    const x0 = clamp(imgX - half, 0, img.naturalWidth - GRID)
    const y0 = clamp(imgY - half, 0, img.naturalHeight - GRID)
    let data: ImageData
    try {
      data = ctx.getImageData(x0, y0, GRID, GRID)
    } catch {
      return
    }
    const next: RgbCell[] = new Array(GRID * GRID)
    const d = data.data
    for (let i = 0; i < GRID * GRID; i++) {
      const o = i * 4
      next[i] = { r: d[o], g: d[o + 1], b: d[o + 2] }
    }
    setCells(next)
  }, [])

  const flush = useCallback(() => {
    rafRef.current = 0
    const p = pendingRef.current
    if (!p) return
    pendingRef.current = null
    sampleAt(p.x, p.y)
  }, [sampleAt])

  useEffect(() => {
    const el = sampleTargetRef.current
    if (!el) return

    const onMove = (e: PointerEvent) => {
      const img = imgRef.current
      if (!img || !readyRef.current) return
      const rect = el.getBoundingClientRect()
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        return
      }
      const { x, y } = mapCoverToImage(
        e.clientX,
        e.clientY,
        rect,
        img.naturalWidth,
        img.naturalHeight,
      )
      pendingRef.current = { x, y }
      if (!rafRef.current) rafRef.current = requestAnimationFrame(flush)
    }

    // Keep last sample on leave (no reset).
    el.addEventListener('pointermove', onMove)
    return () => {
      el.removeEventListener('pointermove', onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [sampleTargetRef, flush])

  const focus = Math.floor(GRID / 2) // (4,4) in 0-index for 8×8 — matches ref ~ (5,5) 1-index

  return (
    <div className="pixel-magnifier" aria-hidden="true">
      <div
        className="pixel-magnifier-grid"
        style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }}
      >
        {cells.map((c, i) => {
          const x = i % GRID
          const y = Math.floor(i / GRID)
          const isFocus = x === focus && y === focus
          const lum = luminance(c.r, c.g, c.b)
          const ink = lum > 140 ? 'dark' : 'light'
          return (
            <div
              key={i}
              className={`pixel-magnifier-cell${isFocus ? ' is-focus' : ''}`}
              data-ink={ink}
              style={{ backgroundColor: `rgb(${c.r},${c.g},${c.b})` }}
            >
              <span className="pixel-magnifier-rgb">
                {c.r},{c.g},{c.b}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

