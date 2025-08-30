import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@profs-academie/db";

// Fonction pour mapper les niveaux scolaires du frontend vers les enums Prisma
function mapGradeToNiveauScolaire(grade: string): string | null {
  const mapping: { [key: string]: string } = {
    "Maternelle": "MATERNELLE_5_ANS",
    "1ère année": "PRIMAIRE_1",
    "2ème année": "PRIMAIRE_2",
    "3ème année": "PRIMAIRE_3",
    "4ème année": "PRIMAIRE_4",
    "5ème année": "PRIMAIRE_5",
    "6ème année": "PRIMAIRE_6"
  };
  
  return mapping[grade] || null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, birthDate, grade, pin, parentId } = body;

    // Validation de base
    if (!firstName || !lastName || !birthDate || !grade || !pin || !parentId) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      );
    }

    // Mapper le niveau scolaire
    const niveauScolaire = mapGradeToNiveauScolaire(grade);
    if (!niveauScolaire) {
      return NextResponse.json(
        { error: "Niveau scolaire invalide" },
        { status: 400 }
      );
    }

    // Vérifier que le parent existe et a un foyer
    const parent = await db.user.findUnique({
      where: { id: parentId },
      include: { foyer: true }
    });

    if (!parent || parent.role !== "PARENT") {
      return NextResponse.json(
        { error: "Parent non trouvé ou non autorisé" },
        { status: 400 }
      );
    }

    if (!parent.foyer) {
      return NextResponse.json(
        { error: "Le parent n'a pas de foyer configuré" },
        { status: 400 }
      );
    }

    // Vérifier si un enfant avec ce prénom existe déjà dans ce foyer
    const existingChild = await db.enfant.findFirst({
      where: {
        prenom: firstName,
        foyerId: parent.foyer.id
      }
    });

    if (existingChild) {
      return NextResponse.json(
        { error: "Un enfant avec ce prénom existe déjà dans votre foyer" },
        { status: 400 }
      );
    }

    // Hasher le PIN
    const hashedPin = await hash(pin, 12);

    // Créer l'enfant
    const enfant = await db.enfant.create({
      data: {
        prenom: firstName,
        nom: lastName,
        anneeNaissance: new Date(birthDate).getFullYear(),
        niveauScolaire: niveauScolaire as any, // Cast pour éviter les erreurs TypeScript
        pinHash: hashedPin,
        foyerId: parent.foyer.id,
      }
    });

    return NextResponse.json(
      { 
        message: "Enfant ajouté avec succès",
        enfant: {
          id: enfant.id,
          prenom: enfant.prenom,
          nom: enfant.nom,
          anneeNaissance: enfant.anneeNaissance,
          niveauScolaire: enfant.niveauScolaire
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Erreur lors de l'ajout de l'enfant:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
