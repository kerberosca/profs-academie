# Profs Académie 🎓

Plateforme éducative québécoise construite avec Next.js 15, TypeScript et Prisma.

## 🚀 Fonctionnalités

- **Authentification complète** : Inscription, connexion, gestion des rôles (ADMIN, STAFF, TEACHER, PARENT, CHILD)
- **Gestion des foyers** : Parents peuvent créer des profils pour leurs enfants
- **LMS complet** : Cours, modules, leçons, quiz interactifs
- **Studio enseignant** : Création et édition de cours avec éditeur MDX
- **Paiements Stripe** : Abonnements mensuels/annuels avec taxes canadiennes
- **Suivi de progression** : Analytics détaillées pour parents et enseignants
- **Interface adaptée aux enfants** : Design ludique et gamifié
- **Internationalisation** : Support fr-CA et en-CA
- **Sécurité** : RGPD, chiffrement, contrôle parental

## 🛠️ Stack Technologique

- **Frontend** : Next.js 15 (App Router) + TypeScript
- **UI** : Tailwind CSS + shadcn/ui + Radix UI
- **Base de données** : PostgreSQL + Prisma ORM
- **Authentification** : NextAuth.js avec RBAC
- **Paiements** : Stripe (abonnements, taxes canadiennes)
- **Email** : Resend + react-email
- **État** : React Query + Zod validation
- **Monorepo** : Turborepo + pnpm workspaces

## 📋 Prérequis

- Node.js 18+ 
- pnpm 8+
- Docker et Docker Compose
- PostgreSQL (via Docker)

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/votre-username/profs-academie.git
cd profs-academie
```

### 2. Installer les dépendances

```bash
pnpm install
```

### 3. Configuration de l'environnement

```bash
cp env.example .env
```

Éditez le fichier `.env` avec vos clés API :

```env
# Base de données
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/profs_academie"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-nextauth"

# Stripe (optionnel pour le développement)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (optionnel pour le développement)
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@profsacademie.ca"
```

### 4. Démarrer la base de données

```bash
docker-compose up db -d
```

### 5. Configurer la base de données

```bash
# Générer le client Prisma
pnpm db:generate

# Exécuter les migrations
pnpm db:migrate

# Seeder avec les données de démonstration
pnpm db:seed
```

### 6. Démarrer l'application

```bash
pnpm dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 👥 Comptes de test

Après le seeding, vous pouvez utiliser ces comptes :

### Admin
- **Email** : admin@profsacademie.ca
- **Mot de passe** : admin123

### Enseignant
- **Email** : prof@profsacademie.ca
- **Mot de passe** : prof123

### Parent
- **Email** : parent@profsacademie.ca
- **Mot de passe** : parent123

### Enfants
- **Emma** : PIN 1234
- **Lucas** : PIN 5678

## 📁 Structure du projet

```
profs-academie/
├── apps/
│   └── web/                 # Application Next.js principale
│       ├── src/
│       │   ├── app/         # App Router (pages)
│       │   ├── components/  # Composants spécifiques à l'app
│       │   ├── lib/         # Utilitaires et configurations
│       │   └── types/       # Types TypeScript
│       └── public/          # Assets statiques
├── packages/
│   ├── config/              # Configuration partagée (ESLint, TypeScript, Tailwind)
│   ├── db/                  # Schéma Prisma et utilitaires DB
│   └── ui/                  # Composants UI partagés (shadcn/ui)
├── docker-compose.yml       # Services de développement
└── package.json             # Configuration monorepo
```

## 🎯 Fonctionnalités principales

### Pour les Parents
- Création de compte et gestion du foyer
- Ajout de profils enfants avec codes PIN
- Suivi de progression en temps réel
- Gestion des abonnements
- Recommandations personnalisées

### Pour les Enfants
- Interface ludique et colorée
- Navigation par cours et leçons
- Quiz interactifs avec feedback immédiat
- Badges et récompenses
- Progression visuelle

### Pour les Enseignants
- Studio de création de cours
- Éditeur MDX pour le contenu
- Création de quiz interactifs
- Analytics des performances
- Workflow de publication

### Pour les Admins
- Gestion des utilisateurs
- Modération des cours
- Approbation des enseignants
- Analytics globales
- Gestion des abonnements

## 🔧 Scripts disponibles

```bash
# Développement
pnpm dev              # Démarrer l'application en mode développement
pnpm build            # Build de production
pnpm start            # Démarrer l'application en production

# Base de données
pnpm db:generate      # Générer le client Prisma
pnpm db:migrate       # Exécuter les migrations
pnpm db:seed          # Seeder avec les données de démonstration
pnpm db:studio        # Ouvrir Prisma Studio

# Qualité de code
pnpm lint             # Linter ESLint
pnpm type-check       # Vérification TypeScript
pnpm format           # Formater avec Prettier

# Tests
pnpm test             # Tests unitaires
pnpm test:e2e         # Tests end-to-end
```

## 🐳 Déploiement avec Docker

### Build de l'image

```bash
docker build -t profs-academie .
```

### Démarrage avec docker-compose

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🔒 Sécurité

- **Authentification** : NextAuth.js avec sessions sécurisées
- **Autorisation** : RBAC (Role-Based Access Control)
- **Validation** : Zod pour toutes les entrées utilisateur
- **Base de données** : Prisma avec protection contre les injections SQL
- **Paiements** : Stripe avec webhooks sécurisés
- **Données** : Chiffrement et stockage conforme RGPD

## 📊 Monitoring

- **Logs** : Pino pour les logs structurés
- **Erreurs** : Sentry pour le monitoring d'erreurs
- **Performance** : Next.js Analytics intégré
- **Base de données** : Prisma Studio pour l'inspection

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

- **Documentation** : [docs.profsacademie.ca](https://docs.profsacademie.ca)
- **Email** : support@profsacademie.ca
- **Discord** : [Serveur communautaire](https://discord.gg/profsacademie)

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) pour le framework React
- [Prisma](https://prisma.io/) pour l'ORM
- [shadcn/ui](https://ui.shadcn.com/) pour les composants UI
- [Stripe](https://stripe.com/) pour les paiements
- [Tailwind CSS](https://tailwindcss.com/) pour le styling

---

**Profs Académie** - Apprendre en s'amusant, la façon québécoise ! 🇨🇦
