import { NextRequest, NextResponse } from 'next/server';
import { db } from '@profs-academie/db';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: 'PARENT' | 'TEACHER' | 'CHILD';
    nom: string;
  };
}

export type Role = 'PARENT' | 'TEACHER' | 'CHILD';

export interface AuthMiddlewareOptions {
  requiredRoles?: Role[];
  requireAuth?: boolean;
}

/**
 * Middleware d'authentification pour les API routes
 * Vérifie le token d'authentification et les permissions utilisateur
 */
export async function authMiddleware(
  request: NextRequest,
  options: AuthMiddlewareOptions = {}
): Promise<{ request: AuthenticatedRequest; response?: NextResponse }> {
  const { requiredRoles = [], requireAuth = true } = options;

  try {
    // Récupérer le token depuis les headers
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || 
                  request.cookies.get('authToken')?.value;

    // Si l'authentification est requise mais pas de token
    if (requireAuth && !token) {
      return {
        request: request as AuthenticatedRequest,
        response: NextResponse.json(
          { error: 'Token d\'authentification requis' },
          { status: 401 }
        )
      };
    }

    // Si pas de token et pas d'authentification requise, continuer
    if (!token) {
      return { request: request as AuthenticatedRequest };
    }

    // Vérifier le token (pour l'instant, on utilise un token dummy)
    // En production, vous devriez vérifier un vrai JWT
    if (token === 'dummy-token') {
      // Récupérer les données utilisateur depuis les cookies ou headers
      const userDataHeader = request.headers.get('x-user-data');
      let userData;

      if (userDataHeader) {
        try {
          userData = JSON.parse(userDataHeader);
        } catch (error) {
          console.error('Erreur parsing user data:', error);
        }
      }

      // Si pas de données utilisateur dans les headers, essayer de les récupérer depuis la DB
      if (!userData) {
        // Pour l'instant, on retourne une erreur
        // En production, vous devriez décoder le JWT pour obtenir l'ID utilisateur
        return {
          request: request as AuthenticatedRequest,
          response: NextResponse.json(
            { error: 'Données utilisateur invalides' },
            { status: 401 }
          )
        };
      }

      // Vérifier les rôles requis
      if (requiredRoles.length > 0 && !requiredRoles.includes(userData.role)) {
        return {
          request: request as AuthenticatedRequest,
          response: NextResponse.json(
            { error: 'Permissions insuffisantes' },
            { status: 403 }
          )
        };
      }

      // Ajouter les données utilisateur à la requête
      const authenticatedRequest = request as AuthenticatedRequest;
      authenticatedRequest.user = userData;

      return { request: authenticatedRequest };
    }

    // Token invalide
    return {
      request: request as AuthenticatedRequest,
      response: NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      )
    };

  } catch (error) {
    console.error('Erreur dans authMiddleware:', error);
    return {
      request: request as AuthenticatedRequest,
      response: NextResponse.json(
        { error: 'Erreur d\'authentification' },
        { status: 500 }
      )
    };
  }
}

/**
 * Wrapper pour les API routes qui nécessitent une authentification
 */
export function withAuth(
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>,
  options: AuthMiddlewareOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const { request: authenticatedRequest, response } = await authMiddleware(request, options);
    
    if (response) {
      return response;
    }

    return handler(authenticatedRequest);
  };
}

/**
 * Vérifier si un utilisateur peut accéder à une ressource spécifique
 */
export function checkResourceAccess(
  user: AuthenticatedRequest['user'],
  resourceOwnerId?: string,
  allowedRoles?: Role[]
): boolean {
  if (!user) return false;

  // Vérifier les rôles autorisés
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return false;
  }

  // Vérifier la propriété de la ressource (si applicable)
  if (resourceOwnerId && user.id !== resourceOwnerId) {
    // Les enseignants peuvent avoir des permissions spéciales
    if (user.role !== 'TEACHER') {
      return false;
    }
  }

  return true;
}
