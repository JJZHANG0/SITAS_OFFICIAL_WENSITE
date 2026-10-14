type Props = {
  label: string
  /** Aspect hint: wide | square | tall */
  ratio?: 'wide' | 'square' | 'tall'
  className?: string
}

/** Dashed placeholder for future product/diagram assets. */
export function VisualSlot({ label, ratio = 'wide', className = '' }: Props) {
  return (
    <div
      className={`visual-slot visual-slot--${ratio}${className ? ` ${className}` : ''}`}
      role="img"
      aria-label={label}
    >
      <span className="visual-slot__label">{label}</span>
      <span className="visual-slot__hint" aria-hidden="true">
        ASSET TBD
      </span>
    </div>
  )
}
