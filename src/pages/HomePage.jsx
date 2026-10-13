import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { schemeService } from '../services/schemeService';
import SchemeCard from '../components/schemes/SchemeCard';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import {
  ShieldCheck,
  CheckCircle,
  Search,
  Mic,
  ArrowRight,
  Users,
  Building,
  HeartHandshake,
  Sparkles,
  HelpCircle,
  FileCheck2,
} from 'lucide-react';

const HomePage = () => {
  const { t } = useTranslation();
  const [featuredSchemes, setFeaturedSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const schemes = await schemeService.getRecentSchemes();
        setFeaturedSchemes(schemes.slice(0, 3));
      } catch (err) {
        console.error('Failed to load featured schemes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gov-navy via-blue-900 to-teal-900 text-white p-8 sm:p-12 lg:p-16 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs sm:text-sm font-semibold">
            <Sparkles className="w-4 h-4 text-teal-300" />
            Verified Indian Welfare Schemes Platform
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none text-white">
            {t('home.heroTitle')}
          </h1>

          <p className="text-base sm:text-xl text-slate-200 leading-relaxed font-normal">
            {t('home.heroSubtitle')}
          </p>

          {/* Large Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              to="/user/eligibility"
              className="px-7 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-2xl shadow-lg hover:shadow-teal-500/20 transition-all text-base sm:text-lg inline-flex items-center gap-2.5 active:scale-95"
            >
              <CheckCircle className="w-5 h-5 text-slate-950" />
              {t('home.checkEligibilityBtn')}
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/user/schemes"
              className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 transition-all text-base sm:text-lg inline-flex items-center gap-2.5 backdrop-blur-xs"
            >
              <Search className="w-5 h-5 text-teal-300" />
              {t('home.browseSchemesBtn')}
            </Link>

            <Link
              to="/user/voice-assistant"
              className="px-6 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl shadow-lg transition-all text-base sm:text-lg inline-flex items-center gap-2.5 active:scale-95"
            >
              <Mic className="w-5 h-5 text-slate-950" />
              {t('home.askVoiceBtn')}
            </Link>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Preliminary Guidance Disclaimer */}
      <DisclaimerBanner />

      {/* Voice Assistant Accessibility Highlight */}
      <section className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gov-teal flex items-center justify-center text-white shrink-0 shadow-md">
            <Mic className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t('home.voiceBannerTitle')}
            </h3>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
              {t('home.voiceBannerDesc')}
            </p>
          </div>
        </div>

        <Link
          to="/user/voice-assistant"
          className="shrink-0 px-6 py-3.5 bg-gov-teal hover:bg-teal-700 text-white font-bold rounded-xl shadow-sm transition-all inline-flex items-center gap-2 text-base"
        >
          {t('home.openVoiceBtn')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* How GovGuide Works */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {t('home.howItWorksTitle')}
          </h2>
          <p className="text-slate-600 text-base">
            Three simple steps to connect with official Indian welfare benefits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card-gov p-8 space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-gov-blue flex items-center justify-center font-black text-xl shadow-xs">
              1
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {t('home.step1Title')}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('home.step1Desc')}
            </p>
          </div>

          <div className="card-gov p-8 space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-50 text-gov-teal flex items-center justify-center font-black text-xl shadow-xs">
              2
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {t('home.step2Title')}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('home.step2Desc')}
            </p>
          </div>

          <div className="card-gov p-8 space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-xl shadow-xs">
              3
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {t('home.step3Title')}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('home.step3Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Government Schemes */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {t('home.featuredTitle')}
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Active schemes verified from official ministries and national portals.
            </p>
          </div>

          <Link
            to="/user/schemes"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-gov-teal hover:text-teal-700"
          >
            {t('home.viewAllBtn')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="card-gov p-6 h-80 animate-pulse bg-slate-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSchemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
