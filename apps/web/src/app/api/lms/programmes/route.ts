import { NextRequest, NextResponse } from 'next/server';
import { CalendrierGenerator } from '../../../../lib/calendrier-generator';
import { db } from '@profs-academie/db';
import { NiveauScolaire } from '../../../../types/lms';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const niveauScolaire = searchParams.get('niveauScolaire') as NiveauScolaire;

    if (niveauScolaire) {
      const competences = await db.competence.findMany({
        where: { niveauScolaire },
        include: {
          contenusApprentissage: {
            orderBy: { ordre: 'asc' }
          }
        },
        orderBy: { ordre: 'asc' }
      });

      return NextResponse.json({ competences });
    }

    const competences = await db.competence.findMany({
      include: {
        contenusApprentissage: {
          orderBy: { ordre: 'asc' }
        }
      },
      orderBy: [
        { niveauScolaire: 'asc' },
        { ordre: 'asc' }
      ]
    });

    return NextResponse.json({ competences });
  } catch (error) {
    console.error('Erreur lors de la récupération des programmes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des programmes' },
      { status: 500 }
    );
  }
}

// POST - Créer un calendrier basé sur les compétences de la base de données
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      niveauScolaire,
      enfantId,
      parentId,
      dureeHebdomadaire = 300
    } = body;

    if (!niveauScolaire || !enfantId || !parentId) {
      return NextResponse.json(
        { error: 'niveauScolaire, enfantId et parentId sont requis' },
        { status: 400 }
      );
    }

    console.log('📚 Début de la génération du calendrier...');
    
    // Vérifier que des compétences existent pour ce niveau
    const competences = await CalendrierGenerator.getCompetences(niveauScolaire);
    
    if (competences.length === 0) {
      return NextResponse.json(
        { error: `Aucune compétence trouvée pour le niveau ${niveauScolaire}` },
        { status: 404 }
      );
    }

    console.log('📅 Génération du calendrier...');
    const calendrierId = await CalendrierGenerator.generateCalendrier(
      enfantId,
      parentId,
      niveauScolaire,
      dureeHebdomadaire
    );

    const calendrier = await db.calendrierEtude.findUnique({
      where: { id: calendrierId },
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

    return NextResponse.json({
      message: 'Calendrier créé avec succès basé sur le programme scolaire québécois',
      calendrier,
      structure: {
        competences: competences.length,
        contenus: competences.reduce((sum, comp) => sum + comp.contenusApprentissage.length, 0),
        matieres: [...new Set(competences.map(c => c.matiere))].length
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la génération du calendrier:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du calendrier' },
      { status: 500 }
    );
  }
}
