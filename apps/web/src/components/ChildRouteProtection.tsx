'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@profs-academie/ui";
import { Button } from "@profs-academie/ui";
import { Shield, ArrowLeft, Home, LogOut } from "lucide-react";
import Link from "next/link";

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

interface ChildRouteProtectionProps {
  children: React.ReactNode;
}

export default function ChildRouteProtection({ children }: ChildRouteProtectionProps) {
  const [childSession, setChildSession] = useState<ChildSession | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Vérifier si on a une session enfant
    const sessionData = localStorage.getItem('childSession');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        
        // Vérifier si la session n'est pas expirée (24h)
        const sessionTime = new Date(session.timestamp);
        const now = new Date();
        const hoursDiff = (now.getTime() - sessionTime.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff > 24) {
          // Session expirée
          localStorage.removeItem('childSession');
          setChildSession(null);
        } else {
          setChildSession(session);
        }
      } catch (error) {
        console.error('Erreur lors du parsing de la session enfant:', error);
        localStorage.removeItem('childSession');
      }
    }
    setLoading(false);
  }, []);

  const handleReturnToParent = () => {
    localStorage.removeItem('childSession');
    router.push('/dashboard/parent');
  };

  const handleLogout = () => {
    localStorage.removeItem('childSession');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si pas de session enfant, afficher la page d'accès non autorisé
  if (!childSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-600">Accès non autorisé</CardTitle>
              <CardDescription>
                Cette page est réservée aux sessions enfant actives
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-medium text-yellow-900 mb-2">Informations de session</h3>
                <div className="text-sm text-yellow-800">
                  <p><strong>Statut :</strong> Aucune session enfant active</p>
                  <p><strong>Action requise :</strong> Connexion via l'espace parent</p>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Link href="/dashboard/parent/child-login">
                  <Button className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Se connecter en tant qu'enfant
                  </Button>
                </Link>
                
                <Link href="/dashboard/parent">
                  <Button variant="outline" className="w-full">
                    <Home className="w-4 h-4 mr-2" />
                    Aller au tableau de bord parent
                  </Button>
                </Link>
                
                <Button variant="ghost" className="w-full" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Se déconnecter
                </Button>
              </div>
              
              <div className="text-center text-sm text-gray-500">
                Si vous pensez qu'il s'agit d'une erreur, contactez l'administrateur.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Si session enfant valide, afficher le contenu
  return <>{children}</>;
}
