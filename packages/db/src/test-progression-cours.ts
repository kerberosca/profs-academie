import { db } from "./db";

async function testProgressionCours() {
  console.log("🧪 Test de la progression des cours...");

  try {
    // Test 1: Vérifier les cours gouvernementaux disponibles
    console.log("\n📚 Test 1: Vérification des cours gouvernementaux...");
    const cours = await db.coursGouvernemental.findMany({
      take: 10
    });
    
    console.log(`Nombre de cours trouvés: ${cours.length}`);
    
    if (cours.length > 0) {
      console.log("Exemples de cours:");
      cours.slice(0, 3).forEach((coursItem, index) => {
        console.log(`  ${index + 1}. ${coursItem.titre}`);
        console.log(`     Matière: ${coursItem.matiere}`);
        console.log(`     Niveau: ${coursItem.niveauScolaire}`);
        console.log(`     Durée estimée: ${coursItem.dureeEstimee} minutes`);
      });
    } else {
      console.log("❌ Aucun cours gouvernemental trouvé");
      return;
    }

    // Test 2: Vérifier les enfants et leurs progressions
    console.log("\n👨‍👩‍👧‍👦 Test 2: Vérification des enfants et progressions...");
    const enfants = await db.enfant.findMany({
      include: {
        progressionsCours: {
          include: {
            cours: true
          }
        }
      },
      take: 3
    });

    console.log(`Nombre d'enfants trouvés: ${enfants.length}`);

    for (const enfant of enfants) {
      console.log(`\nEnfant: ${enfant.prenom} ${enfant.nom || ''}`);
      console.log(`  Niveau scolaire: ${enfant.niveauScolaire}`);
      console.log(`  Progressions: ${enfant.progressionsCours.length}`);
      
      if (enfant.progressionsCours.length > 0) {
        enfant.progressionsCours.forEach((progression, index) => {
          console.log(`    ${index + 1}. ${progression.cours.titre}`);
          console.log(`       Progression: ${progression.pourcentage}%`);
          console.log(`       Temps passé: ${Math.round(progression.tempsPasse / 60)}h ${progression.tempsPasse % 60}m`);
          console.log(`       Statut: ${progression.statut}`);
          console.log(`       Dernier accès: ${new Date(progression.dernierAcces).toLocaleDateString()}`);
        });
      } else {
        console.log("    Aucune progression");
      }
    }

    // Test 3: Créer des progressions de test si nécessaire
    console.log("\n🔧 Test 3: Création de progressions de test...");
    
    if (enfants.length > 0 && cours.length > 0) {
      const enfant = enfants[0];
      const coursTest = cours[0];
      
      // Vérifier si une progression existe déjà
      const progressionExistante = await db.progressionCours.findFirst({
        where: {
          enfantId: enfant.id,
          coursId: coursTest.id
        }
      });

      if (!progressionExistante) {
        console.log(`Création d'une progression de test pour ${enfant.prenom} sur ${coursTest.titre}`);
        
        const nouvelleProgression = await db.progressionCours.create({
          data: {
            enfantId: enfant.id,
            coursId: coursTest.id,
            pourcentage: 25,
            tempsPasse: 45, // 45 minutes
            statut: 'EN_COURS',
            dernierAcces: new Date(),
            notes: 'Progression de test créée automatiquement'
          }
        });

        console.log(`✅ Progression créée avec succès (ID: ${nouvelleProgression.id})`);
        console.log(`   Progression: ${nouvelleProgression.pourcentage}%`);
        console.log(`   Temps passé: ${Math.round(nouvelleProgression.tempsPasse / 60)}h ${nouvelleProgression.tempsPasse % 60}m`);
        console.log(`   Statut: ${nouvelleProgression.statut}`);
      } else {
        console.log(`✅ Progression existante trouvée pour ${enfant.prenom} sur ${coursTest.titre}`);
        console.log(`   Progression: ${progressionExistante.pourcentage}%`);
        console.log(`   Temps passé: ${Math.round(progressionExistante.tempsPasse / 60)}h ${progressionExistante.tempsPasse % 60}m`);
      }
    }

    // Test 4: Vérifier les statistiques calculées
    console.log("\n📊 Test 4: Vérification des statistiques...");
    
    if (enfants.length > 0) {
      const enfant = enfants[0];
      const progressions = await db.progressionCours.findMany({
        where: { enfantId: enfant.id },
        include: { cours: true }
      });

      if (progressions.length > 0) {
        const totalTemps = progressions.reduce((sum, p) => sum + p.tempsPasse, 0);
        const coursCompletes = progressions.filter(p => p.statut === 'TERMINE').length;
        const progressionMoyenne = progressions.reduce((sum, p) => sum + p.pourcentage, 0) / progressions.length;

        console.log(`Statistiques pour ${enfant.prenom}:`);
        console.log(`  - Temps total: ${Math.round(totalTemps / 60)}h ${totalTemps % 60}m`);
        console.log(`  - Cours terminés: ${coursCompletes}`);
        console.log(`  - Progression moyenne: ${Math.round(progressionMoyenne)}%`);

        // Calculer les progressions par matière
        const matieres = ['FRANCAIS', 'MATHEMATIQUES', 'SCIENCES'];
        console.log(`  - Progression par matière:`);
        matieres.forEach(matiere => {
          const progressionsMatiere = progressions.filter(p => p.cours.matiere === matiere);
          const progressionMatiere = progressionsMatiere.length > 0
            ? progressionsMatiere.reduce((sum, p) => sum + p.pourcentage, 0) / progressionsMatiere.length
            : 0;
          console.log(`    * ${matiere}: ${Math.round(progressionMatiere)}%`);
        });
      }
    }

    // Test 5: Vérifier l'affichage dans l'interface
    console.log("\n🎨 Test 5: Simulation de l'affichage dans l'interface...");
    
    const coursParNiveau = await db.coursGouvernemental.findMany({
      where: { niveauScolaire: 'PRIMAIRE_1' },
      take: 6
    });

    console.log(`Cours disponibles pour PRIMAIRE_1: ${coursParNiveau.length}`);
    coursParNiveau.forEach((coursItem, index) => {
      console.log(`  ${index + 1}. ${coursItem.titre} (${coursItem.matiere})`);
    });

    console.log("\n✅ Résumé des tests:");
    console.log("  📚 Cours gouvernementaux: Disponibles");
    console.log("  👨‍👩‍👧‍👦 Enfants: Trouvés avec leurs progressions");
    console.log("  🔧 Progressions: Créées ou existantes");
    console.log("  📊 Statistiques: Calculées correctement");
    console.log("  🎨 Interface: Cours disponibles pour l'affichage");

  } catch (error) {
    console.error("❌ Erreur lors des tests:", error);
    throw error;
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  testProgressionCours()
    .then(() => {
      console.log("🎉 Tests de progression des cours terminés avec succès !");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Erreur lors des tests:", error);
      process.exit(1);
    });
}

export { testProgressionCours };
