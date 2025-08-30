-- CreateTable
CREATE TABLE "competences" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "matiere" "Matiere" NOT NULL,
    "niveauScolaire" "NiveauScolaire" NOT NULL,
    "ordre" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contenus_apprentissage" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "dureeEstimee" INTEGER NOT NULL,
    "ordre" INTEGER NOT NULL,
    "prerequis" TEXT[],
    "competenceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contenus_apprentissage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "competences_matiere_niveauScolaire_ordre_key" ON "competences"("matiere", "niveauScolaire", "ordre");

-- CreateIndex
CREATE UNIQUE INDEX "contenus_apprentissage_competenceId_ordre_key" ON "contenus_apprentissage"("competenceId", "ordre");

-- AddForeignKey
ALTER TABLE "contenus_apprentissage" ADD CONSTRAINT "contenus_apprentissage_competenceId_fkey" FOREIGN KEY ("competenceId") REFERENCES "competences"("id") ON DELETE CASCADE ON UPDATE CASCADE;
