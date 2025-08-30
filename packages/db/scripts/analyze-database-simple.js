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
    // Analyser chaque table avec les méthodes Prisma
    console.log('📊 Comptage des enregistrements par table:');
    
    // Users
    const userCount = await prisma.user.count();
    analysis.tables.users = { count: userCount, status: userCount > 0 ? 'ACTIVE' : 'EMPTY' };
    console.log(`👥 Users: ${userCount} utilisateurs`);

    // Foyers
    const foyerCount = await prisma.foyer.count();
    analysis.tables.foyers = { count: foyerCount, status: foyerCount > 0 ? 'ACTIVE' : 'EMPTY' };
    console.log(`🏠 Foyers: ${foyerCount} foyers`);

    // Enfants
    const enfantCount = await prisma.enfant.count();
    analysis.tables.enfants = { count: enfantCount, status: enfantCount > 0 ? 'ACTIVE' : 'EMPTY' };
    console.log(`👶 Enfants: ${enfantCount} enfants`);

    // Profils Prof
    const profCount = await prisma.profilProf.count();
    analysis.tables.profils_prof = { count: profCount, status: profCount > 0 ? 'ACTIVE' : 'EMPTY' };
    console.log(`👨‍🏫 Profils Prof: ${profCount} profils`);

    // Cours Gouvernementaux
    const coursGouvCount = await prisma.coursGouvernemental.count();
    analysis.tables.cours_gouvernementaux = { count: coursGouvCount, status: coursGouvCount > 0 ? 'ACTIVE' : 'EMPTY' };
    console.log(`📚 Cours Gouvernementaux: ${coursGouvCount} cours`);

    // Calendriers d'étude
    const calendrierCount = await prisma.calendrierEtude.count();
    analysis.tables.calendriers_etude = { count: calendrierCount, status: calendrierCount > 0 ? 'ACTIVE' : 'EMPTY' };
    console.log(`📅 Calendriers d'étude: ${calendrierCount} calendriers`);

    // Sessions d'étude
    const sessionCount = await prisma.sessionEtude.count();
    analysis.tables.sessions_etude = { count: sessionCount, status: sessionCount > 0 ? 'ACTIVE' : 'EMPTY' };
    console.log(`⏰ Sessions d'étude: ${sessionCount} sessions`);

    // Progressions de cours
    const progressionCount = await prisma.progressionCours.count();
    analysis.tables.progressions_cours = { count: progressionCount, status: progressionCount > 0 ? 'ACTIVE' : 'EMPTY' };
    console.log(`📈 Progressions de cours: ${progressionCount} progressions`);

    // Compétences
    const competenceCount = await prisma.competence.count();
    analysis.tables.competences = { count: competenceCount, status: competenceCount > 0 ? 'ACTIVE' : 'EMPTY' };
    console.log(`🎯 Compétences: ${competenceCount} compétences`);

    // Contenus d'apprentissage
    const contenuCount = await prisma.contenuApprentissage.count();
    analysis.tables.contenus_apprentissage = { count: contenuCount, status: contenuCount > 0 ? 'ACTIVE' : 'EMPTY' };
    console.log(`📖 Contenus d'apprentissage: ${contenuCount} contenus`);

    // Abonnements
    const abonnementCount = await prisma.abonnements.count();
    analysis.tables.abonnements = { count: abonnementCount, status: abonnementCount > 0 ? 'ACTIVE' : 'EMPTY' };
    console.log(`💳 Abonnements: ${abonnementCount} abonnements`);

    // Audit logs
    const auditCount = await prisma.audit_logs.count();
    analysis.tables.audit_logs = { count: auditCount, status: auditCount > 0 ? 'ACTIVE' : 'EMPTY' };
    console.log(`📝 Audit logs: ${auditCount} logs`);

    // Consentements
    const consentementCount = await prisma.consentements.count();
    analysis.tables.consentements = { count: consentementCount, status: consentementCount > 0 ? 'ACTIVE' : 'EMPTY' };
    console.log(`✅ Consentements: ${consentementCount} consentements`);

    // Plans
    const planCount = await prisma.plans.count();
    analysis.tables.plans = { count: planCount, status: planCount > 0 ? 'ACTIVE' : 'EMPTY' };
    console.log(`📋 Plans: ${planCount} plans`);

    // Suivis d'apprentissage
    const suiviCount = await prisma.suivis_apprentissage.count();
    analysis.tables.suivis_apprentissage = { count: suiviCount, status: suiviCount > 0 ? 'ACTIVE' : 'EMPTY' };
    console.log(`📊 Suivis d'apprentissage: ${suiviCount} suivis`);

    // Vérifier l'intégrité des données
    console.log('\n🔍 Vérification de l\'intégrité des données...');
    
    // Vérifier les utilisateurs sans foyer ni profil prof
    const orphanUsers = await prisma.user.findMany({
      where: {
        foyer: null,
        profilProf: null,
        abonnements: { none: {} }
      }
    });

    if (orphanUsers.length > 0) {
      analysis.dataIntegrity.orphanUsers = orphanUsers.length;
      analysis.recommendations.push(`Supprimer ${orphanUsers.length} utilisateurs orphelins`);
      console.log(`⚠️ ${orphanUsers.length} utilisateurs orphelins trouvés`);
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
      console.log(`⚠️ ${orphanChildren.length} enfants orphelins trouvés`);
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
      console.log(`⚠️ ${orphanSessions.length} sessions orphelines trouvées`);
    }

    // Identifier les tables vides
    const emptyTables = Object.entries(analysis.tables)
      .filter(([table, data]) => data.count === 0)
      .map(([table]) => table);

    console.log('\n📋 Résumé de l\'analyse:');
    console.log(`Total de tables analysées: ${Object.keys(analysis.tables).length}`);
    console.log(`Tables vides: ${emptyTables.length}`);
    
    if (emptyTables.length > 0) {
      console.log('\n🗑️ Tables vides:');
      emptyTables.forEach(table => {
        console.log(`- ${table}`);
        analysis.unusedTables.push({
          table,
          reason: 'Table vide',
          recommendation: 'Considérer la suppression si non utilisée'
        });
      });
    }

    // Recommandations spécifiques
    if (auditCount === 0) {
      analysis.recommendations.push('Considérer l\'activation des logs d\'audit pour la sécurité');
    }

    if (consentementCount === 0) {
      analysis.recommendations.push('Implémenter la gestion des consentements RGPD');
    }

    if (planCount === 0) {
      analysis.recommendations.push('Créer des plans d\'abonnement pour la monétisation');
    }

    if (analysis.recommendations.length > 0) {
      console.log('\n⚠️ Recommandations:');
      analysis.recommendations.forEach(rec => console.log(`- ${rec}`));
    }

    // Sauvegarder le rapport
    const fs = require('fs');
    fs.writeFileSync(
      'database-analysis-simple.json',
      JSON.stringify(analysis, null, 2)
    );

    console.log('\n✅ Rapport sauvegardé dans database-analysis-simple.json');

  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse:', error);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeDatabase();
