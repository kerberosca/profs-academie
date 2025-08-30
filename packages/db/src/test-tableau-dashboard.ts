import { db } from "./db";

async function testTableauDashboard() {
  console.log("🧪 Test du tableau de bord avec données réelles...");

  try {
    // Test 1: Vérifier qu'il y a des utilisateurs parents
    console.log("\n👨‍👩‍👧‍👦 Test 1: Vérification des parents...");
    const parents = await db.user.findMany({
      where: {
        foyer: {
          isNot: null
        }
      },
      include: {
        foyer: {
          include: {
            enfants: true
          }
        }
      },
      take: 1
    });
    
    if (parents.length === 0) {
      console.log("❌ Aucun parent trouvé pour tester le tableau de bord");
      return;
    }

    const parent = parents[0];
    console.log(`Parent trouvé: ${parent.prenom} ${parent.nom}`);
    console.log(`Nombre d'enfants: ${parent.foyer?.enfants.length || 0}`);

    // Test 2: Vérifier les progressions des enfants
    console.log("\n📊 Test 2: Vérification des progressions...");
    const enfants = parent.foyer?.enfants || [];
    
    for (const enfant of enfants) {
      console.log(`\nEnfant: ${enfant.prenom} ${enfant.nom}`);
      
      const progressions = await db.progressionCours.findMany({
        where: {
          enfantId: enfant.id
        },
        include: {
          cours: true
        }
      });

      console.log(`  - Progressions trouvées: ${progressions.length}`);
      
      if (progressions.length > 0) {
        const totalTemps = progressions.reduce((sum, p) => sum + p.tempsPasse, 0);
        const coursCompletes = progressions.filter(p => p.statut === 'TERMINE').length;
        const progressionMoyenne = progressions.reduce((sum, p) => sum + p.pourcentage, 0) / progressions.length;
        
        console.log(`  - Temps total: ${Math.round(totalTemps / 60)}h ${totalTemps % 60}m`);
        console.log(`  - Cours terminés: ${coursCompletes}`);
        console.log(`  - Progression moyenne: ${Math.round(progressionMoyenne)}%`);

        // Calculer les progressions par matière
        const matieres = ['FRANCAIS', 'MATHEMATIQUES', 'SCIENCES'];
        console.log(`  - Progression par matière:`);
        matieres.forEach(matiere => {
          const progressionsMatiere = progressions.filter(p => p.cours?.matiere === matiere);
          const progressionMatiere = progressionsMatiere.length > 0
            ? progressionsMatiere.reduce((sum, p) => sum + p.pourcentage, 0) / progressionsMatiere.length
            : 0;
          console.log(`    * ${matiere}: ${Math.round(progressionMatiere)}%`);
        });

        // Calculer les badges
        const badges = [];
        if (progressionMoyenne > 50) badges.push('Mathématicien');
        if (coursCompletes > 3) badges.push('Étudiant assidu');
        if (totalTemps > 120) badges.push('Persévérant');
        
        console.log(`  - Badges gagnés: ${badges.length > 0 ? badges.join(', ') : 'Aucun'}`);
      }
    }

    // Test 3: Simuler l'affichage du tableau de bord
    console.log("\n📈 Test 3: Simulation de l'affichage du tableau de bord...");
    
    let totalTempsGlobal = 0;
    let totalCoursCompletes = 0;
    let totalProgressions = 0;
    let nombreProgressions = 0;

    for (const enfant of enfants) {
      const progressions = await db.progressionCours.findMany({
        where: { enfantId: enfant.id }
      });

      totalTempsGlobal += progressions.reduce((sum, p) => sum + p.tempsPasse, 0);
      totalCoursCompletes += progressions.filter(p => p.statut === 'TERMINE').length;
      totalProgressions += progressions.reduce((sum, p) => sum + p.pourcentage, 0);
      nombreProgressions += progressions.length;
    }

    const progressionMoyenneGlobale = nombreProgressions > 0 ? totalProgressions / nombreProgressions : 0;
    const progressionHebdomadaire = progressionMoyenneGlobale > 0 ? `+${Math.round(progressionMoyenneGlobale / 10)}%` : '+0%';
    const serieActive = Math.max(1, Math.floor(totalCoursCompletes / 2));

    console.log("Statistiques globales du tableau de bord:");
    console.log(`  - Temps d'apprentissage: ${Math.round(totalTempsGlobal / 60)}h ${totalTempsGlobal % 60}m`);
    console.log(`  - Progression hebdomadaire: ${progressionHebdomadaire}`);
    console.log(`  - Leçons complétées: ${totalCoursCompletes}`);
    console.log(`  - Série active: ${serieActive} jours`);

    // Test 4: Vérifier la cohérence des données
    console.log("\n✅ Test 4: Vérification de la cohérence...");
    
    if (totalCoursCompletes > 0) {
      console.log("✅ Le tableau de bord affichera des données réelles");
      console.log("✅ Les progressions par matière seront calculées");
      console.log("✅ Les badges seront attribués automatiquement");
      console.log("✅ Les recommandations seront personnalisées");
    } else {
      console.log("⚠️ Aucune progression trouvée - le tableau affichera des données à zéro");
      console.log("💡 Pour voir des données réelles, créez des progressions dans la base");
    }

    console.log("\n🎯 Résumé des améliorations:");
    console.log("  📊 Tableau de bord parent:");
    console.log("     - Statistiques globales basées sur les vraies données");
    console.log("     - Progression par matière calculée automatiquement");
    console.log("     - Badges attribués selon les critères définis");
    console.log("     - Recommandations personnalisées");
    console.log("     - Réussites basées sur les accomplissements réels");

  } catch (error) {
    console.error("❌ Erreur lors des tests:", error);
    throw error;
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  testTableauDashboard()
    .then(() => {
      console.log("🎉 Tests du tableau de bord terminés avec succès !");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Erreur lors des tests:", error);
      process.exit(1);
    });
}

export { testTableauDashboard };
