import { NextRequest, NextResponse } from "next/server";
import { db } from "@profs-academie/db";
import { GradeKey } from "../../../types/lms";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const grade = searchParams.get('grade') as GradeKey;

    if (!grade) {
      return NextResponse.json(
        { error: 'Paramètre grade requis' },
        { status: 400 }
      );
    }

    // Convertir le GradeKey en niveau scolaire pour la requête
    const niveauScolaire = convertGradeKeyToNiveau(grade);

    // Récupérer les cours gouvernementaux pour ce niveau
    const coursGouvernementaux = await db.coursGouvernemental.findMany({
      where: {
        niveauScolaire: niveauScolaire
      },
      orderBy: {
        titre: 'asc'
      }
    });

    // Transformer en format Course
    const courses = coursGouvernementaux.map(cours => ({
      id: cours.id,
      title: cours.titre,
      slug: cours.titre.toLowerCase().replace(/\s+/g, '-'),
      gradeKeys: [grade], // Pour l'instant, un cours n'est associé qu'à un niveau
      durationMinutes: cours.dureeEstimee || 60,
      weeklyFrequency: getWeeklyFrequency(cours.matiere),
      description: cours.description,
      subject: cours.matiere
    }));

    // Si pas de cours dans la base, créer des cours par défaut
    if (courses.length === 0) {
      const defaultCourses = getDefaultCourses(grade);
      return NextResponse.json({ courses: defaultCourses });
    }

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Erreur lors de la récupération des cours:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des cours' },
      { status: 500 }
    );
  }
}

// Fonction utilitaire pour convertir GradeKey en niveau scolaire
function convertGradeKeyToNiveau(gradeKey: GradeKey): string {
  const mapping: Record<GradeKey, string> = {
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

// Fonction pour déterminer la fréquence hebdomadaire par matière
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

// Fonction pour créer des cours par défaut si la base est vide
function getDefaultCourses(grade: GradeKey) {
  const defaultCourses = [
    {
      id: 'francais-' + grade,
      title: 'Français',
      slug: 'francais',
      gradeKeys: [grade],
      durationMinutes: 60,
      weeklyFrequency: 5,
      description: 'Apprentissage de la langue française',
      subject: 'FRANCAIS'
    },
    {
      id: 'mathematiques-' + grade,
      title: 'Mathématiques',
      slug: 'mathematiques',
      gradeKeys: [grade],
      durationMinutes: 60,
      weeklyFrequency: 5,
      description: 'Apprentissage des mathématiques',
      subject: 'MATHEMATIQUES'
    },
    {
      id: 'sciences-' + grade,
      title: 'Sciences',
      slug: 'sciences',
      gradeKeys: [grade],
      durationMinutes: 60,
      weeklyFrequency: 3,
      description: 'Découverte des sciences',
      subject: 'SCIENCES'
    },
    {
      id: 'univers-social-' + grade,
      title: 'Univers social',
      slug: 'univers-social',
      gradeKeys: [grade],
      durationMinutes: 60,
      weeklyFrequency: 2,
      description: 'Histoire et géographie',
      subject: 'HISTOIRE'
    },
    {
      id: 'arts-' + grade,
      title: 'Arts',
      slug: 'arts',
      gradeKeys: [grade],
      durationMinutes: 60,
      weeklyFrequency: 2,
      description: 'Expression artistique',
      subject: 'ARTS'
    },
    {
      id: 'eps-' + grade,
      title: 'ÉPS',
      slug: 'eps',
      gradeKeys: [grade],
      durationMinutes: 60,
      weeklyFrequency: 2,
      description: 'Éducation physique et sportive',
      subject: 'EDUCATION_PHYSIQUE'
    },
    {
      id: 'ccq-' + grade,
      title: 'CCQ',
      slug: 'ccq',
      gradeKeys: [grade],
      durationMinutes: 60,
      weeklyFrequency: 1,
      description: 'Éthique et culture religieuse',
      subject: 'ETHIQUE_CULTURE_RELIGIEUSE'
    }
  ];

  return defaultCourses;
}
