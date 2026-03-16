import { PIGMENTS } from '../data/hairData'

export default function PigmentSelector({ value, onChange, currentLevel }) {
  return (
    <div className="pigment-selector">
      {PIGMENTS.map(p => {
        const isTypical = p.typicalFor.includes(currentLevel)
        const selected = value === p.value
        return (
          <button
            key={p.value}
            className={[
              'color-chip',
              selected ? 'color-chip--selected' : '',
              isTypical ? 'color-chip--typical' : '',
            ].join(' ').trim()}
            onClick={() => onChange(p.value)}
            title={isTypical ? `${p.name} — typical for Level ${currentLevel}` : p.name}
          >
            <span className="chip-dot" style={{ backgroundColor: p.color }} />
            <span className="chip-label">{p.name}</span>
            {isTypical && <span className="chip-badge">typical</span>}
          </button>
        )
      })}
    </div>
  )
}
