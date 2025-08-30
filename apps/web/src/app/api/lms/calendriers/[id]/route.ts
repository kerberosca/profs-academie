import { NextRequest, NextResponse } from 'next/server';
import { db } from '@profs-academie/db';

// GET - Récupérer un calendrier spécifique avec ses sessions
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const calendrier = await db.calendrierEtude.findUnique({
      where: { id },
      include: {
        enfant: {
          select: {
            id: true,
            prenom: true,
            nom: true,
            niveauScolaire: true
          }
        },
        sessions: {
          orderBy: { dateDebut: 'asc' }
        }
      }
    });

    if (!calendrier) {
      return NextResponse.json(
        { error: 'Calendrier non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ calendrier });
  } catch (error) {
    console.error('Erreur lors de la récupération du calendrier:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du calendrier' },
      { status: 500 }
    );
  }
}
