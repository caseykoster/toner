import { useState, useMemo, useEffect } from 'react'
import { LEVELS, getTypicalPigment, getRecommendation } from './data/hairData'
import LevelPicker from './components/LevelPicker'
import PigmentSelector from './components/PigmentSelector'
import ToneSelector from './components/ToneSelector'
import ResultPanel from './components/ResultPanel'

export default function App() {
  const [currentLevel, setCurrentLevel] = useState(null)
  const [currentPigment, setCurrentPigment] = useState(null)
  const [targetLevel, setTargetLevel] = useState(null)
  const [targetTone, setTargetTone] = useState(null)

  useEffect(() => {
    if (currentLevel) setCurrentPigment(getTypicalPigment(currentLevel))
  }, [currentLevel])

  const result = useMemo(
    () => getRecommendation(currentLevel, currentPigment, targetLevel, targetTone),
    [currentLevel, currentPigment, targetLevel, targetTone]
  )

  const currentLevelName = LEVELS.find(l => l.value === currentLevel)?.name
  const targetLevelName = LEVELS.find(l => l.value === targetLevel)?.name

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">toner</h1>
        <p className="app-tagline">Professional hair toning formulator</p>
      </header>

      <main className="app-main">
        <div className="input-grid">
          <section className="input-card">
            <h2 className="card-title">Current Hair</h2>

            <div className="field">
              <label className="field-label">Level</label>
              <LevelPicker value={currentLevel} onChange={setCurrentLevel} />
              {currentLevelName
                ? <p className="field-hint">Level {currentLevel} — {currentLevelName}</p>
                : <p className="field-hint field-hint--placeholder">Select a level</p>
              }
            </div>

            <div className="field">
              <label className="field-label">Underlying Pigment</label>
              {currentLevel
                ? <PigmentSelector value={currentPigment} onChange={setCurrentPigment} currentLevel={currentLevel} />
                : <p className="field-placeholder">Select a level first</p>
              }
            </div>
          </section>

          <section className="input-card">
            <h2 className="card-title">Target Result</h2>

            <div className="field">
              <label className="field-label">Target Level</label>
              <LevelPicker value={targetLevel} onChange={setTargetLevel} />
              {targetLevelName
                ? <p className="field-hint">Level {targetLevel} — {targetLevelName}</p>
                : <p className="field-hint field-hint--placeholder">Select a level</p>
              }
            </div>

            <div className="field">
              <label className="field-label">Desired Tone</label>
              <ToneSelector value={targetTone} onChange={setTargetTone} targetLevel={targetLevel} />
            </div>
          </section>
        </div>

        <ResultPanel result={result} targetTone={targetTone} targetLevel={targetLevel} />
      </main>
    </div>
  )
}
