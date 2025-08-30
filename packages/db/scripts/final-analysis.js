const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function finalAnalysis() {
  console.log('🔍 Analyse finale de la base de données...\n');
  
  const analysis = {
    timestamp: new Date().toISOString(),
    summary: {},
    recommendations: [],
    tablesStatus: {}
  };

  try {
    // Comptage des enregistrements par table
    console.log('📊 État actuel de la base de données:');
    
    const tables = [
      { name: 'users', model: prisma.user, label: '👥 Utilisateurs' },
      { name: 'foyers', model: prisma.foyer, label: '🏠 Foyers' },
      { name: 'enfants', model: prisma.enfant, label: '👶 Enfants' },
      { name: 'profils_prof', model: prisma.profilProf, label: '👨‍🏫 Profils Prof' },
      { name: 'cours_gouvernementaux', model: prisma.coursGouvernemental, label: '📚 Cours Gouvernementaux' },
      { name: 'calendriers_etude', model: prisma.calendrierEtude, label: '📅 Calendriers d\'étude' },
      { name: 'sessions_etude', model: prisma.sessionEtude, label: '⏰ Sessions d\'étude' },
      { name: 'progressions_cours', model: prisma.progressionCours, label: '📈 Progressions de cours' },
      { name: 'competences', model: prisma.competence, label: '🎯 Compétences' },
      { name: 'contenus_apprentissage', model: prisma.contenuApprentissage, label: '📖 Contenus d\'apprentissage' },
      { name: 'abonnements', model: prisma.abonnements, label: '💳 Abonnements' },
      { name: 'audit_logs', model: prisma.audit_logs, label: '📝 Audit logs' },
      { name: 'consentements', model: prisma.consentements, label: '✅ Consentements' },
      { name: 'plans', model: prisma.plans, label: '📋 Plans' },
      { name: 'suivis_apprentissage', model: prisma.suivis_apprentissage, label: '📊 Suivis d\'apprentissage' }
    ];

    for (const table of tables) {
      try {
        const count = await table.model.count();
        analysis.tablesStatus[table.name] = {
          count,
          status: count > 0 ? 'ACTIVE' : 'EMPTY'
        };
        console.log(`${table.label}: ${count} enregistrements`);
      } catch (error) {
        console.log(`❌ Erreur pour ${table.label}: ${error.message}`);
        analysis.tablesStatus[table.name] = {
          count: -1,
          status: 'ERROR',
          error: error.message
        };
      }
    }

    // Vérifier l'intégrité des données
    console.log('\n🔍 Vérification de l\'intégrité des données...');
    
    // Vérifier les relations utilisateur-foyer
    const usersWithFoyer = await prisma.user.count({
      where: { foyer: { isNot: null } }
    });
    const totalUsers = await prisma.user.count();
    
    console.log(`👥 Utilisateurs avec foyer: ${usersWithFoyer}/${totalUsers}`);
    analysis.summary.usersWithFoyer = { current: usersWithFoyer, total: totalUsers };

    // Vérifier les relations enfant-foyer
    const enfantsWithFoyer = await prisma.enfant.count({
      where: { foyer: { isNot: null } }
    });
    const totalEnfants = await prisma.enfant.count();
    
    console.log(`👶 Enfants avec foyer: ${enfantsWithFoyer}/${totalEnfants}`);
    analysis.summary.enfantsWithFoyer = { current: enfantsWithFoyer, total: totalEnfants };

    // Vérifier les sessions avec calendrier
    const sessionsWithCalendrier = await prisma.sessionEtude.count({
      where: { calendrier: { isNot: null } }
    });
    const totalSessions = await prisma.sessionEtude.count();
    
    console.log(`⏰ Sessions avec calendrier: ${sessionsWithCalendrier}/${totalSessions}`);
    analysis.summary.sessionsWithCalendrier = { current: sessionsWithCalendrier, total: totalSessions };

    // Vérifier les progressions actives
    const progressionsActives = await prisma.progressionCours.count({
      where: {
        OR: [
          { pourcentage: { gt: 0 } },
          { tempsPasse: { gt: 0 } },
          { statut: { in: ['EN_COURS', 'TERMINE'] } }
        ]
      }
    });
    const totalProgressions = await prisma.progressionCours.count();
    
    console.log(`📈 Progressions actives: ${progressionsActives}/${totalProgressions}`);
    analysis.summary.progressionsActives = { current: progressionsActives, total: totalProgressions };

    // Analyser les tables vides
    const emptyTables = Object.entries(analysis.tablesStatus)
      .filter(([table, data]) => data.count === 0)
      .map(([table]) => table);

    console.log('\n📋 Résumé de l\'analyse:');
    console.log(`Total de tables analysées: ${Object.keys(analysis.tablesStatus).length}`);
    console.log(`Tables vides: ${emptyTables.length}`);
    
    if (emptyTables.length > 0) {
      console.log('\n🗑️ Tables vides:');
      emptyTables.forEach(table => {
        console.log(`- ${table}`);
      });
    }

    // Recommandations basées sur l'analyse
    analysis.recommendations = [];

    if (analysis.tablesStatus.audit_logs.count === 0) {
      analysis.recommendations.push('Considérer l\'activation des logs d\'audit pour la sécurité');
    }

    if (analysis.tablesStatus.suivis_apprentissage.count === 0) {
      analysis.recommendations.push('Implémenter le système de suivi d\'apprentissage');
    }

    if (analysis.tablesStatus.progressions_cours.count === 0) {
      analysis.recommendations.push('Activer le système de progression des cours');
    }

    if (analysis.tablesStatus.abonnements.count === 0) {
      analysis.recommendations.push('Créer des abonnements pour les utilisateurs');
    }

    if (analysis.tablesStatus.plans.count === 0) {
      analysis.recommendations.push('Créer des plans d\'abonnement');
    }

    // Évaluation de la santé de la base de données
    const activeTables = Object.values(analysis.tablesStatus).filter(data => data.count > 0).length;
    const totalTables = Object.keys(analysis.tablesStatus).length;
    const healthScore = Math.round((activeTables / totalTables) * 100);

    analysis.summary.healthScore = healthScore;
    analysis.summary.activeTables = activeTables;
    analysis.summary.totalTables = totalTables;

    console.log(`\n🏥 Score de santé de la base de données: ${healthScore}%`);
    console.log(`📊 Tables actives: ${activeTables}/${totalTables}`);

    if (healthScore >= 80) {
      console.log('✅ La base de données est en bonne santé !');
    } else if (healthScore >= 60) {
      console.log('⚠️ La base de données nécessite quelques améliorations');
    } else {
      console.log('❌ La base de données nécessite une attention urgente');
    }

    if (analysis.recommendations.length > 0) {
      console.log('\n💡 Recommandations:');
      analysis.recommendations.forEach(rec => console.log(`- ${rec}`));
    }

    // Sauvegarder le rapport final
    const fs = require('fs');
    fs.writeFileSync(
      'database-final-analysis.json',
      JSON.stringify(analysis, null, 2)
    );

    console.log('\n✅ Rapport final sauvegardé dans database-final-analysis.json');

  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse finale:', error);
  } finally {
    await prisma.$disconnect();
  }
}

finalAnalysis();
