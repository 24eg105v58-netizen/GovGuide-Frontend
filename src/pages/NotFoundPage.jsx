import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HelpCircle, ArrowLeft, Home } from 'lucide-react';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="py-20 text-center space-y-6 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
        <HelpCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-black text-slate-900 tracking-tight">404 - Page Not Found</h1>
      <p className="text-sm text-slate-600 leading-relaxed">
        The government welfare page or service link you are looking for does not exist or may have been moved.
      </p>
      <div className="flex items-center justify-center gap-3 pt-2">
        <Link to="/" className="btn-primary">
          <Home className="w-4 h-4" /> Go to Home
        </Link>
        <Link to="/user/schemes" className="btn-outline">
          Browse Schemes
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
