import { NextRequest, NextResponse } from 'next/server';
import { db } from '@profs-academie/db';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET - Récupérer les enfants d'un parent
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const parentId = searchParams.get('parentId');

    if (!parentId) {
      return NextResponse.json(
        { error: 'ID du parent requis' },
        { status: 400 }
      );
    }

    // Récupérer le foyer du parent
    const foyer = await db.foyer.findFirst({
      where: {
        users: {
          some: {
            id: parentId
          }
        }
      },
      include: {
        enfants: {
          orderBy: {
            prenom: 'asc'
          }
        }
      }
    });

    if (!foyer) {
      return NextResponse.json(
        { error: 'Foyer non trouvé pour ce parent' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      enfants: foyer.enfants || [] 
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des enfants:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des enfants' },
      { status: 500 }
    );
  }
}
