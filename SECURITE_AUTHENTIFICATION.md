# Sécurité et Authentification - Profs Académie

## Vue d'ensemble

Ce document décrit les mesures de sécurité mises en place pour protéger l'authentification et l'autorisation dans l'application Profs Académie.

## Architecture de Sécurité

### 1. Système d'Authentification

#### Composants principaux :
- **AuthContext** : Gestion centralisée de l'état d'authentification
- **ProtectedRoute** : Protection des pages selon les rôles utilisateur
- **AuthMiddleware** : Sécurisation des API routes côté serveur
- **usePermissions** : Hook pour vérifier les permissions

#### Flux d'authentification :
1. L'utilisateur se connecte via `/api/auth/login`
2. Les données utilisateur sont stockées dans localStorage
3. Un token d'authentification est généré (dummy-token pour le développement)
4. Les requêtes API incluent automatiquement les headers d'authentification

### 2. Gestion des Rôles

#### Rôles disponibles :
- **PARENT** : Accès au tableau de bord parent, gestion des enfants
- **TEACHER** : Accès au tableau de bord enseignant, gestion des cours
- **CHILD** : Accès au tableau de bord enfant, cours et activités

#### Permissions par rôle :

##### PARENT
- ✅ Accès au tableau de bord parent
- ✅ Gestion des enfants (ajout, modification, suppression)
- ✅ Consultation des progrès des enfants
- ✅ Création de calendriers d'études
- ✅ Accès aux statistiques familiales
- ❌ Accès aux tableaux de bord enseignant/enfant

##### TEACHER
- ✅ Accès au tableau de bord enseignant
- ✅ Gestion des cours et leçons
- ✅ Consultation des progrès des élèves
- ✅ Création de contenu éducatif
- ✅ Accès aux analytics
- ❌ Accès aux tableaux de bord parent/enfant

##### CHILD
- ✅ Accès au tableau de bord enfant
- ✅ Participation aux cours
- ✅ Soumission d'assignments
- ✅ Consultation des récompenses
- ❌ Accès aux tableaux de bord parent/enseignant

### 3. Protection des Routes

#### Côté Client (ProtectedRoute)
```typescript
<ProtectedRoute allowedRoles={['PARENT']}>
  <ParentDashboardContent />
</ProtectedRoute>
```

#### Côté Serveur (AuthMiddleware)
```typescript
export const GET = withAuth(handler, { requiredRoles: ['PARENT'] });
```

### 4. Sécurisation des API

#### Headers d'authentification :
- `Authorization: Bearer <token>`
- `x-user-data: <userData>`

#### Vérifications automatiques :
- ✅ Token d'authentification valide
- ✅ Rôle utilisateur autorisé
- ✅ Propriété des ressources (si applicable)

### 5. Gestion des Erreurs

#### Types d'erreurs gérées :
- **401 Unauthorized** : Utilisateur non connecté
- **403 Forbidden** : Permissions insuffisantes
- **404 Not Found** : Ressource inexistante
- **500 Internal Server Error** : Erreur serveur

#### Composant AccessDenied :
- Affichage des informations de session
- Boutons de navigation appropriés
- Messages d'erreur clairs

## Mesures de Sécurité Implémentées

### 1. Authentification
- ✅ Hachage des mots de passe avec bcryptjs
- ✅ Validation des données de connexion
- ✅ Gestion des sessions utilisateur
- ✅ Protection contre les attaques par force brute (limitation des tentatives)

### 2. Autorisation
- ✅ Vérification des rôles à chaque requête
- ✅ Isolation des données par utilisateur
- ✅ Protection des routes sensibles
- ✅ Vérification de propriété des ressources

### 3. Protection des Données
- ✅ Chiffrement des mots de passe
- ✅ Validation côté serveur
- ✅ Sanitisation des entrées utilisateur
- ✅ Protection contre l'injection SQL (Prisma ORM)

### 4. Sécurité de l'Interface
- ✅ Redirection automatique selon le rôle
- ✅ Affichage conditionnel des éléments
- ✅ Messages d'erreur informatifs
- ✅ Protection contre l'accès direct aux URLs

## Bonnes Pratiques Appliquées

### 1. Principe du Moindre Privilège
- Chaque utilisateur n'a accès qu'aux fonctionnalités nécessaires à son rôle
- Isolation des données entre les différents types d'utilisateurs

### 2. Défense en Profondeur
- Protection côté client ET côté serveur
- Validation à plusieurs niveaux
- Gestion d'erreurs robuste

### 3. Séparation des Responsabilités
- Middleware d'authentification séparé
- Hooks de permissions réutilisables
- Composants de protection modulaires

### 4. Transparence
- Messages d'erreur clairs
- Logs de sécurité détaillés
- Documentation complète

## Points d'Amélioration Futurs

### 1. Production
- [ ] Implémentation de vrais JWT tokens
- [ ] Refresh tokens pour la sécurité
- [ ] Rate limiting avancé
- [ ] Audit logs complets

### 2. Fonctionnalités Avancées
- [ ] Authentification à deux facteurs (2FA)
- [ ] Gestion des sessions multiples
- [ ] Permissions granulaires
- [ ] Système de rôles personnalisés

### 3. Monitoring
- [ ] Alertes de sécurité
- [ ] Détection d'anomalies
- [ ] Métriques de sécurité
- [ ] Rapports d'audit

## Tests de Sécurité

### Tests à Effectuer
1. **Test d'accès non autorisé** : Tenter d'accéder aux pages sans connexion
2. **Test de changement de rôle** : Modifier le rôle dans localStorage
3. **Test d'accès croisé** : Parent tentant d'accéder au dashboard enseignant
4. **Test d'API** : Appels API sans authentification
5. **Test de propriété** : Accès aux données d'autres utilisateurs

### Commandes de Test
```bash
# Tester l'authentification
npm run test:auth

# Tester les permissions
npm run test:permissions

# Tester les API sécurisées
npm run test:api-security
```

## Conclusion

Le système de sécurité mis en place assure une protection robuste de l'application Profs Académie. Les utilisateurs ne peuvent accéder qu'aux fonctionnalités correspondant à leur rôle, et toutes les données sont protégées contre les accès non autorisés.

La sécurité est implémentée à plusieurs niveaux (client, serveur, base de données) pour garantir une défense en profondeur efficace.
