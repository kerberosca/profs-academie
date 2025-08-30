// Normalisation des niveaux scolaires
export type GradeKey = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'S1' | 'S2' | 'S3' | 'S4' | 'S5';

// Types pour les niveaux de base de données
export type NiveauScolaire = 
  | 'MATERNELLE_4_ANS' | 'MATERNELLE_5_ANS'
  | 'PRIMAIRE_1' | 'PRIMAIRE_2' | 'PRIMAIRE_3' | 'PRIMAIRE_4' | 'PRIMAIRE_5' | 'PRIMAIRE_6'
  | 'SECONDAIRE_1' | 'SECONDAIRE_2' | 'SECONDAIRE_3' | 'SECONDAIRE_4' | 'SECONDAIRE_5';

// Dictionnaire des libellés localisés
export const GRADE_LABELS: Record<GradeKey, string> = {
  P1: "Primaire — 1re année",
  P2: "Primaire — 2e année", 
  P3: "Primaire — 3e année",
  P4: "Primaire — 4e année",
  P5: "Primaire — 5e année",
  P6: "Primaire — 6e année",
  S1: "Secondaire 1",
  S2: "Secondaire 2",
  S3: "Secondaire 3",
  S4: "Secondaire 4",
  S5: "Secondaire 5"
};

// Fonction utilitaire pour obtenir le libellé d'un niveau
export function getGradeLabel(niveauScolaire: NiveauScolaire | string | null): string {
  if (!niveauScolaire) return "Niveau non défini";
  
  const mapping: Record<string, GradeKey> = {
    'MATERNELLE_4_ANS': 'P1',
    'MATERNELLE_5_ANS': 'P1',
    'PRIMAIRE_1': 'P1',
    'PRIMAIRE_2': 'P2',
    'PRIMAIRE_3': 'P3',
    'PRIMAIRE_4': 'P4',
    'PRIMAIRE_5': 'P5',
    'PRIMAIRE_6': 'P6',
    'SECONDAIRE_1': 'S1',
    'SECONDAIRE_2': 'S2',
    'SECONDAIRE_3': 'S3',
    'SECONDAIRE_4': 'S4',
    'SECONDAIRE_5': 'S5'
  };

  const gradeKey = mapping[niveauScolaire];
  return gradeKey ? GRADE_LABELS[gradeKey] : "Niveau non défini";
}

// Types pour les enfants
export interface Enfant {
  id: string;
  prenom: string;
  nom?: string;
  anneeNaissance: number;
  niveauScolaire?: NiveauScolaire;
}

export interface EnfantData {
  id: string;
  name: string;
  age: number;
  grade: string;
  avatar: string;
  niveauScolaire?: NiveauScolaire;
}

// Types pour les cours gouvernementaux
export interface CoursGouvernemental {
  id: string;
  titre: string;
  description?: string;
  dureeEstimee?: number;
  competences: string[];
  urlPdf?: string;
  urlComplementaire?: string;
}

// Types pour les compétences
export interface Competence {
  id: string;
  nom: string;
  description?: string;
  ordre: number;
  contenus: ContenuApprentissage[];
}

export interface ContenuApprentissage {
  id: string;
  nom: string;
  description?: string;
  dureeEstimee: number;
  ordre: number;
}

// Types pour la planification par périodes
export interface ConfigurationPeriode {
  dateDebut: string;
  dateFin: string;
  frequencesMatiere: Record<string, number>;
}

export interface PlanHebdomadaire {
  semaine: number;
  dateDebut: string;
  dateFin: string;
  sessions: SessionPlanifiee[];
}

export interface SessionPlanifiee {
  id: string;
  matiere: string;
  competenceId: string;
  competenceNom: string;
  jour: string;
  dureeMinutes: number;
  contenuNom?: string;
}

export interface PlanPeriode {
  enfantId: string;
  enfantNom: string;
  niveau: string;
  configuration: ConfigurationPeriode;
  semaines: PlanHebdomadaire[];
}

// Types pour l'état du LMS
export interface LMSState {
  enfantSelectionne: EnfantData | null;
  coursDisponibles: Record<string, CoursGouvernemental[]>;
  competencesNiveau: Record<string, Competence[]>;
  planGenere: PlanPeriode | null;
  configuration: ConfigurationPeriode;
  loading: boolean;
  error: string | null;
}

// Configuration par défaut des fréquences par matière
export const FREQUENCES_DEFAUT: Record<string, number> = {
  'FRANCAIS': 5,
  'MATHEMATIQUES': 5,
  'SCIENCES': 3,
  'HISTOIRE': 2,
  'GEOGRAPHIE': 2,
  'ARTS': 2,
  'EDUCATION_PHYSIQUE': 2,
  'ETHIQUE_CULTURE_RELIGIEUSE': 1
};

// Libellés des matières pour l'affichage
export const MATIERES_LABELS: Record<string, string> = {
  'FRANCAIS': 'Français',
  'MATHEMATIQUES': 'Mathématiques',
  'SCIENCES': 'Sciences et technologie',
  'HISTOIRE': 'Histoire',
  'GEOGRAPHIE': 'Géographie',
  'ARTS': 'Arts',
  'EDUCATION_PHYSIQUE': 'Éducation physique et santé',
  'ETHIQUE_CULTURE_RELIGIEUSE': 'Éthique et culture religieuse',
  'ANGLAIS': 'Anglais',
  'ESPAGNOL': 'Espagnol',
  'TECHNOLOGIE': 'Technologie',
  'ECONOMIE_FAMILIALE': 'Économie familiale'
};

// Jours de la semaine
export const JOURS_SEMAINE = [
  { key: 'lundi', label: 'Lundi' },
  { key: 'mardi', label: 'Mardi' },
  { key: 'mercredi', label: 'Mercredi' },
  { key: 'jeudi', label: 'Jeudi' },
  { key: 'vendredi', label: 'Vendredi' }
];
