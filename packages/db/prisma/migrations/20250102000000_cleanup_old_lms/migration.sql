-- Migration de nettoyage de l'ancien système LMS
-- Suppression des tables obsolètes tout en conservant les données essentielles

-- Supprimer les tables de liaison
DROP TABLE IF EXISTS "_CalendrierCours";

-- Supprimer les tables de sessions et calendriers (dans l'ordre des dépendances)
DROP TABLE IF EXISTS "sessions_etude";
DROP TABLE IF EXISTS "calendriers_etude";

-- Supprimer les tables de progression et suivi
DROP TABLE IF EXISTS "progressions_cours";
DROP TABLE IF EXISTS "suivis_apprentissage";

-- Supprimer les enums inutilisés (TypeCours et StatutProgression)
-- Note: Ces enums peuvent encore être référencés, donc on les garde pour l'instant
-- DROP TYPE IF EXISTS "TypeCours";
-- DROP TYPE IF EXISTS "StatutProgression";

-- Les tables conservées :
-- ✅ users (parents)
-- ✅ foyers (relations parent-enfant)
-- ✅ enfants (avec niveauScolaire)
-- ✅ competences (compétences officielles)
-- ✅ contenus_apprentissage (contenus détaillés)
-- ✅ cours_gouvernementaux (cours officiels)
-- ✅ Enums : NiveauScolaire, Matiere (utilisés par le nouveau LMS)
