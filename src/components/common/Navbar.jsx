import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import {
  Shield,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Search,
  CheckCircle,
  Mic,
  Bookmark,
  Lock,
} from 'lucide-react';

const Navbar = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-gov-navy to-gov-teal flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black text-gov-navy tracking-tight">GovGuide</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  India
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                {t('app.tagline')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/') ? 'text-gov-teal bg-teal-50' : 'text-slate-700 hover:text-gov-navy hover:bg-slate-100'
              }`}
            >
              {t('nav.home')}
            </Link>

            <Link
              to="/user/schemes"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/user/schemes') ? 'text-gov-teal bg-teal-50' : 'text-slate-700 hover:text-gov-navy hover:bg-slate-100'
              }`}
            >
              {t('nav.schemes')}
            </Link>

            <Link
              to="/user/eligibility"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/user/eligibility') ? 'text-gov-teal bg-teal-50' : 'text-slate-700 hover:text-gov-navy hover:bg-slate-100'
              }`}
            >
              {t('nav.eligibility')}
            </Link>

            <Link
              to="/user/voice-assistant"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors inline-flex items-center gap-1.5 ${
                isActive('/user/voice-assistant') ? 'text-gov-teal bg-teal-50' : 'text-slate-700 hover:text-gov-navy hover:bg-slate-100'
              }`}
            >
              <Mic className="w-4 h-4 text-gov-teal" />
              {t('nav.voice')}
            </Link>

            {isAuthenticated && !isAdmin && (
              <>
                <Link
                  to="/user/dashboard"
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive('/user/dashboard') ? 'text-gov-teal bg-teal-50' : 'text-slate-700 hover:text-gov-navy hover:bg-slate-100'
                  }`}
                >
                  {t('nav.dashboard')}
                </Link>
                <Link
                  to="/user/saved-schemes"
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive('/user/saved-schemes') ? 'text-gov-teal bg-teal-50' : 'text-slate-700 hover:text-gov-navy hover:bg-slate-100'
                  }`}
                >
                  {t('nav.saved')}
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive('/admin/dashboard') ? 'text-gov-teal bg-teal-50' : 'text-slate-700 hover:text-gov-navy hover:bg-slate-100'
                }`}
              >
                {t('nav.admin')}
              </Link>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />

            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <Link
                  to={isAdmin ? "/admin/dashboard" : "/user/profile"}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-sm font-semibold"
                >
                  <User className="w-4 h-4 text-gov-teal" />
                  <span className="max-w-[120px] truncate">{user?.fullName?.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                  title={t('nav.logout')}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gov-navy hover:text-gov-teal hover:bg-slate-100 rounded-xl transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gov-teal hover:bg-teal-700 rounded-xl shadow-xs transition-colors"
                >
                  {t('nav.register')}
                </Link>
                <Link
                  to="/admin/login"
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
                  title={t('nav.adminLogin')}
                >
                  <Lock className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-slate-100"
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/user/schemes"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-slate-100"
          >
            {t('nav.schemes')}
          </Link>
          <Link
            to="/user/eligibility"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-slate-100"
          >
            {t('nav.eligibility')}
          </Link>
          <Link
            to="/user/voice-assistant"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-slate-100"
          >
            {t('nav.voice')}
          </Link>

          {isAuthenticated ? (
            <>
              {!isAdmin && (
                <>
                  <Link
                    to="/user/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-slate-100"
                  >
                    {t('nav.dashboard')}
                  </Link>
                  <Link
                    to="/user/saved-schemes"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-slate-100"
                  >
                    {t('nav.saved')}
                  </Link>
                  <Link
                    to="/user/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-slate-100"
                  >
                    {t('nav.profile')}
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-slate-100"
                >
                  {t('nav.admin')}
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2.5 rounded-xl font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 font-semibold text-gov-navy bg-slate-100 rounded-xl"
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 font-semibold text-white bg-gov-teal rounded-xl shadow-xs"
              >
                {t('nav.register')}
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                {t('nav.adminLogin')}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;


