import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { schemeService } from '../services/schemeService';
import { useAuth } from '../context/AuthContext';
import TextToSpeechPlayer from '../components/voice/TextToSpeechPlayer';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import {
  ShieldCheck,
  Building2,
  Calendar,
  ExternalLink,
  Bookmark,
  CheckCircle2,
  FileText,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  Share2,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';

const SchemeDetailsPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();

  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchScheme = async () => {
      setLoading(true);
      try {
        const data = await schemeService.getSchemeById(id);
        setScheme(data);
        setIsSaved(data.isSaved || false);
      } catch (err) {
        setError('Unable to load scheme details. The scheme may not exist.');
      } finally {
        setLoading(false);
      }
    };
    fetchScheme();
  }, [id]);

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        await schemeService.removeSavedScheme(scheme.id);
        setIsSaved(false);
      } else {
        await schemeService.saveScheme(scheme.id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-12 h-12 border-4 border-gov-teal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 font-semibold">Loading scheme details...</p>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-800">Scheme Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'Scheme could not be located.'}</p>
        <Link to="/user/schemes" className="btn-primary">
          Back to Schemes
        </Link>
      </div>
    );
  }

  // Spoken text summary for Text-to-Speech
  const ttsSummary = `${scheme.schemeName}. Department: ${scheme.department}. Benefits: ${scheme.benefits}. ${scheme.shortDescription}`;

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/user/schemes" className="hover:text-gov-teal inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> All Schemes
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-800 truncate">{scheme.schemeName}</span>
      </div>

      {/* Main Header Card */}
      <div className="card-gov p-8 sm:p-10 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 text-xs font-bold rounded-lg ${
                scheme.governmentLevel === 'CENTRAL'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {scheme.governmentLevel === 'CENTRAL' ? t('schemes.central') : t('schemes.state')}
            </span>

            <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700">
              {scheme.category}
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Official Data
            </span>

            <span className="px-3 py-1 text-xs font-bold rounded-lg bg-green-100 text-green-800">
              Status: {scheme.applicationStatus || 'OPEN'}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <TextToSpeechPlayer text={ttsSummary} language={i18n.language} />

            <button
              onClick={handleToggleSave}
              disabled={saving}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors border ${
                isSaved
                  ? 'bg-teal-50 text-gov-teal border-teal-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? t('schemeDetails.saved') : t('schemeDetails.saveScheme')}
            </button>
          </div>
        </div>

        {/* Scheme Full Title */}
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
          {scheme.schemeName}
        </h1>

        {/* Department & Verification Source */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 font-medium mb-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span><strong>Department:</strong> {scheme.department}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span><strong>Last Verified:</strong> {scheme.lastVerifiedAt}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-slate-400" />
            <span><strong>Source:</strong> {scheme.informationSource}</span>
          </div>
        </div>

        {/* Prominent Official Apply Button & Eligibility CTA */}
        <div className="flex flex-wrap items-center gap-4 bg-teal-50/70 p-6 rounded-2xl border border-teal-100">
          <div className="flex-1 min-w-[240px]">
            <p className="text-sm font-bold text-teal-950 mb-1">
              Ready to submit your application?
            </p>
            <p className="text-xs text-teal-800">
              GovGuide directs you safely to the authenticated government website. Applications are processed directly by the ministry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/user/eligibility"
              className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl border border-slate-200 text-sm shadow-xs transition-all"
            >
              Check My Eligibility
            </Link>

            <a
              href={scheme.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gov-teal hover:bg-teal-700 text-white font-bold rounded-xl shadow-md text-sm inline-flex items-center gap-2 transition-all"
            >
              Apply on Official Portal
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Preliminary Guidance Disclaimer */}
      <DisclaimerBanner />

      {/* 2-Column Scheme Information Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Descriptions, Rules, Process */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: What is it */}
          <div className="card-gov p-6 sm:p-8 space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-gov-teal" />
              {t('schemeDetails.whatIsIt')}
            </h2>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              {scheme.detailedDescription}
            </p>
          </div>

          {/* Section 2: Why it exists */}
          {scheme.whyExists && (
            <div className="card-gov p-6 sm:p-8 space-y-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                {t('schemeDetails.whyExists')}
              </h2>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                {scheme.whyExists}
              </p>
            </div>
          )}

          {/* Section 3: Benefits Provided */}
          <div className="card-gov p-6 sm:p-8 space-y-3 border-teal-200 bg-teal-50/20">
            <h2 className="text-xl font-bold text-teal-950 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
              {t('schemeDetails.benefitsProvided')}
            </h2>
            <p className="text-slate-800 leading-relaxed text-sm sm:text-base font-medium">
              {scheme.benefits}
            </p>
          </div>

          {/* Section 4: Eligibility Conditions */}
          <div className="card-gov p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-gov-blue" />
              {t('schemeDetails.eligibilityRules')}
            </h2>

            {scheme.eligibilityRule ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-bold text-slate-400 block uppercase">Age Range</span>
                  <span className="font-semibold text-slate-800">
                    {scheme.eligibilityRule.minimumAge} to {scheme.eligibilityRule.maximumAge} years
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-bold text-slate-400 block uppercase">Eligible States</span>
                  <span className="font-semibold text-slate-800">
                    {scheme.eligibilityRule.eligibleStates}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-bold text-slate-400 block uppercase">Target Occupations</span>
                  <span className="font-semibold text-slate-800">
                    {scheme.eligibilityRule.eligibleOccupations}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-bold text-slate-400 block uppercase">Family Income Ceiling</span>
                  <span className="font-semibold text-slate-800">
                    {scheme.eligibilityRule.maximumIncome ? `Up to ₹${scheme.eligibilityRule.maximumIncome}` : 'No explicit cap'}
                  </span>
                </div>

                {scheme.eligibilityRule.additionalConditions && (
                  <div className="p-3 bg-slate-50 rounded-xl sm:col-span-2">
                    <span className="text-xs font-bold text-slate-400 block uppercase">Additional Criteria</span>
                    <span className="font-medium text-slate-700">
                      {scheme.eligibilityRule.additionalConditions}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-600">
                General welfare guidelines apply. Check official notifications for amendments.
              </p>
            )}
          </div>

          {/* Section 5: Step-by-Step Application Process */}
          <div className="card-gov p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              {t('schemeDetails.applicationProcess')}
            </h2>
            <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed whitespace-pre-line text-slate-700 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              {scheme.applicationProcess}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Required Documents & Support */}
        <div className="space-y-6">
          {/* Required Documents Card */}
          <div className="card-gov p-6 space-y-4 sticky top-28">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <FileText className="w-5 h-5 text-gov-teal" />
              <h3 className="font-bold text-slate-900 text-lg">
                {t('schemeDetails.documentsRequired')}
              </h3>
            </div>

            {scheme.documents && scheme.documents.length > 0 ? (
              <ul className="space-y-3.5">
                {scheme.documents.map((doc, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-bold text-slate-800">
                        {doc.documentName}
                      </span>
                      {doc.mandatoryStatus && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-red-100 text-red-700 shrink-0">
                          Mandatory
                        </span>
                      )}
                    </div>
                    {doc.description && (
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {doc.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">
                Aadhaar card and standard identification documents typically required.
              </p>
            )}

            <div className="pt-4 border-t border-slate-100">
              <a
                href={scheme.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-gov-teal hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs text-sm inline-flex items-center justify-center gap-2 transition-all"
              >
                Apply on Official Portal
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetailsPage;


