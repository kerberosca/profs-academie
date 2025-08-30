# Migration vers le Programme Scolaire Québécois Statique

## 📋 Résumé des changements

Ce document décrit la migration du système de génération de calendriers d'étude de l'utilisation d'un fichier `Programme.lua` dynamique vers des données statiques basées sur le programme scolaire québécois officiel.

## 🔄 Changements effectués

### 1. Remplacement des données dynamiques par des données statiques

**Avant :**
- Le système utilisait le fichier `Txt/Programme.lua` pour extraire dynamiquement les compétences
- Les données étaient générées à la volée lors de la création de calendriers
- Risque d'incohérence et de dépendance à un fichier externe

**Après :**
- Les données du programme scolaire québécois sont maintenant stockées statiquement dans la base de données
- Données basées sur le tableau officiel du programme (1re à 6e année)
- Cohérence garantie et performance améliorée

### 2. Nouvelle structure de données

Le programme scolaire québécois a été structuré comme suit :

#### Niveaux scolaires supportés
- PRIMAIRE_1 (1re année)
- PRIMAIRE_2 (2e année)
- PRIMAIRE_3 (3e année)
- PRIMAIRE_4 (4e année)
- PRIMAIRE_5 (5e année)
- PRIMAIRE_6 (6e année)

#### Matières couvertes
- **Français** : Lecture, écriture, communication orale
- **Mathématiques** : Nombres, opérations, géométrie, mesure
- **Sciences** : Exploration scientifique, expérimentation
- **Géographie** : Repères spatiaux, territoires
- **Histoire** : Histoire du Québec, société
- **Arts** : Création artistique, expression
- **Éducation physique** : Motricité, sports, santé
- **Éthique et culture religieuse** : Citoyenneté, valeurs

### 3. Fichiers créés/modifiés

#### Nouveaux fichiers
- `packages/db/src/seed-programme-quebec.ts` - Script de seeding des données statiques
- `apps/web/src/lib/calendrier-generator.ts` - Nouveau générateur de calendrier
- `packages/db/src/test-calendrier-generator.ts` - Script de test du nouveau système

#### Fichiers modifiés
- `apps/web/src/app/api/lms/programmes/route.ts` - API mise à jour pour utiliser les données statiques
- `packages/db/package.json` - Nouveaux scripts ajoutés

#### Fichiers supprimés
- `apps/web/src/lib/programme-extractor.ts` - Ancien extracteur de fichier
- `apps/web/src/app/api/lms/test-extraction/route.ts` - API de test obsolète
- `test-extraction.js` - Script de test obsolète

## 🚀 Utilisation

### 1. Seeding des données

Pour insérer les données du programme scolaire québécois dans la base de données :

```bash
cd packages/db
pnpm db:seed-programme
```

### 2. Test du système

Pour tester le nouveau générateur de calendrier :

```bash
cd packages/db
pnpm db:test-calendrier
```

### 3. Génération de calendriers

Les calendriers sont maintenant générés automatiquement à partir des données statiques de la base de données via l'API `/api/lms/programmes`.

## 📊 Statistiques des données

Après le seeding, la base de données contient :
- **42 compétences** (7 matières × 6 niveaux)
- **117 contenus d'apprentissage** répartis par compétence
- **6 niveaux scolaires** (1re à 6e année)
- **7 matières principales** par niveau

## 🔧 Avantages du nouveau système

### Performance
- ✅ Pas de lecture de fichier à chaque génération de calendrier
- ✅ Requêtes de base de données optimisées
- ✅ Temps de réponse réduit

### Fiabilité
- ✅ Données cohérentes et validées
- ✅ Pas de dépendance à des fichiers externes
- ✅ Structure de données normalisée

### Maintenabilité
- ✅ Code plus simple et modulaire
- ✅ Données centralisées dans la base
- ✅ Facilité de mise à jour et d'extension

### Conformité
- ✅ Programme scolaire québécois officiel
- ✅ Contenus d'apprentissage structurés
- ✅ Progression pédagogique cohérente

## 📝 Structure des données

### Table `competences`
```sql
- id: Identifiant unique
- nom: Nom de la compétence
- description: Description détaillée
- matiere: Matière (FRANCAIS, MATHEMATIQUES, etc.)
- niveauScolaire: Niveau (PRIMAIRE_1, PRIMAIRE_2, etc.)
- ordre: Ordre d'apprentissage
```

### Table `contenus_apprentissage`
```sql
- id: Identifiant unique
- nom: Nom du contenu
- description: Description détaillée
- dureeEstimee: Durée estimée en minutes
- ordre: Ordre dans la compétence
- prerequis: Liste des prérequis
- competenceId: Référence à la compétence
```

## 🔮 Évolutions futures

Le nouveau système permet facilement :
- L'ajout de nouveaux niveaux scolaires
- L'extension des matières existantes
- L'ajout de nouveaux contenus d'apprentissage
- La personnalisation par région ou école
- L'intégration de compétences transversales

## ✅ Validation

Le système a été testé avec succès :
- ✅ Seeding des données réussi
- ✅ Génération de calendriers fonctionnelle
- ✅ API mise à jour et opérationnelle
- ✅ Tests automatisés passés
- ✅ Intégration avec l'interface utilisateur maintenue
