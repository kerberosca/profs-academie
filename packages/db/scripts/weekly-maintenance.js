
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
      console.log(`⚠️ ${orphanChildren.length} enfants orphelins détectés`);
    }
    
    // Vérifier les sessions sans calendrier
    const orphanSessions = await prisma.sessionEtude.findMany({
      where: {
        calendrier: null
      }
    });
    
    if (orphanSessions.length > 0) {
      console.log(`⚠️ ${orphanSessions.length} sessions orphelines détectées`);
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
      `health-report-${new Date().toISOString().split('T')[0]}.json`,
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
