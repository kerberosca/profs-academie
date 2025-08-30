const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function analyzeDatabase() {
  console.log('🔍 Analyse de la base de données Profs Académie...\n');

  try {
    // 1. Lister toutes les tables existantes
    console.log('📊 Tables existantes dans la base de données :');
    console.log('==============================================');
    
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    
    console.log('Tables trouvées :');
    tables.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });
    console.log('');

    // 2. Compter les enregistrements dans chaque table
    console.log('📈 Statistiques des enregistrements :');
    console.log('=====================================');
    
    const tableStats = {};
    
    for (const table of tables) {
      const tableName = table.table_name;
      try {
        const count = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "${tableName}"`;
        tableStats[tableName] = parseInt(count[0].count);
        console.log(`  ${tableName}: ${count[0].count} enregistrements`);
      } catch (error) {
        console.log(`  ${tableName}: Erreur lors du comptage - ${error.message}`);
        tableStats[tableName] = -1;
      }
    }
    console.log('');

    // 3. Analyser les relations et dépendances
    console.log('🔗 Analyse des relations :');
    console.log('==========================');
    
    const foreignKeys = await prisma.$queryRaw`
      SELECT 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND tc.table_schema = 'public'
      ORDER BY tc.table_name, kcu.column_name;
    `;
    
    console.log('Clés étrangères trouvées :');
    foreignKeys.forEach(fk => {
      console.log(`  ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
    });
    console.log('');

    // 4. Identifier les tables potentiellement inutilisées
    console.log('⚠️  Tables potentiellement inutilisées :');
    console.log('=========================================');
    
    const potentiallyUnused = [];
    const definitelyUsed = [
      'users', 'foyers', 'enfants', 'profils_prof',
      'cours_gouvernementaux', 'calendriers_etude', 'sessions_etude',
      'progressions_cours', 'competences', 'contenus_apprentissage'
    ];
    
    for (const table of tables) {
      const tableName = table.table_name;
      if (!definitelyUsed.includes(tableName)) {
        const count = tableStats[tableName];
        if (count === 0) {
          potentiallyUnused.push({ table: tableName, reason: 'Aucun enregistrement' });
        } else if (count === -1) {
          potentiallyUnused.push({ table: tableName, reason: 'Erreur d\'accès' });
        } else {
          potentiallyUnused.push({ table: tableName, reason: `${count} enregistrements, mais pas dans la liste des tables utilisées` });
        }
      }
    }
    
    if (potentiallyUnused.length === 0) {
      console.log('✅ Toutes les tables semblent être utilisées !');
    } else {
      potentiallyUnused.forEach(item => {
        console.log(`  - ${item.table}: ${item.reason}`);
      });
    }
    console.log('');

    // 5. Générer un rapport détaillé
    const report = {
      timestamp: new Date().toISOString(),
      totalTables: tables.length,
      tableStats,
      foreignKeys: foreignKeys.length,
      potentiallyUnused,
      recommendations: []
    };

    // Ajouter des recommandations
    if (potentiallyUnused.length > 0) {
      report.recommendations.push('Considérer la suppression des tables inutilisées');
    }
    
    if (Object.values(tableStats).some(count => count > 1000)) {
      report.recommendations.push('Certaines tables ont beaucoup d\'enregistrements - vérifier l\'optimisation');
    }

    // Sauvegarder le rapport
    const reportPath = path.join(__dirname, '../database-analysis-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('📄 Rapport détaillé sauvegardé dans : database-analysis-report.json');
    console.log('');

    // 6. Résumé final
    console.log('📋 Résumé de l\'analyse :');
    console.log('=========================');
    console.log(`  • Total des tables : ${tables.length}`);
    console.log(`  • Tables avec des données : ${Object.values(tableStats).filter(count => count > 0).length}`);
    console.log(`  • Tables vides : ${Object.values(tableStats).filter(count => count === 0).length}`);
    console.log(`  • Relations (clés étrangères) : ${foreignKeys.length}`);
    console.log(`  • Tables potentiellement inutilisées : ${potentiallyUnused.length}`);
    
    if (report.recommendations.length > 0) {
      console.log('\n💡 Recommandations :');
      report.recommendations.forEach(rec => {
        console.log(`  • ${rec}`);
      });
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse :', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter l'analyse
analyzeDatabase();
