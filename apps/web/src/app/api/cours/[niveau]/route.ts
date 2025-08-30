import { NextRequest, NextResponse } from "next/server";
import { db } from "@profs-academie/db";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { niveau: string } }
) {
  try {
    const { niveau } = params;

    // Validation du niveau
    const niveauxValides = [
      'MATERNELLE_4_ANS', 'MATERNELLE_5_ANS',
      'PRIMAIRE_1', 'PRIMAIRE_2', 'PRIMAIRE_3', 'PRIMAIRE_4', 'PRIMAIRE_5', 'PRIMAIRE_6',
      'SECONDAIRE_1', 'SECONDAIRE_2', 'SECONDAIRE_3', 'SECONDAIRE_4', 'SECONDAIRE_5'
    ];

    if (!niveauxValides.includes(niveau)) {
      return NextResponse.json(
        { error: 'Niveau scolaire invalide' },
        { status: 400 }
      );
    }

    // Récupérer les cours gouvernementaux pour ce niveau
    const cours = await db.coursGouvernemental.findMany({
      where: { 
        niveauScolaire: niveau as any 
      },
      orderBy: [
        { matiere: 'asc' },
        { titre: 'asc' }
      ]
    });

    // Grouper par matière pour un affichage organisé
    const coursParMatiere = cours.reduce((acc: Record<string, any[]>, coursItem) => {
      const matiere = coursItem.matiere;
      if (!acc[matiere]) {
        acc[matiere] = [];
      }
      acc[matiere].push({
        id: coursItem.id,
        titre: coursItem.titre,
        description: coursItem.description,
        dureeEstimee: coursItem.dureeEstimee,
        competences: coursItem.competences,
        urlPdf: coursItem.urlPdf,
        urlComplementaire: coursItem.urlComplementaire
      });
      return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json({
      niveau,
      cours: coursParMatiere,
      total: cours.length,
      matieres: Object.keys(coursParMatiere)
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des cours:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des cours' },
      { status: 500 }
    );
  }
}
