"use client";

import { useState, useEffect } from "react";
import { Button } from "@profs-academie/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@profs-academie/ui";
import { Badge } from "@profs-academie/ui";
import { 
  Users, 
  GraduationCap, 
  Heart, 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  Calendar,
  Settings,
  LogOut,
  User,
  Star,
  Target,
  Clock,
  ArrowLeft,
  Shield
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import ChildRouteProtection from "../../../components/ChildRouteProtection";

interface ChildSession {
  enfant: {
    id: string;
    prenom: string;
    nom?: string;
    anneeNaissance: number;
    niveauScolaire?: string;
  };
  parentId: string;
  timestamp: string;
}

function ChildDashboardContent() {
  const { user, logout } = useAuth();
  const [childSession, setChildSession] = useState<ChildSession | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Récupérer la session enfant
    const sessionData = localStorage.getItem('childSession');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        setChildSession(session);
      } catch (error) {
        console.error('Erreur lors du parsing de la session enfant:', error);
      }
    }
  }, []);

  const handleReturnToParent = () => {
    localStorage.removeItem('childSession');
    router.push('/dashboard/parent');
  };

  const handleLogout = () => {
    localStorage.removeItem('childSession');
    logout();
  };

  if (!childSession) {
    return null; // Le composant de protection s'en chargera
  }

  const enfant = childSession.enfant;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/parent">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour parent
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <img src="/logo.png" alt="Profs Académie" className="w-8 h-8" />
                <span className="text-xl font-bold text-dark-900">Profs Académie</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {enfant.prenom.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{enfant.prenom}</p>
                  <p className="text-xs text-gray-500">Mode enfant</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleReturnToParent}>
                <Shield className="w-4 h-4 mr-2" />
                Retour parent
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bonjour {enfant.prenom}! 👋
          </h1>
          <p className="text-gray-600">
            Voici ton espace d'apprentissage personnalisé
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Temps d'apprentissage</p>
                  <p className="text-2xl font-bold text-gray-900">--h --m</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Progression hebdo</p>
                  <p className="text-2xl font-bold text-gray-900">--%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Leçons complétées</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Série active</p>
                  <p className="text-2xl font-bold text-gray-900">-- jours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Commencer une leçon</h3>
                <p className="text-gray-600 mb-4">Découvre de nouveaux concepts</p>
                <Button className="w-full btn-child">
                  Commencer
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Continuer ma progression</h3>
                <p className="text-gray-600 mb-4">Reprends où tu t'es arrêté</p>
                <Button variant="outline" className="w-full">
                  Continuer
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mes récompenses</h3>
                <p className="text-gray-600 mb-4">Voir mes badges et points</p>
                <Button variant="outline" className="w-full">
                  Voir
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Activité récente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucune activité récente</p>
              <p className="text-sm text-gray-500">Commence à apprendre pour voir ton activité ici !</p>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Mode enfant actif</h3>
              <p className="text-sm text-blue-700">
                Tu es connecté en tant que {enfant.prenom}. Toutes tes actions seront enregistrées 
                sous ton nom. Pour revenir à l'espace parent, utilise le bouton "Retour parent".
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChildDashboardPage() {
  return (
    <ChildRouteProtection>
      <ChildDashboardContent />
    </ChildRouteProtection>
  );
}
