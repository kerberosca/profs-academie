-- CreateEnum
CREATE TYPE "NiveauScolaire" AS ENUM ('MATERNELLE_4_ANS', 'MATERNELLE_5_ANS', 'PRIMAIRE_1', 'PRIMAIRE_2', 'PRIMAIRE_3', 'PRIMAIRE_4', 'PRIMAIRE_5', 'PRIMAIRE_6', 'SECONDAIRE_1', 'SECONDAIRE_2', 'SECONDAIRE_3', 'SECONDAIRE_4', 'SECONDAIRE_5');

-- CreateEnum
CREATE TYPE "Matiere" AS ENUM ('FRANCAIS', 'MATHEMATIQUES', 'SCIENCES', 'HISTOIRE', 'GEOGRAPHIE', 'ARTS', 'EDUCATION_PHYSIQUE', 'ETHIQUE_CULTURE_RELIGIEUSE', 'ANGLAIS', 'ESPAGNOL', 'TECHNOLOGIE', 'ECONOMIE_FAMILIALE');

-- CreateEnum
CREATE TYPE "StatutProgression" AS ENUM ('NON_COMMENCE', 'EN_COURS', 'TERMINE', 'EN_PAUSE');

-- CreateEnum
CREATE TYPE "TypeCours" AS ENUM ('COURS_GOUVERNEMENTAL', 'COURS_PERSONNALISE', 'ACTIVITE_COMPLEMENTAIRE');

-- AlterTable
ALTER TABLE "enfants" ADD COLUMN     "niveauScolaire" "NiveauScolaire",
ADD COLUMN     "nom" TEXT;

-- CreateTable
CREATE TABLE "cours_gouvernementaux" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "matiere" "Matiere" NOT NULL,
    "niveauScolaire" "NiveauScolaire" NOT NULL,
    "urlPdf" TEXT NOT NULL,
    "urlComplementaire" TEXT,
    "dureeEstimee" INTEGER,
    "competences" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cours_gouvernementaux_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendriers_etude" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "enfantId" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calendriers_etude_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions_etude" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3),
    "dureePlanifiee" INTEGER NOT NULL,
    "calendrierId" TEXT NOT NULL,
    "coursId" TEXT,
    "typeCours" "TypeCours" NOT NULL,
    "statut" "StatutProgression" NOT NULL DEFAULT 'NON_COMMENCE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_etude_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progressions_cours" (
    "id" TEXT NOT NULL,
    "pourcentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tempsPasse" INTEGER NOT NULL DEFAULT 0,
    "dernierAcces" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" "StatutProgression" NOT NULL DEFAULT 'NON_COMMENCE',
    "notes" TEXT,
    "enfantId" TEXT NOT NULL,
    "coursId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "progressions_cours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suivis_apprentissage" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "matiere" "Matiere" NOT NULL,
    "niveauScolaire" "NiveauScolaire" NOT NULL,
    "tempsPasse" INTEGER NOT NULL,
    "coursCompletes" INTEGER NOT NULL DEFAULT 0,
    "competencesAcquises" TEXT[],
    "observations" TEXT,
    "enfantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suivis_apprentissage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CalendrierCours" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "progressions_cours_enfantId_coursId_key" ON "progressions_cours"("enfantId", "coursId");

-- CreateIndex
CREATE UNIQUE INDEX "_CalendrierCours_AB_unique" ON "_CalendrierCours"("A", "B");

-- CreateIndex
CREATE INDEX "_CalendrierCours_B_index" ON "_CalendrierCours"("B");

-- AddForeignKey
ALTER TABLE "calendriers_etude" ADD CONSTRAINT "calendriers_etude_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "enfants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendriers_etude" ADD CONSTRAINT "calendriers_etude_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions_etude" ADD CONSTRAINT "sessions_etude_calendrierId_fkey" FOREIGN KEY ("calendrierId") REFERENCES "calendriers_etude"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions_etude" ADD CONSTRAINT "sessions_etude_coursId_fkey" FOREIGN KEY ("coursId") REFERENCES "cours_gouvernementaux"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progressions_cours" ADD CONSTRAINT "progressions_cours_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "enfants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progressions_cours" ADD CONSTRAINT "progressions_cours_coursId_fkey" FOREIGN KEY ("coursId") REFERENCES "cours_gouvernementaux"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suivis_apprentissage" ADD CONSTRAINT "suivis_apprentissage_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "enfants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CalendrierCours" ADD CONSTRAINT "_CalendrierCours_A_fkey" FOREIGN KEY ("A") REFERENCES "calendriers_etude"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CalendrierCours" ADD CONSTRAINT "_CalendrierCours_B_fkey" FOREIGN KEY ("B") REFERENCES "cours_gouvernementaux"("id") ON DELETE CASCADE ON UPDATE CASCADE;
