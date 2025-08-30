const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyCleanup() {
  console.log('🔍 Vérification finale du nettoyage et de l\'activation...\n');
  
  const verification = {
    timestamp: new Date().toISOString(),
    status: 'SUCCESS',
    metrics: {},
    issues: [],
    recommendations: []
  };

  try {
    // 1. Vérifier l'état des tables principales
    console.log('📊 Vérification de l\'état des tables:');
    
    const tableChecks = [
      { name: 'users', model: prisma.user, label: '👥 Utilisateurs' },
      { name: 'foyers', model: prisma.foyer, label: '🏠 Foyers' },
      { name: 'enfants', model: prisma.enfant, label: '👶 Enfants' },
      { name: 'cours_gouvernementaux', model: prisma.coursGouvernemental, label: '📚 Cours' },
      { name: 'progressions_cours', model: prisma.progressionCours, label: '📈 Progressions' },
      { name: 'competences', model: prisma.competence, label: '🎯 Compétences' },
      { name: 'contenus_apprentissage', model: prisma.contenuApprentissage, label: '📖 Contenus' },
      { name: 'abonnements', model: prisma.abonnements, label: '💳 Abonnements' },
      { name: 'audit_logs', model: prisma.audit_logs, label: '📝 Audit logs' }
    ];

    for (const check of tableChecks) {
      const count = await check.model.count();
      verification.metrics[check.name] = count;
      console.log(`${check.label}: ${count} enregistrements`);
    }

    // 2. Vérifier l'intégrité des relations
    console.log('\n🔍 Vérification de l\'intégrité des relations:');
    
    // Utilisateurs avec foyer
    const usersWithFoyer = await prisma.user.count({
      where: { foyer: { isNot: null } }
    });
    const totalUsers = verification.metrics.users;
    const userFoyerRatio = totalUsers > 0 ? (usersWithFoyer / totalUsers * 100).toFixed(1) : 0;
    console.log(`👥 Utilisateurs avec foyer: ${usersWithFoyer}/${totalUsers} (${userFoyerRatio}%)`);
    
    if (userFoyerRatio < 100) {
      verification.issues.push(`${totalUsers - usersWithFoyer} utilisateurs sans foyer`);
    }

    // Enfants avec foyer
    const enfantsWithFoyer = await prisma.enfant.count({
      where: { foyer: { isNot: null } }
    });
    const totalEnfants = verification.metrics.enfants;
    const enfantFoyerRatio = totalEnfants > 0 ? (enfantsWithFoyer / totalEnfants * 100).toFixed(1) : 0;
    console.log(`👶 Enfants avec foyer: ${enfantsWithFoyer}/${totalEnfants} (${enfantFoyerRatio}%)`);
    
    if (enfantFoyerRatio < 100) {
      verification.issues.push(`${totalEnfants - enfantsWithFoyer} enfants sans foyer`);
    }

    // Progressions actives
    const progressionsActives = await prisma.progressionCours.count({
      where: {
        OR: [
          { pourcentage: { gt: 0 } },
          { tempsPasse: { gt: 0 } },
          { statut: { in: ['EN_COURS', 'TERMINE'] } }
        ]
      }
    });
    const totalProgressions = verification.metrics.progressions_cours;
    const progressionRatio = totalProgressions > 0 ? (progressionsActives / totalProgressions * 100).toFixed(1) : 0;
    console.log(`📈 Progressions actives: ${progressionsActives}/${totalProgressions} (${progressionRatio}%)`);

    // 3. Vérifier les systèmes activés
    console.log('\n✅ Vérification des systèmes activés:');
    
    // Système de progression
    if (verification.metrics.progressions_cours > 0) {
      console.log('✅ Système de progression des cours: ACTIF');
    } else {
      console.log('❌ Système de progression des cours: INACTIF');
      verification.issues.push('Système de progression inactif');
    }

    // Système d'audit
    if (verification.metrics.audit_logs > 0) {
      console.log('✅ Système de logs d\'audit: ACTIF');
    } else {
      console.log('❌ Système de logs d\'audit: INACTIF');
      verification.issues.push('Système d\'audit inactif');
    }

    // Système d'abonnement
    if (verification.metrics.abonnements > 0) {
      console.log('✅ Système d\'abonnement: ACTIF');
    } else {
      console.log('❌ Système d\'abonnement: INACTIF');
      verification.issues.push('Système d\'abonnement inactif');
    }

    // 4. Calculer le score de santé final
    const activeTables = Object.values(verification.metrics).filter(count => count > 0).length;
    const totalTables = Object.keys(verification.metrics).length;
    const healthScore = Math.round((activeTables / totalTables) * 100);
    
    verification.metrics.healthScore = healthScore;
    verification.metrics.activeTables = activeTables;
    verification.metrics.totalTables = totalTables;

    console.log(`\n🏥 Score de santé final: ${healthScore}%`);
    console.log(`📊 Tables actives: ${activeTables}/${totalTables}`);

    // 5. Évaluer le succès du nettoyage
    if (healthScore >= 85 && verification.issues.length === 0) {
      verification.status = 'EXCELLENT';
      console.log('🎉 Nettoyage et activation EXCELLENTS !');
    } else if (healthScore >= 75 && verification.issues.length <= 2) {
      verification.status = 'GOOD';
      console.log('✅ Nettoyage et activation RÉUSSIS !');
    } else if (healthScore >= 60) {
      verification.status = 'FAIR';
      console.log('⚠️ Nettoyage et activation ACCEPTABLES');
    } else {
      verification.status = 'POOR';
      console.log('❌ Nettoyage et activation INSUFFISANTS');
    }

    // 6. Générer les recommandations finales
    if (verification.issues.length > 0) {
      console.log('\n⚠️ Problèmes détectés:');
      verification.issues.forEach(issue => {
        console.log(`- ${issue}`);
      });
    }

    // Recommandations basées sur l'état final
    if (healthScore < 90) {
      verification.recommendations.push('Continuer l\'optimisation des systèmes inactifs');
    }
    
    if (verification.metrics.progressions_cours === 0) {
      verification.recommendations.push('Activer le système de progression des cours');
    }
    
    if (verification.metrics.audit_logs === 0) {
      verification.recommendations.push('Activer les logs d\'audit pour la sécurité');
    }

    if (verification.recommendations.length > 0) {
      console.log('\n💡 Recommandations finales:');
      verification.recommendations.forEach(rec => console.log(`- ${rec}`));
    }

    // 7. Résumé final
    console.log('\n📋 Résumé final:');
    console.log(`Status: ${verification.status}`);
    console.log(`Score de santé: ${healthScore}%`);
    console.log(`Problèmes détectés: ${verification.issues.length}`);
    console.log(`Recommandations: ${verification.recommendations.length}`);

    // Sauvegarder le rapport de vérification
    const fs = require('fs');
    fs.writeFileSync(
      'database-verification-report.json',
      JSON.stringify(verification, null, 2)
    );

    console.log('\n✅ Rapport de vérification sauvegardé dans database-verification-report.json');

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
    verification.status = 'ERROR';
    verification.error = error.message;
  } finally {
    await prisma.$disconnect();
  }
}

verifyCleanup();
