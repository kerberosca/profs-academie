import { NextRequest, NextResponse } from 'next/server';
import { db } from '@profs-academie/db';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Récupérer l'ID du parent depuis les paramètres de requête
    const { searchParams } = request.nextUrl;
    const parentId = searchParams.get('parentId');
    
    if (!parentId) {
      return NextResponse.json(
        { error: 'ID du parent requis' },
        { status: 400 }
      );
    }

    // Récupérer le foyer du parent connecté
    const foyer = await db.foyer.findFirst({
      where: {
        parentId: parentId
      }
    });

    if (!foyer) {
      return NextResponse.json({ enfants: [], total: 0 });
    }

    // Récupérer uniquement les enfants du foyer du parent connecté
    const enfants = await db.enfant.findMany({
      where: {
        foyerId: foyer.id
      },
      include: {
        foyer: {
          include: {
            parent: true
          }
        }
      },
      orderBy: {
        prenom: 'asc'
      }
    });

    // Transformer les données pour l'interface
    const enfantsFormatted = enfants.map((enfant: any) => ({
      id: enfant.id,
      prenom: enfant.prenom,
      nom: enfant.nom || '',
      niveauScolaire: enfant.niveauScolaire,
      foyerId: enfant.foyerId,
      parentId: enfant.foyer?.parentId
    }));

    return NextResponse.json({ 
      enfants: enfantsFormatted,
      total: enfantsFormatted.length 
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des enfants:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des enfants' },
      { status: 500 }
    );
  }
}
