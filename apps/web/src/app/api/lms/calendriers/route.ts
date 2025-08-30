import { NextRequest, NextResponse } from 'next/server';
import { db } from '@profs-academie/db';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET - Récupérer les calendriers d'un parent
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const parentId = searchParams.get('parentId');
    const enfantId = searchParams.get('enfantId');

    if (!parentId) {
      return NextResponse.json(
        { error: 'ID du parent requis' },
        { status: 400 }
      );
    }

    const where: any = { parentId };
    if (enfantId) {
      where.enfantId = enfantId;
    }

    const calendriers = await db.calendrierEtude.findMany({
      where,
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
          include: {
            cours: {
              select: {
                id: true,
                titre: true,
                matiere: true,
                niveauScolaire: true
              }
            }
          },
          orderBy: {
            dateDebut: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ calendriers });
  } catch (error) {
    console.error('Erreur lors de la récupération des calendriers:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des calendriers' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau calendrier d'études
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nom, description, enfantId, parentId } = body;

    if (!nom || !enfantId || !parentId) {
      return NextResponse.json(
        { error: 'Nom, enfantId et parentId sont requis' },
        { status: 400 }
      );
    }

    const calendrier = await db.calendrierEtude.create({
      data: {
        nom,
        description,
        enfantId,
        parentId
      },
      include: {
        enfant: {
          select: {
            id: true,
            prenom: true,
            nom: true,
            niveauScolaire: true
          }
        }
      }
    });

    return NextResponse.json({ calendrier }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du calendrier:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du calendrier' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un calendrier d'études
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const calendrierId = searchParams.get('id');
    const parentId = searchParams.get('parentId');

    if (!calendrierId || !parentId) {
      return NextResponse.json(
        { error: 'ID du calendrier et ID du parent sont requis' },
        { status: 400 }
      );
    }

    // Vérifier que le calendrier appartient au parent
    const calendrier = await db.calendrierEtude.findFirst({
      where: {
        id: calendrierId,
        parentId: parentId
      }
    });

    if (!calendrier) {
      return NextResponse.json(
        { error: 'Calendrier non trouvé ou accès non autorisé' },
        { status: 404 }
      );
    }

    // Supprimer d'abord les sessions associées
    await db.sessionEtude.deleteMany({
      where: {
        calendrierId: calendrierId
      }
    });

    // Supprimer le calendrier
    await db.calendrierEtude.delete({
      where: {
        id: calendrierId
      }
    });

    return NextResponse.json({ 
      message: 'Calendrier supprimé avec succès',
      calendrierId 
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du calendrier:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du calendrier' },
      { status: 500 }
    );
  }
}
