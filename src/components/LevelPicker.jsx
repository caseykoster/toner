import { LEVELS } from '../data/hairData'

export default function LevelPicker({ value, onChange }) {
  return (
    <div className="level-picker" role="radiogroup">
      {LEVELS.map(level => {
        const selected = value === level.value
        const isLight = level.value >= 7
        return (
          <button
            key={level.value}
            role="radio"
            aria-checked={selected}
            className={`level-btn${selected ? ' level-btn--selected' : ''}`}
            onClick={() => onChange(level.value)}
            title={`Level ${level.value} — ${level.name}`}
          >
            <span
              className="level-swatch"
              style={{
                backgroundColor: level.color,
                color: isLight ? '#3d3530' : '#e8ddd5',
              }}
            >
              {level.value}
            </span>
          </button>
        )
      })}
    </div>
  )
}
