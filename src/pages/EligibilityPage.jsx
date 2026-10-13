import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { eligibilityService } from '../services/eligibilityService';
import { schemeService } from '../services/schemeService';
import { INDIAN_STATES, OCCUPATIONS } from '../components/schemes/SchemeFilter';
import TextToSpeechPlayer from '../components/voice/TextToSpeechPlayer';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ExternalLink,
  Bookmark,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  ArrowRight,
  RefreshCw,
  FileText,
  User,
  Info,
} from 'lucide-react';

const SOCIAL_CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'Prefer not to disclose'];

const EDUCATION_LEVELS = [
  'No formal education',
  'Primary education',
  'Secondary education',
  'Intermediate / Higher Secondary',
  'Diploma',
  'Undergraduate',
  'Postgraduate',
  'Other',
];

const EligibilityPage = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    age: '',
    state: '',
    occupation: '',
    annualIncome: '',
    socialCategory: '',
    educationLevel: '',
    gender: 'ALL',
    disabilityStatus: 'NOT_REQUIRED',
    landholdingAcres: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('likely');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.age || !formData.state || !formData.occupation || !formData.annualIncome || !formData.socialCategory || !formData.educationLevel) {
      setError('Please fill in all mandatory fields to evaluate scheme rules.');
      return;
    }

    const ageNum = parseInt(formData.age, 10);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      setError('Please enter a valid age between 1 and 120 years.');
      return;
    }

    const incomeNum = parseFloat(formData.annualIncome);
    if (isNaN(incomeNum) || incomeNum < 0) {
      setError('Annual family income cannot be negative.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        age: ageNum,
        state: formData.state,
        occupation: formData.occupation,
        annualIncome: incomeNum,
        socialCategory: formData.socialCategory,
        educationLevel: formData.educationLevel,
        gender: formData.gender,
        disabilityStatus: formData.disabilityStatus,
        landholdingAcres: formData.landholdingAcres ? parseFloat(formData.landholdingAcres) : null,
      };

      const data = await eligibilityService.checkEligibility(payload);
      setResults(data);

      // Default active tab to likely if present, else possibly, else not
      if (data.likelyEligible?.length > 0) setActiveTab('likely');
      else if (data.possiblyEligible?.length > 0) setActiveTab('possibly');
      else setActiveTab('not');

      // Smooth scroll down to results
      setTimeout(() => {
        document.getElementById('evaluation-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err.response?.data?.message || 'Eligibility evaluation failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScheme = async (schemeId) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    try {
      await schemeService.saveScheme(schemeId);
      alert('Scheme successfully saved to your bookmarks!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-50 text-gov-teal flex items-center justify-center shadow-xs mb-3">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t('eligibility.title')}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          {t('eligibility.subtitle')}
        </p>
      </div>

      {/* Preliminary Guidance Disclaimer */}
      <DisclaimerBanner />

      {/* Main Eligibility Form */}
      <div className="card-gov p-8 sm:p-10 shadow-lg">
        {/* Privacy Note */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl mb-8 flex items-start gap-3 text-xs sm:text-sm text-blue-900">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t('eligibility.privacyNote')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-start gap-3 text-sm text-red-800">
            <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. {t('eligibility.ageLabel')} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                max="120"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 35"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-teal focus:bg-white text-base"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                2. {t('eligibility.stateLabel')} <span className="text-red-500">*</span>
              </label>
              <select
                required
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-teal focus:bg-white text-base cursor-pointer"
              >
                <option value="">-- {t('eligibility.selectState')} --</option>
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                3. {t('eligibility.occupationLabel')} <span className="text-red-500">*</span>
              </label>
              <select
                required
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-teal focus:bg-white text-base cursor-pointer"
              >
                <option value="">-- {t('eligibility.selectOccupation')} --</option>
                {OCCUPATIONS.map((occ) => (
                  <option key={occ} value={occ}>{occ}</option>
                ))}
              </select>
            </div>

            {/* Annual Family Income */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                4. {t('eligibility.incomeLabel')} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                step="1000"
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleChange}
                placeholder="e.g. 150000"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-teal focus:bg-white text-base"
              />
              <span className="text-xs text-slate-500 mt-1 block">
                {t('eligibility.incomeHelp')}
              </span>
            </div>

            {/* Social Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                5. {t('eligibility.socialCategoryLabel')} <span className="text-red-500">*</span>
              </label>
              <select
                required
                name="socialCategory"
                value={formData.socialCategory}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-teal focus:bg-white text-base cursor-pointer"
              >
                <option value="">-- Select Category --</option>
                {SOCIAL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <span className="text-xs text-slate-500 mt-1 block">
                {t('eligibility.categoryHelp')}
              </span>
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                6. {t('eligibility.educationLabel')} <span className="text-red-500">*</span>
              </label>
              <select
                required
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-teal focus:bg-white text-base cursor-pointer"
              >
                <option value="">-- {t('eligibility.selectEducation')} --</option>
                {EDUCATION_LEVELS.map((edu) => (
                  <option key={edu} value={edu}>{edu}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Fields Accordion / Section */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
              Optional Details (For Specific Target Schemes)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  {t('eligibility.genderLabel')}
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700"
                >
                  <option value="ALL">Any / Prefer not to specify</option>
                  <option value="FEMALE">Female</option>
                  <option value="MALE">Male</option>
                  <option value="TRANSGENDER">Transgender</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  {t('eligibility.disabilityLabel')}
                </label>
                <select
                  name="disabilityStatus"
                  value={formData.disabilityStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700"
                >
                  <option value="NOT_REQUIRED">No disability</option>
                  <option value="REQUIRED">Yes (Benchmark Disability)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  {t('eligibility.landholdingLabel')}
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  name="landholdingAcres"
                  value={formData.landholdingAcres}
                  onChange={handleChange}
                  placeholder="e.g. 2.5"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Evaluate Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gov-teal hover:bg-teal-700 text-white font-black rounded-2xl shadow-md transition-all inline-flex items-center justify-center gap-2 text-lg active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  {t('eligibility.evaluating')}
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  {t('eligibility.checkBtn')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {results && (
        <div id="evaluation-results" className="space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t('eligibility.resultsTitle')}
            </h2>
            <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-lg text-slate-600 uppercase tracking-wider">
              Evaluated {results.totalEvaluated} Schemes
            </span>
          </div>

          {/* 3 Categories Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setActiveTab('likely')}
              className={`p-4 rounded-2xl font-bold text-left transition-all border ${
                activeTab === 'likely'
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5" />
                  Likely Eligible
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                  activeTab === 'likely' ? 'bg-white text-emerald-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {results.likelyEligible?.length || 0}
                </span>
              </div>
              <p className={`text-xs ${activeTab === 'likely' ? 'text-emerald-100' : 'text-slate-500'}`}>
                Satisfies all mandatory criteria
              </p>
            </button>

            <button
              onClick={() => setActiveTab('possibly')}
              className={`p-4 rounded-2xl font-bold text-left transition-all border ${
                activeTab === 'possibly'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base flex items-center gap-1.5">
                  <AlertTriangle className="w-5 h-5" />
                  Possibly Eligible
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                  activeTab === 'possibly' ? 'bg-white text-amber-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {results.possiblyEligible?.length || 0}
                </span>
              </div>
              <p className={`text-xs ${activeTab === 'possibly' ? 'text-amber-100' : 'text-slate-500'}`}>
                Additional details needed
              </p>
            </button>

            <button
              onClick={() => setActiveTab('not')}
              className={`p-4 rounded-2xl font-bold text-left transition-all border ${
                activeTab === 'not'
                  ? 'bg-slate-700 text-white border-slate-800 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base flex items-center gap-1.5">
                  <XCircle className="w-5 h-5" />
                  Not Eligible
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                  activeTab === 'not' ? 'bg-white text-slate-900' : 'bg-slate-200 text-slate-800'
                }`}>
                  {results.notEligible?.length || 0}
                </span>
              </div>
              <p className={`text-xs ${activeTab === 'not' ? 'text-slate-300' : 'text-slate-500'}`}>
                Conditions unmet
              </p>
            </button>
          </div>

          {/* Results List */}
          <div className="space-y-4">
            {activeTab === 'likely' && (
              <>
                {results.likelyEligible?.length === 0 ? (
                  <div className="card-gov p-10 text-center text-slate-500">
                    No schemes completely match this profile configuration. Check the "Possibly Eligible" tab for schemes requiring more details.
                  </div>
                ) : (
                  results.likelyEligible.map((item) => (
                    <EligibilityItemCard key={item.schemeId} item={item} statusType="likely" onSave={handleSaveScheme} language={i18n.language} />
                  ))
                )}
              </>
            )}

            {activeTab === 'possibly' && (
              <>
                {results.possiblyEligible?.length === 0 ? (
                  <div className="card-gov p-10 text-center text-slate-500">
                    No schemes pending additional information.
                  </div>
                ) : (
                  results.possiblyEligible.map((item) => (
                    <EligibilityItemCard key={item.schemeId} item={item} statusType="possibly" onSave={handleSaveScheme} language={i18n.language} />
                  ))
                )}
              </>
            )}

            {activeTab === 'not' && (
              <>
                {results.notEligible?.length === 0 ? (
                  <div className="card-gov p-10 text-center text-slate-500">
                    Great news! None of the evaluated schemes were disqualified based on known rules.
                  </div>
                ) : (
                  results.notEligible.map((item) => (
                    <EligibilityItemCard key={item.schemeId} item={item} statusType="not" onSave={handleSaveScheme} language={i18n.language} />
                  ))
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for individual evaluated result card
const EligibilityItemCard = ({ item, statusType, onSave, language }) => {
  const { t } = useTranslation();

  const isLikely = statusType === 'likely';
  const isPossibly = statusType === 'possibly';
  const isNot = statusType === 'not';

  const ttsText = `${item.schemeName}. Benefits: ${item.benefits}. Status: ${
    isLikely ? 'Likely Eligible' : isPossibly ? 'Possibly Eligible' : 'Not Eligible'
  }.`;

  return (
    <div className={`card-gov p-6 sm:p-8 space-y-5 border-l-8 ${
      isLikely
        ? 'border-l-emerald-500'
        : isPossibly
        ? 'border-l-amber-500'
        : 'border-l-slate-400'
    }`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-3 py-1 text-xs font-bold rounded-lg ${
            isLikely
              ? 'bg-emerald-100 text-emerald-800'
              : isPossibly
              ? 'bg-amber-100 text-amber-800'
              : 'bg-slate-100 text-slate-700'
          }`}>
            {isLikely ? 'LIKELY ELIGIBLE' : isPossibly ? 'POSSIBLY ELIGIBLE' : 'NOT ELIGIBLE BASED ON KNOWN RULES'}
          </span>

          <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-600">
            {item.category}
          </span>

          <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-800">
            {item.governmentLevel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <TextToSpeechPlayer text={ttsText} language={language} />

          <button
            onClick={() => onSave(item.schemeId)}
            className="p-2 text-slate-400 hover:text-gov-teal rounded-lg hover:bg-slate-100 transition-colors"
            title="Save Scheme"
          >
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scheme Title */}
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
          <Link to={`/user/schemes/${item.schemeId}`} className="hover:text-gov-teal">
            {item.schemeName}
          </Link>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {item.department} | Last Verified: {item.lastVerifiedAt}
        </p>
      </div>

      {/* Benefits Highlight */}
      <div className="p-3.5 bg-teal-50/70 border border-teal-100 rounded-xl text-sm font-semibold text-teal-900">
        <span className="text-xs uppercase tracking-wider text-teal-700 font-bold block mb-0.5">
          Scheme Benefit:
        </span>
        {item.benefits}
      </div>

      {/* Criteria Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
        {/* Met Conditions */}
        {item.matchingConditions?.length > 0 && (
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-2">
            <span className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {t('eligibility.matchedCriteria')}
            </span>
            <ul className="space-y-1.5 text-emerald-800">
              {item.matchingConditions.map((cond, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{cond}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Unmet Conditions */}
        {item.unmetConditions?.length > 0 && (
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-100 space-y-2">
            <span className="font-bold text-red-900 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-red-600" />
              {t('eligibility.unmetCriteria')}
            </span>
            <ul className="space-y-1.5 text-red-800">
              {item.unmetConditions.map((cond, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-red-500 font-bold">•</span>
                  <span>{cond}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Missing / Verification Details */}
        {item.missingDetails?.length > 0 && (
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100 space-y-2 md:col-span-2">
            <span className="font-bold text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              {t('eligibility.missingCriteria')}
            </span>
            <ul className="space-y-1.5 text-amber-800">
              {item.missingDetails.map((cond, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{cond}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Required Documents Summary */}
      {item.requiredDocuments?.length > 0 && (
        <div className="pt-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Key Documents Required:
          </span>
          <div className="flex flex-wrap gap-2">
            {item.requiredDocuments.map((doc, i) => (
              <span key={i} className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                {doc}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <Link
          to={`/user/schemes/${item.schemeId}`}
          className="px-4 py-2.5 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          View Full Scheme Details
        </Link>

        {item.officialUrl && (
          <a
            href={item.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 text-sm font-bold text-white bg-gov-teal hover:bg-teal-700 rounded-xl shadow-xs inline-flex items-center gap-1.5 transition-colors"
          >
            Apply on Official Portal
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};

export default EligibilityPage;


