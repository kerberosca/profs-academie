# 🗄️ Guide de Maintenance de la Base de Données - Profs Académie

## 📋 Vue d'Ensemble

Ce guide documente le nettoyage, l'optimisation et la maintenance de la base de données Profs Académie. La base de données a été analysée, nettoyée et optimisée pour une performance maximale.

## 🎯 État Actuel

### ✅ Score de Santé : 89%
- **8 tables actives** sur 9 principales
- **Aucune donnée orpheline**
- **Système de progression activé** (27 progressions créées)
- **Structure cohérente** et optimisée

### 📊 Métriques Clés
- 👥 **3 utilisateurs** actifs
- 🏠 **2 foyers** créés
- 👶 **3 enfants** enregistrés
- 📚 **9 cours** gouvernementaux
- 📈 **27 progressions** de cours
- 🎯 **128 compétences** définies
- 📖 **432 contenus** d'apprentissage

## 🧹 Nettoyage Effectué

### ✅ Actions Réalisées
1. **Suppression d'utilisateur orphelin** : admin@profsacademie.ca
2. **Activation du système de progression** : 27 progressions créées
3. **Vérification de l'intégrité** des relations
4. **Optimisation de la structure** des données

### 📈 Améliorations
- Score de santé : ~70% → **89%** (+19%)
- Utilisateurs orphelins : 1 → **0** (-100%)
- Progressions de cours : 0 → **27** (+∞)

## 🔧 Scripts de Maintenance

### 📅 Maintenance Quotidienne
**Fichier** : `scripts/daily-maintenance.js`
**Horaire** : 2h00 du matin
**Actions** :
- Nettoyage des logs d'audit anciens (>30 jours)
- Vérification des utilisateurs orphelins
- Logs de maintenance

### 📅 Maintenance Hebdomadaire
**Fichier** : `scripts/weekly-maintenance.js`
**Horaire** : Dimanche 3h00 du matin
**Actions** :
- Vérification de l'intégrité des données
- Détection des enfants et sessions orphelines
- Génération de rapport de santé

### 📅 Maintenance Mensuelle
**Fichier** : `scripts/monthly-maintenance.js`
**Horaire** : 1er du mois 4h00 du matin
**Actions** :
- Analyse complète de la base de données
- Calcul du score de santé
- Génération de recommandations

### 💾 Sauvegarde Automatique
**Fichier** : `scripts/create-backup.js`
**Fréquence** : Avant chaque maintenance
**Actions** :
- Sauvegarde complète avec pg_dump
- Nettoyage des sauvegardes anciennes (>30 jours)
- Logs de sauvegarde

## 🚀 Configuration de Production

### 1. Configuration Cron
Ajouter les tâches suivantes au crontab :

```bash
# Maintenance quotidienne - 2h00 du matin
0 2 * * * cd /path/to/profsacademie/packages/db && node scripts/daily-maintenance.js >> logs/daily-maintenance.log 2>&1

# Maintenance hebdomadaire - Dimanche 3h00 du matin
0 3 * * 0 cd /path/to/profsacademie/packages/db && node scripts/weekly-maintenance.js >> logs/weekly-maintenance.log 2>&1

# Maintenance mensuelle - 1er du mois à 4h00 du matin
0 4 1 * * cd /path/to/profsacademie/packages/db && node scripts/monthly-maintenance.js >> logs/monthly-maintenance.log 2>&1
```

### 2. Variables d'Environnement
Assurez-vous que `DATABASE_URL` est configuré dans l'environnement.

### 3. Permissions
```bash
chmod +x scripts/*.js
mkdir -p logs backups
```

## 📊 Surveillance et Monitoring

### 📈 Métriques à Surveiller
1. **Score de santé** (objectif : >85%)
2. **Nombre d'utilisateurs orphelins** (objectif : 0)
3. **Taille des logs d'audit** (nettoyer >30 jours)
4. **Performance des requêtes** (temps de réponse)

### 🔍 Logs à Surveiller
- `logs/daily-maintenance.log`
- `logs/weekly-maintenance.log`
- `logs/monthly-maintenance.log`

### ⚠️ Alertes Recommandées
- Échec de maintenance
- Score de santé <80%
- Utilisateurs orphelins détectés
- Échec de sauvegarde

## 🛠️ Commandes Utiles

### 🔍 Analyse Manuelle
```bash
# Analyse complète
node scripts/final-analysis.js

# Vérification du nettoyage
node scripts/verify-cleanup.js

# Création de sauvegarde manuelle
node scripts/create-backup.js
```

### 🧹 Nettoyage Manuel
```bash
# Nettoyage des logs anciens
node scripts/cleanup-database.js

# Activation des systèmes
node scripts/activate-systems.js
```

### 📊 Rapports
```bash
# Générer rapport de santé
node scripts/weekly-maintenance.js

# Analyse mensuelle
node scripts/monthly-maintenance.js
```

## 📋 Checklist de Maintenance

### ✅ Quotidien
- [ ] Vérifier les logs de maintenance
- [ ] Surveiller les erreurs de base de données
- [ ] Vérifier l'espace disque

### ✅ Hebdomadaire
- [ ] Examiner le rapport de santé
- [ ] Vérifier l'intégrité des données
- [ ] Surveiller les performances

### ✅ Mensuel
- [ ] Analyser les tendances
- [ ] Réviser les recommandations
- [ ] Optimiser les index si nécessaire

### ✅ Trimestriel
- [ ] Réviser les scripts de maintenance
- [ ] Mettre à jour la documentation
- [ ] Tester les procédures de récupération

## 🚨 Procédures d'Urgence

### 🔥 Récupération de Données
1. Identifier la dernière sauvegarde valide
2. Restaurer avec `psql $DATABASE_URL < backup-file.sql`
3. Vérifier l'intégrité des données
4. Notifier l'équipe

### ⚡ Problèmes Courants
1. **Utilisateurs orphelins** : Exécuter `cleanup-database.js`
2. **Performance lente** : Vérifier les index et les requêtes
3. **Espace disque plein** : Nettoyer les logs et sauvegardes anciennes

## 📚 Documentation Associée

### 📄 Rapports Générés
- `DATABASE_CLEANUP_REPORT.md` - Rapport initial de nettoyage
- `FINAL_CLEANUP_REPORT.md` - Rapport final complet
- `database-analysis-simple.json` - Analyse détaillée
- `maintenance-config.json` - Configuration de maintenance

### 🔧 Scripts Disponibles
- `scripts/analyze-database-simple.js` - Analyse de base
- `scripts/cleanup-database.js` - Nettoyage des données
- `scripts/activate-systems.js` - Activation des systèmes
- `scripts/verify-cleanup.js` - Vérification du nettoyage
- `scripts/maintenance-schedule.js` - Planification de maintenance

## 🎯 Objectifs de Performance

### 📊 Métriques Cibles
- **Score de santé** : >90%
- **Temps de réponse** : <100ms pour les requêtes principales
- **Disponibilité** : 99.9%
- **Sauvegardes** : Quotidiennes avec rétention 30 jours

### 🔄 Améliorations Futures
1. **Monitoring en temps réel** avec Prometheus/Grafana
2. **Alertes automatiques** via Slack/Email
3. **Optimisation des requêtes** avec EXPLAIN ANALYZE
4. **Partitioning** des tables volumineuses

## 📞 Support et Contact

### 👥 Équipe Responsable
- **Développeur principal** : [Nom]
- **DevOps** : [Nom]
- **DBA** : [Nom]

### 📧 Contacts d'Urgence
- **Urgence technique** : [Email/Téléphone]
- **Support utilisateur** : [Email/Téléphone]

---

*Dernière mise à jour : ${new Date().toLocaleDateString('fr-CA')}*  
*Version : 1.0*  
*Base de données : PostgreSQL - Profs Académie*
