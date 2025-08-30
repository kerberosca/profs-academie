import { NextRequest, NextResponse } from 'next/server';
import { db } from '@profs-academie/db';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET - Récupérer tous les cours gouvernementaux avec filtres
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const matiere = searchParams.get('matiere');
    const niveauScolaire = searchParams.get('niveauScolaire');

    // Validation des paramètres
    if (niveauScolaire && !['MATERNELLE_5_ANS', 'PRIMAIRE_1', 'PRIMAIRE_2', 'PRIMAIRE_3', 'PRIMAIRE_4', 'PRIMAIRE_5', 'PRIMAIRE_6'].includes(niveauScolaire)) {
      return NextResponse.json(
        { error: 'Niveau scolaire invalide' },
        { status: 400 }
      );
    }

    const where: any = {};
    
    if (matiere) {
      where.matiere = matiere;
    }
    
    if (niveauScolaire) {
      where.niveauScolaire = niveauScolaire;
    }

    const cours = await db.coursGouvernemental.findMany({
      where,
      orderBy: {
        niveauScolaire: 'asc'
      },
      take: 100 // Limiter le nombre de résultats
    });

    return NextResponse.json({ cours });
  } catch (error) {
    console.error('Erreur lors de la récupération des cours gouvernementaux:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des cours' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau cours gouvernemental (admin seulement)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titre, description, matiere, niveauScolaire, urlPdf, urlComplementaire, dureeEstimee, competences } = body;

    const cours = await db.coursGouvernemental.create({
      data: {
        titre,
        description,
        matiere,
        niveauScolaire,
        urlPdf,
        urlComplementaire,
        dureeEstimee,
        competences: competences || []
      }
    });

    return NextResponse.json({ cours }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du cours gouvernemental:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du cours' },
      { status: 500 }
    );
  }
}
