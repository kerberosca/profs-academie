const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function activateSystems() {
  console.log('🔧 Activation des systèmes inactifs...\n');
  
  const activation = {
    timestamp: new Date().toISOString(),
    activatedSystems: [],
    createdRecords: {},
    recommendations: []
  };

  try {
    // 1. Activer le système de progression des cours
    console.log('📈 Activation du système de progression des cours...');
    
    // Récupérer tous les enfants et cours
    const enfants = await prisma.enfant.findMany();
    const cours = await prisma.coursGouvernemental.findMany();
    
    let progressionsCreated = 0;
    
    for (const enfant of enfants) {
      for (const coursItem of cours) {
        // Vérifier si une progression existe déjà
        const existingProgression = await prisma.progressionCours.findUnique({
          where: {
            enfantId_coursId: {
              enfantId: enfant.id,
              coursId: coursItem.id
            }
          }
        });
        
        if (!existingProgression) {
          // Créer une progression initiale
          await prisma.progressionCours.create({
            data: {
              enfantId: enfant.id,
              coursId: coursItem.id,
              pourcentage: 0,
              tempsPasse: 0,
              statut: 'NON_COMMENCE',
              notes: `Progression initiale pour ${enfant.prenom}`
            }
          });
          progressionsCreated++;
        }
      }
    }
    
    if (progressionsCreated > 0) {
      activation.activatedSystems.push('Système de progression des cours');
      activation.createdRecords.progressions = progressionsCreated;
      console.log(`✅ ${progressionsCreated} progressions de cours créées`);
    } else {
      console.log('✅ Système de progression déjà actif');
    }

    // 2. Activer le système de suivi d'apprentissage
    console.log('\n📊 Activation du système de suivi d\'apprentissage...');
    
    let suivisCreated = 0;
    
    for (const enfant of enfants) {
      // Créer un suivi d'apprentissage pour chaque enfant
      const existingSuivi = await prisma.suivis_apprentissage.findFirst({
        where: {
          enfantId: enfant.id,
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      });
      
      if (!existingSuivi) {
        await prisma.suivis_apprentissage.create({
          data: {
            enfantId: enfant.id,
            matiere: 'FRANCAIS', // Par défaut
            niveauScolaire: enfant.niveauScolaire || 'PRIMAIRE_1',
            tempsPasse: 0,
            coursCompletes: 0,
            competencesAcquises: [],
            observations: `Suivi initial pour ${enfant.prenom}`
          }
        });
        suivisCreated++;
      }
    }
    
    if (suivisCreated > 0) {
      activation.activatedSystems.push('Système de suivi d\'apprentissage');
      activation.createdRecords.suivis = suivisCreated;
      console.log(`✅ ${suivisCreated} suivis d'apprentissage créés`);
    } else {
      console.log('✅ Système de suivi déjà actif');
    }

    // 3. Activer les logs d'audit
    console.log('\n📝 Activation des logs d\'audit...');
    
    // Créer un log d'audit pour l'activation des systèmes
    await prisma.audit_logs.create({
      data: {
        action: 'SYSTEM_ACTIVATION',
        cibleType: 'DATABASE',
        cibleId: 'SYSTEMS',
        metadata: {
          activatedSystems: activation.activatedSystems,
          timestamp: new Date().toISOString()
        },
        acteurId: (await prisma.user.findFirst())?.id || 'system'
      }
    });
    
    activation.activatedSystems.push('Système de logs d\'audit');
    activation.createdRecords.auditLogs = 1;
    console.log('✅ Système de logs d\'audit activé');

    // 4. Vérifier et créer des abonnements pour les utilisateurs sans abonnement
    console.log('\n💳 Vérification des abonnements...');
    
    const usersWithoutSubscription = await prisma.user.findMany({
      where: {
        abonnements: { none: {} }
      }
    });
    
    let abonnementsCreated = 0;
    
    for (const user of usersWithoutSubscription) {
      // Trouver un plan par défaut
      const defaultPlan = await prisma.plans.findFirst();
      
      if (defaultPlan) {
        await prisma.abonnements.create({
          data: {
            userId: user.id,
            planId: defaultPlan.id,
            statut: 'TRIAL',
            finPeriode: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours
          }
        });
        abonnementsCreated++;
      }
    }
    
    if (abonnementsCreated > 0) {
      activation.createdRecords.abonnements = abonnementsCreated;
      console.log(`✅ ${abonnementsCreated} abonnements créés`);
    } else {
      console.log('✅ Tous les utilisateurs ont déjà un abonnement');
    }

    // Résumé de l'activation
    console.log('\n📋 Résumé de l\'activation:');
    console.log(`Systèmes activés: ${activation.activatedSystems.length}`);
    activation.activatedSystems.forEach(system => {
      console.log(`  - ${system}`);
    });
    
    console.log('\n📊 Enregistrements créés:');
    Object.entries(activation.createdRecords).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count}`);
    });

    // Recommandations post-activation
    activation.recommendations = [
      'Configurer des alertes pour les logs d\'audit importants',
      'Mettre en place un système de notifications pour les progressions',
      'Créer des rapports automatiques de suivi d\'apprentissage',
      'Implémenter un système de récompenses basé sur les progressions'
    ];

    console.log('\n💡 Recommandations post-activation:');
    activation.recommendations.forEach(rec => console.log(`- ${rec}`));

    // Sauvegarder le rapport d'activation
    const fs = require('fs');
    fs.writeFileSync(
      'database-activation-report.json',
      JSON.stringify(activation, null, 2)
    );

    console.log('\n✅ Rapport d\'activation sauvegardé dans database-activation-report.json');

  } catch (error) {
    console.error('❌ Erreur lors de l\'activation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

activateSystems();
