import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import { useLanguage } from '../LanguageContext'
import VoiceTools from '../components/VoiceTools'
const categories = [
  'All Schemes',
  'Education',
  'Health',
  'Housing',
  'Agriculture',
  'Women & Child Welfare',
  'Financial Inclusion',
  'Other'
]
function getCategory(scheme) {
  const text = `
    ${scheme.name || ''}
    ${scheme.description || ''}
    ${scheme.benefits || ''}
    ${scheme.eligibilityCriteria || ''}
  `.toLowerCase()

  if (/scholarship|education|shiksha|school|student|విద్య|విద్యార్థి|छात्रवृत्ति|शिक्षा/.test(text))
    return 'Education'

  if (/ayushman|health|medical|hospital|ఆరోగ్య|వైద్య|स्वास्थ्य|अस्पताल/.test(text))
    return 'Health'

  if (/awas|housing|house|home loan|ఇల్లు|గృహ|आवास|मकान/.test(text))
    return 'Housing'

  if (/kisan|farmer|agriculture|farming|రైతు|రైతులు|వ్యవసాయం|किसान|खेती|कृषि/.test(text))
    return 'Agriculture'

  if (/ujjwala|women|girl child|maternity|sukanya|మహిళ|బాలిక|महिला|बालिका/.test(text))
    return 'Women & Child Welfare'

  if (/jan dhan|bank account|financial inclusion|బ్యాంకు ఖాతా|బ్యాంక్|बैंक खाता/.test(text))
    return 'Financial Inclusion'

  return 'Other'
}


function getIcon(category) {
  const icons = {
    'All Schemes': '🏛️',
    Education: '🎓',
    Health: '❤️',
    Housing: '🏠',
    Agriculture: '🌱',
    'Women & Child Welfare': '👩',
    'Financial Inclusion': '🏦',
    Other: '📋'
  }

  return icons[category] || '📋'
}

export default function Schemes() {
  const [schemes, setSchemes] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All Schemes')
  const [expandedId, setExpandedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
const { language, t } = useLanguage()

function handleVoiceSearch(transcript) {
  const spokenText = transcript.trim().toLowerCase()

  const farmerWords = [
    'farmer',
    'farmers',
    'farming',
    'agriculture',
    'రైతు',
    'రైతులు',
    'వ్యవసాయం',
    'రైతుల పథకాలు',
    'किसान',
    'किसानों',
    'खेती',
    'किसान योजना'
  ]

  if (farmerWords.some(word => spokenText.includes(word))) {
    setSearch('')
    setCategory('Agriculture')
    return
  }

  setSearch(transcript)
  setCategory('All Schemes')
}
  
useEffect(() => {
  api.get('/schemes')
    .then(res => {
      const data = res.data
      const records = Array.isArray(data)
        ? data
        : data?.content

      if (!Array.isArray(records)) {
        throw new Error('Unexpected schemes API response')
      }

      setSchemes(records.map(scheme => ({
        ...scheme,
        name: scheme.schemeName,
        description: scheme.shortDescription,
        applicationUrl: scheme.officialUrl,
        eligibilityCriteria:
          scheme.eligibilityRule?.additionalConditions ||
          scheme.whoCanBenefit ||
          'Confirm eligibility using the official scheme guidelines.',
        benefits: scheme.benefits,
      })))
    })
    .catch(err => {
      setError(
        err.response
          ? `Unable to load schemes (HTTP ${err.response.status}).`
          : err.message === 'Unexpected schemes API response'
            ? err.message
            : 'Cannot connect to the backend. Please check that Spring Boot is running.'
      )
    })
    .finally(() => setLoading(false))
}, [])

  const filteredSchemes = useMemo(() => {
    return schemes.filter(scheme => {
      const matchesCategory =
        category === 'All Schemes' ||
        getCategory(scheme) === category

      const searchableText = [
        scheme.name,
        scheme.description,
        scheme.benefits,
        scheme.eligibilityCriteria,
        getCategory(scheme)
      ].join(' ').toLowerCase()

      return matchesCategory &&
        searchableText.includes(search.trim().toLowerCase())
    })
  }, [schemes, search, category])

  const categoryCount = name => {
    if (name === 'All Schemes') return schemes.length
    return schemes.filter(s => getCategory(s) === name).length
  }

  return (
    <div className="gov-dashboard">
      <header className="gov-hero">
        <div className="gov-hero-inner">
          <div className="gov-eyebrow">
            YOUR GUIDE TO GOVERNMENT BENEFITS
          </div>

          <h1>Explore Government Schemes</h1>

          <p>
            Discover schemes that may help you and your family.
            Learn about benefits, eligibility criteria, and official portals.
          </p>
            <VoiceTools
  language={language}
  onTranscript={handleVoiceSearch}
  speakText={
    language === 'te'
      ? 'గోవ్‌గైడ్‌కు స్వాగతం. రైతు పథకాలు తెలుసుకోవడానికి మైక్రోఫోన్ నొక్కి మాట్లాడండి.'
      : language === 'hi'
        ? 'GovGuide में आपका स्वागत है। किसान योजनाएँ जानने के लिए माइक्रोफ़ोन दबाकर बोलें।'
        : 'Welcome to GovGuide. Use the microphone to search for farmer schemes.'
  }
  placeholder={
    language === 'te'
      ? 'పథకం పేరు చెప్పండి'
      : language === 'hi'
        ? 'योजना का नाम बोलें'
        : 'Speak a scheme name'
  }
/>
          <div className="gov-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search schemes by name, category or keyword..."
              aria-label="Search government schemes"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>

          <div className="gov-result-count">
            Showing {filteredSchemes.length} of {schemes.length} schemes
          </div>
        </div>
      </header>

      <main className="gov-dashboard-main">
        <aside className="gov-sidebar">
          <h2>☷ &nbsp; Filter by Category</h2>

          <div className="gov-category-list">
            {categories.map(item => (
              <button
                type="button"
                key={item}
                className={`gov-category ${
                  category === item ? 'active' : ''
                }`}
                onClick={() => {
                  setCategory(item)
                  setExpandedId(null)
                }}
              >
                <span className="gov-category-icon">
                  {getIcon(item)}
                </span>

                <span className="gov-category-name">{item}</span>

                <span className="gov-category-count">
                  {categoryCount(item)}
                </span>
              </button>
            ))}
          </div>

          <div className="gov-sidebar-note">
            <strong>Need help?</strong>
            <p>Check which schemes may match your profile.</p>
            <Link to="/eligibility">Check eligibility →</Link>
          </div>
        </aside>

        <section className="gov-scheme-section">
          <div className="gov-section-heading">
            <div>
              <h2>
                {category === 'All Schemes'
                  ? 'Available Schemes'
                  : category}
              </h2>
              <p>Explore scheme details and official requirements.</p>
            </div>

            <Link className="gov-eligibility-link" to="/eligibility">
              Check my eligibility →
            </Link>
          </div>

          {loading && (
            <div className="gov-state-message">
              Loading government schemes...
            </div>
          )}

          {error && (
            <div className="gov-state-message gov-error">
              {error}
            </div>
          )}

          {!loading && !error && filteredSchemes.length === 0 && (
            <div className="gov-state-message">
              <h3>No schemes found</h3>
              <p>Try another keyword or choose a different category.</p>
              <button
                type="button"
                className="gov-reset-button"
                onClick={() => {
                  setSearch('')
                  setCategory('All Schemes')
                }}
              >
                Show all schemes
              </button>
            </div>
          )}

          <div className="gov-scheme-grid">
            {filteredSchemes.map(scheme => {
              const schemeCategory = getCategory(scheme)
              const expanded = expandedId === scheme.id

              return (
                <article className="gov-scheme-card" key={scheme.id}>
                  <div className="gov-card-heading">
                    <div className="gov-scheme-icon">
                      {getIcon(schemeCategory)}
                    </div>

                    <span className="gov-scheme-badge">
                      {schemeCategory}
                    </span>
                  </div>

                  <h3>{scheme.name}</h3>

                  <p className="gov-scheme-description">
                    {scheme.description ||
                      'View the official portal for scheme information.'}
                  </p>

                  <div className="gov-card-summary">
                    <div>
                      <span className="gov-detail-icon">⌂</span>
                      <strong>Benefits</strong>
                      <p>
                        {scheme.benefits ||
                          'Please check the official guidelines.'}
                      </p>
                    </div>

                    <div>
                      <span className="gov-detail-icon">✓</span>
                      <strong>Eligibility</strong>
                      <p>
                        {scheme.eligibilityCriteria ||
                          'Confirm eligibility on the official portal.'}
                      </p>
                    </div>
                  </div>

                  {expanded && (
                    <div className="gov-expanded-details">
                      
<h4>Eligibility Information</h4>

{scheme.eligibilityRule ? (
  <ul className="gov-eligibility-list">
    <li>
      <strong>Minimum age:</strong>{' '}
      {scheme.eligibilityRule.minimumAge ?? 'Not specified'}
    </li>
    <li>
      <strong>Maximum age:</strong>{' '}
      {scheme.eligibilityRule.maximumAge ?? 'Not specified'}
    </li>
    <li>
      <strong>Minimum income:</strong>{' '}
      {scheme.eligibilityRule.minimumIncome ?? 'Not specified'}
    </li>
    <li>
      <strong>Maximum income:</strong>{' '}
      {scheme.eligibilityRule.maximumIncome ?? 'Not specified'}
    </li>
    <li>
      <strong>Eligible states:</strong>{' '}
      {scheme.eligibilityRule.eligibleStates || 'Not specified'}
    </li>
    <li>
      <strong>Occupations:</strong>{' '}
      {scheme.eligibilityRule.eligibleOccupations || 'Not specified'}
    </li>
    <li>
      <strong>Social categories:</strong>{' '}
      {scheme.eligibilityRule.eligibleSocialCategories || 'Not specified'}
    </li>
    <li>
      <strong>Education:</strong>{' '}
      {scheme.eligibilityRule.eligibleEducationLevels || 'Not specified'}
    </li>
    <li>
      <strong>Gender:</strong>{' '}
      {scheme.eligibilityRule.genderRequirement || 'Not specified'}
    </li>
    <li>
      <strong>Additional conditions:</strong>{' '}
      {scheme.eligibilityRule.additionalConditions || 'Not specified'}
    </li>
  </ul>
) : (
  <p>Detailed eligibility rules are not available.</p>
)}

<h4>Document Checklist</h4>

{scheme.documents?.length > 0 ? (
  <ul className="gov-document-list">
    {scheme.documents.map(document => (
      <li key={document.id}>
        <strong>{document.documentName}</strong>
        <p>{document.description}</p>
        <small>
          {document.mandatoryStatus
            ? 'Marked mandatory'
            : 'Confirm whether this document is required'}
        </small>
      </li>
    ))}
  </ul>
) : (
  <p>Document information is not available.</p>
)}

<h4>Application Process</h4>
<p>
  {scheme.applicationProcess ||
    'Follow the instructions on the official scheme website.'}
</p>

<p className="gov-verification-note">
  Verification status: {scheme.verificationStatus || 'UNVERIFIED'}.
  Please confirm the current rules through the official government portal.
</p>
```

Keep the existing **About this scheme** section after this block if you still want it.

## Step 3 — Add styling without changing your overall design

Open `frontend/src/index.css` or `frontend/src/styles.css` and add these styles at the end:

<CodeBlock language="css" editable>
.gov-eligibility-list,
.gov-document-list {
  padding-left: 20px;
  line-height: 1.7;
}

.gov-eligibility-list li {
  margin-bottom: 8px;
  overflow-wrap: anywhere;
}

.gov-document-list {
  display: grid;
  gap: 12px;
}

.gov-document-list li {
  padding: 12px;
  background: #f5f7fb;
  border-radius: 8px;
}

.gov-document-list p {
  margin: 6px 0;
}

.gov-document-list small {
  color: #795817;
}

.gov-expanded-details {
  overflow-wrap: anywhere;
}


                      <h4>About this scheme</h4>
                      <p>
                        {scheme.description ||
                          'Refer to the official scheme guidelines.'}
                      </p>

                      <p className="gov-verification-note">
                        This information is preliminary. Final eligibility
                        and application requirements are determined by the
                        responsible government authority.
                      </p>
                    </div>
                  )}

                  <div className="gov-card-actions">
                    <button
                      type="button"
                      className="gov-details-button"
                      onClick={() =>
                        setExpandedId(expanded ? null : scheme.id)
                      }
                    >
                      {expanded ? 'Hide Details ↑' : 'View Details →'}
                    </button>

                    {scheme.applicationUrl ? (
                      <a
                        className="gov-portal-button"
                        href={scheme.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Official Portal ↗
                      </a>
                    ) : (
                      <span className="gov-no-portal">
                        Portal unavailable
                      </span>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </main>

      <footer className="gov-disclaimer">
        <span aria-hidden="true">ⓘ</span>
        <p>
          <strong>Please note:</strong> GovGuide provides preliminary
          information. Scheme rules, documents, and application procedures
          may change. Verify the latest details through official government
          portals.
        </p>
      </footer>
    </div>
  )
}
