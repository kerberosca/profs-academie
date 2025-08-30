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
  Plus,
  Settings,
  LogOut,
  User,
  Star,
  Target,
  Clock
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../../contexts/AuthContext";
import { NiveauScolaire } from "../../../types/lms";

interface Enfant {
  id: string;
  prenom: string;
  nom?: string;
  anneeNaissance: number;
  niveauScolaire?: NiveauScolaire;
}

interface EnfantData {
  id: string;
  name: string;
  age: number;
  grade: string;
  avatar: string;
  niveauScolaire?: NiveauScolaire;
}

function ParentDashboardContent() {
  const { user, logout } = useAuth();
  const [children, setChildren] = useState<EnfantData[]>([]);
  const [selectedChild, setSelectedChild] = useState<EnfantData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(`/api/parent/enfants-secure`, {
          headers: {
            'Content-Type': 'application/json',
            'x-user-data': localStorage.getItem('userData') || JSON.stringify(user),
          },
        });

        if (response.ok) {
          const data = await response.json();
          const enfantsFormatted = data.enfants.map((enfant: Enfant) => ({
            id: enfant.id,
            name: enfant.prenom,
            age: new Date().getFullYear() - enfant.anneeNaissance,
            grade: getGradeLabel(enfant.niveauScolaire || 'P1'),
            avatar: enfant.prenom.charAt(0).toUpperCase(),
            niveauScolaire: enfant.niveauScolaire
          }));
          setChildren(enfantsFormatted);
          
          // Sélectionner automatiquement le premier enfant
          if (enfantsFormatted.length > 0 && !selectedChild) {
            setSelectedChild(enfantsFormatted[0]);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des enfants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, [user, selectedChild]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/logo.png" alt="Profs Académie" className="w-8 h-8" />
              <span className="text-xl font-bold text-dark-900">Profs Académie</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">{user?.email}</span>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bonjour {user?.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Voici un aperçu de vos enfants et de leurs calendriers d'apprentissage
          </p>
        </div>

        {/* Stats Cards - Espaces réservés */}
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

        {/* Children Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mes Enfants</h2>
            <div className="flex space-x-3">
              <Link href="/dashboard/parent/child-login">
                <Button variant="outline">
                  <Heart className="w-4 h-4 mr-2" />
                  Connecter un enfant
                </Button>
              </Link>
              <Link href="/dashboard/parent/add-child">
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un enfant
                </Button>
              </Link>
              <Link href="/dashboard/parent/lms">
                <Button className="btn-child">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Système LMS
                </Button>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des enfants...</p>
            </div>
          ) : children.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun enfant ajouté</h3>
                <p className="text-gray-600 mb-4">
                  Ajoutez vos enfants pour commencer à utiliser Profs Académie
                </p>
                <Link href="/dashboard/parent/add-child">
                  <Button className="btn-child">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un enfant
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {children.map((child) => (
                <Card key={child.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-xl font-bold text-primary">{child.avatar}</span>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{child.name}</CardTitle>
                          <CardDescription>{child.grade} • {child.age} ans</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline">{child.niveauScolaire}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Espace réservé pour la progression par matière */}
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Français</span>
                            <span>--%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Mathématiques</span>
                            <span>--%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Sciences</span>
                            <span>--%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link href="/dashboard/parent/lms" className="flex-1">
                          <Button variant="outline" className="w-full">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Voir les calendriers
                          </Button>
                        </Link>
                        <Link href="/dashboard/parent/child-login">
                          <Button variant="outline" size="sm">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Espace réservé pour les statistiques détaillées */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Statistiques détaillées</h2>
          <Card>
            <CardContent className="p-8 text-center">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fonctionnalité à venir</h3>
              <p className="text-gray-600 mb-4">
                Les statistiques détaillées de progression seront disponibles prochainement. 
                Ici s'affichera un aperçu complet de l'apprentissage de vos enfants.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                <div>
                  <div className="font-medium">Progression globale</div>
                  <div className="text-2xl font-bold text-gray-400">--%</div>
                </div>
                <div>
                  <div className="font-medium">Temps total d'apprentissage</div>
                  <div className="text-2xl font-bold text-gray-400">--h --m</div>
                </div>
                <div>
                  <div className="font-medium">Cours terminés</div>
                  <div className="text-2xl font-bold text-gray-400">--</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ParentDashboard() {
  return <ParentDashboardContent />;
}
