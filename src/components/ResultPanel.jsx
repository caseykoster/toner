import { LEVELS, TARGET_TONES } from '../data/hairData'

// ─── Shared sub-components ────────────────────────────────────────────────────

function FormulaGrid({ developer, ratio, processTime }) {
  return (
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
  )
}

function WarningList({ warnings }) {
  if (!warnings?.length) return null
  return (
    <div className="result-warnings">
      {warnings.map((w, i) => (
        <div key={i} className="result-warning-item">
          <span>⚠</span> {w}
        </div>
      ))}
    </div>
  )
}

function ProductList({ products }) {
  return (
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
  )
}

function TipList({ tips }) {
  if (!tips?.length) return null
  return (
    <div className="formula-section">
      <p className="formula-section-label">Application Notes</p>
      <ul className="tips-list">
        {tips.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

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

  // ── Simple alert (darken, pigment conflict, alert) ──────────────────────────
  if (result.type !== 'formula' && result.type !== 'lift') {
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

  // ── Two-step: Lift + Tone ───────────────────────────────────────────────────
  if (result.type === 'lift') {
    const {
      levelsOfLift, sessions, method, developer, ratio,
      processTime, products, expectedPigment, warnings, tips, tonerStep,
    } = result

    return (
      <div className="result-panel result-panel--lift">

        {/* Step 1 — Lighten */}
        <div className="lift-step">
          <div className="step-header">
            <span className="step-number">1</span>
            <div className="step-header-text">
              <h3 className="step-title">Lighten</h3>
              <p className="step-meta">
                {levelsOfLift} level{levelsOfLift > 1 ? 's' : ''} of lift
                &nbsp;·&nbsp; {method}
                &nbsp;·&nbsp; {sessions} session{sessions > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <WarningList warnings={warnings} />
          <FormulaGrid developer={developer} ratio={ratio} processTime={processTime} />
          <ProductList products={products} />
          <TipList tips={tips} />

          <div className="expected-undertone">
            <p className="formula-section-label">Expected Undertone After Lifting</p>
            <div className="undertone-result">
              <span className="undertone-dot" style={{ backgroundColor: expectedPigment.color }} />
              <div>
                <span className="undertone-name">{expectedPigment.name}</span>
                <span className="undertone-note">
                  — typical contributing pigment at Level {targetLevel}.
                  This warm tone will need to be toned or worked with in step 2.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 — Tone */}
        {tonerStep && (
          <div className="lift-step lift-step--tone">
            <div className="step-header">
              <span className="step-number step-number--outline">2</span>
              <div className="step-header-text">
                <h3 className="step-title">Tone</h3>
                <p className="step-meta">
                  Apply after lifting to achieve {toneData?.name ?? 'target tone'}
                </p>
              </div>
              {toneData && (
                <span
                  className="result-tone-preview"
                  style={{ backgroundColor: toneData.color }}
                  title={toneData.description}
                />
              )}
            </div>

            <WarningList warnings={tonerStep.warnings} />
            <FormulaGrid
              developer={tonerStep.developer}
              ratio={tonerStep.ratio}
              processTime={tonerStep.processTime}
            />
            <ProductList products={tonerStep.products} />
            <TipList tips={tonerStep.tips} />
          </div>
        )}
      </div>
    )
  }

  // ── Toner only ──────────────────────────────────────────────────────────────
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

      <WarningList warnings={warnings} />
      <FormulaGrid developer={developer} ratio={ratio} processTime={processTime} />
      <ProductList products={products} />
      <TipList tips={tips} />
    </div>
  )
}
