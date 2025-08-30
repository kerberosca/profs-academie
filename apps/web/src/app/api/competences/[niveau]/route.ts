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

    // Récupérer les compétences pour ce niveau
    const competences = await db.competence.findMany({
      where: { 
        niveauScolaire: niveau as any 
      },
      include: {
        contenusApprentissage: {
          orderBy: { ordre: 'asc' }
        }
      },
      orderBy: [
        { matiere: 'asc' },
        { ordre: 'asc' }
      ]
    });

    // Grouper par matière pour un affichage organisé
    const competencesParMatiere = competences.reduce((acc: Record<string, any[]>, competence) => {
      const matiere = competence.matiere;
      if (!acc[matiere]) {
        acc[matiere] = [];
      }
      acc[matiere].push({
        id: competence.id,
        nom: competence.nom,
        description: competence.description,
        ordre: competence.ordre,
        contenus: competence.contenusApprentissage.map((contenu: any) => ({
          id: contenu.id,
          nom: contenu.nom,
          description: contenu.description,
          dureeEstimee: contenu.dureeEstimee,
          ordre: contenu.ordre
        }))
      });
      return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json({
      niveau,
      competences: competencesParMatiere,
      total: competences.length,
      matieres: Object.keys(competencesParMatiere)
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des compétences:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des compétences' },
      { status: 500 }
    );
  }
}
