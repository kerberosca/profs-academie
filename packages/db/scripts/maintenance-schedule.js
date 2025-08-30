const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function maintenanceSchedule() {
  console.log('🔧 Planification de la maintenance de la base de données...\n');
  
  const maintenance = {
    timestamp: new Date().toISOString(),
    schedule: {},
    scripts: {},
    recommendations: []
  };

  try {
    // 1. Créer le script de maintenance quotidienne
    const dailyScript = `
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function dailyMaintenance() {
  console.log('🧹 Maintenance quotidienne de la base de données...');
  
  try {
    // Nettoyer les logs d'audit anciens (garder 30 jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const deletedLogs = await prisma.audit_logs.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo
        }
      }
    });
    
    console.log(\`🗑️ \${deletedLogs.count} logs d'audit anciens supprimés\`);
    
    // Vérifier les utilisateurs orphelins
    const orphanUsers = await prisma.user.findMany({
      where: {
        foyer: null,
        profilProf: null,
        abonnements: { none: {} },
        calendriers: { none: {} }
      }
    });
    
    if (orphanUsers.length > 0) {
      console.log(\`⚠️ \${orphanUsers.length} utilisateurs orphelins détectés\`);
    }
    
    console.log('✅ Maintenance quotidienne terminée');
    
  } catch (error) {
    console.error('❌ Erreur lors de la maintenance:', error);
  } finally {
    await prisma.$disconnect();
  }
}

dailyMaintenance();
`;

    fs.writeFileSync('scripts/daily-maintenance.js', dailyScript);
    maintenance.scripts.daily = 'scripts/daily-maintenance.js';
    console.log('✅ Script de maintenance quotidienne créé');

    // 2. Créer le script de maintenance hebdomadaire
    const weeklyScript = `
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function weeklyMaintenance() {
  console.log('🔧 Maintenance hebdomadaire de la base de données...');
  
  try {
    // Vérifier l'intégrité des données
    const orphanChildren = await prisma.enfant.findMany({
      where: {
        foyer: null
      }
    });
    
    if (orphanChildren.length > 0) {
      console.log(\`⚠️ \${orphanChildren.length} enfants orphelins détectés\`);
    }
    
    // Vérifier les sessions sans calendrier
    const orphanSessions = await prisma.sessionEtude.findMany({
      where: {
        calendrier: null
      }
    });
    
    if (orphanSessions.length > 0) {
      console.log(\`⚠️ \${orphanSessions.length} sessions orphelines détectées\`);
    }
    
    // Générer un rapport de santé
    const healthReport = {
      timestamp: new Date().toISOString(),
      users: await prisma.user.count(),
      foyers: await prisma.foyer.count(),
      enfants: await prisma.enfant.count(),
      cours: await prisma.coursGouvernemental.count(),
      progressions: await prisma.progressionCours.count(),
      competences: await prisma.competence.count(),
      contenus: await prisma.contenuApprentissage.count()
    };
    
    const fs = require('fs');
    fs.writeFileSync(
      \`health-report-\${new Date().toISOString().split('T')[0]}.json\`,
      JSON.stringify(healthReport, null, 2)
    );
    
    console.log('✅ Rapport de santé hebdomadaire généré');
    console.log('✅ Maintenance hebdomadaire terminée');
    
  } catch (error) {
    console.error('❌ Erreur lors de la maintenance:', error);
  } finally {
    await prisma.$disconnect();
  }
}

weeklyMaintenance();
`;

    fs.writeFileSync('scripts/weekly-maintenance.js', weeklyScript);
    maintenance.scripts.weekly = 'scripts/weekly-maintenance.js';
    console.log('✅ Script de maintenance hebdomadaire créé');

    // 3. Créer le script de maintenance mensuelle
    const monthlyScript = `
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function monthlyMaintenance() {
  console.log('📊 Maintenance mensuelle de la base de données...');
  
  try {
    // Analyse complète de la base de données
    const analysis = {
      timestamp: new Date().toISOString(),
      tables: {},
      recommendations: []
    };
    
    const tables = [
      { name: 'users', model: prisma.user },
      { name: 'foyers', model: prisma.foyer },
      { name: 'enfants', model: prisma.enfant },
      { name: 'cours_gouvernementaux', model: prisma.coursGouvernemental },
      { name: 'progressions_cours', model: prisma.progressionCours },
      { name: 'competences', model: prisma.competence },
      { name: 'contenus_apprentissage', model: prisma.contenuApprentissage },
      { name: 'abonnements', model: prisma.abonnements },
      { name: 'audit_logs', model: prisma.audit_logs }
    ];
    
    for (const table of tables) {
      const count = await table.model.count();
      analysis.tables[table.name] = count;
    }
    
    // Calculer le score de santé
    const activeTables = Object.values(analysis.tables).filter(count => count > 0).length;
    const totalTables = Object.keys(analysis.tables).length;
    const healthScore = Math.round((activeTables / totalTables) * 100);
    
    analysis.healthScore = healthScore;
    
    // Générer des recommandations
    if (analysis.tables.audit_logs === 0) {
      analysis.recommendations.push('Activer les logs d\'audit pour la sécurité');
    }
    
    if (analysis.tables.progressions_cours === 0) {
      analysis.recommendations.push('Activer le système de progression des cours');
    }
    
    const fs = require('fs');
    fs.writeFileSync(
      \`monthly-analysis-\${new Date().toISOString().slice(0, 7)}.json\`,
      JSON.stringify(analysis, null, 2)
    );
    
    console.log(\`🏥 Score de santé mensuel: \${healthScore}%\`);
    console.log('✅ Analyse mensuelle terminée');
    
  } catch (error) {
    console.error('❌ Erreur lors de la maintenance:', error);
  } finally {
    await prisma.$disconnect();
  }
}

monthlyMaintenance();
`;

    fs.writeFileSync('scripts/monthly-maintenance.js', monthlyScript);
    maintenance.scripts.monthly = 'scripts/monthly-maintenance.js';
    console.log('✅ Script de maintenance mensuelle créé');

    // 4. Créer le fichier de configuration cron
    const cronConfig = `
# Configuration cron pour la maintenance de la base de données Profs Académie

# Maintenance quotidienne - 2h00 du matin
0 2 * * * cd /path/to/profsacademie/packages/db && node scripts/daily-maintenance.js >> logs/daily-maintenance.log 2>&1

# Maintenance hebdomadaire - Dimanche 3h00 du matin
0 3 * * 0 cd /path/to/profsacademie/packages/db && node scripts/weekly-maintenance.js >> logs/weekly-maintenance.log 2>&1

# Maintenance mensuelle - 1er du mois à 4h00 du matin
0 4 1 * * cd /path/to/profsacademie/packages/db && node scripts/monthly-maintenance.js >> logs/monthly-maintenance.log 2>&1
`;

    fs.writeFileSync('cron-maintenance.txt', cronConfig);
    maintenance.schedule.cron = 'cron-maintenance.txt';
    console.log('✅ Configuration cron créée');

    // 5. Créer le dossier de logs
    if (!fs.existsSync('logs')) {
      fs.mkdirSync('logs');
      console.log('✅ Dossier de logs créé');
    }

    // 6. Créer le script de sauvegarde
    const backupScript = `
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function createBackup() {
  console.log('💾 Création de la sauvegarde de la base de données...');
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = 'backups';
  const backupFile = \`backup-\${timestamp}.sql\`;
  
  try {
    // Créer le dossier de sauvegarde s'il n'existe pas
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }
    
    // Créer la sauvegarde avec pg_dump
    const backupPath = path.join(backupDir, backupFile);
    execSync(\`pg_dump \$DATABASE_URL > \${backupPath}\`, { stdio: 'inherit' });
    
    console.log(\`✅ Sauvegarde créée: \${backupPath}\`);
    
    // Supprimer les sauvegardes anciennes (garder 30 jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const files = fs.readdirSync(backupDir);
    files.forEach(file => {
      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.mtime < thirtyDaysAgo) {
        fs.unlinkSync(filePath);
        console.log(\`🗑️ Sauvegarde ancienne supprimée: \${file}\`);
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error);
  }
}

createBackup();
`;

    fs.writeFileSync('scripts/create-backup.js', backupScript);
    maintenance.scripts.backup = 'scripts/create-backup.js';
    console.log('✅ Script de sauvegarde créé');

    // Configuration de la maintenance
    maintenance.schedule = {
      daily: '2h00 - Nettoyage des logs anciens et vérification des orphelins',
      weekly: 'Dimanche 3h00 - Vérification d\'intégrité et rapport de santé',
      monthly: '1er du mois 4h00 - Analyse complète et recommandations',
      backup: 'Avant chaque maintenance - Sauvegarde automatique'
    };

    maintenance.recommendations = [
      'Configurer les tâches cron sur le serveur de production',
      'Surveiller les logs de maintenance régulièrement',
      'Tester les scripts de maintenance en environnement de développement',
      'Mettre en place des alertes en cas d\'échec de maintenance',
      'Réviser les scripts de maintenance tous les 6 mois'
    ];

    console.log('\n📋 Planification de maintenance créée:');
    console.log('📅 Quotidienne: Nettoyage des logs et vérification des orphelins');
    console.log('📅 Hebdomadaire: Vérification d\'intégrité et rapport de santé');
    console.log('📅 Mensuelle: Analyse complète et recommandations');
    console.log('💾 Sauvegarde: Automatique avant chaque maintenance');

    console.log('\n💡 Recommandations:');
    maintenance.recommendations.forEach(rec => console.log(`- ${rec}`));

    // Sauvegarder la configuration
    fs.writeFileSync(
      'maintenance-config.json',
      JSON.stringify(maintenance, null, 2)
    );

    console.log('\n✅ Configuration de maintenance sauvegardée dans maintenance-config.json');

  } catch (error) {
    console.error('❌ Erreur lors de la création de la planification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

maintenanceSchedule();
