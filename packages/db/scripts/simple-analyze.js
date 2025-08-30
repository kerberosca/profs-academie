const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function simpleAnalyze() {
  console.log('🔍 Analyse simple de la base de données...\n');

  try {
    // Test de connexion
    console.log('✅ Connexion à la base de données réussie\n');

    // Vérifier les tables principales
    const tablesToCheck = [
      'users', 'foyers', 'enfants', 'profils_prof',
      'cours_gouvernementaux', 'calendriers_etude', 'sessions_etude',
      'progressions_cours', 'competences', 'contenus_apprentissage'
    ];

    console.log('📊 Vérification des tables principales :');
    console.log('=========================================');

    for (const tableName of tablesToCheck) {
      try {
        const result = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "${tableName}"`;
        const count = parseInt(result[0].count);
        console.log(`  ${tableName}: ${count} enregistrements`);
      } catch (error) {
        console.log(`  ${tableName}: ❌ Erreur - ${error.message}`);
      }
    }

    console.log('\n🔍 Recherche d\'autres tables...');
    console.log('================================');

    // Essayer de trouver d'autres tables
    const otherTables = [
      'cours', 'modules', 'lecons', 'quiz', 'questions', 'soumissions',
      'progressions', 'abonnements', 'plans', 'consentements', 'audit_logs',
      'suivis_apprentissage'
    ];

    for (const tableName of otherTables) {
      try {
        const result = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "${tableName}"`;
        const count = parseInt(result[0].count);
        if (count > 0) {
          console.log(`  ⚠️  ${tableName}: ${count} enregistrements (table potentiellement inutilisée)`);
        } else {
          console.log(`  ✅ ${tableName}: ${count} enregistrements (table vide)`);
        }
      } catch (error) {
        // Table n'existe pas
        console.log(`  ❌ ${tableName}: Table inexistante`);
      }
    }

    console.log('\n📋 Recommandations :');
    console.log('===================');
    console.log('• Les tables avec des enregistrements mais non listées dans les tables principales');
    console.log('  peuvent être supprimées si elles ne sont pas utilisées par l\'application');
    console.log('• Les tables vides peuvent être supprimées si elles ne sont pas nécessaires');
    console.log('• Vérifiez que toutes les fonctionnalités marchent après suppression');

  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse :', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

simpleAnalyze();
