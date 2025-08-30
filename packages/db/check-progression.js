const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkProgression() {
  try {
    console.log('🔍 Vérification des données de progression...\n');

    // 1. Vérifier les enfants
    const enfants = await prisma.enfant.findMany({
      include: {
        foyer: {
          include: {
            parent: true
          }
        }
      }
    });

    console.log(`📚 Enfants trouvés: ${enfants.length}`);
    enfants.forEach(enfant => {
      console.log(`  - ${enfant.prenom} ${enfant.nom} (${enfant.niveauScolaire})`);
    });

    // 2. Vérifier les progressions
    for (const enfant of enfants) {
      console.log(`\n👤 Progression pour ${enfant.prenom}:`);
      
      const progressions = await prisma.progressionCours.findMany({
        where: { enfantId: enfant.id },
        include: { cours: true }
      });

      console.log(`  Progressions trouvées: ${progressions.length}`);

      if (progressions.length > 0) {
        const totalTemps = progressions.reduce((sum, p) => sum + p.tempsPasse, 0);
        const coursCompletes = progressions.filter(p => p.statut === 'TERMINE').length;
        const progressionMoyenne = progressions.reduce((sum, p) => sum + p.pourcentage, 0) / progressions.length;

        console.log(`  - Temps total: ${Math.round(totalTemps / 60)}h ${totalTemps % 60}m`);
        console.log(`  - Cours terminés: ${coursCompletes}`);
        console.log(`  - Progression moyenne: ${Math.round(progressionMoyenne)}%`);

        // Détails des progressions
        progressions.forEach((prog, index) => {
          console.log(`    ${index + 1}. ${prog.cours?.titre} - ${prog.pourcentage}% (${prog.tempsPasse}min)`);
        });
      } else {
        console.log('  Aucune progression trouvée');
      }
    }

    // 3. Vérifier les cours gouvernementaux
    console.log('\n📖 Cours gouvernementaux disponibles:');
    const cours = await prisma.coursGouvernemental.findMany({
      take: 5
    });
    
    cours.forEach(c => {
      console.log(`  - ${c.titre} (${c.matiere} - ${c.niveauScolaire})`);
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProgression();
