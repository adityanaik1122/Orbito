import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getDefaultLocale, getDefaultCurrency, LOCALE_OPTIONS, FX_DEFAULT_RATES, mapCountryToLocaleCurrency, t as translate, formatCurrency } from '@/lib/locale';
import { supabase } from '@/lib/customSupabaseClient';

const LocaleContext = createContext(undefined);

export const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    return localStorage.getItem('orbito.locale') || getDefaultLocale();
  });
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('orbito.currency') || getDefaultCurrency(locale);
  });
  const [country, setCountry] = useState(() => {
    return localStorage.getItem('orbito.country') || '';
  });
  const [fxRates, setFxRates] = useState(() => {
    const cached = localStorage.getItem('orbito.fxRates');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed?.rates) return parsed.rates;
      } catch {
        return FX_DEFAULT_RATES;
      }
    }
    return FX_DEFAULT_RATES;
  });
  const [profileLoaded, setProfileLoaded] = useState(false);
  const lastSyncedRef = useRef({ locale: null, currency: null });
  const userSetRef = useRef({
    locale: localStorage.getItem('orbito.locale.userSet') === 'true',
    currency: localStorage.getItem('orbito.currency.userSet') === 'true',
    country: localStorage.getItem('orbito.country.userSet') === 'true',
  });

  useEffect(() => {
    localStorage.setItem('orbito.locale', locale);
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    localStorage.setItem('orbito.currency', currency);
  }, [currency]);

  useEffect(() => {
    if (country) {
      localStorage.setItem('orbito.country', country);
    }
  }, [country]);

  useEffect(() => {
    let isMounted = true;

    const loadFromProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setProfileLoaded(true);
          return;
        }
        const { data } = await supabase
          .from('profiles')
          .select('locale, currency, country')
          .eq('id', session.user.id)
          .maybeSingle();
        if (!data) {
          setProfileLoaded(true);
          return;
        }
        if (isMounted && data) {
          if (data.locale) setLocale(data.locale);
          if (data.currency) setCurrency(data.currency);
          if (data.country) setCountry(data.country);
          lastSyncedRef.current = {
            locale: data.locale || null,
            currency: data.currency || null,
          };
        }
      } finally {
        if (isMounted) setProfileLoaded(true);
      }
    };

    loadFromProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const syncToProfile = async () => {
      if (!profileLoaded) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const last = lastSyncedRef.current;
      if (last.locale === locale && last.currency === currency) return;

      const { error } = await supabase
        .from('profiles')
        .update({ locale, currency, country })
        .eq('id', session.user.id);

      if (!error) {
        lastSyncedRef.current = { locale, currency };
      }
    };

    syncToProfile();
  }, [locale, currency, country, profileLoaded]);

  const setLocalePreset = (preset) => {
    const next = LOCALE_OPTIONS.find((opt) => opt.id === preset);
    if (next) {
      setLocale(next.locale);
      setCurrency(next.currency);
      userSetRef.current.locale = true;
      userSetRef.current.currency = true;
      localStorage.setItem('orbito.locale.userSet', 'true');
      localStorage.setItem('orbito.currency.userSet', 'true');
    }
  };

  const setCountryWithUser = (value) => {
    setCountry(value);
    userSetRef.current.country = true;
    localStorage.setItem('orbito.country.userSet', 'true');
  };

  useEffect(() => {
    const loadRates = async () => {
      const cached = localStorage.getItem('orbito.fxRates');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const isFresh = parsed?.fetchedAt && (Date.now() - parsed.fetchedAt) < 12 * 60 * 60 * 1000;
          if (isFresh && parsed?.rates) {
            setFxRates(parsed.rates);
            return;
          }
        } catch {
          // fallthrough to refresh
        }
      }

      try {
        const res = await fetch('/api/fx');
        if (!res.ok) return;
        const data = await res.json();
        if (data?.rates) {
          setFxRates(data.rates);
          localStorage.setItem('orbito.fxRates', JSON.stringify({
            rates: data.rates,
            fetchedAt: Date.now()
          }));
        }
      } catch {
        // keep defaults on failure
      }
    };

    loadRates();
  }, []);

  useEffect(() => {
    const applyGeoDefaults = async () => {
      if (userSetRef.current.locale || userSetRef.current.currency) return;
      if (country || userSetRef.current.country) return;
      try {
        const res = await fetch('/api/geo');
        if (!res.ok) return;
        const data = await res.json();
        const countryCode = data?.country_code;
        if (!countryCode) return;
        setCountry(countryCode);
        const mapped = mapCountryToLocaleCurrency(countryCode);
        if (mapped) {
          setLocale(mapped.locale);
          setCurrency(mapped.currency);
        }
      } catch {
        // ignore geo lookup failures
      }
    };

    applyGeoDefaults();
  }, [country]);

  const formatMoney = (amount, fromCurrency) => {
    return formatCurrency(amount, fromCurrency || 'USD', currency, locale, fxRates);
  };

  const value = useMemo(() => ({
    locale,
    currency,
    country,
    setLocale,
    setCurrency,
    setLocalePreset,
    setCountry: setCountryWithUser,
    formatMoney,
    t: (key) => translate(key, locale),
  }), [locale, currency, country, fxRates]);

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
