const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupDatabase() {
  console.log('🧹 Nettoyage de la base de données en cours...\n');
  
  const cleanup = {
    timestamp: new Date().toISOString(),
    deletedRecords: {},
    recommendations: []
  };

  try {
    // 1. Supprimer les utilisateurs orphelins (sans foyer, profil prof, abonnements, etc.)
    console.log('🔍 Recherche des utilisateurs orphelins...');
    const orphanUsers = await prisma.user.findMany({
      where: {
        foyer: null,
        profilProf: null,
        abonnements: { none: {} },
        calendriers: { none: {} }
      }
    });

    if (orphanUsers.length > 0) {
      console.log(`🗑️ Suppression de ${orphanUsers.length} utilisateurs orphelins...`);
      for (const user of orphanUsers) {
        console.log(`  - Suppression de l'utilisateur: ${user.email} (${user.id})`);
        await prisma.user.delete({
          where: { id: user.id }
        });
      }
      cleanup.deletedRecords.orphanUsers = orphanUsers.length;
    } else {
      console.log('✅ Aucun utilisateur orphelin trouvé');
    }

    // 2. Supprimer les sessions d'étude orphelines
    console.log('\n🔍 Recherche des sessions d\'étude orphelines...');
    const orphanSessions = await prisma.sessionEtude.findMany({
      where: {
        calendrier: null
      }
    });

    if (orphanSessions.length > 0) {
      console.log(`🗑️ Suppression de ${orphanSessions.length} sessions orphelines...`);
      for (const session of orphanSessions) {
        console.log(`  - Suppression de la session: ${session.titre} (${session.id})`);
        await prisma.sessionEtude.delete({
          where: { id: session.id }
        });
      }
      cleanup.deletedRecords.orphanSessions = orphanSessions.length;
    } else {
      console.log('✅ Aucune session orpheline trouvée');
    }

    // 3. Supprimer les progressions de cours vides ou inutiles
    console.log('\n🔍 Recherche des progressions de cours inutiles...');
    const emptyProgressions = await prisma.progressionCours.findMany({
      where: {
        OR: [
          { pourcentage: 0, tempsPasse: 0 },
          { statut: 'NON_COMMENCE' }
        ]
      }
    });

    if (emptyProgressions.length > 0) {
      console.log(`🗑️ Suppression de ${emptyProgressions.length} progressions vides...`);
      for (const progression of emptyProgressions) {
        await prisma.progressionCours.delete({
          where: { id: progression.id }
        });
      }
      cleanup.deletedRecords.emptyProgressions = emptyProgressions.length;
    } else {
      console.log('✅ Aucune progression vide trouvée');
    }

    // 4. Nettoyer les logs d'audit anciens (garder seulement les 30 derniers jours)
    console.log('\n🔍 Nettoyage des logs d\'audit anciens...');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const oldAuditLogs = await prisma.audit_logs.findMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo
        }
      }
    });

    if (oldAuditLogs.length > 0) {
      console.log(`🗑️ Suppression de ${oldAuditLogs.length} logs d'audit anciens...`);
      await prisma.audit_logs.deleteMany({
        where: {
          createdAt: {
            lt: thirtyDaysAgo
          }
        }
      });
      cleanup.deletedRecords.oldAuditLogs = oldAuditLogs.length;
    } else {
      console.log('✅ Aucun log d\'audit ancien trouvé');
    }

    // 5. Nettoyer les suivis d'apprentissage vides
    console.log('\n🔍 Recherche des suivis d\'apprentissage vides...');
    const emptySuivis = await prisma.suivis_apprentissage.findMany({
      where: {
        tempsPasse: 0,
        coursCompletes: 0,
        competencesAcquises: { isEmpty: true }
      }
    });

    if (emptySuivis.length > 0) {
      console.log(`🗑️ Suppression de ${emptySuivis.length} suivis d'apprentissage vides...`);
      for (const suivi of emptySuivis) {
        await prisma.suivis_apprentissage.delete({
          where: { id: suivi.id }
        });
      }
      cleanup.deletedRecords.emptySuivis = emptySuivis.length;
    } else {
      console.log('✅ Aucun suivi d\'apprentissage vide trouvé');
    }

    // 6. Vérifier et nettoyer les calendriers d'étude inactifs
    console.log('\n🔍 Recherche des calendriers d\'étude inactifs...');
    const inactiveCalendriers = await prisma.calendrierEtude.findMany({
      where: {
        actif: false,
        sessions: { none: {} }
      }
    });

    if (inactiveCalendriers.length > 0) {
      console.log(`🗑️ Suppression de ${inactiveCalendriers.length} calendriers inactifs...`);
      for (const calendrier of inactiveCalendriers) {
        await prisma.calendrierEtude.delete({
          where: { id: calendrier.id }
        });
      }
      cleanup.deletedRecords.inactiveCalendriers = inactiveCalendriers.length;
    } else {
      console.log('✅ Aucun calendrier inactif trouvé');
    }

    // Résumé du nettoyage
    console.log('\n📋 Résumé du nettoyage:');
    const totalDeleted = Object.values(cleanup.deletedRecords).reduce((sum, count) => sum + count, 0);
    
    if (totalDeleted > 0) {
      console.log(`🗑️ Total des enregistrements supprimés: ${totalDeleted}`);
      Object.entries(cleanup.deletedRecords).forEach(([type, count]) => {
        console.log(`  - ${type}: ${count}`);
      });
    } else {
      console.log('✅ Aucun enregistrement supprimé - la base de données est propre !');
    }

    // Recommandations
    cleanup.recommendations = [
      'Considérer l\'activation des logs d\'audit pour la sécurité',
      'Implémenter une stratégie de sauvegarde régulière',
      'Mettre en place des index sur les colonnes fréquemment utilisées'
    ];

    console.log('\n💡 Recommandations:');
    cleanup.recommendations.forEach(rec => console.log(`- ${rec}`));

    // Sauvegarder le rapport de nettoyage
    const fs = require('fs');
    fs.writeFileSync(
      'database-cleanup-report.json',
      JSON.stringify(cleanup, null, 2)
    );

    console.log('\n✅ Rapport de nettoyage sauvegardé dans database-cleanup-report.json');

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDatabase();
