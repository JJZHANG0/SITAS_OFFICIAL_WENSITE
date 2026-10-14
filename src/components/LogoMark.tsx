/**
 * Stroke-based SITAS mark: hexagonal frame + shutter blades.
 * Recreated for path-draw animation (matches public/sitas-logo-transparent.png silhouette).
 */
type Props = {
  className?: string
  /** When true, paths use stroke-dash animation classes */
  animate?: boolean
}

export function LogoMark({ className = '', animate = false }: Props) {
  const draw = animate ? ' logo-mark--draw' : ''
  return (
    <svg
      className={`logo-mark${draw}${className ? ` ${className}` : ''}`}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer hexagon */}
      <polygon
        className="logo-mark__path logo-mark__outer"
        points="60,8 104,34 104,86 60,112 16,86 16,34"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Inner shutter ring (hex) */}
      <polygon
        className="logo-mark__path logo-mark__inner"
        points="60,42 78,52 78,68 60,78 42,68 42,52"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Six aperture blades — lines from outer mid-edges toward center */}
      <g className="logo-mark__blades" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path className="logo-mark__path" d="M60 18 L60 42" />
        <path className="logo-mark__path" d="M96 39 L78 52" />
        <path className="logo-mark__path" d="M96 81 L78 68" />
        <path className="logo-mark__path" d="M60 102 L60 78" />
        <path className="logo-mark__path" d="M24 81 L42 68" />
        <path className="logo-mark__path" d="M24 39 L42 52" />
      </g>
      {/* Blade tips — short arcs suggesting shutter leaves */}
      <g className="logo-mark__leaves" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none">
        <path className="logo-mark__path" d="M52 28 L68 28 L60 42 Z" />
        <path className="logo-mark__path" d="M86 36 L98 52 L78 52 Z" />
        <path className="logo-mark__path" d="M98 68 L86 84 L78 68 Z" />
        <path className="logo-mark__path" d="M68 92 L52 92 L60 78 Z" />
        <path className="logo-mark__path" d="M34 84 L22 68 L42 68 Z" />
        <path className="logo-mark__path" d="M22 52 L34 36 L42 52 Z" />
      </g>
    </svg>
  )
}
