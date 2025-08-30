import { db } from "./db";

async function seedProgressionsTest() {
  console.log("🌱 Création de progressions de test réalistes...");

  try {
    // Récupérer les enfants
    const enfants = await db.enfant.findMany({
      take: 3
    });

    if (enfants.length === 0) {
      console.log("❌ Aucun enfant trouvé");
      return;
    }

    // Récupérer les cours
    const cours = await db.coursGouvernemental.findMany({
      take: 10
    });

    if (cours.length === 0) {
      console.log("❌ Aucun cours trouvé");
      return;
    }

    console.log(`👨‍👩‍👧‍👦 Enfants trouvés: ${enfants.length}`);
    console.log(`📚 Cours trouvés: ${cours.length}`);

    // Créer des progressions réalistes pour chaque enfant
    for (const enfant of enfants) {
      console.log(`\n🎯 Création de progressions pour ${enfant.prenom}...`);
      
      // Sélectionner 3-4 cours au hasard pour cet enfant
      const coursSelectionnes = cours.slice(0, 4);
      
      for (let i = 0; i < coursSelectionnes.length; i++) {
        const coursItem = coursSelectionnes[i];
        
        // Générer des données réalistes
        const pourcentages = [0, 15, 30, 45, 60, 75, 90, 100];
        const pourcentage = pourcentages[Math.floor(Math.random() * pourcentages.length)];
        const tempsPasse = Math.floor(Math.random() * 120) + 10; // 10-130 minutes
        const statuts = ['NON_COMMENCE', 'EN_COURS', 'EN_PAUSE', 'TERMINE'] as const;
        const statut = pourcentage === 0 ? 'NON_COMMENCE' : 
                      pourcentage === 100 ? 'TERMINE' : 
                      pourcentage > 50 ? 'EN_COURS' : 'EN_PAUSE';
        
        // Date de dernier accès (plus récente pour les cours en cours)
        const maintenant = new Date();
        const joursAgo = pourcentage === 0 ? Math.floor(Math.random() * 30) + 1 : 
                        pourcentage === 100 ? Math.floor(Math.random() * 7) + 1 :
                        Math.floor(Math.random() * 3) + 1;
        const dernierAcces = new Date(maintenant.getTime() - joursAgo * 24 * 60 * 60 * 1000);

        // Vérifier si la progression existe déjà
        const progressionExistante = await db.progressionCours.findFirst({
          where: {
            enfantId: enfant.id,
            coursId: coursItem.id
          }
        });

        if (progressionExistante) {
          // Mettre à jour la progression existante
          await db.progressionCours.update({
            where: { id: progressionExistante.id },
            data: {
              pourcentage,
              tempsPasse,
              statut,
              dernierAcces,
              notes: `Progression de test mise à jour - ${pourcentage}% complété`
            }
          });
          console.log(`  ✅ ${coursItem.titre}: ${pourcentage}% (${Math.round(tempsPasse / 60)}h ${tempsPasse % 60}m) - ${statut}`);
        } else {
          // Créer une nouvelle progression
          await db.progressionCours.create({
            data: {
              enfantId: enfant.id,
              coursId: coursItem.id,
              pourcentage,
              tempsPasse,
              statut,
              dernierAcces,
              notes: `Progression de test créée - ${pourcentage}% complété`
            }
          });
          console.log(`  ✅ ${coursItem.titre}: ${pourcentage}% (${Math.round(tempsPasse / 60)}h ${tempsPasse % 60}m) - ${statut}`);
        }
      }
    }

    // Vérifier les résultats
    console.log("\n📊 Vérification des progressions créées...");
    
    for (const enfant of enfants) {
      const progressions = await db.progressionCours.findMany({
        where: { enfantId: enfant.id },
        include: { cours: true },
        orderBy: { pourcentage: 'desc' }
      });

      console.log(`\n${enfant.prenom}:`);
      progressions.slice(0, 3).forEach(progression => {
        console.log(`  - ${progression.cours.titre}: ${progression.pourcentage}% (${Math.round(progression.tempsPasse / 60)}h ${progression.tempsPasse % 60}m) - ${progression.statut}`);
      });
    }

    console.log("\n🎉 Progressions de test créées avec succès !");
    console.log("💡 Maintenant la page LMS affichera des données réalistes dans la section 'Progression récente'");

  } catch (error) {
    console.error("❌ Erreur lors de la création des progressions:", error);
    throw error;
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedProgressionsTest()
    .then(() => {
      console.log("🎉 Script de seeding des progressions terminé !");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Erreur lors du seeding:", error);
      process.exit(1);
    });
}

export { seedProgressionsTest };
