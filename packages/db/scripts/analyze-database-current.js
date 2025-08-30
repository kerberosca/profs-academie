const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function analyzeDatabase() {
  console.log('🔍 Analyse de la base de données en cours...\n');
  
  const analysis = {
    timestamp: new Date().toISOString(),
    tables: {},
    recommendations: [],
    unusedTables: [],
    dataIntegrity: {}
  };

  try {
    // Analyser chaque table
    const tables = [
      'users', 'foyers', 'enfants', 'profils_prof', 'cours_gouvernementaux',
      'calendriers_etude', 'sessions_etude', 'progressions_cours',
      'competences', 'contenus_apprentissage', 'abonnements', 'audit_logs',
      'consentements', 'cours', 'lecons', 'modules', 'plans', 'progressions',
      'questions', 'quiz', 'soumissions', 'suivis_apprentissage'
    ];

    for (const table of tables) {
      try {
        const count = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "${table}"`;
        const countValue = count[0]?.count || 0;
        
        analysis.tables[table] = {
          count: parseInt(countValue),
          status: countValue > 0 ? 'ACTIVE' : 'EMPTY'
        };

        // Vérifier les relations
        if (countValue === 0) {
          analysis.unusedTables.push({
            table,
            reason: 'Table vide',
            recommendation: 'Considérer la suppression si non utilisée'
          });
        }

        console.log(`📊 ${table}: ${countValue} enregistrements`);
      } catch (error) {
        console.log(`❌ Erreur lors de l'analyse de ${table}:`, error.message);
        analysis.tables[table] = {
          count: -1,
          status: 'ERROR',
          error: error.message
        };
      }
    }

    // Vérifier l'intégrité des données
    console.log('\n🔍 Vérification de l\'intégrité des données...');
    
    // Vérifier les utilisateurs orphelins
    const orphanUsers = await prisma.user.findMany({
      where: {
        foyer: null,
        profilProf: null,
        abonnements: { none: {} },
        cours: { none: {} },
        calendriers: { none: {} }
      }
    });

    if (orphanUsers.length > 0) {
      analysis.dataIntegrity.orphanUsers = orphanUsers.length;
      analysis.recommendations.push(`Supprimer ${orphanUsers.length} utilisateurs orphelins`);
    }

    // Vérifier les enfants sans foyer
    const orphanChildren = await prisma.enfant.findMany({
      where: {
        foyer: null
      }
    });

    if (orphanChildren.length > 0) {
      analysis.dataIntegrity.orphanChildren = orphanChildren.length;
      analysis.recommendations.push(`Supprimer ${orphanChildren.length} enfants orphelins`);
    }

    // Vérifier les sessions sans calendrier
    const orphanSessions = await prisma.sessionEtude.findMany({
      where: {
        calendrier: null
      }
    });

    if (orphanSessions.length > 0) {
      analysis.dataIntegrity.orphanSessions = orphanSessions.length;
      analysis.recommendations.push(`Supprimer ${orphanSessions.length} sessions orphelines`);
    }

    // Analyser les tables potentiellement inutilisées
    const potentiallyUnused = [
      { table: 'audit_logs', reason: 'Logs système - peut être conservé pour la sécurité' },
      { table: 'consentements', reason: 'Conformité RGPD - nécessaire' },
      { table: 'cours', reason: 'Système de cours personnalisés - vérifier l\'utilisation' },
      { table: 'lecons', reason: 'Partie du système de cours personnalisés' },
      { table: 'modules', reason: 'Partie du système de cours personnalisés' },
      { table: 'progressions', reason: 'Partie du système de cours personnalisés' },
      { table: 'questions', reason: 'Partie du système de quiz' },
      { table: 'quiz', reason: 'Système de quiz - vérifier l\'utilisation' },
      { table: 'soumissions', reason: 'Partie du système de quiz' }
    ];

    for (const item of potentiallyUnused) {
      const count = analysis.tables[item.table]?.count || 0;
      if (count === 0) {
        analysis.unusedTables.push({
          table: item.table,
          reason: item.reason,
          recommendation: 'Évaluer si cette fonctionnalité est nécessaire'
        });
      }
    }

    console.log('\n📋 Résumé de l\'analyse:');
    console.log(`Total de tables analysées: ${Object.keys(analysis.tables).length}`);
    console.log(`Tables vides: ${analysis.unusedTables.filter(t => t.reason === 'Table vide').length}`);
    console.log(`Tables potentiellement inutilisées: ${analysis.unusedTables.filter(t => t.reason !== 'Table vide').length}`);

    if (analysis.recommendations.length > 0) {
      console.log('\n⚠️ Recommandations:');
      analysis.recommendations.forEach(rec => console.log(`- ${rec}`));
    }

    // Sauvegarder le rapport
    const fs = require('fs');
    fs.writeFileSync(
      'database-analysis-current.json',
      JSON.stringify(analysis, null, 2)
    );

    console.log('\n✅ Rapport sauvegardé dans database-analysis-current.json');

  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse:', error);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeDatabase();
