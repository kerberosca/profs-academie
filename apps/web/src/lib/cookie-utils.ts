'use client';

import { CookiePreferences } from '../hooks/useCookieConsent';

// Types de cookies
export enum CookieType {
  ESSENTIAL = 'essential',
  ANALYTICS = 'analytics',
  MARKETING = 'marketing',
  PREFERENCES = 'preferences',
}

// Configuration des cookies
export const COOKIE_CONFIG = {
  [CookieType.ESSENTIAL]: {
    name: 'essential_cookies',
    maxAge: 365 * 24 * 60 * 60, // 1 an
    secure: true,
    sameSite: 'strict' as const,
  },
  [CookieType.ANALYTICS]: {
    name: 'analytics_cookies',
    maxAge: 2 * 365 * 24 * 60 * 60, // 2 ans
    secure: true,
    sameSite: 'strict' as const,
  },
  [CookieType.MARKETING]: {
    name: 'marketing_cookies',
    maxAge: 2 * 365 * 24 * 60 * 60, // 2 ans
    secure: true,
    sameSite: 'strict' as const,
  },
  [CookieType.PREFERENCES]: {
    name: 'preferences_cookies',
    maxAge: 365 * 24 * 60 * 60, // 1 an
    secure: true,
    sameSite: 'strict' as const,
  },
};

// Fonction pour définir un cookie
export function setCookie(
  name: string,
  value: string,
  options: {
    maxAge?: number;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    domain?: string;
    path?: string;
  } = {}
): void {
  if (typeof window === 'undefined') return; // SSR

  const {
    maxAge = 365 * 24 * 60 * 60,
    secure = true,
    sameSite = 'strict',
    domain,
    path = '/',
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (maxAge) {
    cookieString += `; max-age=${maxAge}`;
  }

  if (secure) {
    cookieString += '; secure';
  }

  if (sameSite) {
    cookieString += `; samesite=${sameSite}`;
  }

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  if (path) {
    cookieString += `; path=${path}`;
  }

  document.cookie = cookieString;
}

// Fonction pour récupérer un cookie
export function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null; // SSR

  const nameEQ = name + '=';
  const ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }

  return null;
}

// Fonction pour supprimer un cookie
export function deleteCookie(name: string, options: { domain?: string; path?: string } = {}): void {
  if (typeof window === 'undefined') return; // SSR

  const { domain, path = '/' } = options;
  
  // Définir le cookie avec une date d'expiration dans le passé
  setCookie(name, '', {
    maxAge: -1,
    domain,
    path,
  });
}

// Fonction pour appliquer les préférences de cookies
export function applyCookiePreferences(preferences: CookiePreferences): void {
  // Cookies essentiels - toujours activés
  if (preferences.essential) {
    setCookie('session_id', generateSessionId(), COOKIE_CONFIG[CookieType.ESSENTIAL]);
    setCookie('csrf_token', generateCSRFToken(), COOKIE_CONFIG[CookieType.ESSENTIAL]);
  }

  // Cookies analytiques
  if (preferences.analytics) {
    setCookie('analytics_enabled', 'true', COOKIE_CONFIG[CookieType.ANALYTICS]);
    initializeAnalytics();
  } else {
    deleteCookie('analytics_enabled');
    disableAnalytics();
  }

  // Cookies marketing
  if (preferences.marketing) {
    setCookie('marketing_enabled', 'true', COOKIE_CONFIG[CookieType.MARKETING]);
    initializeMarketing();
  } else {
    deleteCookie('marketing_enabled');
    disableMarketing();
  }

  // Cookies de préférences
  if (preferences.preferences) {
    setCookie('preferences_enabled', 'true', COOKIE_CONFIG[CookieType.PREFERENCES]);
  } else {
    deleteCookie('preferences_enabled');
  }
}

// Fonction pour vérifier si un type de cookie est autorisé
export function isCookieAllowed(type: CookieType): boolean {
  const consent = localStorage.getItem('cookie-consent');
  if (!consent) return false;

  try {
    const preferences: CookiePreferences = JSON.parse(consent);
    return preferences[type] || false;
  } catch {
    return false;
  }
}

// Fonction pour obtenir les préférences actuelles
export function getCurrentPreferences(): CookiePreferences | null {
  const consent = localStorage.getItem('cookie-consent');
  if (!consent) return null;

  try {
    return JSON.parse(consent);
  } catch {
    return null;
  }
}

// Fonction pour sauvegarder les préférences
export function savePreferences(preferences: CookiePreferences): void {
  localStorage.setItem('cookie-consent', JSON.stringify(preferences));
  localStorage.setItem('cookie-consent-date', new Date().toISOString());
  applyCookiePreferences(preferences);
}

// Fonction pour réinitialiser les préférences
export function resetPreferences(): void {
  localStorage.removeItem('cookie-consent');
  localStorage.removeItem('cookie-consent-date');
  
  // Supprimer tous les cookies non essentiels
  deleteCookie('analytics_enabled');
  deleteCookie('marketing_enabled');
  deleteCookie('preferences_enabled');
  
  // Désactiver les services
  disableAnalytics();
  disableMarketing();
}

// Fonctions utilitaires
function generateSessionId(): string {
  return 'session_' + Math.random().toString(36).substr(2, 9);
}

function generateCSRFToken(): string {
  return 'csrf_' + Math.random().toString(36).substr(2, 9);
}

function initializeAnalytics(): void {
  // Initialiser Google Analytics ou autre service d'analyse
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      analytics_storage: 'granted',
    });
  }
}

function disableAnalytics(): void {
  // Désactiver Google Analytics ou autre service d'analyse
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      analytics_storage: 'denied',
    });
  }
}

function initializeMarketing(): void {
  // Initialiser les services marketing
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      ad_storage: 'granted',
    });
  }
}

function disableMarketing(): void {
  // Désactiver les services marketing
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      ad_storage: 'denied',
    });
  }
}

// Fonction pour vérifier si le consentement a expiré (1 an)
export function isConsentExpired(): boolean {
  const consentDate = localStorage.getItem('cookie-consent-date');
  if (!consentDate) return true;

  const consentTime = new Date(consentDate).getTime();
  const currentTime = new Date().getTime();
  const oneYear = 365 * 24 * 60 * 60 * 1000; // 1 an en millisecondes

  return currentTime - consentTime > oneYear;
}

// Fonction pour obtenir un résumé des cookies actifs
export function getActiveCookiesSummary(): Record<string, boolean> {
  const preferences = getCurrentPreferences();
  if (!preferences) return {};

  return {
    'Cookies essentiels': preferences.essential,
    'Cookies analytiques': preferences.analytics,
    'Cookies marketing': preferences.marketing,
    'Cookies de préférences': preferences.preferences,
  };
}
