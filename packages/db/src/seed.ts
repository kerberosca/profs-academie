import { db } from "./db";
import { hashPassword, hashPin } from "./auth";
import { Prisma } from "@prisma/client";

async function main() {
  console.log("🌱 Début du seeding...");

  // Nettoyer la base de données
  await db.auditLog.deleteMany();
  await db.consentement.deleteMany();
  await db.soumission.deleteMany();
  await db.progression.deleteMany();
  await db.question.deleteMany();
  await db.quiz.deleteMany();
  await db.lecon.deleteMany();
  await db.module.deleteMany();
  await db.cours.deleteMany();
  await db.enfant.deleteMany();
  await db.foyer.deleteMany();
  await db.profilProf.deleteMany();
  await db.abonnement.deleteMany();
  await db.plan.deleteMany();
  await db.user.deleteMany();

  // Créer les plans d'abonnement
  const plans = await Promise.all([
    db.plan.create({
      data: {
        key: "essentiel",
        nom: "Essentiel",
        prixCents: 1999, // 19.99$
        intervalle: "MONTH",
        nbEnfants: 1,
        description: "Parfait pour commencer l'apprentissage",
        features: ["1 enfant", "Accès à tous les cours", "Suivi de progression", "Support par email"],
      },
    }),
    db.plan.create({
      data: {
        key: "famille",
        nom: "Famille",
        prixCents: 3999, // 39.99$
        intervalle: "MONTH",
        nbEnfants: 5,
        description: "Idéal pour les familles nombreuses",
        features: ["Jusqu'à 5 enfants", "Accès à tous les cours", "Suivi de progression", "Support prioritaire"],
      },
    }),
    db.plan.create({
      data: {
        key: "prof",
        nom: "Prof Créateur",
        prixCents: 999, // 9.99$
        intervalle: "MONTH",
        nbEnfants: 10,
        description: "Pour les enseignants qui veulent créer du contenu",
        features: ["Jusqu'à 10 enfants", "Studio de création", "Publier des cours", "Analytics avancées"],
      },
    }),
  ]);

  console.log("✅ Plans créés");

  // Créer l'admin
  const adminPassword = await hashPassword("admin123");
  const admin = await db.user.create({
    data: {
      email: "admin@profsacademie.ca",
      motDePasseHash: adminPassword,
      nom: "Administrateur",
      role: "ADMIN",
      verifiedAt: new Date(),
    },
  });

  console.log("✅ Admin créé");

  // Créer un enseignant
  const profPassword = await hashPassword("prof123");
  const prof = await db.user.create({
    data: {
      email: "prof@profsacademie.ca",
      motDePasseHash: profPassword,
      nom: "Marie Dubois",
      role: "TEACHER",
      verifiedAt: new Date(),
      profilProf: {
        create: {
          statut: "APPROVED",
          bio: "Enseignante passionnée de mathématiques avec 10 ans d'expérience",
        },
      },
    },
  });

  console.log("✅ Enseignant créé");

  // Créer un parent avec foyer et enfants
  const parentPassword = await hashPassword("parent123");
  const parent = await db.user.create({
    data: {
      email: "parent@profsacademie.ca",
      motDePasseHash: parentPassword,
      nom: "Jean Tremblay",
      role: "PARENT",
      verifiedAt: new Date(),
      foyer: {
        create: {
          nom: "Famille Tremblay",
        },
      },
    },
  });

  const foyer = await db.foyer.findUnique({
    where: { parentId: parent.id },
  });

  if (!foyer) throw new Error("Foyer non trouvé");

  // Créer les enfants
  const enfant1Pin = await hashPin("1234");
  const enfant2Pin = await hashPin("5678");

  const [enfant1, enfant2] = await Promise.all([
    db.enfant.create({
      data: {
        prenom: "Emma",
        anneeNaissance: 2015,
        pinHash: enfant1Pin,
        foyerId: foyer.id,
      },
    }),
    db.enfant.create({
      data: {
        prenom: "Lucas",
        anneeNaissance: 2018,
        pinHash: enfant2Pin,
        foyerId: foyer.id,
      },
    }),
  ]);

  console.log("✅ Parent et enfants créés");

  // Créer un abonnement pour le parent
  await db.abonnement.create({
    data: {
      userId: parent.id,
      planId: plans[1].id, // Plan Famille
      statut: "ACTIVE",
      finPeriode: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
    },
  });

  console.log("✅ Abonnement créé");

  // Créer un cours de démonstration
  const cours = await db.cours.create({
    data: {
      titre: "Introduction aux Mathématiques - Niveau Primaire",
      slug: "math-primaire-intro",
      matiere: "Mathématiques",
      niveau: "Primaire",
      resume: "Un cours complet pour maîtriser les bases des mathématiques au primaire",
      statut: "PUBLISHED",
      auteurId: prof.id,
    },
  });

  // Créer les modules
  const [module1, module2] = await Promise.all([
    db.module.create({
      data: {
        titre: "Les Nombres",
        ordre: 1,
        coursId: cours.id,
      },
    }),
    db.module.create({
      data: {
        titre: "Les Opérations",
        ordre: 2,
        coursId: cours.id,
      },
    }),
  ]);

  // Créer les leçons
  const lecons = await Promise.all([
    db.lecon.create({
      data: {
        titre: "Compter jusqu'à 100",
        slug: "compter-100",
        mdx: `# Compter jusqu'à 100

Bienvenue dans cette leçon sur les nombres !

## Objectifs d'apprentissage
- Reconnaître les nombres de 1 à 100
- Compter par dizaines
- Écrire les nombres en chiffres

## Activité interactive
Comptons ensemble : 1, 2, 3, 4, 5...

### Exercice
Complétez la suite : 10, 20, 30, ___, 50

**Réponse : 40**

## Résumé
Vous savez maintenant compter jusqu'à 100 !`,
        dureeMin: 15,
        ordre: 1,
        moduleId: module1.id,
      },
    }),
    db.lecon.create({
      data: {
        titre: "L'addition simple",
        slug: "addition-simple",
        mdx: `# L'addition simple

## Qu'est-ce que l'addition ?
L'addition, c'est quand on ajoute des nombres ensemble.

### Exemple
2 + 3 = 5

## Règles importantes
- On peut additionner dans n'importe quel ordre
- 2 + 3 = 3 + 2 = 5

## Exercices pratiques
1. 4 + 5 = ?
2. 7 + 2 = ?
3. 1 + 9 = ?

**Réponses : 9, 9, 10**`,
        dureeMin: 20,
        ordre: 2,
        moduleId: module1.id,
      },
    }),
    db.lecon.create({
      data: {
        titre: "La soustraction",
        slug: "soustraction",
        mdx: `# La soustraction

## Définition
La soustraction, c'est l'opération inverse de l'addition.

### Exemple
5 - 2 = 3

## Astuce
Pensez à l'addition : 3 + 2 = 5, donc 5 - 2 = 3

## Exercices
1. 8 - 3 = ?
2. 10 - 4 = ?
3. 7 - 1 = ?

**Réponses : 5, 6, 6**`,
        dureeMin: 18,
        ordre: 1,
        moduleId: module2.id,
      },
    }),
    db.lecon.create({
      data: {
        titre: "Les tables de multiplication",
        slug: "multiplication",
        mdx: `# Les tables de multiplication

## Table de 2
2 × 1 = 2
2 × 2 = 4
2 × 3 = 6
2 × 4 = 8
2 × 5 = 10

## Table de 5
5 × 1 = 5
5 × 2 = 10
5 × 3 = 15
5 × 4 = 20
5 × 5 = 25

## Exercice
Complétez : 2 × 6 = ___

**Réponse : 12**`,
        dureeMin: 25,
        ordre: 2,
        moduleId: module2.id,
      },
    }),
  ]);

  console.log("✅ Cours et leçons créés");

  // Créer des quiz
  const quiz1 = await db.quiz.create({
    data: {
      titre: "Quiz sur les nombres",
      ordre: 1,
      leconId: lecons[0].id,
    },
  });

  const quiz2 = await db.quiz.create({
    data: {
      titre: "Quiz sur l'addition",
      ordre: 1,
      leconId: lecons[1].id,
    },
  });

  // Créer les questions
  await Promise.all([
    // Questions pour le quiz 1
    db.question.create({
      data: {
        type: "SINGLE",
        enonce: "Quel nombre vient après 25 ?",
        options: ["24", "25", "26", "27"],
        cleReponse: "26",
        ordre: 1,
        quizId: quiz1.id,
      },
    }),
    db.question.create({
      data: {
        type: "MULTIPLE",
        enonce: "Quels sont les nombres pairs ?",
        options: ["2", "3", "4", "5", "6"],
        cleReponse: ["2", "4", "6"],
        ordre: 2,
        quizId: quiz1.id,
      },
    }),
    db.question.create({
      data: {
        type: "SHORT",
        enonce: "Écrivez le nombre qui vient après 99",
        cleReponse: "100",
        ordre: 3,
        quizId: quiz1.id,
      },
    }),
    // Questions pour le quiz 2
    db.question.create({
      data: {
        type: "SINGLE",
        enonce: "Combien font 7 + 3 ?",
        options: ["8", "9", "10", "11"],
        cleReponse: "10",
        ordre: 1,
        quizId: quiz2.id,
      },
    }),
    db.question.create({
      data: {
        type: "SINGLE",
        enonce: "Quel est le résultat de 5 + 5 ?",
        options: ["9", "10", "11", "12"],
        cleReponse: "10",
        ordre: 2,
        quizId: quiz2.id,
      },
    }),
  ]);

  console.log("✅ Quiz et questions créés");

  // Créer quelques progressions pour Emma
  await Promise.all([
    db.progression.create({
      data: {
        enfantId: enfant1.id,
        leconId: lecons[0].id,
        complete: true,
        secondesPassees: 900, // 15 minutes
        dernierAcces: new Date(),
      },
    }),
    db.progression.create({
      data: {
        enfantId: enfant1.id,
        leconId: lecons[1].id,
        complete: false,
        secondesPassees: 600, // 10 minutes
        dernierAcces: new Date(),
      },
    }),
  ]);

  console.log("✅ Progressions créées");

  // Créer des consentements
  await Promise.all([
    db.consentement.create({
      data: {
        type: "PRIVACY_POLICY",
        userId: parent.id,
      },
    }),
    db.consentement.create({
      data: {
        type: "TERMS_OF_SERVICE",
        userId: parent.id,
      },
    }),
    db.consentement.create({
      data: {
        type: "COOKIES",
        userId: parent.id,
      },
    }),
  ]);

  console.log("✅ Consentements créés");

  console.log("🎉 Seeding terminé avec succès !");
  console.log("\n📋 Comptes de test créés :");
  console.log("👨‍💼 Admin: admin@profsacademie.ca / admin123");
  console.log("👩‍🏫 Prof: prof@profsacademie.ca / prof123");
  console.log("👨‍👩‍👧‍👦 Parent: parent@profsacademie.ca / parent123");
  console.log("👧 Emma (enfant): PIN 1234");
  console.log("👦 Lucas (enfant): PIN 5678");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
