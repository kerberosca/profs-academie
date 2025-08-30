import { db } from "./db";
import { CalendrierGenerator } from "../../../apps/web/src/lib/calendrier-generator";
import { NiveauScolaire } from "@prisma/client";

async function testCalendrierGenerator() {
  console.log("🧪 Test du générateur de calendrier...");

  try {
    // Test 1: Récupérer les niveaux scolaires disponibles
    console.log("\n📚 Test 1: Récupération des niveaux scolaires...");
    const niveaux = await CalendrierGenerator.getNiveauxScolaires();
    console.log("Niveaux scolaires disponibles:", niveaux);

    // Test 2: Récupérer les compétences pour un niveau
    console.log("\n📖 Test 2: Récupération des compétences pour PRIMAIRE_1...");
    const competences = await CalendrierGenerator.getCompetences(NiveauScolaire.PRIMAIRE_1);
    console.log(`Nombre de compétences trouvées: ${competences.length}`);
    
    competences.forEach(comp => {
      console.log(`- ${comp.matiere}: ${comp.nom} (${comp.contenusApprentissage.length} contenus)`);
    });

    // Test 3: Récupérer les matières pour un niveau
    console.log("\n📚 Test 3: Récupération des matières pour PRIMAIRE_1...");
    const matieres = await CalendrierGenerator.getMatieres(NiveauScolaire.PRIMAIRE_1);
    console.log("Matières disponibles:", matieres);

    // Test 4: Générer un calendrier (si des utilisateurs existent)
    console.log("\n📅 Test 4: Test de génération de calendrier...");
    
    // Vérifier s'il y a des utilisateurs et enfants dans la base
    const users = await db.user.findMany({ take: 1 });
    if (users.length > 0) {
      const enfants = await db.enfant.findMany({ 
        take: 1 
      });
      
      if (enfants.length > 0) {
        const enfant = enfants[0];
        const parent = await db.user.findFirst({
          where: { foyer: { enfants: { some: { id: enfant.id } } } }
        });
        
        if (parent) {
          console.log(`Génération d'un calendrier pour ${enfant.prenom} (${enfant.niveauScolaire || 'Niveau non défini'})`);
          
          const calendrierId = await CalendrierGenerator.generateCalendrier(
            enfant.id,
            parent.id,
            enfant.niveauScolaire || NiveauScolaire.PRIMAIRE_1,
            300 // 5 heures par semaine
          );
          
          console.log(`✅ Calendrier généré avec l'ID: ${calendrierId}`);
          
          // Vérifier le calendrier créé
          const calendrier = await db.calendrierEtude.findUnique({
            where: { id: calendrierId },
            include: {
              sessions: true,
              enfant: true
            }
          });
          
          if (calendrier) {
            console.log(`📊 Calendrier créé: ${calendrier.nom}`);
            console.log(`📊 Nombre de sessions: ${calendrier.sessions.length}`);
            console.log(`📊 Enfant: ${calendrier.enfant.prenom}`);
          }
        } else {
          console.log("❌ Aucun parent trouvé pour l'enfant");
        }
      } else {
        console.log("❌ Aucun enfant trouvé dans la base de données");
      }
    } else {
      console.log("❌ Aucun utilisateur trouvé dans la base de données");
    }

    console.log("\n✅ Tests terminés avec succès !");

  } catch (error) {
    console.error("❌ Erreur lors des tests:", error);
    throw error;
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  testCalendrierGenerator()
    .then(() => {
      console.log("🎉 Tests terminés avec succès !");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Erreur lors des tests:", error);
      process.exit(1);
    });
}

export { testCalendrierGenerator };
