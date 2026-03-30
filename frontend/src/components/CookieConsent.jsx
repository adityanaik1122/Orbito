import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLocale } from '@/contexts/LocaleContext';

const CONSENT_KEY = 'orbito.cookieConsent';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const { t } = useLocale();

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem(CONSENT_KEY, 'all');
    setVisible(false);
  };

  const essentialOnly = () => {
    localStorage.setItem(CONSENT_KEY, 'essential');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-6 z-[60] bg-white border border-gray-200 shadow-lg rounded-2xl p-4 md:p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-sm text-gray-600">
          {t('cookie_text')}{' '}
          <Link to="/privacy" className="text-[#0B3D91] font-medium hover:underline">Privacy Policy</Link>.
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={essentialOnly}>
            {t('cookie_essential')}
          </Button>
          <Button className="bg-[#0B3D91] hover:bg-[#092C6B] text-white" onClick={acceptAll}>
            {t('cookie_accept')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
