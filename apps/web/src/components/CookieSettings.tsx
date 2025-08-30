'use client';

import { useState } from 'react';
import { Settings, X, Check } from 'lucide-react';
import { Button } from '@profs-academie/ui';
import { useCookieConsent, CookiePreferences } from '../hooks/useCookieConsent';

interface CookieSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CookieSettings({ isOpen, onClose }: CookieSettingsProps) {
  const { preferences, savePreferences, resetConsent } = useCookieConsent();
  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>(
    preferences || {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
    }
  );

  const handleSave = () => {
    savePreferences(localPreferences);
    onClose();
  };

  const handleReset = () => {
    resetConsent();
    setLocalPreferences({
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
    });
  };

  const togglePreference = (type: keyof CookiePreferences) => {
    if (type === 'essential') return; // Ne peut pas être désactivé
    setLocalPreferences(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Paramètres des cookies
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-gray-600 mt-2">
            Gérez vos préférences de cookies pour personnaliser votre expérience sur Profs Académie.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Cookies essentiels */}
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Cookies essentiels</h3>
                <p className="text-sm text-gray-600 mt-1">
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
          </div>

          {/* Cookies analytiques */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Cookies analytiques</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Nous aident à comprendre comment vous utilisez le site
                </p>
              </div>
              <Button
                variant={localPreferences.analytics ? "default" : "outline"}
                size="sm"
                onClick={() => togglePreference('analytics')}
                className={localPreferences.analytics ? "bg-blue-600" : ""}
              >
                {localPreferences.analytics ? "Actif" : "Inactif"}
              </Button>
            </div>
          </div>

          {/* Cookies de préférences */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Cookies de préférences</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Mémorisent vos choix pour personnaliser votre expérience
                </p>
              </div>
              <Button
                variant={localPreferences.preferences ? "default" : "outline"}
                size="sm"
                onClick={() => togglePreference('preferences')}
                className={localPreferences.preferences ? "bg-blue-600" : ""}
              >
                {localPreferences.preferences ? "Actif" : "Inactif"}
              </Button>
            </div>
          </div>

          {/* Cookies marketing */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Cookies marketing</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Utilisés pour afficher des publicités pertinentes
                </p>
              </div>
              <Button
                variant={localPreferences.marketing ? "default" : "outline"}
                size="sm"
                onClick={() => togglePreference('marketing')}
                className={localPreferences.marketing ? "bg-blue-600" : ""}
              >
                {localPreferences.marketing ? "Actif" : "Inactif"}
              </Button>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Informations importantes</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Les cookies essentiels ne peuvent pas être désactivés</li>
              <li>• Vos préférences sont sauvegardées localement</li>
              <li>• Vous pouvez modifier ces paramètres à tout moment</li>
              <li>• Consultez notre <a href="/cookies" className="text-blue-600 hover:underline">politique des cookies</a> pour plus d'informations</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1"
            >
              Réinitialiser
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
