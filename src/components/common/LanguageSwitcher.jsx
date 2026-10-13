import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
];

const LanguageSwitcher = ({ variant = 'default' }) => {
  const { currentLanguage, changeLanguage } = useLanguage();

  if (variant === 'pills') {
    return (
      <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              currentLanguage === lang.code
                ? 'bg-gov-teal text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {lang.native}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center gap-1.5 bg-slate-100/90 hover:bg-slate-200/80 px-3 py-1.5 rounded-xl border border-slate-200 text-sm font-medium transition-colors">
      <Globe className="w-4 h-4 text-gov-teal" />
      <select
        value={currentLanguage}
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-transparent border-none text-slate-800 text-sm font-semibold focus:outline-none cursor-pointer pr-1"
        aria-label="Select website language"
      >
        <option value="en">English</option>
        <option value="te">తెలుగు (Telugu)</option>
        <option value="hi">हिंदी (Hindi)</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;


