import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { schemeService } from '../services/schemeService';
import SchemeCard from '../components/schemes/SchemeCard';
import {
  Sparkles,
  Layers,
  CheckCircle2,
  Bookmark,
  Mic,
  ArrowRight,
  Search,
  User,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

const UserDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [recentSchemes, setRecentSchemes] = useState([]);
  const [recommendedSchemes, setRecommendedSchemes] = useState([]);
  const [savedCount, setSavedCount] = useState(0);
  const [totalSchemes, setTotalSchemes] = useState(8);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [recent, recommended, saved, allSchemes] = await Promise.all([
          schemeService.getRecentSchemes(),
          schemeService.getRecommendedSchemes(),
          schemeService.getSavedSchemes(),
          schemeService.getSchemes({ size: 1 }),
        ]);

        setRecentSchemes(recent);
        setRecommendedSchemes(recommended);
        setSavedCount(saved.length);
        if (allSchemes.totalElements) {
          setTotalSchemes(allSchemes.totalElements);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-10 py-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-gov-navy to-teal-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-teal-400/20 text-teal-300 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Citizen Portal Dashboard
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t('dashboard.welcome')}, {user?.fullName}!
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            Discover welfare initiatives curated for you, verify official application documents, and use voice assistance in your preferred language.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card-gov p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-gov-blue flex items-center justify-center shrink-0">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900">{totalSchemes}</span>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              {t('dashboard.totalSchemes')}
            </p>
          </div>
        </div>

        <div className="card-gov p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-gov-teal flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900">{totalSchemes}</span>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              {t('dashboard.matchedSchemes')}
            </p>
          </div>
        </div>

        <div className="card-gov p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Bookmark className="w-7 h-7" />
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900">{savedCount}</span>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              {t('dashboard.savedSchemes')}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          {t('dashboard.quickActions')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link
            to="/user/eligibility"
            className="card-gov p-6 hover:border-gov-teal group transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-gov-teal flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-gov-teal transition-colors">
              Check My Eligibility
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Enter your age, occupation, and state to discover every scheme you qualify for.
            </p>
            <span className="text-xs font-bold text-gov-teal inline-flex items-center gap-1">
              Start Evaluation <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/user/schemes"
            className="card-gov p-6 hover:border-gov-blue group transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-gov-blue flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-gov-blue transition-colors">
              Browse Government Schemes
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Explore agriculture, healthcare, housing, and education schemes across India.
            </p>
            <span className="text-xs font-bold text-gov-blue inline-flex items-center gap-1">
              View All Schemes <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/user/voice-assistant"
            className="card-gov p-6 hover:border-amber-500 group transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-amber-600 transition-colors">
              GovGuide Voice Assistant
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Speak in Telugu, Hindi, or English to hear scheme details read aloud.
            </p>
            <span className="text-xs font-bold text-amber-600 inline-flex items-center gap-1">
              Speak to Assistant <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>

      {/* Recommended Schemes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {t('dashboard.recommended')}
          </h2>
          <Link
            to="/user/schemes"
            className="text-xs font-bold text-gov-teal hover:underline inline-flex items-center gap-1"
          >
            View More <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedSchemes.slice(0, 3).map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      </div>

      {/* Recently Added Schemes */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          {t('dashboard.recentSchemes')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentSchemes.slice(0, 3).map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;


