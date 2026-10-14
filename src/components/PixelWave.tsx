import { useEffect, useRef } from 'react'
import { useSite } from '../context/SiteContext'

/** Dense RGB sensor-grid with rolling wave shimmer (~60fps, ImageData). */
export function PixelWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useSite()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const off = document.createElement('canvas')
    const octx = off.getContext('2d')
    if (!octx) return

    let raf = 0
    let running = true
    let cols = 0
    let rows = 0
    let cell = 4
    let cssW = 0
    let cssH = 0
    let buffer: ImageData | null = null
    let last = 0
    const light = theme === 'light'
    const t0 = performance.now()

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      cssW = parent.clientWidth
      cssH = parent.clientHeight
      canvas.width = Math.max(1, Math.floor(cssW * dpr))
      canvas.height = Math.max(1, Math.floor(cssH * dpr))
      canvas.style.width = `${cssW}px`
      canvas.style.height = `${cssH}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      cell = Math.max(3, Math.min(5, Math.round(Math.min(cssW, cssH) / 140)))
      cols = Math.max(1, Math.ceil(cssW / cell))
      rows = Math.max(1, Math.ceil(cssH / cell))
      off.width = cols
      off.height = rows
      buffer = octx.createImageData(cols, rows)
    }

    resize()
    const ro = new ResizeObserver(resize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    const draw = (now: number) => {
      if (!running) return
      raf = requestAnimationFrame(draw)
      if (now - last < 14) return
      last = now
      if (!buffer || cols < 1 || rows < 1) return

      const t = (now - t0) / 1000
      const data = buffer.data

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const wave =
            Math.sin(x * 0.19 + t * 1.55) * 0.5 +
            Math.sin(y * 0.23 - t * 1.05) * 0.35 +
            Math.sin((x + y) * 0.08 + t * 0.72) * 0.25
          const pulse = (wave + 1) * 0.5

          let r = 40 + pulse * 175 + Math.sin(t * 2.05 + x * 0.28) * 28
          let g = 48 + pulse * 155 + Math.sin(t * 1.65 + y * 0.24 + 2.1) * 32
          let b = 70 + pulse * 135 + Math.sin(t * 2.35 + (x - y) * 0.18 + 4.2) * 38

          const seam = x / cols
          const fade = seam > 0.72 ? 1 - (seam - 0.72) / 0.28 : 1
          const base = light ? 0.28 : 0.18
          let a = (base + pulse * (light ? 0.5 : 0.65)) * fade

          if (light) {
            r = 210 + (r - 128) * 0.4
            g = 208 + (g - 128) * 0.4
            b = 200 + (b - 128) * 0.45
          }

          const i = (y * cols + x) * 4
          data[i] = r < 0 ? 0 : r > 255 ? 255 : r | 0
          data[i + 1] = g < 0 ? 0 : g > 255 ? 255 : g | 0
          data[i + 2] = b < 0 ? 0 : b > 255 ? 255 : b | 0
          a *= 255
          data[i + 3] = a < 0 ? 0 : a > 255 ? 255 : a | 0
        }
      }

      octx.putImageData(buffer, 0, 0)
      ctx.fillStyle = light ? '#f4f3ee' : '#050606'
      ctx.fillRect(0, 0, cssW, cssH)
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(off, 0, 0, cols, rows, 0, 0, cols * cell, rows * cell)
    }

    raf = requestAnimationFrame(draw)
    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [theme])

  return <canvas ref={canvasRef} className="pixel-wave" aria-hidden="true" />
}
