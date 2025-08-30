"use client";

import { Button } from "@profs-academie/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@profs-academie/ui";
import { Shield, AlertTriangle, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

interface AccessDeniedProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

export default function AccessDenied({ 
  title = "Accès refusé",
  message = "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
  showBackButton = true,
  showHomeButton = true
}: AccessDeniedProps) {
  const { user, logout } = useAuth();

  const getRedirectUrl = () => {
    if (!user) return '/auth/login';
    
    switch (user.role) {
      case 'PARENT':
        return '/dashboard/parent';
      case 'TEACHER':
        return '/dashboard/enseignant';
      case 'CHILD':
        return '/dashboard/child';
      default:
        return '/';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {message}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {user && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">Informations de session</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Rôle:</strong> {user.role}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Nom:</strong> {user.nom}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-3">
            {showBackButton && (
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            )}
            
            {showHomeButton && (
              <Link href={getRedirectUrl()}>
                <Button className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Aller au tableau de bord
                </Button>
              </Link>
            )}

            {!user && (
              <Link href="/auth/login">
                <Button variant="outline" className="w-full">
                  Se connecter
                </Button>
              </Link>
            )}

            {user && (
              <Button 
                variant="outline" 
                onClick={logout}
                className="w-full text-red-600 hover:text-red-700"
              >
                Se déconnecter
              </Button>
            )}
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Si vous pensez qu'il s'agit d'une erreur, contactez l'administrateur.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
