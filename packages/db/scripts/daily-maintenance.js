
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
    
    console.log(`🗑️ ${deletedLogs.count} logs d'audit anciens supprimés`);
    
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
      console.log(`⚠️ ${orphanUsers.length} utilisateurs orphelins détectés`);
    }
    
    console.log('✅ Maintenance quotidienne terminée');
    
  } catch (error) {
    console.error('❌ Erreur lors de la maintenance:', error);
  } finally {
    await prisma.$disconnect();
  }
}

dailyMaintenance();
