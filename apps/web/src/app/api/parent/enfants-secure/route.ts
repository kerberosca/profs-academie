import { NextRequest, NextResponse } from "next/server";
import { db } from "@profs-academie/db";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Récupérer les données utilisateur depuis les cookies ou headers
    const userDataHeader = request.headers.get('x-user-data');
    let userData;

    if (userDataHeader) {
      try {
        userData = JSON.parse(userDataHeader);
      } catch (error) {
        console.error('Erreur parsing user data:', error);
        return NextResponse.json(
          { error: 'Données utilisateur invalides' },
          { status: 401 }
        );
      }
    }

    if (!userData) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }

    // Vérifier que l'utilisateur est bien un parent
    if (userData.role !== 'PARENT') {
      return NextResponse.json(
        { error: 'Accès non autorisé - Rôle parent requis' },
        { status: 403 }
      );
    }

    console.log('Recherche des enfants pour le parent:', userData.id);

    // Récupérer le foyer du parent connecté
    const foyer = await db.foyer.findFirst({
      where: {
        parentId: userData.id
      }
    });

    console.log('Foyer trouvé:', foyer);

    if (!foyer) {
      console.log('Aucun foyer trouvé pour le parent:', userData.id);
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

    console.log('Enfants trouvés:', enfants.length);

    // Transformer les données pour l'interface
    const enfantsFormatted = enfants.map(enfant => ({
      id: enfant.id,
      prenom: enfant.prenom,
      nom: enfant.nom || '',
      niveauScolaire: enfant.niveauScolaire,
      foyerId: enfant.foyerId,
      parentId: enfant.foyer?.parentId
    }));

    return NextResponse.json({ 
      enfants: enfantsFormatted,
      total: enfantsFormatted.length,
      parentId: userData.id,
      message: 'Données récupérées avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des enfants:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des enfants' },
      { status: 500 }
    );
  }
}
