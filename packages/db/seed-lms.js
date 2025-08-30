const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedLMS() {
  console.log('🌱 Début du seeding LMS...');

  try {
    // Cours gouvernementaux de démonstration
    const coursGouvernementaux = [
      // Maternelle
      {
        titre: "Découverte des formes et des couleurs",
        description: "Introduction aux formes géométriques de base et aux couleurs primaires",
        matiere: "MATHEMATIQUES",
        niveauScolaire: "MATERNELLE_5_ANS",
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/education-prescolaire.pdf",
        dureeEstimee: 30,
        competences: ["Reconnaître les formes de base", "Identifier les couleurs primaires", "Compter jusqu'à 5"]
      },
      {
        titre: "Premiers pas en lecture",
        description: "Initiation à la reconnaissance des lettres et des sons",
        matiere: "FRANCAIS",
        niveauScolaire: "MATERNELLE_5_ANS",
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/education-prescolaire.pdf",
        dureeEstimee: 25,
        competences: ["Reconnaître les lettres de l'alphabet", "Associer les sons aux lettres", "Écouter des histoires"]
      },
      {
        titre: "Exploration du monde vivant",
        description: "Découverte des animaux et des plantes",
        matiere: "SCIENCES",
        niveauScolaire: "MATERNELLE_5_ANS",
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/education-prescolaire.pdf",
        dureeEstimee: 20,
        competences: ["Identifier les animaux familiers", "Observer les plantes", "Comprendre les besoins de base"]
      },

      // Primaire 1
      {
        titre: "Les nombres de 1 à 20",
        description: "Apprentissage des nombres et du comptage",
        matiere: "MATHEMATIQUES",
        niveauScolaire: "PRIMAIRE_1",
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/primaire/math1.pdf",
        dureeEstimee: 45,
        competences: ["Compter jusqu'à 20", "Écrire les chiffres", "Additionner jusqu'à 10"]
      },
      {
        titre: "Lecture de mots simples",
        description: "Lecture de mots courts et de phrases simples",
        matiere: "FRANCAIS",
        niveauScolaire: "PRIMAIRE_1",
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/primaire/francais1.pdf",
        dureeEstimee: 40,
        competences: ["Lire des mots simples", "Comprendre des phrases courtes", "Écrire des mots familiers"]
      },
      {
        titre: "Les saisons et le temps",
        description: "Découverte des saisons et de la météo",
        matiere: "SCIENCES",
        niveauScolaire: "PRIMAIRE_1",
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/primaire/science1.pdf",
        dureeEstimee: 35,
        competences: ["Identifier les 4 saisons", "Observer les changements météo", "Comprendre le cycle jour/nuit"]
      },

      // Primaire 2
      {
        titre: "Addition et soustraction",
        description: "Opérations mathématiques de base",
        matiere: "MATHEMATIQUES",
        niveauScolaire: "PRIMAIRE_2",
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/primaire/math2.pdf",
        dureeEstimee: 50,
        competences: ["Additionner jusqu'à 100", "Soustraire jusqu'à 50", "Résoudre des problèmes simples"]
      },
      {
        titre: "Lecture de textes courts",
        description: "Lecture et compréhension de textes simples",
        matiere: "FRANCAIS",
        niveauScolaire: "PRIMAIRE_2",
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/primaire/francais2.pdf",
        dureeEstimee: 45,
        competences: ["Lire des textes courts", "Comprendre l'histoire", "Répondre à des questions"]
      },
      {
        titre: "Les animaux et leurs habitats",
        description: "Étude des animaux et de leurs milieux de vie",
        matiere: "SCIENCES",
        niveauScolaire: "PRIMAIRE_2",
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/primaire/science2.pdf",
        dureeEstimee: 40,
        competences: ["Identifier les habitats", "Comprendre les besoins", "Observer les comportements"]
      }
    ];

    console.log('📚 Création des cours gouvernementaux...');
    
    for (const cours of coursGouvernementaux) {
      await prisma.coursGouvernemental.upsert({
        where: {
          id: `cours-${cours.niveauScolaire}-${cours.titre.toLowerCase().replace(/\s+/g, '-')}`
        },
        update: {},
        create: {
          ...cours,
          id: `cours-${cours.niveauScolaire}-${cours.titre.toLowerCase().replace(/\s+/g, '-')}`
        }
      });
    }

    console.log(`✅ ${coursGouvernementaux.length} cours gouvernementaux créés`);

  } catch (error) {
    console.error('❌ Erreur lors du seeding LMS:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le seeding
seedLMS()
  .then(() => {
    console.log('🎉 Seeding LMS terminé avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erreur lors du seeding LMS:', error);
    process.exit(1);
  });
