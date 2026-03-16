import { TARGET_TONES } from '../data/hairData'

function isMuted(tone, targetLevel) {
  if (!targetLevel) return false
  if (['platinum', 'silver'].includes(tone) && targetLevel < 9) return true
  if (['violet', 'rose-gold'].includes(tone) && targetLevel < 8) return true
  return false
}

export default function ToneSelector({ value, onChange, targetLevel }) {
  return (
    <div className="tone-selector">
      {TARGET_TONES.map(tone => {
        const selected = value === tone.value
        const muted = isMuted(tone.value, targetLevel)
        return (
          <button
            key={tone.value}
            className={[
              'color-chip',
              selected ? 'color-chip--selected' : '',
              muted ? 'color-chip--muted' : '',
            ].join(' ').trim()}
            onClick={() => onChange(tone.value)}
            title={muted ? `${tone.name} — requires a higher target level` : tone.description}
            aria-pressed={selected}
          >
            <span className="chip-dot" style={{ backgroundColor: tone.color }} />
            <span className="chip-label">{tone.name}</span>
          </button>
        )
      })}
    </div>
  )
}
