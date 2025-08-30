-- Script de nettoyage de la base de données Profs Académie
-- Suppression des tables inutilisées

-- 1. Suppression des tables du système d'abonnement (non utilisé)
DROP TABLE IF EXISTS "abonnements" CASCADE;
DROP TABLE IF EXISTS "plans" CASCADE;

-- 2. Suppression des tables du système de consentement (non utilisé)
DROP TABLE IF EXISTS "consentements" CASCADE;

-- 3. Suppression des tables du système d'audit (non utilisé)
DROP TABLE IF EXISTS "audit_logs" CASCADE;

-- 4. Suppression des tables du système de suivi d'apprentissage (non utilisé)
DROP TABLE IF EXISTS "suivis_apprentissage" CASCADE;

-- 5. Suppression des tables de l'ancien système de cours (remplacé par cours_gouvernementaux)
DROP TABLE IF EXISTS "soumissions" CASCADE;
DROP TABLE IF EXISTS "questions" CASCADE;
DROP TABLE IF EXISTS "quiz" CASCADE;
DROP TABLE IF EXISTS "progressions" CASCADE;
DROP TABLE IF EXISTS "lecons" CASCADE;
DROP TABLE IF EXISTS "modules" CASCADE;
DROP TABLE IF EXISTS "cours" CASCADE;

-- 6. Suppression des enums inutilisés
DROP TYPE IF EXISTS "CourseStatus" CASCADE;
DROP TYPE IF EXISTS "SubscriptionStatus" CASCADE;
DROP TYPE IF EXISTS "SubscriptionInterval" CASCADE;
DROP TYPE IF EXISTS "QuestionType" CASCADE;
DROP TYPE IF EXISTS "ConsentType" CASCADE;

-- Vérification des tables restantes
-- Les tables suivantes doivent rester :
-- - users
-- - foyers
-- - enfants
-- - profils_prof
-- - cours_gouvernementaux
-- - calendriers_etude
-- - sessions_etude
-- - progressions_cours
-- - competences
-- - contenus_apprentissage
