import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@profs-academie/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, userType, phone, city, specialty, experience, birthDate, grade, parentEmail } = body;

    // Validation de base
    if (!email || !password || !firstName || !lastName || !userType) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un utilisateur avec cet email existe déjà" },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await hash(password, 12);

    // Déterminer le rôle
    let role: "PARENT" | "TEACHER" | "CHILD";
    switch (userType) {
      case "parent":
        role = "PARENT";
        break;
      case "teacher":
      case "enseignant":
        role = "TEACHER";
        break;
      case "child":
        role = "CHILD";
        break;
      default:
        return NextResponse.json(
          { error: "Type d'utilisateur invalide" },
          { status: 400 }
        );
    }

    // Créer l'utilisateur
    const user = await db.user.create({
      data: {
        email,
        motDePasseHash: hashedPassword,
        nom: `${firstName} ${lastName}`,
        role,
        locale: "fr-CA",
        fuseau: "America/Montreal",
        verifiedAt: new Date(),
      }
    });

    // Si c'est un parent, créer un foyer
    if (role === "PARENT") {
      await db.foyer.create({
        data: {
          nom: `${firstName} ${lastName}`,
          parentId: user.id,
        }
      });
    }

    // Si c'est un enseignant, créer un profil prof
    if (role === "TEACHER") {
      await db.profilProf.create({
        data: {
          userId: user.id,
          bio: specialty || "",
          statut: "PENDING",
        }
      });
    }

    // Si c'est un enfant, vérifier que le parent existe et l'ajouter au foyer
    if (role === "CHILD" && parentEmail) {
      const parent = await db.user.findUnique({
        where: { email: parentEmail },
        include: { foyer: true }
      });

      if (!parent || parent.role !== "PARENT") {
        // Supprimer l'enfant créé
        await db.user.delete({ where: { id: user.id } });
        return NextResponse.json(
          { error: "Email du parent invalide ou parent non trouvé" },
          { status: 400 }
        );
      }

      // Créer l'enfant dans le foyer du parent
      if (parent.foyer) {
        await db.enfant.create({
          data: {
            prenom: firstName,
            anneeNaissance: new Date(birthDate).getFullYear(),
            pinHash: await hash("1234", 12), // PIN par défaut
            foyerId: parent.foyer.id,
          }
        });
      }
    }

    return NextResponse.json(
      { 
        message: "Utilisateur créé avec succès",
        user: {
          id: user.id,
          email: user.email,
          nom: user.nom,
          role: user.role
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
