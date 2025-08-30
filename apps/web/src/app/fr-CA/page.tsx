import { Button } from "@profs-academie/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@profs-academie/ui";
import { Badge } from "@profs-academie/ui";
import { BookOpen, Users, Shield, Star, CheckCircle, GraduationCap, Heart, Zap } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Profs Académie" className="w-10 h-10" />
            <span className="text-xl font-bold text-dark-900">Profs Académie</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#parents" className="text-gray-600 hover:text-primary transition-colors">
              Parents
            </Link>
            <Link href="#profs" className="text-gray-600 hover:text-primary transition-colors">
              Enseignants
            </Link>
            <Link href="#securite" className="text-gray-600 hover:text-primary transition-colors">
              Sécurité
            </Link>
            <Link href="#prix" className="text-gray-600 hover:text-primary transition-colors">
              Prix
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Commencer gratuitement</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6">
            <Star className="w-4 h-4 mr-2" />
            Plateforme éducative québécoise
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-dark-900 mb-6">
            Apprenez avec des{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-blue-500 to-dark-800">
                              enseignants passionnés
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Découvrez une nouvelle façon d'apprendre avec des cours interactifs, 
            des quiz amusants et un suivi personnalisé pour vos enfants.
          </p>
                     <div className="flex justify-center">
             <Link href="/auth/register">
               <Button size="lg" className="btn-child">
                 <Zap className="w-5 h-5 mr-2" />
                 Commencer l'essai gratuit
               </Button>
             </Link>
           </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pourquoi choisir Profs Académie ?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Une plateforme conçue spécialement pour les familles québécoises
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="card-hover">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
                              <CardTitle>Enseignants québécois</CardTitle>
              <CardDescription>
                Des enseignants passionnés qui connaissent le programme scolaire du Québec
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-success" />
              </div>
              <CardTitle>Apprentissage ludique</CardTitle>
              <CardDescription>
                Des cours interactifs et des quiz amusants pour motiver vos enfants
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Sécurité garantie</CardTitle>
              <CardDescription>
                Protection des données et environnement sécurisé pour vos enfants
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Parents Section */}
      <section id="parents" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Pour les parents
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Suivez la progression de vos enfants, gérez leurs comptes et 
                découvrez des recommandations personnalisées.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-success mr-3" />
                  <span>Suivi de progression en temps réel</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-success mr-3" />
                  <span>Gestion de plusieurs enfants</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-success mr-3" />
                  <span>Rapports détaillés et recommandations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-success mr-3" />
                  <span>Support prioritaire</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary-20 rounded-2xl p-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Tableau de bord parent</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Emma (8 ans)</span>
                    <Badge variant="secondary">75% complété</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Lucas (5 ans)</span>
                    <Badge variant="secondary">45% complété</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

              {/* Enseignants Section */}
      <section id="profs" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-gradient-to-br from-success/10 to-success-20 rounded-2xl p-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">Studio de création</h3>
                  <p className="text-gray-600 mb-4">
                    Créez des cours interactifs avec notre éditeur MDX avancé
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-success mr-2" />
                      <span className="text-sm">Éditeur de contenu riche</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-success mr-2" />
                      <span className="text-sm">Quiz interactifs</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-success mr-2" />
                      <span className="text-sm">Analytics détaillées</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Pour les enseignants
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Partagez votre passion pour l'enseignement et créez du contenu 
                éducatif de qualité pour les enfants québécois.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-success mr-3" />
                  <span>Studio de création intuitif</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-success mr-3" />
                  <span>Support et formation</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-success mr-3" />
                  <span>Revenus partagés (future marketplace)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-success mr-3" />
                  <span>Communauté d'enseignants</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sécurité Section */}
      <section id="securite" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Sécurité et confidentialité
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            La protection de vos données et de vos enfants est notre priorité absolue.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Données protégées</CardTitle>
                <CardDescription>
                  Chiffrement de bout en bout et stockage sécurisé au Canada
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Contrôle parental</CardTitle>
                <CardDescription>
                  Gestion complète des comptes enfants et des paramètres de sécurité
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Conformité RGPD</CardTitle>
                <CardDescription>
                  Respect des réglementations canadiennes et européennes
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Prix Section */}
      <section id="prix" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Plans d'abonnement
            </h2>
            <p className="text-lg text-gray-600">
              Choisissez le plan qui convient à votre famille
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="relative">
              <CardHeader className="text-center">
                <CardTitle>Essentiel</CardTitle>
                <div className="text-3xl font-bold text-primary">19,99$</div>
                <CardDescription>par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    <span>1 enfant</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    <span>Accès à tous les cours</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    <span>Suivi de progression</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    <span>Support par email</span>
                  </li>
                </ul>
                <Button className="w-full mt-6">Choisir ce plan</Button>
              </CardContent>
            </Card>

            <Card className="relative border-primary shadow-lg scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-white">Populaire</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle>Famille</CardTitle>
                <div className="text-3xl font-bold text-primary">39,99$</div>
                <CardDescription>par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    <span>Jusqu'à 5 enfants</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    <span>Accès à tous les cours</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    <span>Suivi de progression</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    <span>Support prioritaire</span>
                  </li>
                </ul>
                <Button className="w-full mt-6">Choisir ce plan</Button>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardHeader className="text-center">
                <CardTitle>Prof Créateur</CardTitle>
                <div className="text-3xl font-bold text-primary">9,99$</div>
                <CardDescription>par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    <span>Jusqu'à 10 enfants</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    <span>Studio de création</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    <span>Publier des cours</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    <span>Analytics avancées</span>
                  </li>
                </ul>
                <Button className="w-full mt-6">Choisir ce plan</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Questions fréquentes
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Comment fonctionne l'essai gratuit ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Vous pouvez essayer Profs Académie gratuitement pendant 7 jours. 
                  Aucune carte de crédit requise pour commencer.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mes données sont-elles sécurisées ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Absolument. Nous utilisons un chiffrement de bout en bout et 
                  stockons toutes les données au Canada selon les normes RGPD.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Puis-je annuler à tout moment ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Oui, vous pouvez annuler votre abonnement à tout moment depuis 
                  votre tableau de bord, sans frais supplémentaires.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Les cours suivent-ils le programme québécois ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Tous nos cours sont créés par des enseignants québécois et 
                  alignés sur le programme scolaire du Québec.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Prêt à commencer l'aventure ?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Rejoignez des milliers de familles québécoises qui font confiance à Profs Académie
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="btn-child">
                  <Zap className="w-5 h-5 mr-2" />
                  Commencer maintenant
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg">
                  J'ai déjà un compte
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img src="/logo.png" alt="Profs Académie" className="w-10 h-10" />
                <span className="text-xl font-bold">Profs Académie</span>
              </div>
              <p className="text-gray-400">
                La plateforme éducative québécoise pour apprendre en s'amusant.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Cours</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Quiz</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Progression</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Prix</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Centre d'aide</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Légal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Confidentialité</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Conditions</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Profs Académie. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
