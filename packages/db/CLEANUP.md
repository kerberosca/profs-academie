# 🧹 Nettoyage de la Base de Données Profs Académie

## 📋 Vue d'ensemble

Ce document décrit le processus de nettoyage de la base de données pour supprimer les tables et enums inutilisés, optimiser les performances et réduire l'empreinte mémoire.

## 🎯 Objectifs

- **Supprimer les tables inutilisées** pour libérer de l'espace disque
- **Optimiser les performances** en réduisant la complexité du schéma
- **Simplifier la maintenance** en gardant seulement les tables nécessaires
- **Améliorer la lisibilité** du code et de la documentation

## 📊 Tables Supprimées

### ❌ Système d'abonnement (non utilisé)
- `abonnements` - Gestion des abonnements Stripe
- `plans` - Plans d'abonnement disponibles
- Enums : `SubscriptionStatus`, `SubscriptionInterval`

### ❌ Système de consentement (non utilisé)
- `consentements` - Consentements utilisateur (RGPD)
- Enum : `ConsentType`

### ❌ Système d'audit (non utilisé)
- `audit_logs` - Logs d'audit des actions utilisateur

### ❌ Système de suivi (non utilisé)
- `suivis_apprentissage` - Suivi détaillé de l'apprentissage

### ❌ Ancien système de cours (remplacé)
- `cours` - Anciens cours personnalisés
- `modules` - Modules des cours
- `lecons` - Leçons des modules
- `quiz` - Quiz des leçons
- `questions` - Questions des quiz
- `soumissions` - Soumissions des quiz
- `progressions` - Progression des leçons
- Enums : `CourseStatus`, `QuestionType`

## ✅ Tables Conservées

### 🔐 Authentification et utilisateurs
- `users` - Utilisateurs de l'application
- `foyers` - Foyers familiaux
- `enfants` - Enfants des foyers
- `profils_prof` - Profils des enseignants

### 📚 Système LMS
- `cours_gouvernementaux` - Cours du programme québécois
- `calendriers_etude` - Calendriers d'étude personnalisés
- `sessions_etude` - Sessions d'étude planifiées
- `progressions_cours` - Progression dans les cours

### 🎯 Programmes officiels
- `competences` - Compétences du programme
- `contenus_apprentissage` - Contenus d'apprentissage

## 🚀 Comment Appliquer le Nettoyage

### 1. Sauvegarde (OBLIGATOIRE)
```bash
# Sauvegarder la base de données avant le nettoyage
pg_dump $DATABASE_URL > backup_before_cleanup.sql
```

### 2. Exécuter le script de nettoyage
```bash
# Depuis le répertoire packages/db
cd packages/db
pnpm db:cleanup
```

### 3. Vérifier l'application
```bash
# Tester la compilation
pnpm build

# Tester le développement
pnpm dev
```

## ⚠️ Précautions

1. **Sauvegarde obligatoire** avant d'appliquer le nettoyage
2. **Test en environnement de développement** d'abord
3. **Vérification des fonctionnalités** après le nettoyage
4. **Rollback possible** avec la sauvegarde

## 📈 Bénéfices Attendus

- **Réduction de l'espace disque** : ~30-50% d'espace libéré
- **Amélioration des performances** : Requêtes plus rapides
- **Simplification du code** : Moins de tables à maintenir
- **Meilleure lisibilité** : Schéma plus clair et focalisé

## 🔍 Vérification Post-Nettoyage

Après le nettoyage, vérifiez que :

- ✅ L'authentification fonctionne
- ✅ La création de foyers et d'enfants fonctionne
- ✅ Les calendriers d'étude se créent correctement
- ✅ Les sessions d'étude sont planifiées
- ✅ La progression des cours est enregistrée
- ✅ L'extraction du programme fonctionne

## 📞 Support

En cas de problème après le nettoyage :
1. Restaurer la sauvegarde : `psql $DATABASE_URL < backup_before_cleanup.sql`
2. Vérifier les logs d'erreur
3. Contacter l'équipe de développement
