import { db } from "./db";
import { Matiere, NiveauScolaire } from "@prisma/client";

async function seedProgrammeQuebec() {
  console.log("🌱 Début du seeding du programme scolaire québécois...");

  try {
    // Vider toutes les tables existantes
    console.log("🧹 Nettoyage des tables existantes...");
    await db.contenuApprentissage.deleteMany();
    await db.competence.deleteMany();

    // Données du programme scolaire québécois (1re à 6e année)
    const programmeData = [
      // 1re année
      {
        niveauScolaire: NiveauScolaire.PRIMAIRE_1,
        matieres: [
          {
            matiere: Matiere.FRANCAIS,
            competences: [
              {
                nom: "Lecture et écriture de base",
                description: "Lire de courts textes simples; écrire des phrases; reconnaître sons et lettres; vocabulaire de base",
                ordre: 1,
                contenus: [
                  { nom: "Lecture de textes simples", description: "Lire de courts textes avec support visuel", dureeEstimee: 25, ordre: 1 },
                  { nom: "Écriture de phrases", description: "Écrire des phrases simples avec aide", dureeEstimee: 30, ordre: 2 },
                  { nom: "Reconnaissance des sons", description: "Identifier et associer les sons aux lettres", dureeEstimee: 20, ordre: 3 },
                  { nom: "Vocabulaire de base", description: "Enrichir le vocabulaire quotidien", dureeEstimee: 15, ordre: 4 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.MATHEMATIQUES,
            competences: [
              {
                nom: "Nombres et opérations de base",
                description: "Nombres jusqu'à 20; additions/soustractions simples; mesures (longueur, temps)",
                ordre: 1,
                contenus: [
                  { nom: "Nombres jusqu'à 20", description: "Compter, lire et écrire les nombres de 1 à 20", dureeEstimee: 30, ordre: 1 },
                  { nom: "Additions simples", description: "Additionner des nombres jusqu'à 20", dureeEstimee: 25, ordre: 2 },
                  { nom: "Soustractions simples", description: "Soustraire des nombres jusqu'à 20", dureeEstimee: 25, ordre: 3 },
                  { nom: "Mesures de base", description: "Mesurer des longueurs et le temps", dureeEstimee: 20, ordre: 4 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.SCIENCES,
            competences: [
              {
                nom: "Exploration du monde",
                description: "Observer phénomènes simples; explorer 5 sens, besoins de base",
                ordre: 1,
                contenus: [
                  { nom: "Observation des phénomènes", description: "Observer et décrire des phénomènes simples", dureeEstimee: 25, ordre: 1 },
                  { nom: "Les 5 sens", description: "Explorer et utiliser ses 5 sens", dureeEstimee: 30, ordre: 2 },
                  { nom: "Besoins de base", description: "Comprendre les besoins fondamentaux", dureeEstimee: 20, ordre: 3 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.GEOGRAPHIE,
            competences: [
              {
                nom: "Repères spatiaux et temporels",
                description: "Temps et espace personnel; repères familiaux et scolaires",
                ordre: 1,
                contenus: [
                  { nom: "Espace personnel", description: "Se situer dans son environnement immédiat", dureeEstimee: 25, ordre: 1 },
                  { nom: "Repères familiaux", description: "Comprendre sa place dans la famille", dureeEstimee: 20, ordre: 2 },
                  { nom: "Repères scolaires", description: "Se repérer dans l'école et la classe", dureeEstimee: 20, ordre: 3 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.ARTS,
            competences: [
              {
                nom: "Exploration artistique",
                description: "Exploration arts plastiques (formes, couleurs); chant simple",
                ordre: 1,
                contenus: [
                  { nom: "Formes et couleurs", description: "Explorer les formes géométriques et les couleurs", dureeEstimee: 30, ordre: 1 },
                  { nom: "Arts plastiques", description: "Créer des œuvres plastiques simples", dureeEstimee: 35, ordre: 2 },
                  { nom: "Chant simple", description: "Chanter des chansons simples", dureeEstimee: 20, ordre: 3 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.EDUCATION_PHYSIQUE,
            competences: [
              {
                nom: "Motricité et jeux",
                description: "Motricité globale; jeux collectifs simples",
                ordre: 1,
                contenus: [
                  { nom: "Motricité globale", description: "Développer la motricité globale", dureeEstimee: 40, ordre: 1 },
                  { nom: "Jeux collectifs", description: "Participer à des jeux collectifs simples", dureeEstimee: 35, ordre: 2 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.ETHIQUE_CULTURE_RELIGIEUSE,
            competences: [
              {
                nom: "Vivre ensemble",
                description: "Respect des autres; vivre ensemble en classe",
                ordre: 1,
                contenus: [
                  { nom: "Respect des autres", description: "Apprendre à respecter les autres", dureeEstimee: 25, ordre: 1 },
                  { nom: "Vivre ensemble", description: "Participer à la vie de classe", dureeEstimee: 30, ordre: 2 }
                ]
              }
            ]
          }
        ]
      },

      // 2e année
      {
        niveauScolaire: NiveauScolaire.PRIMAIRE_2,
        matieres: [
          {
            matiere: Matiere.FRANCAIS,
            competences: [
              {
                nom: "Lecture et écriture avancées",
                description: "Lire textes plus longs; écrire petits paragraphes; conjugaison de base (présent, imparfait)",
                ordre: 1,
                contenus: [
                  { nom: "Lecture de textes longs", description: "Lire des textes plus longs avec compréhension", dureeEstimee: 30, ordre: 1 },
                  { nom: "Écriture de paragraphes", description: "Écrire de petits paragraphes cohérents", dureeEstimee: 35, ordre: 2 },
                  { nom: "Conjugaison de base", description: "Conjuguer au présent et à l'imparfait", dureeEstimee: 25, ordre: 3 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.MATHEMATIQUES,
            competences: [
              {
                nom: "Nombres et opérations étendues",
                description: "Nombres jusqu'à 100; additions/soustractions complexes; introduction multiplication; géométrie simple",
                ordre: 1,
                contenus: [
                  { nom: "Nombres jusqu'à 100", description: "Travailler avec les nombres jusqu'à 100", dureeEstimee: 30, ordre: 1 },
                  { nom: "Opérations complexes", description: "Additions et soustractions avec retenues", dureeEstimee: 35, ordre: 2 },
                  { nom: "Introduction multiplication", description: "Découvrir le concept de multiplication", dureeEstimee: 30, ordre: 3 },
                  { nom: "Géométrie simple", description: "Reconnaître des formes géométriques", dureeEstimee: 25, ordre: 4 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.SCIENCES,
            competences: [
              {
                nom: "Expérimentation scientifique",
                description: "Expériences simples; notions vivants/non-vivants; matières",
                ordre: 1,
                contenus: [
                  { nom: "Expériences simples", description: "Conduire des expériences simples", dureeEstimee: 35, ordre: 1 },
                  { nom: "Vivants et non-vivants", description: "Distinguer les êtres vivants des objets", dureeEstimee: 25, ordre: 2 },
                  { nom: "Propriétés des matières", description: "Explorer les propriétés des matières", dureeEstimee: 30, ordre: 3 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.GEOGRAPHIE,
            competences: [
              {
                nom: "Repères locaux",
                description: "Repères locaux (quartier, ville); symboles culturels",
                ordre: 1,
                contenus: [
                  { nom: "Quartier et ville", description: "Se repérer dans son quartier et sa ville", dureeEstimee: 30, ordre: 1 },
                  { nom: "Symboles culturels", description: "Reconnaître les symboles culturels", dureeEstimee: 25, ordre: 2 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.ARTS,
            competences: [
              {
                nom: "Productions artistiques",
                description: "Productions plastiques et musicales simples; rythme de base",
                ordre: 1,
                contenus: [
                  { nom: "Productions plastiques", description: "Créer des productions plastiques", dureeEstimee: 35, ordre: 1 },
                  { nom: "Productions musicales", description: "Créer des productions musicales simples", dureeEstimee: 30, ordre: 2 },
                  { nom: "Rythme de base", description: "Développer le sens du rythme", dureeEstimee: 25, ordre: 3 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.EDUCATION_PHYSIQUE,
            competences: [
              {
                nom: "Coordination et habiletés",
                description: "Coordination; habiletés de base (lancer, attraper)",
                ordre: 1,
                contenus: [
                  { nom: "Coordination", description: "Développer la coordination motrice", dureeEstimee: 35, ordre: 1 },
                  { nom: "Habiletés de base", description: "Maîtriser les habiletés de base (lancer, attraper)", dureeEstimee: 30, ordre: 2 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.ETHIQUE_CULTURE_RELIGIEUSE,
            competences: [
              {
                nom: "Valeurs familiales et culturelles",
                description: "Valeurs familiales et culturelles simples",
                ordre: 1,
                contenus: [
                  { nom: "Valeurs familiales", description: "Comprendre les valeurs familiales", dureeEstimee: 25, ordre: 1 },
                  { nom: "Valeurs culturelles", description: "Découvrir les valeurs culturelles", dureeEstimee: 30, ordre: 2 }
                ]
              }
            ]
          }
        ]
      },

      // 3e année
      {
        niveauScolaire: NiveauScolaire.PRIMAIRE_3,
        matieres: [
          {
            matiere: Matiere.FRANCAIS,
            competences: [
              {
                nom: "Fluidité et ponctuation",
                description: "Lire avec fluidité; écrire textes narratifs simples; ponctuation de base",
                ordre: 1,
                contenus: [
                  { nom: "Lecture fluide", description: "Lire avec fluidité et expression", dureeEstimee: 30, ordre: 1 },
                  { nom: "Textes narratifs", description: "Écrire des textes narratifs simples", dureeEstimee: 40, ordre: 2 },
                  { nom: "Ponctuation de base", description: "Utiliser la ponctuation de base", dureeEstimee: 25, ordre: 3 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.MATHEMATIQUES,
            competences: [
              {
                nom: "Opérations et fractions",
                description: "Multiplications/divisions simples; fractions (½, ¼); mesures (mètres, litres, kg); solides géométriques",
                ordre: 1,
                contenus: [
                  { nom: "Multiplications simples", description: "Maîtriser les tables de multiplication", dureeEstimee: 35, ordre: 1 },
                  { nom: "Divisions simples", description: "Effectuer des divisions simples", dureeEstimee: 30, ordre: 2 },
                  { nom: "Fractions simples", description: "Comprendre les fractions ½ et ¼", dureeEstimee: 25, ordre: 3 },
                  { nom: "Mesures standard", description: "Utiliser les unités de mesure (m, L, kg)", dureeEstimee: 30, ordre: 4 },
                  { nom: "Solides géométriques", description: "Reconnaître les solides géométriques", dureeEstimee: 25, ordre: 5 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.SCIENCES,
            competences: [
              {
                nom: "Systèmes naturels",
                description: "Chaînes alimentaires; énergie; corps humain de base",
                ordre: 1,
                contenus: [
                  { nom: "Chaînes alimentaires", description: "Comprendre les chaînes alimentaires", dureeEstimee: 35, ordre: 1 },
                  { nom: "Énergie", description: "Découvrir les formes d'énergie", dureeEstimee: 30, ordre: 2 },
                  { nom: "Corps humain", description: "Connaître les parties du corps humain", dureeEstimee: 25, ordre: 3 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.GEOGRAPHIE,
            competences: [
              {
                nom: "Région du Québec",
                description: "Découverte région du Québec; société amérindienne vers 1500",
                ordre: 1,
                contenus: [
                  { nom: "Région du Québec", description: "Découvrir sa région du Québec", dureeEstimee: 35, ordre: 1 },
                  { nom: "Société amérindienne", description: "Connaître la société amérindienne vers 1500", dureeEstimee: 30, ordre: 2 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.ARTS,
            competences: [
              {
                nom: "Exploration artistique étendue",
                description: "Exploration matériaux variés; mélodies simples",
                ordre: 1,
                contenus: [
                  { nom: "Matériaux variés", description: "Explorer différents matériaux artistiques", dureeEstimee: 35, ordre: 1 },
                  { nom: "Mélodies simples", description: "Créer et interpréter des mélodies simples", dureeEstimee: 30, ordre: 2 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.EDUCATION_PHYSIQUE,
            competences: [
              {
                nom: "Endurance et règles",
                description: "Endurance; règles de jeux sportifs simples",
                ordre: 1,
                contenus: [
                  { nom: "Endurance", description: "Développer l'endurance physique", dureeEstimee: 40, ordre: 1 },
                  { nom: "Règles de jeux", description: "Comprendre et respecter les règles de jeux", dureeEstimee: 25, ordre: 2 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.ETHIQUE_CULTURE_RELIGIEUSE,
            competences: [
              {
                nom: "Respect et entraide",
                description: "Respect des règles; amitié et entraide",
                ordre: 1,
                contenus: [
                  { nom: "Respect des règles", description: "Comprendre l'importance des règles", dureeEstimee: 25, ordre: 1 },
                  { nom: "Amitié et entraide", description: "Développer l'amitié et l'entraide", dureeEstimee: 30, ordre: 2 }
                ]
              }
            ]
          }
        ]
      },

      // 4e année
      {
        niveauScolaire: NiveauScolaire.PRIMAIRE_4,
        matieres: [
          {
            matiere: Matiere.FRANCAIS,
            competences: [
              {
                nom: "Types de textes et conjugaison",
                description: "Lire différents types de textes; écrire descriptifs et explicatifs; conjuguer présent, imparfait, futur",
                ordre: 1,
                contenus: [
                  { nom: "Types de textes", description: "Lire différents types de textes", dureeEstimee: 35, ordre: 1 },
                  { nom: "Textes descriptifs", description: "Écrire des textes descriptifs", dureeEstimee: 40, ordre: 2 },
                  { nom: "Textes explicatifs", description: "Écrire des textes explicatifs", dureeEstimee: 40, ordre: 3 },
                  { nom: "Conjugaison étendue", description: "Conjuguer au présent, imparfait et futur", dureeEstimee: 30, ordre: 4 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.MATHEMATIQUES,
            competences: [
              {
                nom: "Opérations avancées et géométrie",
                description: "Multiplications/divisions jusqu'à 100; fractions et décimaux; périmètre et aire",
                ordre: 1,
                contenus: [
                  { nom: "Opérations jusqu'à 100", description: "Multiplier et diviser jusqu'à 100", dureeEstimee: 35, ordre: 1 },
                  { nom: "Fractions et décimaux", description: "Travailler avec fractions et décimaux", dureeEstimee: 30, ordre: 2 },
                  { nom: "Périmètre", description: "Calculer le périmètre de figures", dureeEstimee: 25, ordre: 3 },
                  { nom: "Aire", description: "Calculer l'aire de figures simples", dureeEstimee: 30, ordre: 4 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.SCIENCES,
            competences: [
              {
                nom: "Écosystèmes et physique",
                description: "Écosystèmes; forces et mouvements; propriétés matière",
                ordre: 1,
                contenus: [
                  { nom: "Écosystèmes", description: "Comprendre les écosystèmes", dureeEstimee: 35, ordre: 1 },
                  { nom: "Forces et mouvements", description: "Étudier les forces et mouvements", dureeEstimee: 30, ordre: 2 },
                  { nom: "Propriétés de la matière", description: "Explorer les propriétés de la matière", dureeEstimee: 25, ordre: 3 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.HISTOIRE,
            competences: [
              {
                nom: "Nouvelle-France et histoire",
                description: "Nouvelle-France; vie quotidienne passé-présent",
                ordre: 1,
                contenus: [
                  { nom: "Nouvelle-France", description: "Découvrir la Nouvelle-France", dureeEstimee: 40, ordre: 1 },
                  { nom: "Vie quotidienne", description: "Comparer la vie quotidienne passé-présent", dureeEstimee: 35, ordre: 2 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.ARTS,
            competences: [
              {
                nom: "Productions complexes",
                description: "Productions plus complexes; improvisation musicale",
                ordre: 1,
                contenus: [
                  { nom: "Productions complexes", description: "Créer des productions artistiques complexes", dureeEstimee: 40, ordre: 1 },
                  { nom: "Improvisation musicale", description: "Improviser musicalement", dureeEstimee: 35, ordre: 2 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.EDUCATION_PHYSIQUE,
            competences: [
              {
                nom: "Sports collectifs et condition physique",
                description: "Sports collectifs; condition physique de base",
                ordre: 1,
                contenus: [
                  { nom: "Sports collectifs", description: "Pratiquer des sports collectifs", dureeEstimee: 45, ordre: 1 },
                  { nom: "Condition physique", description: "Développer sa condition physique de base", dureeEstimee: 40, ordre: 2 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.ETHIQUE_CULTURE_RELIGIEUSE,
            competences: [
              {
                nom: "Citoyenneté et diversité",
                description: "Notions de citoyenneté; différences culturelles",
                ordre: 1,
                contenus: [
                  { nom: "Citoyenneté", description: "Comprendre les notions de citoyenneté", dureeEstimee: 30, ordre: 1 },
                  { nom: "Différences culturelles", description: "Respecter les différences culturelles", dureeEstimee: 35, ordre: 2 }
                ]
              }
            ]
          }
        ]
      },

      // 5e année
      {
        niveauScolaire: NiveauScolaire.PRIMAIRE_5,
        matieres: [
          {
            matiere: Matiere.FRANCAIS,
            competences: [
              {
                nom: "Compréhension et argumentation",
                description: "Lire pour dégager idées principales et implicites; écrire textes argumentatifs simples; enrichir vocabulaire",
                ordre: 1,
                contenus: [
                  { nom: "Idées principales", description: "Dégager les idées principales d'un texte", dureeEstimee: 35, ordre: 1 },
                  { nom: "Idées implicites", description: "Comprendre les idées implicites", dureeEstimee: 30, ordre: 2 },
                  { nom: "Textes argumentatifs", description: "Écrire des textes argumentatifs simples", dureeEstimee: 45, ordre: 3 },
                  { nom: "Enrichissement vocabulaire", description: "Enrichir son vocabulaire", dureeEstimee: 25, ordre: 4 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.MATHEMATIQUES,
            competences: [
              {
                nom: "Nombres et probabilités",
                description: "Nombres grands; opérations avec fractions/décimaux; probabilité/statistique; volume",
                ordre: 1,
                contenus: [
                  { nom: "Nombres grands", description: "Travailler avec de grands nombres", dureeEstimee: 30, ordre: 1 },
                  { nom: "Fractions et décimaux", description: "Opérations avec fractions et décimaux", dureeEstimee: 35, ordre: 2 },
                  { nom: "Probabilité", description: "Introduction aux probabilités", dureeEstimee: 25, ordre: 3 },
                  { nom: "Statistique", description: "Introduction aux statistiques", dureeEstimee: 30, ordre: 4 },
                  { nom: "Volume", description: "Calculer le volume de solides", dureeEstimee: 25, ordre: 5 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.SCIENCES,
            competences: [
              {
                nom: "Énergie et corps humain",
                description: "Énergie renouvelable; systèmes du corps humain; introduction électricité",
                ordre: 1,
                contenus: [
                  { nom: "Énergie renouvelable", description: "Comprendre les énergies renouvelables", dureeEstimee: 35, ordre: 1 },
                  { nom: "Systèmes du corps", description: "Connaître les systèmes du corps humain", dureeEstimee: 40, ordre: 2 },
                  { nom: "Électricité", description: "Introduction à l'électricité", dureeEstimee: 30, ordre: 3 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.HISTOIRE,
            competences: [
              {
                nom: "Québec 19e siècle",
                description: "Québec 19e siècle; industrialisation",
                ordre: 1,
                contenus: [
                  { nom: "Québec 19e siècle", description: "Étudier le Québec au 19e siècle", dureeEstimee: 40, ordre: 1 },
                  { nom: "Industrialisation", description: "Comprendre l'industrialisation", dureeEstimee: 35, ordre: 2 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.ARTS,
            competences: [
              {
                nom: "Projet artistique guidé",
                description: "Projet artistique guidé; exploration théâtre/danse",
                ordre: 1,
                contenus: [
                  { nom: "Projet artistique", description: "Réaliser un projet artistique guidé", dureeEstimee: 45, ordre: 1 },
                  { nom: "Théâtre", description: "Explorer l'art dramatique", dureeEstimee: 40, ordre: 2 },
                  { nom: "Danse", description: "Explorer la danse", dureeEstimee: 35, ordre: 3 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.EDUCATION_PHYSIQUE,
            competences: [
              {
                nom: "Habiletés complexes et santé",
                description: "Habiletés motrices complexes; santé et nutrition",
                ordre: 1,
                contenus: [
                  { nom: "Habiletés motrices", description: "Développer des habiletés motrices complexes", dureeEstimee: 45, ordre: 1 },
                  { nom: "Santé et nutrition", description: "Comprendre la santé et la nutrition", dureeEstimee: 30, ordre: 2 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.ETHIQUE_CULTURE_RELIGIEUSE,
            competences: [
              {
                nom: "Éthique sociale",
                description: "Éthique sociale; droits et responsabilités",
                ordre: 1,
                contenus: [
                  { nom: "Éthique sociale", description: "Comprendre l'éthique sociale", dureeEstimee: 35, ordre: 1 },
                  { nom: "Droits et responsabilités", description: "Connaître ses droits et responsabilités", dureeEstimee: 30, ordre: 2 }
                ]
              }
            ]
          }
        ]
      },

      // 6e année
      {
        niveauScolaire: NiveauScolaire.PRIMAIRE_6,
        matieres: [
          {
            matiere: Matiere.FRANCAIS,
            competences: [
              {
                nom: "Interprétation et rédaction avancées",
                description: "Lire et interpréter textes variés; écrire textes longs et structurés; conjuguer temps usuels (présent, imparfait, futur, passé composé)",
                ordre: 1,
                contenus: [
                  { nom: "Interprétation de textes", description: "Lire et interpréter des textes variés", dureeEstimee: 40, ordre: 1 },
                  { nom: "Textes longs", description: "Écrire des textes longs et structurés", dureeEstimee: 50, ordre: 2 },
                  { nom: "Conjugaison complète", description: "Conjuguer tous les temps usuels", dureeEstimee: 35, ordre: 3 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.MATHEMATIQUES,
            competences: [
              {
                nom: "Opérations complexes et résolution",
                description: "Opérations complexes; pourcentages; proportionnalité; résolution de problèmes",
                ordre: 1,
                contenus: [
                  { nom: "Opérations complexes", description: "Effectuer des opérations mathématiques complexes", dureeEstimee: 40, ordre: 1 },
                  { nom: "Pourcentages", description: "Travailler avec les pourcentages", dureeEstimee: 35, ordre: 2 },
                  { nom: "Proportionnalité", description: "Comprendre la proportionnalité", dureeEstimee: 30, ordre: 3 },
                  { nom: "Résolution de problèmes", description: "Résoudre des problèmes complexes", dureeEstimee: 45, ordre: 4 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.SCIENCES,
            competences: [
              {
                nom: "Climat et astronomie",
                description: "Climat; astronomie de base; technologies simples",
                ordre: 1,
                contenus: [
                  { nom: "Climat", description: "Comprendre le climat et ses changements", dureeEstimee: 35, ordre: 1 },
                  { nom: "Astronomie", description: "Découvrir l'astronomie de base", dureeEstimee: 40, ordre: 2 },
                  { nom: "Technologies", description: "Explorer les technologies simples", dureeEstimee: 30, ordre: 3 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.HISTOIRE,
            competences: [
              {
                nom: "Québec contemporain",
                description: "Québec contemporain; institutions démocratiques",
                ordre: 1,
                contenus: [
                  { nom: "Québec contemporain", description: "Étudier le Québec contemporain", dureeEstimee: 40, ordre: 1 },
                  { nom: "Institutions démocratiques", description: "Comprendre les institutions démocratiques", dureeEstimee: 35, ordre: 2 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.ARTS,
            competences: [
              {
                nom: "Projet artistique personnel",
                description: "Projet artistique personnel; expression créative variée",
                ordre: 1,
                contenus: [
                  { nom: "Projet personnel", description: "Réaliser un projet artistique personnel", dureeEstimee: 50, ordre: 1 },
                  { nom: "Expression créative", description: "Développer son expression créative", dureeEstimee: 45, ordre: 2 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.EDUCATION_PHYSIQUE,
            competences: [
              {
                nom: "Autonomie et stratégies",
                description: "Autonomie activité physique; stratégies sportives",
                ordre: 1,
                contenus: [
                  { nom: "Autonomie physique", description: "Développer l'autonomie en activité physique", dureeEstimee: 45, ordre: 1 },
                  { nom: "Stratégies sportives", description: "Comprendre et appliquer des stratégies sportives", dureeEstimee: 40, ordre: 2 }
                ]
              }
            ]
          },
          {
            matiere: Matiere.ETHIQUE_CULTURE_RELIGIEUSE,
            competences: [
              {
                nom: "Citoyenneté québécoise",
                description: "Citoyenneté québécoise; dialogue critique et respectueux",
                ordre: 1,
                contenus: [
                  { nom: "Citoyenneté québécoise", description: "Comprendre la citoyenneté québécoise", dureeEstimee: 40, ordre: 1 },
                  { nom: "Dialogue critique", description: "Participer à un dialogue critique et respectueux", dureeEstimee: 35, ordre: 2 }
                ]
              }
            ]
          }
        ]
      }
    ];

    // Insérer les données dans la base de données
    console.log("📚 Insertion des données du programme scolaire...");
    
    for (const niveau of programmeData) {
      console.log(`📖 Insertion du niveau ${niveau.niveauScolaire}...`);
      
      for (const matiere of niveau.matieres) {
        for (const competence of matiere.competences) {
          // Créer la compétence
          const competenceCreee = await db.competence.create({
            data: {
              nom: competence.nom,
              description: competence.description,
              matiere: matiere.matiere,
              niveauScolaire: niveau.niveauScolaire,
              ordre: competence.ordre
            }
          });

          // Créer les contenus d'apprentissage
          for (const contenu of competence.contenus) {
            await db.contenuApprentissage.create({
              data: {
                nom: contenu.nom,
                description: contenu.description,
                dureeEstimee: contenu.dureeEstimee,
                ordre: contenu.ordre,
                prerequis: [],
                competenceId: competenceCreee.id
              }
            });
          }
        }
      }
    }

    console.log("✅ Programme scolaire québécois inséré avec succès !");
    
    // Afficher un résumé
    const totalCompetences = await db.competence.count();
    const totalContenus = await db.contenuApprentissage.count();
    
    console.log(`📊 Résumé : ${totalCompetences} compétences et ${totalContenus} contenus d'apprentissage créés`);

  } catch (error) {
    console.error("❌ Erreur lors du seeding du programme scolaire:", error);
    throw error;
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedProgrammeQuebec()
    .then(() => {
      console.log("🎉 Seeding terminé avec succès !");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Erreur lors du seeding:", error);
      process.exit(1);
    });
}

export { seedProgrammeQuebec };
