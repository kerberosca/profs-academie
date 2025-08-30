import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { db } from "@profs-academie/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation de base
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    // Trouver l'utilisateur
    const user = await db.user.findUnique({
      where: { email },
      include: {
        foyer: {
          include: {
            enfants: true
          }
        },
        profilProf: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    if (!user.motDePasseHash) {
      return NextResponse.json(
        { error: "Compte non configuré" },
        { status: 401 }
      );
    }

    const isPasswordValid = await compare(password, user.motDePasseHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Extraire le prénom du nom complet
    const nomComplet = user.nom;
    const prenom = nomComplet.split(' ')[0]; // Premier mot = prénom
    
    // Préparer les données de réponse selon le rôle
    let userData: any = {
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: prenom,
      role: user.role,
      locale: user.locale,
      fuseau: user.fuseau,
      verifiedAt: user.verifiedAt,
    };

    // Ajouter des données spécifiques selon le rôle
    switch (user.role) {
      case "PARENT":
        userData.foyer = user.foyer;
        break;
      case "TEACHER":
        userData.profilProf = user.profilProf;
        break;
      case "CHILD":
        // Pour les enfants, on pourrait ajouter des données spécifiques
        break;
    }

    return NextResponse.json({
      message: "Connexion réussie",
      user: userData
    });

  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
