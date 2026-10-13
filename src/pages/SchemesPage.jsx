import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { schemeService } from '../services/schemeService';
import SchemeCard from '../components/schemes/SchemeCard';
import SchemeFilter from '../components/schemes/SchemeFilter';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import { Layers, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

const initialFilters = {
  keyword: '',
  state: 'ALL',
  occupation: 'ALL',
  category: 'ALL',
  governmentLevel: 'ALL',
};

const SchemesPage = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState(initialFilters);
  const [schemes, setSchemes] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const data = await schemeService.getSchemes({
        ...filters,
        page,
        size: 9,
      });
      setSchemes(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Error fetching schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [filters, page]);

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setPage(0);
  };

  return (
    <div className="space-y-8 py-6">
      {/* Title Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {t('schemes.title')}
        </h1>
        <p className="text-slate-600 text-base max-w-2xl">
          {t('schemes.subtitle')}
        </p>
      </div>

      {/* Preliminary guidance banner */}
      <DisclaimerBanner />

      {/* Filter Component */}
      <SchemeFilter
        filters={filters}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setPage(0);
        }}
        onReset={handleResetFilters}
      />

      {/* Schemes Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
          <Loader2 className="w-10 h-10 animate-spin text-gov-teal" />
          <p className="font-semibold text-sm">Loading verified schemes...</p>
        </div>
      ) : schemes.length === 0 ? (
        <div className="card-gov p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">
            {t('schemes.noSchemesFound')}
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Try resetting your filters or searching with different keywords like 'farmer', 'health', or 'student'.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 bg-gov-teal text-white font-bold rounded-xl text-sm hover:bg-teal-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            <span>Showing {schemes.length} of {totalElements} Verified Schemes</span>
            <span>Page {page + 1} of {totalPages}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50 inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>

              <span className="text-sm font-bold text-slate-600 px-3">
                {page + 1} / {totalPages}
              </span>

              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50 inline-flex items-center gap-2"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SchemesPage;

