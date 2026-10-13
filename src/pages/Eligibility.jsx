
import { useState } from 'react'
import api from '../api'
import '../styles.css'
import VoiceTools from '../components/VoiceTools'
const STATES_AND_UTS = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
]

const INITIAL_FORM = {
  age: '',
  state: '',
  occupation: '',
  annualFamilyIncome: '',
  educationLevel: '',
  category: '',
  farmer: false,
  ownsLand: false,
  ownsHouse: false,
  hasLpgConnection: false
}

export default function Eligibility() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [voiceField, setVoiceField] = useState('occupation')
  
function handleVoiceTranscript(transcript) {
  const text = transcript.trim()

  if (!text) return

  const numericFields = ['age', 'annualFamilyIncome']

  setForm((previous) => ({
    ...previous,
    [voiceField]: numericFields.includes(voiceField)
      ? text.replace(/[^0-9]/g, '')
      : text,
  }))

  setResult(null)
  setError('')
}

  function update(e) {
    const { name, value, type, checked } = e.target

    setForm(previous => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value
    }))

    setResult(null)
    setError('')
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setResult(null)

    if (!STATES_AND_UTS.includes(form.state)) {
      setError('Please select a valid Indian state or union territory.')
      return
    }

    if (Number(form.age) < 1 || Number(form.age) > 120) {
      setError('Please enter an age between 1 and 120.')
      return
    }

    if (Number(form.annualFamilyIncome) < 0) {
      setError('Family income cannot be negative.')
      return
    }

    setLoading(true)

    try {
      const res = await api.post('/eligibility/check', {
        age: Number(form.age),
        state: form.state,
        occupation: form.occupation,
        annualFamilyIncome: Number(form.annualFamilyIncome),
        educationLevel: form.educationLevel,
        category: form.category,
        farmer: form.farmer,
        ownsLand: form.ownsLand,
        ownsHouse: form.ownsHouse,
        hasLpgConnection: form.hasLpgConnection
      })

      setResult(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error('Eligibility API error:', err.response?.data || err)

      setError(
        err.response
          ? `Request failed: HTTP ${err.response.status}. Please try again.`
          : 'Cannot connect to the backend. Make sure Spring Boot is running.'
      )
    } finally {
      setLoading(false)
    }
  }

  const completedFields = [
    form.age,
    form.state,
    form.occupation,
    form.annualFamilyIncome
  ].filter(Boolean).length

  return (
    <div className="elig-page">
      <section className="elig-hero">
        <div className="elig-hero-top">
          <div className="elig-brand">
            <div className="elig-brand-logo">G</div>
            <div>
              <strong>GovGuide</strong>
              <span>Government Scheme Assistant</span>
            </div>
          </div>
          <span className="elig-hero-badge">
            <span className="elig-live-dot" />
            Eligibility checker
          </span>
        </div>

        <div className="elig-hero-content">
          <span className="elig-eyebrow">YOUR BENEFITS, SIMPLIFIED</span>
          <h1>Find schemes made for you.</h1>
          <p>
            Discover government schemes that may suit your needs.
            Answer a few simple questions to get started.
          </p>

          <div className="elig-hero-features">
            <span>✓ Simple questions</span>
            <span>✓ Personalized matching</span>
            <span>✓ Free to explore</span>
          </div>
        </div>

        <div className="elig-orbit elig-orbit-one" />
        <div className="elig-orbit elig-orbit-two" />
      </section>

      <div className="elig-layout">
        <aside className="elig-sidebar">
          <section className="elig-sidebar-card">
            <div className="elig-sidebar-icon">◎</div>
            <h3>Your journey</h3>
            <p className="elig-sidebar-intro">
              Three simple steps to discover potential benefits.
            </p>

            <div className="elig-step elig-step-active">
              <span className="elig-step-number">1</span>
              <div>
                <strong>Your profile</strong>
                <p>Share your details</p>
              </div>
            </div>

            <div className="elig-step">
              <span className="elig-step-number">2</span>
              <div>
                <strong>Scheme matching</strong>
                <p>Review potential matches</p>
              </div>
            </div>

            <div className="elig-step">
              <span className="elig-step-number">3</span>
              <div>
                <strong>Next steps</strong>
                <p>Check official requirements</p>
              </div>
            </div>
          </section>

          <section className="elig-tip-card">
            <div className="elig-tip-icon">i</div>
            <h3>Helpful tip</h3>
            <p>
              Enter accurate information for a more useful preliminary
              screening. Final eligibility is decided under official scheme
              rules.
            </p>
          </section>
        </aside>
          <main className="elig-main">
  <VoiceTools
    onTranscript={handleVoiceTranscript}
    speakText="Welcome to GovGuide. Tell us about yourself to explore potential government scheme matches. Choose Telugu, Hindi, or English, and tap Speak to fill in your details. Please review your answers before submitting."
    placeholder="Speak your answer"
  />

  <div className="voice-field-picker">
    <label htmlFor="voice-field">
      Choose which field to fill by voice
    </label>

    <select
      id="voice-field"
      value={voiceField}
      onChange={(event) => setVoiceField(event.target.value)}
    >
      <option value="age">Age</option>
      <option value="state">State / Union Territory</option>
      <option value="occupation">Occupation</option>
      <option value="annualFamilyIncome">Annual family income</option>
      <option value="educationLevel">Education level</option>
      <option value="category">Social category</option>
    </select>
  </div>

  <div className="elig-form-heading">
    <div>
      <span className="elig-section-label">STEP 1 OF 3</span>
      <h2>Tell us about yourself</h2>
      <p>Complete your profile to explore potential scheme matches.</p>
    </div>

    <span className="elig-progress-label">
      {completedFields}/4 details
    </span>
  </div>

          <div
            className="elig-progress-track"
            role="progressbar"
            aria-valuenow={completedFields * 25}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div
              className="elig-progress-fill"
              style={{ width: `${completedFields * 25}%` }}
            />
          </div>

          <form className="elig-form" onSubmit={submit}>
            <section className="elig-form-section">
              <div className="elig-section-heading">
                <span className="elig-section-number">01</span>
                <div>
                  <h3>Basic information</h3>
                  <p>Tell us about your personal circumstances.</p>
                </div>
              </div>

              <div className="elig-fields-grid">
                <label className="elig-field" htmlFor="age">
                  <span>Age <b>*</b></span>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="1"
                    max="120"
                    placeholder="Enter your age"
                    value={form.age}
                    onChange={update}
                    required
                  />
                </label>

                <label className="elig-field" htmlFor="state">
                  <span>State / Union Territory <b>*</b></span>
                  <select
                    id="state"
                    name="state"
                    value={form.state}
                    onChange={update}
                    required
                  >
                    <option value="">Select your state</option>
                    {STATES_AND_UTS.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </label>

                <label className="elig-field" htmlFor="occupation">
                  <span>Occupation <b>*</b></span>
                  <select
                    id="occupation"
                    name="occupation"
                    value={form.occupation}
                    onChange={update}
                    required
                  >
                    <option value="">Select occupation</option>
                    <option value="Farmer">Farmer</option>
                    <option value="Student">Student</option>
                    <option value="Employed">Employed</option>
                    <option value="Self-employed">Self-employed</option>
                    <option value="Unemployed">Unemployed</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label className="elig-field" htmlFor="annualFamilyIncome">
                  <span>Annual family income (₹) <b>*</b></span>
                  <input
                    id="annualFamilyIncome"
                    name="annualFamilyIncome"
                    type="number"
                    min="0"
                    placeholder="e.g. 250000"
                    value={form.annualFamilyIncome}
                    onChange={update}
                    required
                  />
                </label>

                <label className="elig-field" htmlFor="educationLevel">
                  <span>Education level</span>
                  <select
                    id="educationLevel"
                    name="educationLevel"
                    value={form.educationLevel}
                    onChange={update}
                  >
                    <option value="">Select education level</option>
                    <option value="School">School</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label className="elig-field" htmlFor="category">
                  <span>Social category</span>
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={update}
                  >
                    <option value="">Prefer not to specify</option>
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
              </div>
            </section>

            <section className="elig-form-section">
              <div className="elig-section-heading">
                <span className="elig-section-number">02</span>
                <div>
                  <h3>Farmer and household details</h3>
                  <p>Select the statements that apply to your household.</p>
                </div>
              </div>

              <div className="elig-checkbox-list">
                <label className="elig-check-card">
                  <input
                    type="checkbox"
                    name="farmer"
                    checked={form.farmer}
                    onChange={update}
                  />
                  <span className="elig-custom-check">✓</span>
                  <span className="elig-check-copy">
                    <strong>I am a farmer</strong>
                    <small>I am engaged in agricultural activities.</small>
                  </span>
                  <span className="elig-check-symbol">♧</span>
                </label>

                <label className="elig-check-card">
                  <input
                    type="checkbox"
                    name="ownsLand"
                    checked={form.ownsLand}
                    onChange={update}
                  />
                  <span className="elig-custom-check">✓</span>
                  <span className="elig-check-copy">
                    <strong>I own agricultural land</strong>
                    <small>I own or have agricultural land.</small>
                  </span>
                  <span className="elig-check-symbol">⌂</span>
                </label>

                <label className="elig-check-card">
                  <input
                    type="checkbox"
                    name="ownsHouse"
                    checked={form.ownsHouse}
                    onChange={update}
                  />
                  <span className="elig-custom-check">✓</span>
                  <span className="elig-check-copy">
                    <strong>I own a house</strong>
                    <small>My household owns a residential house.</small>
                  </span>
                  <span className="elig-check-symbol">⌂</span>
                </label>

                <label className="elig-check-card">
                  <input
                    type="checkbox"
                    name="hasLpgConnection"
                    checked={form.hasLpgConnection}
                    onChange={update}
                  />
                  <span className="elig-custom-check">✓</span>
                  <span className="elig-check-copy">
                    <strong>My household has an LPG connection</strong>
                    <small>We already have an LPG gas connection.</small>
                  </span>
                  <span className="elig-check-symbol">◉</span>
                </label>
              </div>
            </section>

            {error && (
              <div className="elig-error" role="alert">
                <span>!</span>
                {error}
              </div>
            )}

            <div className="elig-submit-row">
              <p><span>🔒</span> Preliminary screening only</p>
              <button
                className="elig-submit-button"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Checking schemes...' : 'Check eligibility'}
                {!loading && <span aria-hidden="true">→</span>}
              </button>
            </div>
          </form>

          {result !== null && (
            <section className="elig-results" aria-live="polite">
              <div className="elig-results-heading">
                <span className="elig-results-icon">✓</span>
                <div>
                  <span className="elig-section-label">STEP 2 OF 3</span>
                  <h2>Your potential matches</h2>
                  <p>Review the results and verify the official requirements.</p>
                </div>
              </div>

              {result.length === 0 ? (
                <div className="elig-empty">
                  <h3>No potential matches returned</h3>
                  <p>
                    Try reviewing your answers or exploring official government
                    scheme portals for other options.
                  </p>
                </div>
              ) : (
                <div className="elig-result-list">
                  {result.map((scheme, index) => (
                    <article
                      className="elig-result-card"
                      key={scheme.schemeId ?? index}
                    >
                      <div className="elig-result-card-top">
                        <span className="elig-match-label">POTENTIAL MATCH</span>
                        <span className="elig-result-check">✓</span>
                      </div>

                      <h3>{scheme.schemeName ?? 'Government Scheme'}</h3>
                      <p>
                        {scheme.description ||
                          'Review the official scheme information for details.'}
                      </p>

                      <div className="elig-result-detail">
                        <strong>Benefits</strong>
                        <p>{scheme.benefits || 'See official scheme details.'}</p>
                      </div>

                      <div className="elig-result-detail">
                        <strong>Why it matched</strong>
                        {scheme.reasons?.length ? (
                          <ul>
                            {scheme.reasons.map((reason, i) => (
                              <li key={i}>{reason}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>Review the official eligibility requirements.</p>
                        )}
                      </div>

                      <div className="elig-result-footer">
                        <span className="elig-status">Potential match</span>
                        {scheme.applicationUrl && (
                          <a
                            href={scheme.applicationUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="elig-official-link"
                          >
                            Official information ↗
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}

              <p className="elig-disclaimer">
                These results are preliminary and do not guarantee eligibility
                or approval. Confirm the current rules and application process
                on the official government portal.
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
