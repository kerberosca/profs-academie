import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { db } from "@profs-academie/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prenom, pin, parentId } = body;

    if (!prenom || !pin) {
      return NextResponse.json({ error: "Prénom et PIN requis" }, { status: 400 });
    }

    // Vérifier que le parentId est fourni pour la sécurité
    if (!parentId) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    // Trouver l'enfant par prénom ET vérifier qu'il appartient au parent
    const enfant = await db.enfant.findFirst({
      where: { 
        prenom,
        foyer: {
          parentId: parentId
        }
      },
      include: { 
        foyer: { 
          include: { 
            parent: true 
          } 
        } 
      }
    });

    if (!enfant) {
      return NextResponse.json({ error: "Enfant non trouvé dans votre foyer" }, { status: 404 });
    }

    if (!enfant.pinHash || !(await compare(pin, enfant.pinHash))) {
      return NextResponse.json({ error: "PIN incorrect" }, { status: 401 });
    }

    // Vérifier que l'enfant appartient bien au parent connecté
    if (enfant.foyer?.parentId !== parentId) {
      return NextResponse.json({ error: "Accès non autorisé à cet enfant" }, { status: 403 });
    }

    // Créer les données de l'enfant pour la session
    const childData = {
      id: enfant.id,
      prenom: enfant.prenom,
      anneeNaissance: enfant.anneeNaissance,
      niveauScolaire: enfant.niveauScolaire,
      role: "CHILD" as const,
      foyer: enfant.foyer,
      parent: enfant.foyer?.parent,
      parentId: parentId // Garder une trace du parent
    };

    return NextResponse.json({ 
      message: "Connexion réussie", 
      user: childData 
    });
  } catch (error) {
    console.error("Erreur lors de la connexion enfant:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
