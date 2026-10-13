import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, ExternalLink } from 'lucide-react';

const DisclaimerBanner = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-xs mb-6 text-sm text-amber-900 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="font-semibold text-amber-950">
          Official Government Portal Notice & Preliminary Guidance
        </p>
        <p className="text-amber-800 leading-relaxed">
          {t('eligibility.disclaimerText')} GovGuide helps Indian citizens discover schemes and check requirements. Final application submissions and verification must always be completed on the official government website (such as <span className="font-mono font-medium">gov.in</span> or <span className="font-mono font-medium">nic.in</span>). GovGuide does not charge fees or process approvals.
        </p>
      </div>
    </div>
  );
};

export default DisclaimerBanner;
