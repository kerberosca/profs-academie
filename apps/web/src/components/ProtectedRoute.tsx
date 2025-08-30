"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../contexts/AuthContext';
import AccessDenied from './AccessDenied';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('PARENT' | 'TEACHER' | 'CHILD')[];
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = ['PARENT', 'TEACHER', 'CHILD'],
  redirectTo = '/auth/login'
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  useEffect(() => {
    if (!loading) {
      // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
      if (!user) {
        console.log('🔒 Utilisateur non connecté, redirection vers:', redirectTo);
        router.push(redirectTo);
        return;
      }

      // Si des rôles spécifiques sont requis, vérifier que l'utilisateur a le bon rôle
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        console.log('🔒 Rôle non autorisé:', user.role, 'Rôles autorisés:', allowedRoles);
        setShowAccessDenied(true);
        return;
      }
    }
  }, [user, loading, allowedRoles, redirectTo, router]);

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, ne rien afficher (redirection en cours)
  if (!user) {
    return null;
  }

  // Si l'utilisateur n'a pas le bon rôle, afficher la page d'accès refusé
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <AccessDenied 
        title="Accès non autorisé"
        message={`Cette page est réservée aux utilisateurs avec les rôles suivants : ${allowedRoles.join(', ')}. Votre rôle actuel est : ${user.role}.`}
      />
    );
  }

  // Si tout est OK, afficher le contenu protégé
  return <>{children}</>;
}
