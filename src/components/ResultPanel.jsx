import { LEVELS, TARGET_TONES } from '../data/hairData'

export default function ResultPanel({ result, targetTone, targetLevel }) {
  if (!result) {
    return (
      <div className="result-panel result-panel--empty">
        <div className="result-empty-inner">
          <span className="result-empty-icon">◈</span>
          <p className="result-empty-text">Complete both panels above to see your toner recommendation.</p>
        </div>
      </div>
    )
  }

  const toneData = TARGET_TONES.find(t => t.value === targetTone)
  const levelData = LEVELS.find(l => l.value === targetLevel)

  if (result.type !== 'formula') {
    return (
      <div className={`result-panel result-panel--alert result-panel--${result.severity}`}>
        <div className="alert-header">
          <div className={`alert-badge alert-badge--${result.severity}`}>
            {result.severity === 'warning' ? '⚠' : 'ⓘ'}
          </div>
          <div>
            <h3 className="alert-title">{result.title}</h3>
            <p className="alert-message">{result.message}</p>
          </div>
        </div>
        {result.details && <p className="alert-details">{result.details}</p>}
      </div>
    )
  }

  const { products, developer, ratio, processTime, warnings, tips } = result

  return (
    <div className="result-panel result-panel--formula">
      <div className="result-header">
        {toneData && (
          <span
            className="result-tone-preview"
            style={{ backgroundColor: toneData.color }}
            title={toneData.description}
          />
        )}
        <div>
          <h3 className="result-title">{toneData?.name ?? 'Toner Recommendation'}</h3>
          {levelData && (
            <p className="result-subtitle">
              Target Level {levelData.value} — {levelData.name}
            </p>
          )}
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="result-warnings">
          {warnings.map((w, i) => (
            <div key={i} className="result-warning-item">
              <span>⚠</span> {w}
            </div>
          ))}
        </div>
      )}

      <div className="formula-grid">
        <div className="formula-row">
          <span className="formula-label">Developer</span>
          <span className="formula-value">{developer}</span>
        </div>
        <div className="formula-row">
          <span className="formula-label">Ratio</span>
          <span className="formula-value">{ratio}</span>
        </div>
        <div className="formula-row">
          <span className="formula-label">Processing Time</span>
          <span className="formula-value">{processTime}</span>
        </div>
      </div>

      <div className="formula-section">
        <p className="formula-section-label">Recommended Products</p>
        <ul className="products-list">
          {products.map((p, i) => (
            <li key={i} className="product-item">
              {i === 0 && <span className="product-badge">First Choice</span>}
              {p}
            </li>
          ))}
        </ul>
      </div>

      {tips.length > 0 && (
        <div className="formula-section">
          <p className="formula-section-label">Application Notes</p>
          <ul className="tips-list">
            {tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
