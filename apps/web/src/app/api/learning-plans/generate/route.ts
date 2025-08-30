import { NextRequest, NextResponse } from "next/server";
import { db } from "@profs-academie/db";
import { 
  GenerateLearningPlanRequest, 
  LearningPlan, 
  WeekPlan, 
  SubjectWeekPlan, 
  LearningSession,
  LearningCompetency,
  GradeKey
} from "../../../../../types/lms";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body: GenerateLearningPlanRequest = await request.json();
    const { childId, startDate, endDate } = body;

    if (!childId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'childId, startDate et endDate sont requis' },
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

    // 2. Convertir le niveau en GradeKey et récupérer les compétences
    const niveauScolaire = convertGradeKeyToNiveau(enfant.niveauScolaire);
    const competences = await getCompetenciesFromDatabase(niveauScolaire);

    if (competences.length === 0) {
      return NextResponse.json(
        { error: `Aucune compétence trouvée pour le niveau ${niveauScolaire}` },
        { status: 404 }
      );
    }

    // 3. Calculer le nombre de semaines
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalWeeks = Math.ceil((end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));

    // 4. Générer le plan d'apprentissage
    const weeks = generateWeekPlans(start, end, competences, niveauScolaire);

    // 5. Créer la structure LearningPlan
    const learningPlan: LearningPlan = {
      id: `plan-${Date.now()}`,
      childId,
      childName: enfant.prenom,
      grade: convertNiveauToGradeKey(enfant.niveauScolaire),
      startDate,
      endDate,
      totalWeeks,
      weeks
    };

    return NextResponse.json(learningPlan);
  } catch (error) {
    console.error('Erreur lors de la génération du plan d\'apprentissage:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du plan d\'apprentissage' },
      { status: 500 }
    );
  }
}

// Fonction pour récupérer les compétences depuis la base de données
async function getCompetenciesFromDatabase(niveauScolaire: string): Promise<LearningCompetency[]> {
  const competences = await db.competence.findMany({
    where: { niveauScolaire: niveauScolaire as any },
    include: {
      contenusApprentissage: {
        orderBy: { ordre: 'asc' }
      }
    },
    orderBy: { ordre: 'asc' }
  });

  return competences.map(comp => ({
    id: comp.id,
    title: comp.nom,
    description: comp.description || '',
    subject: comp.matiere,
    grade: convertNiveauToGradeKey(niveauScolaire),
    order: comp.ordre,
    contenus: comp.contenusApprentissage.map(cont => ({
      id: cont.id,
      nom: cont.nom,
      description: cont.description || '',
      dureeEstimee: cont.dureeEstimee,
      ordre: cont.ordre
    }))
  }));
}

// Fonction pour générer les plans de semaines
function generateWeekPlans(
  startDate: Date, 
  endDate: Date, 
  competences: LearningCompetency[], 
  niveauScolaire: string
): WeekPlan[] {
  const weeks: WeekPlan[] = [];
  const currentDate = new Date(startDate);
  let weekNumber = 1;

  while (currentDate <= endDate) {
    const weekStart = new Date(currentDate);
    const weekEnd = new Date(currentDate);
    weekEnd.setDate(weekEnd.getDate() + 6); // +6 jours pour avoir 7 jours

    // Générer les matières pour cette semaine
    const subjects = generateSubjectsForWeek(competences, niveauScolaire, weekNumber);

    const weekPlan: WeekPlan = {
      weekNumber,
      startDate: weekStart.toISOString(),
      endDate: weekEnd.toISOString(),
      subjects
    };

    weeks.push(weekPlan);

    // Passer à la semaine suivante
    currentDate.setDate(currentDate.getDate() + 7);
    weekNumber++;
  }

  return weeks;
}

// Fonction pour générer les matières d'une semaine
function generateSubjectsForWeek(
  competences: LearningCompetency[], 
  niveauScolaire: string, 
  weekNumber: number
): SubjectWeekPlan[] {
  const subjects: SubjectWeekPlan[] = [];
  
  // Obtenir les matières disponibles pour ce niveau
  const availableSubjects = getAvailableSubjects();
  
  for (const subject of availableSubjects) {
    const subjectCompetencies = competences.filter(c => c.subject === subject.key);
    
    if (subjectCompetencies.length > 0) {
      // Mélanger les compétences pour cette semaine
      const shuffledCompetencies = shuffleCompetencies(subjectCompetencies, weekNumber);
      
      // Créer les sessions selon la fréquence hebdomadaire
      const sessions: LearningSession[] = [];
      for (let i = 0; i < subject.weeklyFrequency; i++) {
        const competency = shuffledCompetencies[i % shuffledCompetencies.length];
        
        // Sélectionner un contenu d'apprentissage pour cette session
        const contenu = competency.contenus?.[i % (competency.contenus?.length || 1)];
        
        sessions.push({
          id: `session-${weekNumber}-${subject.key}-${i}`,
          competencyId: competency.id,
          competencyTitle: competency.title,
          competencyDescription: competency.description,
          durationMinutes: contenu?.dureeEstimee || 60,
          order: i + 1,
          contenuNom: contenu?.nom,
          contenuDescription: contenu?.description
        });
      }

      subjects.push({
        subject: subject.key,
        title: subject.title,
        weeklyFrequency: subject.weeklyFrequency,
        sessions
      });
    }
  }

  return subjects;
}

// Fonction pour mélanger les compétences de manière équilibrée
function shuffleCompetencies(competencies: LearningCompetency[], weekNumber: number): LearningCompetency[] {
  // Utiliser le numéro de semaine comme seed pour un mélange prévisible
  const shuffled = [...competencies];
  const seed = weekNumber;
  
  // Algorithme de mélange simple basé sur le seed
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (seed + i) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

// Fonction pour obtenir les matières disponibles par niveau
function getAvailableSubjects() {
  const subjects = [
    { key: 'FRANCAIS', title: 'Français', weeklyFrequency: 5 },
    { key: 'MATHEMATIQUES', title: 'Mathématiques', weeklyFrequency: 5 },
    { key: 'SCIENCES', title: 'Sciences', weeklyFrequency: 3 },
    { key: 'HISTOIRE', title: 'Univers social', weeklyFrequency: 2 },
    { key: 'ARTS', title: 'Arts', weeklyFrequency: 2 },
    { key: 'EDUCATION_PHYSIQUE', title: 'ÉPS', weeklyFrequency: 2 },
    { key: 'ETHIQUE_CULTURE_RELIGIEUSE', title: 'CCQ', weeklyFrequency: 1 }
  ];

  return subjects;
}

// Fonction utilitaire pour convertir les niveaux existants en GradeKey
function convertNiveauToGradeKey(niveauScolaire: string | null): GradeKey {
  if (!niveauScolaire) return 'P1';

  const mapping: Record<string, GradeKey> = {
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

// Fonction utilitaire pour convertir GradeKey en niveau scolaire
function convertGradeKeyToNiveau(gradeKey: string | null): string {
  if (!gradeKey) return 'PRIMAIRE_1';

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

  return mapping[gradeKey] || 'PRIMAIRE_1';
}
