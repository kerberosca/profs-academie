import { useState, useCallback } from 'react';
import { 
  EnfantData, 
  CoursGouvernemental, 
  Competence, 
  ConfigurationPeriode, 
  PlanPeriode, 
  PlanHebdomadaire,
  SessionPlanifiee,
  FREQUENCES_DEFAUT,
  MATIERES_LABELS,
  JOURS_SEMAINE,
  NiveauScolaire
} from '../types/lms';

interface LMSStandardState {
  enfantSelectionne: EnfantData | null;
  coursDisponibles: Record<string, CoursGouvernemental[]>;
  competencesNiveau: Record<string, Competence[]>;
  planGenere: PlanPeriode | null;
  configuration: ConfigurationPeriode;
  loading: boolean;
  error: string | null;
}

export function useLMSStandard() {
  const [state, setState] = useState<LMSStandardState>({
    enfantSelectionne: null,
    coursDisponibles: {},
    competencesNiveau: {},
    planGenere: null,
    configuration: {
      dateDebut: '',
      dateFin: '',
      frequencesMatiere: { ...FREQUENCES_DEFAUT }
    },
    loading: false,
    error: null
  });

  // Sélectionner un enfant et charger ses données
  const selectionnerEnfant = useCallback(async (enfant: EnfantData) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Charger les cours et compétences pour ce niveau
      const [coursResponse, competencesResponse] = await Promise.all([
        fetch(`/api/cours/${enfant.niveauScolaire}`),
        fetch(`/api/competences/${enfant.niveauScolaire}`)
      ]);

      if (!coursResponse.ok || !competencesResponse.ok) {
        throw new Error('Erreur lors du chargement des données du niveau');
      }

      const coursData = await coursResponse.json();
      const competencesData = await competencesResponse.json();

      setState(prev => ({
        ...prev,
        enfantSelectionne: enfant,
        coursDisponibles: coursData.cours || {},
        competencesNiveau: competencesData.competences || {},
        loading: false
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        loading: false
      }));
    }
  }, []);

  // Mettre à jour la configuration de période
  const mettreAJourConfiguration = useCallback((nouvelleConfig: Partial<ConfigurationPeriode>) => {
    setState(prev => ({
      ...prev,
      configuration: { ...prev.configuration, ...nouvelleConfig }
    }));
  }, []);

  // Générer le plan d'apprentissage pour la période
  const genererPlan = useCallback(() => {
    if (!state.enfantSelectionne || !state.configuration.dateDebut || !state.configuration.dateFin) {
      setState(prev => ({ ...prev, error: 'Enfant et dates requis pour générer le plan' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const dateDebut = new Date(state.configuration.dateDebut);
      const dateFin = new Date(state.configuration.dateFin);
      
      // Calculer le nombre de semaines
      const diffTime = dateFin.getTime() - dateDebut.getTime();
      const diffWeeks = Math.ceil(diffTime / (7 * 24 * 60 * 60 * 1000));

      if (diffWeeks <= 0) {
        throw new Error('La date de fin doit être après la date de début');
      }

      // Générer les semaines
      const semaines: PlanHebdomadaire[] = [];
      const competencesToutes = Object.values(state.competencesNiveau).flat();

      for (let semaine = 1; semaine <= diffWeeks; semaine++) {
        const debutSemaine = new Date(dateDebut);
        debutSemaine.setDate(debutSemaine.getDate() + (semaine - 1) * 7);
        
        const finSemaine = new Date(debutSemaine);
        finSemaine.setDate(finSemaine.getDate() + 6);

        // Générer les sessions pour cette semaine
        const sessions: SessionPlanifiee[] = [];
        let sessionId = 1;

        // Pour chaque matière configurée
        Object.entries(state.configuration.frequencesMatiere).forEach(([matiere, frequence]) => {
          // Trouver les compétences de cette matière
          const competencesMatiere = competencesToutes.filter(comp => 
            state.competencesNiveau[matiere]?.includes(comp)
          );

          // Créer les sessions selon la fréquence
          for (let i = 0; i < frequence; i++) {
            if (competencesMatiere.length > 0) {
              const competence = competencesMatiere[i % competencesMatiere.length];
              const jour = JOURS_SEMAINE[i % JOURS_SEMAINE.length];

              sessions.push({
                id: `session-${semaine}-${sessionId++}`,
                matiere: MATIERES_LABELS[matiere] || matiere,
                competenceId: competence.id,
                competenceNom: competence.nom,
                jour: jour.label,
                dureeMinutes: competence.contenus[0]?.dureeEstimee || 60,
                contenuNom: competence.contenus[0]?.nom
              });
            }
          }
        });

        semaines.push({
          semaine,
          dateDebut: debutSemaine.toISOString().split('T')[0],
          dateFin: finSemaine.toISOString().split('T')[0],
          sessions
        });
      }

      const plan: PlanPeriode = {
        enfantId: state.enfantSelectionne.id,
        enfantNom: state.enfantSelectionne.name,
        niveau: state.enfantSelectionne.grade,
        configuration: state.configuration,
        semaines
      };

      setState(prev => ({
        ...prev,
        planGenere: plan,
        loading: false
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erreur lors de la génération du plan',
        loading: false
      }));
    }
  }, [state.enfantSelectionne, state.configuration, state.competencesNiveau]);

  // Placeholder pour planifier une semaine
  const planifierSemaine = useCallback((semaine: number, competenceId: string) => {
    console.log(`Planifier la semaine ${semaine} pour la compétence ${competenceId}`);
    // Placeholder - aucune logique de suivi pour l'instant
  }, []);

  // Réinitialiser l'état
  const reinitialiser = useCallback(() => {
    setState({
      enfantSelectionne: null,
      coursDisponibles: {},
      competencesNiveau: {},
      planGenere: null,
      configuration: {
        dateDebut: '',
        dateFin: '',
        frequencesMatiere: { ...FREQUENCES_DEFAUT }
      },
      loading: false,
      error: null
    });
  }, []);

  return {
    ...state,
    selectionnerEnfant,
    mettreAJourConfiguration,
    genererPlan,
    planifierSemaine,
    reinitialiser
  };
}
