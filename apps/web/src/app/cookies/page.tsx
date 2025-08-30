import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Politique des Cookies - Profs Académie",
  description: "Découvrez comment nous utilisons les cookies sur Profs Académie et comment gérer vos préférences.",
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Politique des Cookies
            </h1>
            <p className="text-gray-600">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-CA')}
            </p>
          </div>

          <div className="px-6 py-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Qu'est-ce qu'un cookie ?
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Un cookie est un petit fichier texte stocké sur votre appareil (ordinateur, tablette, smartphone) 
                lorsque vous visitez un site web. Les cookies permettent au site de mémoriser vos actions et 
                préférences (identifiant de connexion, langue, taille de police et autres paramètres d'affichage) 
                pendant une durée déterminée, afin que vous n'ayez pas à les saisir à nouveau à chaque fois 
                que vous consultez le site ou naviguez d'une page à l'autre.
              </p>
            </section>

            {/* Types de cookies utilisés */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Types de cookies que nous utilisons
              </h2>
              
              <div className="space-y-6">
                {/* Cookies essentiels */}
                <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">!</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Cookies essentiels
                    </h3>
                  </div>
                  <p className="text-gray-700 mb-3">
                    Ces cookies sont strictement nécessaires au fonctionnement du site et ne peuvent pas être désactivés.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Fonctionnalités :</h4>
                      <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                        <li>Authentification et sécurité de session</li>
                        <li>Préférences de langue et de région</li>
                        <li>Protection contre les attaques CSRF</li>
                        <li>Fonctionnement du panier d'achat</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Durée de vie :</h4>
                      <p className="text-gray-600 text-sm">
                        Session (supprimés à la fermeture du navigateur) ou jusqu'à 1 an
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cookies analytiques */}
                <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">📊</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Cookies analytiques
                    </h3>
                  </div>
                  <p className="text-gray-700 mb-3">
                    Ces cookies nous permettent de comptabiliser les visites et les sources de trafic 
                    pour mesurer et améliorer les performances de notre site.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Fonctionnalités :</h4>
                      <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                        <li>Statistiques de visite et de performance</li>
                        <li>Identification des pages populaires</li>
                        <li>Analyse du comportement utilisateur</li>
                        <li>Détection des problèmes techniques</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Durée de vie :</h4>
                      <p className="text-gray-600 text-sm">
                        Jusqu'à 2 ans (Google Analytics)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cookies de préférences */}
                <div className="border border-purple-200 rounded-lg p-6 bg-purple-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">⚙️</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Cookies de préférences
                    </h3>
                  </div>
                  <p className="text-gray-700 mb-3">
                    Ces cookies permettent au site de mémoriser les choix que vous avez effectués 
                    pour vous offrir une fonctionnalité améliorée et plus personnalisée.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Fonctionnalités :</h4>
                      <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                        <li>Préférences d'affichage et de navigation</li>
                        <li>Choix de contenu éducatif</li>
                        <li>Paramètres de progression d'apprentissage</li>
                        <li>Thème et personnalisation</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Durée de vie :</h4>
                      <p className="text-gray-600 text-sm">
                        Jusqu'à 1 an
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cookies marketing */}
                <div className="border border-orange-200 rounded-lg p-6 bg-orange-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">📢</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Cookies marketing
                    </h3>
                  </div>
                  <p className="text-gray-700 mb-3">
                    Ces cookies peuvent être définis par notre site ou par nos partenaires publicitaires 
                    pour créer un profil de vos intérêts et vous montrer des publicités pertinentes.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Fonctionnalités :</h4>
                      <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                        <li>Publicités personnalisées</li>
                        <li>Suivi des campagnes marketing</li>
                        <li>Mesure de l'efficacité publicitaire</li>
                        <li>Reciblage publicitaire</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Durée de vie :</h4>
                      <p className="text-gray-600 text-sm">
                        Jusqu'à 2 ans
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Gestion des cookies */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Comment gérer vos cookies
              </h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    🎛️ Via notre bannière de consentement
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Lors de votre première visite, une bannière vous permet de :
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Accepter tous les cookies</li>
                    <li>Refuser les cookies non essentiels</li>
                    <li>Personnaliser vos préférences par catégorie</li>
                    <li>Accéder à plus d'informations</li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    🔧 Via les paramètres de votre navigateur
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Vous pouvez également gérer les cookies directement dans votre navigateur :
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Chrome :</h4>
                      <p className="text-gray-600 text-sm">
                        Paramètres → Confidentialité et sécurité → Cookies et autres données de sites
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Firefox :</h4>
                      <p className="text-gray-600 text-sm">
                        Options → Confidentialité et sécurité → Cookies et données de sites
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Safari :</h4>
                      <p className="text-gray-600 text-sm">
                        Préférences → Confidentialité → Cookies et données de sites web
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Edge :</h4>
                      <p className="text-gray-600 text-sm">
                        Paramètres → Cookies et autorisations de sites → Cookies
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    📧 Via notre équipe support
                  </h3>
                  <p className="text-gray-700">
                    Pour toute question concernant nos cookies ou pour exercer vos droits, 
                    contactez-nous à <strong>privacy@profsacademie.ca</strong>
                  </p>
                </div>
              </div>
            </section>

            {/* Cookies tiers */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Cookies tiers
              </h2>
              <p className="text-gray-700 mb-4">
                Nous utilisons également des services tiers qui peuvent placer des cookies sur votre appareil :
              </p>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Google Analytics</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Service d'analyse web pour mesurer l'audience et les performances du site.
                  </p>
                  <a 
                    href="https://policies.google.com/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Politique de confidentialité Google
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Stripe</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Service de paiement pour traiter les abonnements et paiements.
                  </p>
                  <a 
                    href="https://stripe.com/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Politique de confidentialité Stripe
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Vercel</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Plateforme d'hébergement et d'analyse de performance.
                  </p>
                  <a 
                    href="https://vercel.com/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Politique de confidentialité Vercel
                  </a>
                </div>
              </div>
            </section>

            {/* Mise à jour de la politique */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Mise à jour de cette politique
              </h2>
              <p className="text-gray-700">
                Nous nous réservons le droit de modifier cette politique des cookies à tout moment. 
                Toute modification sera publiée sur cette page avec une nouvelle date de mise à jour. 
                Nous vous encourageons à consulter régulièrement cette page pour rester informé de 
                notre utilisation des cookies.
              </p>
            </section>

            {/* Contact et liens */}
            <section className="border-t border-gray-200 pt-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Questions ?
                  </h2>
                  <p className="text-gray-600">
                    Contactez-nous à privacy@profsacademie.ca
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="/privacy" 
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Politique de confidentialité
                  </Link>
                  <Link 
                    href="/terms" 
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Conditions d'utilisation
                  </Link>
                  <Link 
                    href="/" 
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Retour à l'accueil
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
