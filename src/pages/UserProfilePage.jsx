import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Mail, Phone, Globe, Shield, LogOut, CheckCircle2 } from 'lucide-react';

const UserProfilePage = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [successMsg, setSuccessMsg] = useState('');

  const handleLanguageUpdate = async (e) => {
    const newLang = e.target.value;
    await changeLanguage(newLang);
    setSuccessMsg('Language preference updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {t('nav.profile')}
        </h1>
        <p className="text-slate-600 text-sm">
          Manage your personal details and interface preferences.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl flex items-center gap-3 text-sm text-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Account Info Card */}
      <div className="card-gov p-8 space-y-6 shadow-md">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-gov-teal flex items-center justify-center font-black text-2xl shadow-xs">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user?.fullName}</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mt-1">
              Active Citizen Account
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl">
            <Mail className="w-5 h-5 text-slate-400" />
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">Email Address</span>
              <span className="text-sm font-semibold text-slate-800">{user?.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl">
            <Phone className="w-5 h-5 text-slate-400" />
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">Mobile Number</span>
              <span className="text-sm font-semibold text-slate-800">
                {user?.mobileNumber || 'Not provided'}
              </span>
            </div>
          </div>

          {/* Preferred Language Settings */}
          <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100 space-y-2">
            <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
              <Globe className="w-4 h-4 text-gov-teal" />
              <span>Language Preference</span>
            </div>
            <p className="text-xs text-slate-500">
              Select the language used across portal pages, schemes, and eligibility evaluations.
            </p>
            <select
              value={currentLanguage}
              onChange={handleLanguageUpdate}
              className="w-full mt-2 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-teal cursor-pointer"
            >
              <option value="en">English</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={logout}
            className="px-5 py-2.5 text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl inline-flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
