import { db } from '@profs-academie/db';
import { NiveauScolaire, TypeCours, StatutProgression } from '../types/lms';

export class CalendrierGenerator {
  /**
   * Génère un calendrier d'étude basé sur les compétences de la base de données
   */
  static async generateCalendrier(
    enfantId: string,
    parentId: string,
    niveauScolaire: NiveauScolaire,
    dureeHebdomadaire: number = 300
  ): Promise<string> {
    console.log(`📅 Génération du calendrier pour ${niveauScolaire}`);

    // Récupérer les compétences et contenus pour ce niveau
    const competences = await db.competence.findMany({
      where: { niveauScolaire },
      include: {
        contenusApprentissage: {
          orderBy: { ordre: 'asc' }
        }
      },
      orderBy: { ordre: 'asc' }
    });

    if (competences.length === 0) {
      throw new Error(`Aucune compétence trouvée pour le niveau ${niveauScolaire}`);
    }

    // Créer le calendrier
    const calendrier = await db.calendrierEtude.create({
      data: {
        nom: `Calendrier d'étude - ${niveauScolaire}`,
        description: `Calendrier d'étude basé sur le programme scolaire québécois pour ${niveauScolaire} (${dureeHebdomadaire} min/semaine)`,
        actif: true,
        enfantId,
        parentId
      }
    });

    // Calculer la répartition hebdomadaire
    const totalContenus = competences.reduce((sum, comp) => sum + comp.contenusApprentissage.length, 0);
    const contenusParSemaine = Math.ceil(totalContenus / 10); // 10 semaines par défaut
    const dureeParSession = Math.floor(dureeHebdomadaire / contenusParSemaine);

    // Créer les sessions d'étude
    let semaineActuelle = 1;
    let jourActuel = 1; // Lundi = 1

    for (const competence of competences) {
      for (const contenu of competence.contenusApprentissage) {
        // Calculer la date de début
        const dateDebut = new Date();
        dateDebut.setDate(dateDebut.getDate() + (semaineActuelle - 1) * 7 + (jourActuel - 1));

        // Créer la session
        await db.sessionEtude.create({
          data: {
            titre: contenu.nom,
            description: contenu.description,
            dateDebut,
            dureePlanifiee: Math.max(20, Math.min(60, contenu.dureeEstimee)),
            statut: StatutProgression.NON_COMMENCE,
            typeCours: TypeCours.COURS_GOUVERNEMENTAL,
            calendrierId: calendrier.id
          }
        });

        // Passer au jour suivant
        jourActuel++;
        if (jourActuel > 5) { // Vendredi
          jourActuel = 1; // Retour au lundi
          semaineActuelle++;
        }
      }
    }

    console.log(`✅ Calendrier généré avec ${semaineActuelle} semaines`);
    return calendrier.id;
  }

  /**
   * Récupère les compétences disponibles pour un niveau scolaire
   */
  static async getCompetences(niveauScolaire: NiveauScolaire) {
    return await db.competence.findMany({
      where: { niveauScolaire },
      include: {
        contenusApprentissage: {
          orderBy: { ordre: 'asc' }
        }
      },
      orderBy: { ordre: 'asc' }
    });
  }

  /**
   * Récupère tous les niveaux scolaires disponibles
   */
  static async getNiveauxScolaires() {
    const competences = await db.competence.findMany({
      select: { niveauScolaire: true },
      distinct: ['niveauScolaire']
    });
    
    return competences.map(c => c.niveauScolaire).sort();
  }

  /**
   * Récupère les matières disponibles pour un niveau scolaire
   */
  static async getMatieres(niveauScolaire: NiveauScolaire) {
    const competences = await db.competence.findMany({
      where: { niveauScolaire },
      select: { matiere: true },
      distinct: ['matiere']
    });
    
    return competences.map(c => c.matiere).sort();
  }
}
