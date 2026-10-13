import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, ExternalLink, Heart, Globe, PhoneCall } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Vision */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-blue-500 flex items-center justify-center text-white shadow-md">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">GovGuide</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('app.subtagline')}
            </p>
            <div className="pt-2">
              <span className="text-xs text-slate-400 font-medium block mb-2">Switch Language:</span>
              <LanguageSwitcher variant="pills" />
            </div>
          </div>

          {/* Citizen Portals */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/user/schemes" className="hover:text-teal-400 transition-colors">
                  {t('nav.schemes')}
                </a>
              </li>
              <li>
                <a href="/user/eligibility" className="hover:text-teal-400 transition-colors">
                  {t('nav.eligibility')}
                </a>
              </li>
              <li>
                <a href="/user/voice-assistant" className="hover:text-teal-400 transition-colors">
                  {t('nav.voice')}
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-teal-400 transition-colors">
                  {t('nav.login')}
                </a>
              </li>
              <li>
                <a href="/admin/login" className="hover:text-teal-400 transition-colors">
                  {t('nav.adminLogin')}
                </a>
              </li>
            </ul>
          </div>

          {/* Official Portals Directory */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4">
              Official Portals
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a
                  href="https://pmkisan.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-400 transition-colors inline-flex items-center gap-1.5"
                >
                  PM-KISAN Portal <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmjay.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-400 transition-colors inline-flex items-center gap-1.5"
                >
                  Ayushman Bharat PM-JAY <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmaymis.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-400 transition-colors inline-flex items-center gap-1.5"
                >
                  PMAY Housing Portal <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://scholarships.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-400 transition-colors inline-flex items-center gap-1.5"
                >
                  National Scholarship Portal <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.india.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-400 transition-colors inline-flex items-center gap-1.5"
                >
                  National Portal of India <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Emergency & Support Helplines */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4">
              Government Helplines
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-teal-400" />
                <div>
                  <span className="font-semibold text-slate-200 block">14555</span>
                  <span className="text-xs">Ayushman Bharat Toll-Free</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-teal-400" />
                <div>
                  <span className="font-semibold text-slate-200 block">155261 / 011-24300606</span>
                  <span className="text-xs">PM-KISAN Helpline</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-teal-400" />
                <div>
                  <span className="font-semibold text-slate-200 block">1800-11-6446</span>
                  <span className="text-xs">PMAY Housing Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-center md:text-left leading-relaxed max-w-3xl">
            Disclaimer: GovGuide is an assistive welfare discovery platform. Information is gathered from verified government sources (.gov.in, .nic.in). GovGuide is not an official government agency and does not charge citizens or grant approvals. Final eligibility decisions are made by relevant government ministries.
          </p>
          <p className="shrink-0">
            © 2026 GovGuide. Built for Indian Citizens.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
