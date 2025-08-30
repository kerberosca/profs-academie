import { PrismaClient, Matiere, NiveauScolaire } from '@prisma/client';

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
        matiere: Matiere.MATHEMATIQUES,
        niveauScolaire: NiveauScolaire.MATERNELLE_5_ANS,
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/education-prescolaire.pdf",
        dureeEstimee: 30,
        competences: ["Reconnaître les formes de base", "Identifier les couleurs primaires", "Compter jusqu'à 5"]
      },
      {
        titre: "Premiers pas en lecture",
        description: "Initiation à la reconnaissance des lettres et des sons",
        matiere: Matiere.FRANCAIS,
        niveauScolaire: NiveauScolaire.MATERNELLE_5_ANS,
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/education-prescolaire.pdf",
        dureeEstimee: 25,
        competences: ["Reconnaître les lettres de l'alphabet", "Associer les sons aux lettres", "Écouter des histoires"]
      },
      {
        titre: "Exploration du monde vivant",
        description: "Découverte des animaux et des plantes",
        matiere: Matiere.SCIENCES,
        niveauScolaire: NiveauScolaire.MATERNELLE_5_ANS,
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/education-prescolaire.pdf",
        dureeEstimee: 20,
        competences: ["Identifier les animaux familiers", "Observer les plantes", "Comprendre les besoins de base"]
      },

      // Primaire 1
      {
        titre: "Les nombres de 1 à 20",
        description: "Apprentissage des nombres et du comptage",
        matiere: Matiere.MATHEMATIQUES,
        niveauScolaire: NiveauScolaire.PRIMAIRE_1,
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/primaire/math1.pdf",
        dureeEstimee: 45,
        competences: ["Compter jusqu'à 20", "Écrire les chiffres", "Additionner jusqu'à 10"]
      },
      {
        titre: "Lecture de mots simples",
        description: "Lecture de mots courts et de phrases simples",
        matiere: Matiere.FRANCAIS,
        niveauScolaire: NiveauScolaire.PRIMAIRE_1,
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/primaire/francais1.pdf",
        dureeEstimee: 40,
        competences: ["Lire des mots simples", "Comprendre des phrases courtes", "Écrire des mots familiers"]
      },
      {
        titre: "Les saisons et le temps",
        description: "Découverte des saisons et de la météo",
        matiere: Matiere.SCIENCES,
        niveauScolaire: NiveauScolaire.PRIMAIRE_1,
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/primaire/science1.pdf",
        dureeEstimee: 35,
        competences: ["Identifier les 4 saisons", "Observer les changements météo", "Comprendre le cycle jour/nuit"]
      },

      // Primaire 2
      {
        titre: "Addition et soustraction",
        description: "Opérations mathématiques de base",
        matiere: Matiere.MATHEMATIQUES,
        niveauScolaire: NiveauScolaire.PRIMAIRE_2,
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/primaire/math2.pdf",
        dureeEstimee: 50,
        competences: ["Additionner jusqu'à 100", "Soustraire jusqu'à 50", "Résoudre des problèmes simples"]
      },
      {
        titre: "Lecture de textes courts",
        description: "Lecture et compréhension de textes simples",
        matiere: Matiere.FRANCAIS,
        niveauScolaire: NiveauScolaire.PRIMAIRE_2,
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/primaire/francais2.pdf",
        dureeEstimee: 45,
        competences: ["Lire des textes courts", "Comprendre l'histoire", "Répondre à des questions"]
      },
      {
        titre: "Les animaux et leurs habitats",
        description: "Étude des animaux et de leurs milieux de vie",
        matiere: Matiere.SCIENCES,
        niveauScolaire: NiveauScolaire.PRIMAIRE_2,
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/primaire/science2.pdf",
        dureeEstimee: 40,
        competences: ["Identifier les habitats", "Comprendre les besoins", "Observer les comportements"]
      },

      // Primaire 3
      {
        titre: "Multiplication et division",
        description: "Introduction aux tables de multiplication",
        matiere: Matiere.MATHEMATIQUES,
        niveauScolaire: NiveauScolaire.PRIMAIRE_3,
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/primaire/math3.pdf",
        dureeEstimee: 60,
        competences: ["Tables de multiplication (1-5)", "Division simple", "Résolution de problèmes"]
      },
      {
        titre: "Grammaire de base",
        description: "Introduction aux règles grammaticales",
        matiere: Matiere.FRANCAIS,
        niveauScolaire: NiveauScolaire.PRIMAIRE_3,
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/primaire/francais3.pdf",
        dureeEstimee: 50,
        competences: ["Reconnaître les noms", "Identifier les verbes", "Utiliser les articles"]
      },
      {
        titre: "Les écosystèmes",
        description: "Découverte des écosystèmes locaux",
        matiere: Matiere.SCIENCES,
        niveauScolaire: NiveauScolaire.PRIMAIRE_3,
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/primaire/science3.pdf",
        dureeEstimee: 45,
        competences: ["Comprendre les écosystèmes", "Identifier les chaînes alimentaires", "Observer les interactions"]
      },

      // Primaire 4
      {
        titre: "Fractions simples",
        description: "Introduction aux fractions",
        matiere: Matiere.MATHEMATIQUES,
        niveauScolaire: NiveauScolaire.PRIMAIRE_4,
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/primaire/math4.pdf",
        dureeEstimee: 65,
        competences: ["Reconnaître les fractions", "Comparer les fractions", "Additionner les fractions simples"]
      },
      {
        titre: "Rédaction de textes",
        description: "Écriture de textes courts et structurés",
        matiere: Matiere.FRANCAIS,
        niveauScolaire: NiveauScolaire.PRIMAIRE_4,
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/primaire/francais4.pdf",
        dureeEstimee: 55,
        competences: ["Écrire des textes courts", "Structurer un récit", "Utiliser la ponctuation"]
      },
      {
        titre: "Les forces et le mouvement",
        description: "Introduction aux concepts de physique",
        matiere: Matiere.SCIENCES,
        niveauScolaire: NiveauScolaire.PRIMAIRE_4,
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/primaire/science4.pdf",
        dureeEstimee: 50,
        competences: ["Comprendre les forces", "Observer le mouvement", "Conduire des expériences simples"]
      },

      // Primaire 5
      {
        titre: "Géométrie plane",
        description: "Étude des figures géométriques",
        matiere: Matiere.MATHEMATIQUES,
        niveauScolaire: NiveauScolaire.PRIMAIRE_5,
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/primaire/math5.pdf",
        dureeEstimee: 70,
        competences: ["Identifier les figures géométriques", "Calculer les périmètres", "Mesurer les angles"]
      },
      {
        titre: "Littérature jeunesse",
        description: "Découverte d'œuvres littéraires adaptées",
        matiere: Matiere.FRANCAIS,
        niveauScolaire: NiveauScolaire.PRIMAIRE_5,
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/primaire/francais5.pdf",
        dureeEstimee: 60,
        competences: ["Lire des œuvres complètes", "Analyser les personnages", "Comprendre les thèmes"]
      },
      {
        titre: "Les changements d'état",
        description: "Étude des transformations de la matière",
        matiere: Matiere.SCIENCES,
        niveauScolaire: NiveauScolaire.PRIMAIRE_5,
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/primaire/science5.pdf",
        dureeEstimee: 55,
        competences: ["Comprendre les états de la matière", "Observer les changements", "Expliquer les phénomènes"]
      },

      // Primaire 6
      {
        titre: "Pourcentages et probabilités",
        description: "Introduction aux pourcentages et aux probabilités",
        matiere: Matiere.MATHEMATIQUES,
        niveauScolaire: NiveauScolaire.PRIMAIRE_6,
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/primaire/math6.pdf",
        dureeEstimee: 75,
        competences: ["Calculer les pourcentages", "Comprendre les probabilités", "Résoudre des problèmes complexes"]
      },
      {
        titre: "Analyse de textes",
        description: "Analyse approfondie de textes variés",
        matiere: Matiere.FRANCAIS,
        niveauScolaire: NiveauScolaire.PRIMAIRE_6,
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/primaire/francais6.pdf",
        dureeEstimee: 65,
        competences: ["Analyser les textes", "Identifier les figures de style", "Comprendre les intentions"]
      },
      {
        titre: "L'énergie et ses transformations",
        description: "Étude des formes d'énergie",
        matiere: Matiere.SCIENCES,
        niveauScolaire: NiveauScolaire.PRIMAIRE_6,
        urlPdf: "https://www.education.gouv.qc.ca/fileadmin/site_web/documents/education/jeunes/pfeq/primaire/science6.pdf",
        dureeEstimee: 60,
        competences: ["Identifier les formes d'énergie", "Comprendre les transformations", "Analyser les impacts"]
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

// Exécuter le seeding si le script est appelé directement
if (require.main === module) {
  seedLMS()
    .then(() => {
      console.log('🎉 Seeding LMS terminé avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erreur lors du seeding LMS:', error);
      process.exit(1);
    });
}

export { seedLMS };
