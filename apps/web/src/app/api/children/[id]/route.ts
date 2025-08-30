import { NextRequest, NextResponse } from "next/server";
import { db } from "@profs-academie/db";
import { GradeKey, GRADE_LABELS } from "../../../../types/lms";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID de l\'enfant requis' },
        { status: 400 }
      );
    }

    // Récupérer l'enfant depuis la base de données
    const enfant = await db.enfant.findUnique({
      where: { id },
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

    // Convertir le niveau scolaire en GradeKey
    const gradeKey = convertNiveauToGradeKey(enfant.niveauScolaire);

    // Transformer en format Child
    const child = {
      id: enfant.id,
      firstName: enfant.prenom,
      lastName: enfant.nom || '',
      grade: gradeKey,
      birthYear: enfant.anneeNaissance
    };

    return NextResponse.json(child);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'enfant:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'enfant' },
      { status: 500 }
    );
  }
}

// Fonction utilitaire pour convertir les niveaux existants en GradeKey
function convertNiveauToGradeKey(niveauScolaire: string | null): GradeKey {
  if (!niveauScolaire) return 'P1'; // Valeur par défaut

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
