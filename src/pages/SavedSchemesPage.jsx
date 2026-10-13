import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { schemeService } from '../services/schemeService';
import SchemeCard from '../components/schemes/SchemeCard';
import { Bookmark, ArrowRight, Layers, Loader2 } from 'lucide-react';

const SavedSchemesPage = () => {
  const { t } = useTranslation();
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const data = await schemeService.getSavedSchemes();
      setSavedSchemes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleSaveToggle = (schemeId, isNowSaved) => {
    if (!isNowSaved) {
      setSavedSchemes((prev) => prev.filter((s) => s.id !== schemeId));
    }
  };

  return (
    <div className="space-y-8 py-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold">
          <Bookmark className="w-3.5 h-3.5" /> Bookmarked Initiatives
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {t('dashboard.savedSchemes')}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Quickly access welfare schemes you have saved for application preparation.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
          <Loader2 className="w-10 h-10 animate-spin text-gov-teal" />
          <p className="font-semibold text-sm">Loading your saved schemes...</p>
        </div>
      ) : savedSchemes.length === 0 ? (
        <div className="card-gov p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">
            No schemes bookmarked yet
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Browse government schemes or check your eligibility, and click the bookmark icon on any card to save it here.
          </p>
          <Link to="/user/schemes" className="btn-primary">
            Browse Government Schemes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedSchemes.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={{ ...scheme, isSaved: true }}
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedSchemesPage;

