'use client';

import { useState, useEffect } from 'react';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Charger les préférences depuis le localStorage
    const savedConsent = localStorage.getItem('cookie-consent');
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        setPreferences(parsed);
      } catch (error) {
        console.error('Erreur lors du chargement des préférences cookies:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  const savePreferences = (newPreferences: CookiePreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem('cookie-consent', JSON.stringify(newPreferences));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    
    // Appliquer les préférences
    applyCookiePreferences(newPreferences);
  };

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // Cookies essentiels - toujours activés
    if (prefs.essential) {
      // Activer les cookies de session, authentification, etc.
      console.log('Cookies essentiels activés');
    }

    // Cookies analytiques
    if (prefs.analytics) {
      // Activer Google Analytics, Matomo, etc.
      console.log('Cookies analytiques activés');
      // Exemple: gtag('consent', 'update', { analytics_storage: 'granted' });
    } else {
      // Désactiver les analytics
      console.log('Cookies analytiques désactivés');
      // Exemple: gtag('consent', 'update', { analytics_storage: 'denied' });
    }

    // Cookies marketing
    if (prefs.marketing) {
      // Activer les cookies publicitaires
      console.log('Cookies marketing activés');
      // Exemple: gtag('consent', 'update', { ad_storage: 'granted' });
    } else {
      // Désactiver les cookies publicitaires
      console.log('Cookies marketing désactivés');
      // Exemple: gtag('consent', 'update', { ad_storage: 'denied' });
    }

    // Cookies de préférences
    if (prefs.preferences) {
      // Activer les cookies de personnalisation
      console.log('Cookies de préférences activés');
    } else {
      // Désactiver les cookies de personnalisation
      console.log('Cookies de préférences désactivés');
    }
  };

  const hasConsent = (type: keyof CookiePreferences): boolean => {
    if (!preferences) return false;
    return preferences[type];
  };

  const canTrackAnalytics = (): boolean => {
    return hasConsent('analytics');
  };

  const canTrackMarketing = (): boolean => {
    return hasConsent('marketing');
  };

  const canStorePreferences = (): boolean => {
    return hasConsent('preferences');
  };

  const resetConsent = () => {
    localStorage.removeItem('cookie-consent');
    localStorage.removeItem('cookie-consent-date');
    setPreferences(null);
  };

  return {
    preferences,
    isLoaded,
    savePreferences,
    hasConsent,
    canTrackAnalytics,
    canTrackMarketing,
    canStorePreferences,
    resetConsent,
  };
}
