import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, RotateCcw } from 'lucide-react';

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

export const OCCUPATIONS = [
  'Farmer', 'Agricultural labourer', 'Student', 'Unemployed',
  'Daily wage worker', 'Private employee', 'Government employee',
  'Self-employed', 'Small business owner', 'Homemaker', 'Senior citizen', 'Other'
];

export const SCHEME_CATEGORIES = [
  'Agriculture', 'Healthcare', 'Housing', 'Education', 'Social Welfare',
  'Financial Services', 'Employment', 'Women & Child', 'Skill Development'
];

const SchemeFilter = ({ filters, onFilterChange, onReset }) => {
  const { t } = useTranslation();

  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8 space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={filters.keyword || ''}
          onChange={(e) => handleChange('keyword', e.target.value)}
          placeholder={t('schemes.searchPlaceholder')}
          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gov-teal focus:bg-white text-base transition-all"
        />
      </div>

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
        {/* State Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            {t('schemes.filterState')}
          </label>
          <select
            value={filters.state || 'ALL'}
            onChange={(e) => handleChange('state', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-gov-teal focus:bg-white"
          >
            <option value="ALL">{t('schemes.allStates')}</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Occupation Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            {t('schemes.filterOccupation')}
          </label>
          <select
            value={filters.occupation || 'ALL'}
            onChange={(e) => handleChange('occupation', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-gov-teal focus:bg-white"
          >
            <option value="ALL">{t('schemes.allOccupations')}</option>
            {OCCUPATIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            {t('schemes.filterCategory')}
          </label>
          <select
            value={filters.category || 'ALL'}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-gov-teal focus:bg-white"
          >
            <option value="ALL">{t('schemes.allCategories')}</option>
            {SCHEME_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Government Level Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            {t('schemes.filterGovLevel')}
          </label>
          <select
            value={filters.governmentLevel || 'ALL'}
            onChange={(e) => handleChange('governmentLevel', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-gov-teal focus:bg-white"
          >
            <option value="ALL">{t('schemes.allLevels')}</option>
            <option value="CENTRAL">{t('schemes.central')}</option>
            <option value="STATE">{t('schemes.state')}</option>
          </select>
        </div>
      </div>

      {/* Reset Filter Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onReset}
          className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg inline-flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default SchemeFilter;
