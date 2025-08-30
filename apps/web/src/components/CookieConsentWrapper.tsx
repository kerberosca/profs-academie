'use client';

import CookieConsent from './CookieConsent';
import { useCookieConsent } from '../hooks/useCookieConsent';

export default function CookieConsentWrapper() {
  const { savePreferences } = useCookieConsent();

  const handleAccept = (preferences: any) => {
    savePreferences(preferences);
  };

  const handleDecline = () => {
    const minimalConsent = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    savePreferences(minimalConsent);
  };

  return (
    <CookieConsent 
      onAccept={handleAccept}
      onDecline={handleDecline}
    />
  );
}
