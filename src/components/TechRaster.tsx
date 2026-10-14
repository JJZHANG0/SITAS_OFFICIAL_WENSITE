export function TechRaster() {
  return (
    <div className="tech-raster" aria-hidden="true">
      {Array.from({ length: 35 }).map((_, t) => (
        <i key={t}>
          <b>
            {1261 + (t % 7)},{365 + Math.floor(t / 7)}
          </b>
          <span>
            {10 + t},{11 + t},{12 + t}
          </span>
        </i>
      ))}
    </div>
  )
}
