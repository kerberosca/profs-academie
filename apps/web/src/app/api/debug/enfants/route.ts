import { NextRequest, NextResponse } from "next/server";
import { db } from "@profs-academie/db";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Récupérer tous les foyers
    const foyers = await db.foyer.findMany({
      include: {
        parent: true,
        enfants: true
      }
    });

    // Récupérer tous les enfants
    const enfants = await db.enfant.findMany({
      include: {
        foyer: {
          include: {
            parent: true
          }
        }
      }
    });

    // Récupérer tous les parents (utilisateurs avec rôle PARENT)
    const parents = await db.user.findMany({
      where: {
        role: 'PARENT'
      },
      include: {
        foyer: {
          include: {
            enfants: true
          }
        }
      }
    });

    return NextResponse.json({
      foyers,
      enfants,
      parents,
      stats: {
        totalFoyers: foyers.length,
        totalEnfants: enfants.length,
        totalParents: parents.length
      }
    });

  } catch (error) {
    console.error('Erreur debug:', error);
    return NextResponse.json(
      { error: 'Erreur lors du debug' },
      { status: 500 }
    );
  }
}
