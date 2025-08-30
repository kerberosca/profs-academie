import { NextRequest, NextResponse } from 'next/server';
import { db } from '@profs-academie/db';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET - Récupérer les sessions d'un calendrier
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const calendrierId = searchParams.get('calendrierId');
    const dateDebut = searchParams.get('dateDebut');
    const dateFin = searchParams.get('dateFin');

    if (!calendrierId) {
      return NextResponse.json(
        { error: 'ID du calendrier requis' },
        { status: 400 }
      );
    }

    const where: any = { calendrierId };
    
    if (dateDebut && dateFin) {
      where.dateDebut = {
        gte: new Date(dateDebut),
        lte: new Date(dateFin)
      };
    }

    const sessions = await db.sessionEtude.findMany({
      where,
      include: {
        cours: {
          select: {
            id: true,
            titre: true,
            matiere: true,
            niveauScolaire: true,
            dureeEstimee: true
          }
        }
      },
      orderBy: {
        dateDebut: 'asc'
      }
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Erreur lors de la récupération des sessions:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des sessions' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle session d'étude
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      titre, 
      description, 
      dateDebut, 
      dateFin, 
      dureePlanifiee, 
      calendrierId, 
      coursId, 
      typeCours,
      notes 
    } = body;

    if (!titre || !dateDebut || !dureePlanifiee || !calendrierId || !typeCours) {
      return NextResponse.json(
        { error: 'Titre, dateDebut, dureePlanifiee, calendrierId et typeCours sont requis' },
        { status: 400 }
      );
    }

    const session = await db.sessionEtude.create({
      data: {
        titre,
        description,
        dateDebut: new Date(dateDebut),
        dateFin: dateFin ? new Date(dateFin) : null,
        dureePlanifiee,
        calendrierId,
        coursId,
        typeCours,
        notes
      },
      include: {
        cours: {
          select: {
            id: true,
            titre: true,
            matiere: true,
            niveauScolaire: true
          }
        }
      }
    });

    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la session:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une session d'étude
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      id,
      titre, 
      description, 
      dateDebut, 
      dateFin, 
      dureePlanifiee, 
      coursId, 
      typeCours,
      statut,
      notes 
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID de la session requis' },
        { status: 400 }
      );
    }

    const session = await db.sessionEtude.update({
      where: { id },
      data: {
        titre,
        description,
        dateDebut: dateDebut ? new Date(dateDebut) : undefined,
        dateFin: dateFin ? new Date(dateFin) : undefined,
        dureePlanifiee,
        coursId,
        typeCours,
        statut,
        notes
      },
      include: {
        cours: {
          select: {
            id: true,
            titre: true,
            matiere: true,
            niveauScolaire: true
          }
        }
      }
    });

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la session:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la session' },
      { status: 500 }
    );
  }
}
