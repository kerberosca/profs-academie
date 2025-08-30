'use client';

import { useState, useEffect } from 'react';
import { X, Settings, Check, AlertCircle } from 'lucide-react';
import { Button } from '@profs-academie/ui';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

interface CookieConsentProps {
  onAccept: (preferences: CookiePreferences) => void;
  onDecline: () => void;
}

export default function CookieConsent({ onAccept, onDecline }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Toujours activé
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Vérifier si le consentement a déjà été donné
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    onAccept(allAccepted);
    setShowBanner(false);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    onAccept(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleDecline = () => {
    const minimalConsent = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    localStorage.setItem('cookie-consent', JSON.stringify(minimalConsent));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    onDecline();
    setShowBanner(false);
  };

  const togglePreference = (type: keyof CookiePreferences) => {
    if (type === 'essential') return; // Ne peut pas être désactivé
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto p-4">
        {!showSettings ? (
          // Bannière principale
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">
                  Nous utilisons des cookies pour améliorer votre expérience
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Nous utilisons des cookies essentiels pour le fonctionnement du site et des cookies optionnels 
                pour analyser le trafic et personnaliser votre expérience. 
                <a href="/privacy" className="text-blue-600 hover:underline ml-1">
                  En savoir plus
                </a>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Personnaliser
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecline}
              >
                Refuser
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Accepter tout
              </Button>
            </div>
          </div>
        ) : (
          // Panneau de paramètres détaillés
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Paramètres des cookies</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {/* Cookies essentiels */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Cookies essentiels</h4>
                  <p className="text-sm text-gray-600">
                    Nécessaires au fonctionnement du site (connexion, sécurité)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-6 bg-blue-600 rounded-full flex items-center justify-end px-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-500">Toujours actif</span>
                </div>
              </div>

              {/* Cookies analytiques */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Cookies analytiques</h4>
                  <p className="text-sm text-gray-600">
                    Nous aident à comprendre comment vous utilisez le site
                  </p>
                </div>
                <Button
                  variant={preferences.analytics ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePreference('analytics')}
                  className={preferences.analytics ? "bg-blue-600" : ""}
                >
                  {preferences.analytics ? "Actif" : "Inactif"}
                </Button>
              </div>

              {/* Cookies de préférences */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Cookies de préférences</h4>
                  <p className="text-sm text-gray-600">
                    Mémorisent vos choix pour personnaliser votre expérience
                  </p>
                </div>
                <Button
                  variant={preferences.preferences ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePreference('preferences')}
                  className={preferences.preferences ? "bg-blue-600" : ""}
                >
                  {preferences.preferences ? "Actif" : "Inactif"}
                </Button>
              </div>

              {/* Cookies marketing */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Cookies marketing</h4>
                  <p className="text-sm text-gray-600">
                    Utilisés pour afficher des publicités pertinentes
                  </p>
                </div>
                <Button
                  variant={preferences.marketing ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePreference('marketing')}
                  className={preferences.marketing ? "bg-blue-600" : ""}
                >
                  {preferences.marketing ? "Actif" : "Inactif"}
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleDecline}
                className="flex-1"
              >
                Refuser tout
              </Button>
              <Button
                onClick={handleAcceptSelected}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Enregistrer mes choix
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
