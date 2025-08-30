import { NextRequest, NextResponse } from "next/server";
import { db } from "@profs-academie/db";
import { GenerateWeekRequest, CalendarWeek, CalendarEvent, Course, DEFAULT_TIME_SLOTS, SUBJECT_PRIORITY } from "../../../../../types/lms";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body: GenerateWeekRequest = await request.json();
    const { childId, weekStartISO, hoursPerWeek } = body;

    if (!childId || !weekStartISO || !hoursPerWeek) {
      return NextResponse.json(
        { error: 'childId, weekStartISO et hoursPerWeek sont requis' },
        { status: 400 }
      );
    }

    // 1. Récupérer l'enfant et son niveau
    const enfant = await db.enfant.findUnique({
      where: { id: childId },
      include: {
        foyer: {
          include: {
            parent: true
          }
        }
      }
    });

    if (!enfant) {
      return NextResponse.json(
        { error: 'Enfant non trouvé' },
        { status: 404 }
      );
    }

    // 2. Convertir le niveau en GradeKey
    const gradeKey = convertNiveauToGradeKey(enfant.niveauScolaire);

    // 3. Récupérer les cours disponibles pour ce niveau
    const niveauScolaire = convertGradeKeyToNiveau(gradeKey);
    const coursGouvernementaux = await db.coursGouvernemental.findMany({
      where: {
        niveauScolaire: niveauScolaire
      },
      orderBy: {
        titre: 'asc'
      }
    });

    // 4. Transformer en format Course avec aperçus
    const courses: Course[] = coursGouvernementaux.length > 0 
      ? coursGouvernementaux.map(cours => ({
          id: cours.id,
          title: cours.titre,
          slug: cours.titre.toLowerCase().replace(/\s+/g, '-'),
          gradeKeys: [gradeKey],
          durationMinutes: cours.dureeEstimee || 60,
          weeklyFrequency: getWeeklyFrequency(cours.matiere),
          description: cours.description,
          subject: cours.matiere,
          outline: getCourseOutline(cours.matiere, gradeKey),
          competences: cours.competences || getDefaultCompetences(cours.matiere, gradeKey)
        }))
      : getDefaultCourses(gradeKey);

    // 5. Générer automatiquement la semaine avec le nombre d'heures spécifié
    const events = generateWeekEvents(courses, childId, weekStartISO, hoursPerWeek);

    // 6. Créer la structure CalendarWeek
    const calendarWeek: CalendarWeek = {
      childId,
      weekStartISO,
      events,
      totalHours: hoursPerWeek
    };

    return NextResponse.json(calendarWeek);
  } catch (error) {
    console.error('Erreur lors de la génération de la semaine:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération de la semaine' },
      { status: 500 }
    );
  }
}

// Fonction pour générer les événements de la semaine avec nombre d'heures spécifique
function generateWeekEvents(courses: Course[], childId: string, weekStartISO: string, hoursPerWeek: number): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const weekStart = new Date(weekStartISO);
  
  // Trier les cours par priorité
  const sortedCourses = courses.sort((a, b) => {
    const aPriority = SUBJECT_PRIORITY.indexOf(a.title);
    const bPriority = SUBJECT_PRIORITY.indexOf(b.title);
    return aPriority - bPriority;
  });

  // Calculer la répartition des heures par matière selon leur importance
  const courseHours = calculateCourseHours(sortedCourses, hoursPerWeek);
  
  // Créer une grille des créneaux disponibles
  const availableSlots = createAvailableSlots(weekStart);
  
  // Répartir les cours selon les heures calculées
  for (const course of sortedCourses) {
    const targetHours = courseHours[course.id] || 0;
    const targetMinutes = targetHours * 60;
    let allocatedMinutes = 0;
    
    while (allocatedMinutes < targetMinutes && availableSlots.length > 0) {
      const slot = availableSlots.shift();
      if (slot) {
        const event: CalendarEvent = {
          id: `event-${Date.now()}-${Math.random()}`,
          childId,
          courseId: course.id,
          startISO: slot.startISO,
          endISO: slot.endISO,
          title: course.title,
          course
        };
        events.push(event);
        allocatedMinutes += course.durationMinutes;
      }
    }
  }

  return events;
}

// Fonction pour calculer la répartition des heures par matière
function calculateCourseHours(courses: Course[], totalHours: number): Record<string, number> {
  const courseHours: Record<string, number> = {};
  const totalPriority = courses.reduce((sum, course) => {
    const priority = SUBJECT_PRIORITY.indexOf(course.title);
    return sum + (priority >= 0 ? SUBJECT_PRIORITY.length - priority : 1);
  }, 0);

  for (const course of courses) {
    const priority = SUBJECT_PRIORITY.indexOf(course.title);
    const weight = priority >= 0 ? SUBJECT_PRIORITY.length - priority : 1;
    const hours = Math.round((weight / totalPriority) * totalHours * 10) / 10;
    courseHours[course.id] = Math.max(0.5, hours); // Minimum 30 minutes
  }

  return courseHours;
}

// Fonction pour créer les créneaux disponibles
function createAvailableSlots(weekStart: Date) {
  const slots: { startISO: string; endISO: string }[] = [];
  
  // Lundi à vendredi (0 = dimanche, 1 = lundi)
  for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
    const currentDate = new Date(weekStart);
    currentDate.setDate(weekStart.getDate() + dayOffset);
    
    for (const timeSlot of DEFAULT_TIME_SLOTS) {
      const startTime = new Date(currentDate);
      const [hours, minutes] = timeSlot.start.split(':').map(Number);
      startTime.setHours(hours, minutes, 0, 0);
      
      const endTime = new Date(currentDate);
      const [endHours, endMinutes] = timeSlot.end.split(':').map(Number);
      endTime.setHours(endHours, endMinutes, 0, 0);
      
      slots.push({
        startISO: startTime.toISOString(),
        endISO: endTime.toISOString()
      });
    }
  }
  
  return slots;
}

// Fonction pour obtenir l'aperçu du cours selon la matière et le niveau
function getCourseOutline(matiere: string, grade: string): string {
  const outlines: Record<string, Record<string, string>> = {
    'FRANCAIS': {
      'P1': 'Lecture et écriture de base, vocabulaire simple, grammaire élémentaire',
      'P2': 'Lecture fluide, écriture de phrases, conjugaison des verbes au présent',
      'P3': 'Compréhension de textes, rédaction de courts textes, grammaire avancée',
      'P4': 'Analyse de textes, rédaction structurée, orthographe et ponctuation',
      'P5': 'Littérature jeunesse, rédaction créative, grammaire complète',
      'P6': 'Préparation au secondaire, analyse littéraire, expression écrite'
    },
    'MATHEMATIQUES': {
      'P1': 'Nombres de 1 à 100, addition et soustraction, géométrie simple',
      'P2': 'Nombres jusqu\'à 1000, multiplication, mesures de longueur',
      'P3': 'Division, fractions simples, périmètre et aire',
      'P4': 'Fractions et décimaux, pourcentages, géométrie plane',
      'P5': 'Nombres décimaux, pourcentages, volume et capacité',
      'P6': 'Algèbre de base, statistiques, géométrie dans l\'espace'
    },
    'SCIENCES': {
      'P1': 'Découverte du monde vivant, les saisons, les animaux',
      'P2': 'Les plantes, les habitats, les changements d\'état',
      'P3': 'Les écosystèmes, l\'énergie, les forces simples',
      'P4': 'Les systèmes du corps humain, l\'électricité, la chimie',
      'P5': 'L\'environnement, les technologies, l\'astronomie',
      'P6': 'Les cellules, la génétique, les réactions chimiques'
    },
    'HISTOIRE': {
      'P1': 'La famille, l\'école, les fêtes traditionnelles',
      'P2': 'La communauté locale, les métiers, les transports',
      'P3': 'L\'histoire du Québec, les Premières Nations',
      'P4': 'La Nouvelle-France, la colonisation, les explorateurs',
      'P5': 'La Révolution américaine, la Confédération',
      'P6': 'Le 20e siècle, les guerres mondiales, la modernisation'
    },
    'ARTS': {
      'P1': 'Expression artistique libre, couleurs et formes',
      'P2': 'Techniques de base, dessin et peinture',
      'P3': 'Histoire de l\'art, techniques mixtes',
      'P4': 'Artistes québécois, sculpture et modelage',
      'P5': 'Mouvements artistiques, techniques avancées',
      'P6': 'Création d\'œuvres personnelles, critique d\'art'
    },
    'EDUCATION_PHYSIQUE': {
      'P1': 'Motricité de base, jeux coopératifs',
      'P2': 'Sports d\'équipe simples, coordination',
      'P3': 'Athlétisme, sports collectifs',
      'P4': 'Techniques sportives, condition physique',
      'P5': 'Stratégies de jeu, performance athlétique',
      'P6': 'Leadership, arbitrage, excellence sportive'
    },
    'ETHIQUE_CULTURE_RELIGIEUSE': {
      'P1': 'Valeurs de base, respect des différences',
      'P2': 'Cultures du monde, traditions familiales',
      'P3': 'Religions du monde, éthique personnelle',
      'P4': 'Questions éthiques, dialogue interculturel',
      'P5': 'Citoyenneté responsable, engagement social',
      'P6': 'Réflexion critique, construction identitaire'
    }
  };

  return outlines[matiere]?.[grade] || 'Aperçu du cours disponible';
}

// Fonction pour obtenir les compétences par défaut
function getDefaultCompetences(matiere: string, grade: string): string[] {
  const competences: Record<string, string[]> = {
    'FRANCAIS': [
      'Comprendre et interpréter des textes',
      'Rédiger des textes variés',
      'Maîtriser les règles de grammaire',
      'Enrichir son vocabulaire'
    ],
    'MATHEMATIQUES': [
      'Résoudre des problèmes mathématiques',
      'Utiliser les opérations arithmétiques',
      'Appliquer les concepts géométriques',
      'Interpréter des données statistiques'
    ],
    'SCIENCES': [
      'Observer et décrire le monde naturel',
      'Conduire des expériences simples',
      'Comprendre les phénomènes scientifiques',
      'Développer un esprit critique'
    ]
  };

  return competences[matiere] || ['Compétences spécifiques au cours'];
}

// Fonctions utilitaires (réutilisées depuis l'API des cours)
function convertNiveauToGradeKey(niveauScolaire: string | null): string {
  if (!niveauScolaire) return 'P1';

  const mapping: Record<string, string> = {
    'MATERNELLE_4_ANS': 'P1',
    'MATERNELLE_5_ANS': 'P1',
    'PRIMAIRE_1': 'P1',
    'PRIMAIRE_2': 'P2',
    'PRIMAIRE_3': 'P3',
    'PRIMAIRE_4': 'P4',
    'PRIMAIRE_5': 'P5',
    'PRIMAIRE_6': 'P6',
    'SECONDAIRE_1': 'S1',
    'SECONDAIRE_2': 'S2',
    'SECONDAIRE_3': 'S3',
    'SECONDAIRE_4': 'S4',
    'SECONDAIRE_5': 'S5'
  };

  return mapping[niveauScolaire] || 'P1';
}

function convertGradeKeyToNiveau(gradeKey: string): string {
  const mapping: Record<string, string> = {
    'P1': 'PRIMAIRE_1',
    'P2': 'PRIMAIRE_2',
    'P3': 'PRIMAIRE_3',
    'P4': 'PRIMAIRE_4',
    'P5': 'PRIMAIRE_5',
    'P6': 'PRIMAIRE_6',
    'S1': 'SECONDAIRE_1',
    'S2': 'SECONDAIRE_2',
    'S3': 'SECONDAIRE_3',
    'S4': 'SECONDAIRE_4',
    'S5': 'SECONDAIRE_5'
  };

  return mapping[gradeKey];
}

function getWeeklyFrequency(matiere: string): number {
  const frequencies: Record<string, number> = {
    'FRANCAIS': 5,
    'MATHEMATIQUES': 5,
    'SCIENCES': 3,
    'HISTOIRE': 2,
    'GEOGRAPHIE': 2,
    'ARTS': 2,
    'EDUCATION_PHYSIQUE': 2,
    'ETHIQUE_CULTURE_RELIGIEUSE': 1,
    'ANGLAIS': 3,
    'ESPAGNOL': 2,
    'TECHNOLOGIE': 2,
    'ECONOMIE_FAMILIALE': 1
  };

  return frequencies[matiere] || 2;
}

function getDefaultCourses(grade: string) {
  return [
    {
      id: 'francais-' + grade,
      title: 'Français',
      slug: 'francais',
      gradeKeys: [grade],
      durationMinutes: 60,
      weeklyFrequency: 5,
      description: 'Apprentissage de la langue française',
      subject: 'FRANCAIS',
      outline: getCourseOutline('FRANCAIS', grade),
      competences: getDefaultCompetences('FRANCAIS', grade)
    },
    {
      id: 'mathematiques-' + grade,
      title: 'Mathématiques',
      slug: 'mathematiques',
      gradeKeys: [grade],
      durationMinutes: 60,
      weeklyFrequency: 5,
      description: 'Apprentissage des mathématiques',
      subject: 'MATHEMATIQUES',
      outline: getCourseOutline('MATHEMATIQUES', grade),
      competences: getDefaultCompetences('MATHEMATIQUES', grade)
    },
    {
      id: 'sciences-' + grade,
      title: 'Sciences',
      slug: 'sciences',
      gradeKeys: [grade],
      durationMinutes: 60,
      weeklyFrequency: 3,
      description: 'Découverte des sciences',
      subject: 'SCIENCES',
      outline: getCourseOutline('SCIENCES', grade),
      competences: getDefaultCompetences('SCIENCES', grade)
    },
    {
      id: 'univers-social-' + grade,
      title: 'Univers social',
      slug: 'univers-social',
      gradeKeys: [grade],
      durationMinutes: 60,
      weeklyFrequency: 2,
      description: 'Histoire et géographie',
      subject: 'HISTOIRE',
      outline: getCourseOutline('HISTOIRE', grade),
      competences: ['Comprendre l\'histoire et la géographie', 'Analyser des documents historiques']
    },
    {
      id: 'arts-' + grade,
      title: 'Arts',
      slug: 'arts',
      gradeKeys: [grade],
      durationMinutes: 60,
      weeklyFrequency: 2,
      description: 'Expression artistique',
      subject: 'ARTS',
      outline: getCourseOutline('ARTS', grade),
      competences: ['Exprimer sa créativité', 'Apprécier les œuvres d\'art']
    },
    {
      id: 'eps-' + grade,
      title: 'ÉPS',
      slug: 'eps',
      gradeKeys: [grade],
      durationMinutes: 60,
      weeklyFrequency: 2,
      description: 'Éducation physique et sportive',
      subject: 'EDUCATION_PHYSIQUE',
      outline: getCourseOutline('EDUCATION_PHYSIQUE', grade),
      competences: ['Développer ses habiletés motrices', 'Adopter un mode de vie sain']
    },
    {
      id: 'ccq-' + grade,
      title: 'CCQ',
      slug: 'ccq',
      gradeKeys: [grade],
      durationMinutes: 60,
      weeklyFrequency: 1,
      description: 'Éthique et culture religieuse',
      subject: 'ETHIQUE_CULTURE_RELIGIEUSE',
      outline: getCourseOutline('ETHIQUE_CULTURE_RELIGIEUSE', grade),
      competences: ['Réfléchir aux questions éthiques', 'Respecter la diversité culturelle']
    }
  ];
}
