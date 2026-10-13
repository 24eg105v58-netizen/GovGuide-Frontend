import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { schemeService } from '../../services/schemeService';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  ExternalLink,
  Bookmark,
  CheckCircle2,
  Calendar,
  Building2,
  FileText,
  Users,
} from 'lucide-react';

const SchemeCard = ({ scheme, onSaveToggle }) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(scheme.isSaved || false);
  const [saving, setSaving] = useState(false);

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
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
      if (onSaveToggle) onSaveToggle(scheme.id, !isSaved);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const isVerified = scheme.verificationStatus === 'VERIFIED';

  return (
    <div className="card-gov p-6 flex flex-col justify-between relative group hover:border-gov-teal/60 transition-all duration-300">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                scheme.governmentLevel === 'CENTRAL'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {scheme.governmentLevel === 'CENTRAL' ? t('schemes.central') : t('schemes.state')}
            </span>

            <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700">
              {scheme.category}
            </span>

            {isVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t('schemes.verified')}
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleToggleSave}
            disabled={saving}
            className={`p-2 rounded-xl transition-colors ${
              isSaved
                ? 'bg-teal-50 text-gov-teal'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={isSaved ? 'Remove Bookmark' : 'Save Scheme'}
            aria-label="Save Scheme"
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Scheme Name */}
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-gov-teal transition-colors line-clamp-2 mb-2">
          <Link to={`/user/schemes/${scheme.id}`}>
            {scheme.schemeName}
          </Link>
        </h3>

        {/* Department */}
        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-3">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{scheme.department}</span>
        </p>

        {/* Short Description */}
        <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
          {scheme.shortDescription}
        </p>

        {/* Benefits Highlight */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            {t('schemes.benefits')}
          </span>
          <p className="text-sm font-semibold text-teal-800 line-clamp-2">
            {scheme.benefits}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-100 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/user/schemes/${scheme.id}`}
            className="px-3.5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl text-center transition-colors"
          >
            {t('schemes.viewDetails')}
          </Link>

          <Link
            to="/user/eligibility"
            className="px-3.5 py-2.5 text-sm font-semibold text-white bg-gov-blue hover:bg-blue-900 rounded-xl text-center transition-colors"
          >
            {t('schemes.checkEligibility')}
          </Link>
        </div>

        {scheme.officialUrl && (
          <a
            href={scheme.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-3.5 py-2 text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-xl text-center transition-colors inline-flex items-center justify-center gap-1.5 border border-teal-200"
          >
            {t('schemes.officialPortal')}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

export default SchemeCard;


