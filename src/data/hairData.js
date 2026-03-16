// ─── Levels ──────────────────────────────────────────────────────────────────

export const LEVELS = [
  { value: 1,  name: 'Black',            color: '#120808' },
  { value: 2,  name: 'Darkest Brown',    color: '#1e0e08' },
  { value: 3,  name: 'Dark Brown',       color: '#32160a' },
  { value: 4,  name: 'Medium Brown',     color: '#4e2010' },
  { value: 5,  name: 'Light Brown',      color: '#6e3318' },
  { value: 6,  name: 'Dark Blonde',      color: '#8e5428' },
  { value: 7,  name: 'Medium Blonde',    color: '#b07840' },
  { value: 8,  name: 'Light Blonde',     color: '#c8a058' },
  { value: 9,  name: 'Very Light Blonde',color: '#dcc070' },
  { value: 10, name: 'Lightest Blonde',  color: '#f0e090' },
]

// ─── Underlying Pigments ─────────────────────────────────────────────────────
// The warm contributing pigment exposed when bleaching/lifting

export const PIGMENTS = [
  { value: 'red',             name: 'Red',             color: '#8b1a1a', typicalFor: [1, 2, 3] },
  { value: 'red-orange',      name: 'Red-Orange',      color: '#a83020', typicalFor: [4, 5]    },
  { value: 'orange',          name: 'Orange',          color: '#c84c18', typicalFor: [5, 6]    },
  { value: 'orange-yellow',   name: 'Orange-Yellow',   color: '#d07820', typicalFor: [6, 7]    },
  { value: 'yellow',          name: 'Yellow',          color: '#d4a810', typicalFor: [7, 8]    },
  { value: 'pale-yellow',     name: 'Pale Yellow',     color: '#e8ca50', typicalFor: [8, 9]    },
  { value: 'very-pale-yellow',name: 'Very Pale Yellow',color: '#f0e080', typicalFor: [9, 10]   },
]

export function getTypicalPigment(level) {
  return PIGMENTS.find(p => p.typicalFor.includes(level))?.value ?? 'orange-yellow'
}

// ─── Target Tones ─────────────────────────────────────────────────────────────

export const TARGET_TONES = [
  { value: 'platinum',  name: 'Platinum',      color: '#dcdaec', description: 'Icy silver-white'          },
  { value: 'silver',    name: 'Silver',         color: '#b4b2c8', description: 'Cool metallic grey'        },
  { value: 'ash',       name: 'Ash Blonde',     color: '#a8aabc', description: 'Cool ash-toned blonde'     },
  { value: 'pearl',     name: 'Pearl',          color: '#d0ccc0', description: 'Soft iridescent neutral'   },
  { value: 'beige',     name: 'Beige Blonde',   color: '#c8b888', description: 'Warm-neutral balance'      },
  { value: 'natural',   name: 'Natural',        color: '#b89060', description: 'No dominant tone'          },
  { value: 'golden',    name: 'Golden Blonde',  color: '#d4a030', description: 'Warm golden glow'          },
  { value: 'copper',    name: 'Copper',         color: '#b86030', description: 'Rich warm copper'          },
  { value: 'rose-gold', name: 'Rose Gold',      color: '#c87870', description: 'Soft pink-warm'            },
  { value: 'violet',    name: 'Violet',         color: '#8060a0', description: 'Cool purple tone'          },
]

// ─── Recommendation Engine ────────────────────────────────────────────────────

export function getRecommendation(currentLevel, currentPigment, targetLevel, targetTone) {
  if (!currentLevel || !currentPigment || !targetLevel || !targetTone) return null

  const delta = targetLevel - currentLevel

  if (delta > 0) {
    return buildLiftFormula(currentLevel, currentPigment, targetLevel, targetTone)
  }

  if (delta < -2) {
    return {
      type: 'darken',
      severity: 'info',
      title: 'Color Application Needed',
      message: `Toner cannot deposit enough pigment to reach Level ${targetLevel} from Level ${currentLevel}.`,
      details: 'Use a permanent or demi-permanent color at the target level and tone. A warm filler may be required first to avoid flat or muddy results.',
    }
  }

  const needsHighLift = ['platinum', 'silver'].includes(targetTone) && targetLevel < 9
  if (needsHighLift) {
    return {
      type: 'alert',
      severity: 'warning',
      title: `More Lift Required for ${targetTone.charAt(0).toUpperCase() + targetTone.slice(1)}`,
      message: `Platinum and silver toning requires a Level 9–10 base (very pale yellow).`,
      details: `At Level ${targetLevel}, residual warmth will produce a grey or muted result rather than true ${targetTone}. Continue lifting until the underlying pigment is very pale yellow.`,
    }
  }

  const warmPigments = ['red', 'red-orange', 'orange']
  if (targetTone === 'ash' && warmPigments.includes(currentPigment) && currentLevel <= 7) {
    return {
      type: 'pigment-warning',
      severity: 'warning',
      title: 'Pigment Conflict — Ash Over Orange/Red',
      message: 'Applying a straight ash toner over orange or red pigment will produce a green or muddy cast.',
      details: 'Use a blue-violet toner (not pure ash) to counter the warmth, or continue lifting the hair to reduce underlying pigment before toning.',
    }
  }

  return buildFormula(currentLevel, currentPigment, targetLevel, targetTone)
}

function buildLiftFormula(currentLevel, currentPigment, targetLevel, targetTone) {
  const levelsOfLift = targetLevel - currentLevel
  const expectedPigment = PIGMENTS.find(p => p.typicalFor.includes(targetLevel))
    ?? PIGMENTS[PIGMENTS.length - 1]

  const warnings = []
  const tips = [
    'Add a bond builder (Olaplex No.1 or Wellaplex No.1) to every bleach mix to protect integrity.',
    'Check progress every 10 minutes. Remove as soon as target level is reached.',
  ]
  const ratio = '1:2 (lightener : developer)'

  let method, developer, processTime, sessions
  let products = [
    'Wella Blondor Multi Blonde Powder',
    'Schwarzkopf BlondMe Premium Lightener 9+',
    'Redken Flash Lift Bonder Inside',
  ]

  if (levelsOfLift === 1) {
    method = currentLevel >= 7 ? 'High-Lift Color or Bleach' : 'Bleach'
    developer = currentLevel >= 7 ? '20–40 vol' : '20 vol'
    processTime = '20–40 min'
    sessions = 1
    if (currentLevel >= 7) {
      products = [
        'Wella Illumina Color (40 vol) — for virgin hair',
        'Schwarzkopf IGORA Royal Highlifts (40 vol) — for virgin hair',
        'Wella Blondor + 20 vol — for previously colored hair',
      ]
      tips.push('High-lift color with 40 vol works on natural/virgin hair only. Use bleach for previously colored hair.')
    } else {
      tips.push('One bleach application should achieve this lift comfortably.')
    }
  } else if (levelsOfLift === 2) {
    method = 'Bleach'
    developer = '20–30 vol'
    processTime = '30–45 min'
    sessions = 1
    tips.push('Use 20 vol for fine or previously damaged hair; 30 vol for coarse or resistant hair.')
    tips.push('Apply mid-lengths and ends first; add roots during the final 10–15 minutes.')
  } else if (levelsOfLift === 3) {
    method = 'Bleach'
    developer = '30 vol'
    processTime = '40–55 min'
    sessions = 1
    warnings.push('3 levels of lift is aggressive — perform an elasticity test first. If hair stretches without snapping back, it may not tolerate a full bleach application.')
    tips.push('Apply mid-lengths and ends first, roots last. Scalp heat accelerates lift at the root.')
    tips.push('Follow immediately with a bond treatment (Olaplex No.2 or Wellaplex No.2).')
  } else if (levelsOfLift <= 5) {
    method = 'Bleach'
    developer = '30–40 vol'
    processTime = '40–60 min per session'
    sessions = 2
    warnings.push(`${levelsOfLift} levels of lift requires 2 bleach sessions. Allow at least 2 weeks between sessions for the hair to recover.`)
    warnings.push('Do not attempt the full lift in a single session — this risks severe breakage and loss of elasticity.')
    tips.push('After session 1: apply Olaplex No.2 or a bond reconstruction treatment and deep condition for 1–2 weeks before session 2.')
    tips.push('Before session 2: perform a strand test and elasticity check to confirm the hair can withstand further processing.')
  } else {
    const estimatedSessions = Math.ceil(levelsOfLift / 2)
    method = 'Bleach — Multiple Sessions'
    developer = '30–40 vol'
    processTime = '40–60 min per session'
    sessions = estimatedSessions
    warnings.push(`${levelsOfLift} levels of lift will require ${estimatedSessions}+ sessions over several weeks. This is a major transformation — set realistic expectations with your client before starting.`)
    warnings.push('Perform a full consultation including hair history, texture, and elasticity assessment before any chemical service.')
    tips.push('Schedule sessions 2–4 weeks apart. Deep condition and use bond treatments between every appointment.')
    tips.push('At each session: do a strand test and elasticity check before applying bleach.')
    tips.push('Consider a keratin or bond reconstruction series alongside the lightening process.')
  }

  // Toner step: compute the formula using the expected post-lift pigment
  const tonerStep = buildFormula(targetLevel, expectedPigment.value, targetLevel, targetTone)

  return {
    type: 'lift',
    levelsOfLift,
    sessions,
    method,
    developer,
    ratio,
    processTime,
    products,
    expectedPigment,
    warnings,
    tips,
    tonerStep,
  }
}

function buildFormula(currentLevel, currentPigment, targetLevel, targetTone) {
  let warnings = []
  let tips = []
  let products = []
  let developer = '20 vol (6%)'
  let ratio = '1 part toner : 2 parts developer'
  let processTime = '20–25 min'

  switch (targetTone) {

    case 'golden':
      developer = '10–20 vol'
      processTime = '15–20 min'
      products = currentLevel >= 9
        ? ['Redken Shades EQ 09G — Café au Lait', 'Wella Color Charm 10G', 'Schwarzkopf Vibrance 9-3']
        : ['Redken Shades EQ 08G — Sheer Sun', 'Wella Color Charm 8G', 'Kenra Demi 8G']
      tips = [
        'Use 10 vol for maximum shine and minimal lift; 20 vol for slightly more deposit.',
        'Warm underlying tones at this level naturally enhance a golden result.',
      ]
      if (['red', 'red-orange'].includes(currentPigment)) {
        warnings.push('Red or red-orange underlying tones may shift the result toward copper-gold. Strand test recommended.')
      }
      break

    case 'copper':
      developer = '10–20 vol'
      processTime = '20 min'
      products = [
        'Redken Shades EQ 07C — Amber',
        'Redken Shades EQ 06RB — Copper Shimmer',
        'Wella Color Charm 7C',
      ]
      tips = [
        'Existing warm tones support and deepen the copper result.',
        'For a brighter copper, use 20 vol. For a richer, deeper result, use 10 vol.',
      ]
      if (currentLevel >= 9) {
        warnings.push('Very light hair at Level 9+ may produce a bright, orange-copper tone. Add a drop of red/auburn to deepen if needed.')
      }
      break

    case 'rose-gold':
      developer = '10 vol'
      processTime = '15–20 min'
      products = [
        'Redken Shades EQ 09RO — Rose Gold',
        'Joico LumiShine Demi-Permanent Rose Gold',
        'Wella Color Charm 10RO',
      ]
      tips = [
        'Rose gold fades rapidly — recommend sulfate-free, color-safe shampoo.',
        'For more pink, add a violet or soft pink toner to the formula.',
        'Schedule a gloss refresh every 4–6 weeks for longevity.',
      ]
      if (currentLevel < 9) {
        warnings.push('Best results on Level 9+. At Level 8, expect a more peachy or copper-pink tone.')
      }
      break

    case 'platinum':
      developer = '20 vol'
      processTime = '20–30 min'
      products = [
        'Wella Color Charm T18 — Lightest Ash Blonde',
        'Wella Color Charm T11 — Lightest Beige Blonde',
        'Kenra Platinum Silken 10V',
      ]
      tips = [
        'Apply to clean, towel-dried hair for maximum pigment deposit.',
        'Check every 5 minutes — platinum toners over-deposit quickly.',
        'Rinse with cool water; follow with a bond-building treatment.',
        'Maintain with a purple/silver toning shampoo 1–2× per week.',
      ]
      if (currentPigment !== 'very-pale-yellow') {
        warnings.push('Any remaining warmth may resist full neutralization. A second toning session may be needed after assessing initial results.')
      }
      break

    case 'silver':
      developer = '20 vol'
      processTime = '25–30 min'
      products = [
        'Wella Color Charm T18 — Lightest Ash Blonde',
        'Redken Shades EQ 09V — Platinum Ice',
        'Matrix Total Results So Silver Toner',
      ]
      tips = [
        'Longer processing (toward 30 min) yields a more silver, less blonde result.',
        'Apply to slightly damp hair for even, controlled distribution.',
        'Recommend a silver/grey toning shampoo for ongoing maintenance.',
      ]
      if (currentPigment !== 'very-pale-yellow') {
        warnings.push('Residual yellow tones will mute the silver result. Ensure hair is fully lifted to very pale yellow before toning.')
      }
      break

    case 'ash':
      developer = '20 vol'
      processTime = '20–25 min'
      products = currentLevel >= 9
        ? ['Wella Color Charm T14 — Pale Ash Blonde', 'Redken Shades EQ 09B — Steel Blue', 'Schwarzkopf Vibrance 10-1']
        : ['Wella Color Charm T28 — Natural Blonde', 'Redken Shades EQ 08B — Lagoon', 'Schwarzkopf Vibrance 8-1']
      tips = [
        'For yellow-based hair: use a violet-ash (T14/T18). For orange-based: use a blue-ash.',
        'Apply from ends to roots — roots process faster due to scalp heat.',
        'Maintain with a blue-violet toning shampoo to counteract fade.',
      ]
      if (['orange-yellow', 'yellow'].includes(currentPigment)) {
        tips.push('Yellow at this level pairs well with a violet-ash for a clean, cool blonde.')
      }
      break

    case 'violet':
      developer = '10–20 vol'
      processTime = '15–20 min'
      products = [
        'Redken Shades EQ 09V — Platinum Ice',
        'Wella Color Charm 10V',
        'Joico LumiShine Demi-Permanent Violet',
      ]
      tips = [
        'True violet reads best on Level 9–10. At Level 8, expect a more muted lavender-grey result.',
        'Violet tones fade quickly — advise less frequent washing and cool rinse water.',
      ]
      if (currentLevel < 9) {
        warnings.push('Level 8 or below will produce a subtle cool-violet rather than vivid purple. Lift further for a stronger tonal result.')
      }
      break

    case 'pearl':
      developer = '20 vol'
      processTime = '20 min'
      products = [
        'Redken Shades EQ 09P — Opal',
        'Wella Color Charm T15 — Pale Gold Blonde',
        'Schwarzkopf BlondMe Pearl Blonde Toner',
      ]
      tips = [
        'Pearl blends cool and warm tones for an iridescent, multi-dimensional effect.',
        'Add a touch of violet for a cooler pearl, or a gold toner for a warmer champagne result.',
      ]
      if (['orange', 'red-orange'].includes(currentPigment)) {
        warnings.push('Warm underlying tones may push pearl toward champagne-gold. Lifting to a yellower base first will give a truer result.')
      }
      break

    case 'beige':
      developer = '20 vol'
      processTime = '20 min'
      products = [
        'Wella Color Charm T35 — Beige Blonde',
        'Wella Color Charm T15 — Pale Gold Blonde',
        'Redken Shades EQ 08N — Champagne Toast',
      ]
      tips = [
        'One of the most forgiving and natural-looking toner results across Level 8–10.',
        'Mix with a touch of ash for a cooler beige, or a golden toner for a warmer finish.',
      ]
      break

    case 'natural':
    default:
      developer = '20 vol'
      processTime = '15–20 min'
      products = [
        'Wella Color Charm T28 — Natural Blonde',
        'Redken Shades EQ 08N — Champagne Toast',
        'Schwarzkopf Vibrance 8-00',
      ]
      tips = [
        'Natural toners reduce brassiness without pushing hair strongly cool or warm.',
        'Good for clients who want shine and freshness without a noticeable tonal shift.',
      ]
      break
  }

  return { type: 'formula', products, developer, ratio, processTime, warnings, tips }
}
