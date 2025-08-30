
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
      analysis.recommendations.push('Activer les logs d'audit pour la sécurité');
    }
    
    if (analysis.tables.progressions_cours === 0) {
      analysis.recommendations.push('Activer le système de progression des cours');
    }
    
    const fs = require('fs');
    fs.writeFileSync(
      `monthly-analysis-${new Date().toISOString().slice(0, 7)}.json`,
      JSON.stringify(analysis, null, 2)
    );
    
    console.log(`🏥 Score de santé mensuel: ${healthScore}%`);
    console.log('✅ Analyse mensuelle terminée');
    
  } catch (error) {
    console.error('❌ Erreur lors de la maintenance:', error);
  } finally {
    await prisma.$disconnect();
  }
}

monthlyMaintenance();
