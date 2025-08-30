import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Politique de Confidentialité - Profs Académie",
  description: "Découvrez comment nous protégeons vos données personnelles et utilisons les cookies sur Profs Académie.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Politique de Confidentialité
            </h1>
            <p className="text-gray-600">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-CA')}
            </p>
          </div>

          <div className="px-6 py-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Chez Profs Académie, nous nous engageons à protéger votre vie privée et vos données personnelles. 
                Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations 
                lorsque vous utilisez notre plateforme éducative.
              </p>
            </section>

            {/* Collecte des données */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Informations que nous collectons
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Informations que vous nous fournissez
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Nom, prénom et adresse e-mail lors de l'inscription</li>
                    <li>Informations sur votre foyer et vos enfants</li>
                    <li>Préférences d'apprentissage et objectifs éducatifs</li>
                    <li>Communications avec notre équipe de support</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Informations collectées automatiquement
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Adresse IP et informations de localisation</li>
                    <li>Type de navigateur et appareil utilisé</li>
                    <li>Pages visitées et temps passé sur le site</li>
                    <li>Données de performance et d'erreurs</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Utilisation des cookies */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Utilisation des cookies
              </h2>
              <p className="text-gray-700 mb-4">
                Nous utilisons des cookies pour améliorer votre expérience sur notre site. 
                Voici les différents types de cookies que nous utilisons :
              </p>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    🍪 Cookies essentiels
                  </h3>
                  <p className="text-gray-700 mb-2">
                    Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 text-sm">
                    <li>Authentification et sécurité de session</li>
                    <li>Préférences de langue et de région</li>
                    <li>Protection contre les attaques CSRF</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    📊 Cookies analytiques
                  </h3>
                  <p className="text-gray-700 mb-2">
                    Ces cookies nous aident à comprendre comment vous utilisez notre site.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 text-sm">
                    <li>Statistiques de visite et de performance</li>
                    <li>Identification des pages populaires</li>
                    <li>Amélioration de l'expérience utilisateur</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    ⚙️ Cookies de préférences
                  </h3>
                  <p className="text-gray-700 mb-2">
                    Ces cookies mémorisent vos choix pour personnaliser votre expérience.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 text-sm">
                    <li>Préférences d'affichage et de navigation</li>
                    <li>Choix de contenu éducatif</li>
                    <li>Paramètres de progression d'apprentissage</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    📢 Cookies marketing
                  </h3>
                  <p className="text-gray-700 mb-2">
                    Ces cookies sont utilisés pour afficher des publicités pertinentes.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 text-sm">
                    <li>Publicités personnalisées</li>
                    <li>Suivi des campagnes marketing</li>
                    <li>Mesure de l'efficacité publicitaire</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Gestion du consentement */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Gestion de votre consentement
              </h2>
              <p className="text-gray-700 mb-4">
                Vous pouvez à tout moment modifier vos préférences de cookies :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Via la bannière de consentement qui apparaît lors de votre première visite</li>
                <li>En cliquant sur "Paramètres des cookies" dans le pied de page</li>
                <li>En nous contactant directement à privacy@profsacademie.ca</li>
              </ul>
            </section>

            {/* Utilisation des données */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Comment nous utilisons vos informations
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Fournir et améliorer nos services éducatifs</li>
                <li>Personnaliser l'expérience d'apprentissage</li>
                <li>Communiquer avec vous concernant votre compte</li>
                <li>Assurer la sécurité et prévenir la fraude</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </section>

            {/* Partage des données */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Partage de vos informations
              </h2>
              <p className="text-gray-700 mb-4">
                Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations uniquement dans les cas suivants :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Avec votre consentement explicite</li>
                <li>Avec nos prestataires de services (hébergement, paiement)</li>
                <li>Pour respecter une obligation légale</li>
                <li>Pour protéger nos droits et notre sécurité</li>
              </ul>
            </section>

            {/* Sécurité */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Sécurité de vos données
              </h2>
              <p className="text-gray-700 mb-4">
                Nous mettons en place des mesures de sécurité appropriées pour protéger vos données :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Chiffrement SSL/TLS pour toutes les communications</li>
                <li>Stockage sécurisé des mots de passe</li>
                <li>Accès restreint aux données personnelles</li>
                <li>Surveillance continue de la sécurité</li>
              </ul>
            </section>

            {/* Vos droits */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Vos droits
              </h2>
              <p className="text-gray-700 mb-4">
                Conformément aux lois sur la protection des données, vous avez les droits suivants :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Accès :</strong> Demander une copie de vos données personnelles</li>
                <li><strong>Rectification :</strong> Corriger des données inexactes</li>
                <li><strong>Effacement :</strong> Demander la suppression de vos données</li>
                <li><strong>Portabilité :</strong> Recevoir vos données dans un format structuré</li>
                <li><strong>Opposition :</strong> Vous opposer au traitement de vos données</li>
                <li><strong>Retrait du consentement :</strong> Retirer votre consentement à tout moment</li>
              </ul>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Nous contacter
              </h2>
              <p className="text-gray-700 mb-4">
                Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, 
                contactez-nous :
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  <strong>Email :</strong> privacy@profsacademie.ca<br />
                  <strong>Adresse :</strong> Profs Académie, Québec, Canada<br />
                  <strong>Téléphone :</strong> +1 (514) XXX-XXXX
                </p>
              </div>
            </section>

            {/* Liens utiles */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Liens utiles
              </h2>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/terms" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Conditions d'utilisation
                </Link>
                <Link 
                  href="/cookies" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Politique des cookies
                </Link>
                <Link 
                  href="/" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Retour à l'accueil
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
