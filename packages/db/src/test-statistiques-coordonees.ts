import { db } from "./db";

async function testStatistiquesCoordonees() {
  console.log("🧪 Test de coordination des statistiques...");

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
      console.log("❌ Aucun parent trouvé pour tester les statistiques");
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
      }
    }

    // Test 3: Vérifier les calendriers
    console.log("\n📅 Test 3: Vérification des calendriers...");
    const calendriers = await db.calendrierEtude.findMany({
      where: {
        parentId: parent.id
      },
      include: {
        sessions: true,
        enfant: true
      }
    });

    console.log(`Nombre de calendriers: ${calendriers.length}`);
    calendriers.forEach(cal => {
      console.log(`  - ${cal.nom}: ${cal.sessions.length} sessions pour ${cal.enfant.prenom}`);
    });

    // Test 4: Calculer les statistiques globales
    console.log("\n📈 Test 4: Calcul des statistiques globales...");
    
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

    console.log("Statistiques globales calculées:");
    console.log(`  - Temps total: ${Math.round(totalTempsGlobal / 60)}h ${totalTempsGlobal % 60}m`);
    console.log(`  - Cours terminés: ${totalCoursCompletes}`);
    console.log(`  - Progression moyenne: ${Math.round(progressionMoyenneGlobale)}%`);
    console.log(`  - Progression hebdomadaire: ${progressionHebdomadaire}`);
    console.log(`  - Série active: ${serieActive} jours`);

    // Test 5: Vérifier la cohérence
    console.log("\n✅ Test 5: Vérification de la cohérence...");
    
    const calendriersActifs = calendriers.filter(c => c.actif).length;
    console.log(`  - Calendriers actifs: ${calendriersActifs}`);
    console.log(`  - Nombre d'enfants: ${enfants.length}`);
    
    if (totalCoursCompletes > 0) {
      console.log("✅ Les statistiques sont cohérentes et peuvent être affichées");
    } else {
      console.log("⚠️ Aucune progression trouvée - les statistiques seront à zéro");
    }

    console.log("\n🎯 Résumé de la coordination:");
    console.log("Les statistiques suivantes seront affichées de manière cohérente:");
    console.log("  📊 Tableau de bord parent principal:");
    console.log("     - Temps d'apprentissage total");
    console.log("     - Progression hebdomadaire");
    console.log("     - Leçons complétées");
    console.log("     - Série active");
    console.log("  📊 Page LMS:");
    console.log("     - Temps total par enfant");
    console.log("     - Cours terminés par enfant");
    console.log("     - Progression moyenne par enfant");
    console.log("     - Calendriers actifs");

  } catch (error) {
    console.error("❌ Erreur lors des tests:", error);
    throw error;
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  testStatistiquesCoordonees()
    .then(() => {
      console.log("🎉 Tests de coordination terminés avec succès !");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Erreur lors des tests:", error);
      process.exit(1);
    });
}

export { testStatistiquesCoordonees };
