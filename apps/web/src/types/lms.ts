// Normalisation des niveaux scolaires
export type GradeKey = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'S1' | 'S2' | 'S3' | 'S4' | 'S5';

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
export function getGradeLabel(gradeKey: GradeKey): string {
  return GRADE_LABELS[gradeKey];
}

// Types principaux
export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  grade: GradeKey;
  birthYear: number;
}

export interface Course {
  id: string;
  title: string;              // ex: "Français"
  slug: string;               // ex: "francais"
  gradeKeys: GradeKey[];      // niveaux où ce cours est offert
  durationMinutes: number;    // par séance
  weeklyFrequency: number;    // nb de séances/semaine par défaut
  description?: string;
  subject: string;            // matière (pour compatibilité)
  outline?: string;           // aperçu du cours/compétences attendues
  competences?: string[];     // liste des compétences
}

export interface CalendarEvent {
  id: string;
  childId: string;
  courseId: string;
  startISO: string; // 2025-09-01T09:00:00-04:00
  endISO: string;
  title?: string;             // titre du cours (pour affichage)
  course?: Course;            // données du cours (pour affichage)
}

export interface CalendarWeek {
  childId: string;
  weekStartISO: string; // lundi ISO
  events: CalendarEvent[];
  totalHours: number;    // nombre total d'heures pour cette semaine
}

// Types pour le plan d'apprentissage par périodes
export interface LearningCompetency {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: GradeKey;
  order: number;
  contenus?: ContenuApprentissage[];
}

export interface ContenuApprentissage {
  id: string;
  nom: string;
  description: string;
  dureeEstimee: number;
  ordre: number;
}

export interface WeekPlan {
  weekNumber: number;
  startDate: string; // ISO date
  endDate: string;   // ISO date
  subjects: SubjectWeekPlan[];
}

export interface SubjectWeekPlan {
  subject: string;
  title: string;
  weeklyFrequency: number;
  sessions: LearningSession[];
}

export interface LearningSession {
  id: string;
  competencyId: string;
  competencyTitle: string;
  competencyDescription: string;
  durationMinutes: number;
  order: number;
  contenuNom?: string;
  contenuDescription?: string;
}

export interface LearningPlan {
  id: string;
  childId: string;
  childName: string;
  grade: GradeKey;
  startDate: string;
  endDate: string;
  totalWeeks: number;
  weeks: WeekPlan[];
}

// Types pour les requêtes API
export interface GenerateWeekRequest {
  childId: string;
  weekStartISO: string;
  hoursPerWeek: number;  // nombre d'heures par semaine
}

export interface CreateEventRequest {
  childId: string;
  courseId: string;
  startISO: string;
  endISO: string;
}

export interface UpdateEventRequest {
  startISO: string;
  endISO: string;
}

export interface GenerateLearningPlanRequest {
  childId: string;
  startDate: string;
  endDate: string;
}

export interface PlanWeekRequest {
  weekNumber: number;
  childId: string;
  subject: string;
  competencyId: string;
}

// Types pour les créneaux horaires
export interface TimeSlot {
  start: string; // "09:00"
  end: string;   // "10:00"
  label: string; // "9h00 - 10h00"
}

// Configuration des créneaux par défaut
export const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { start: "09:00", end: "10:00", label: "9h00 - 10h00" },
  { start: "10:15", end: "11:15", label: "10h15 - 11h15" },
  { start: "13:00", end: "14:00", label: "13h00 - 14h00" },
  { start: "14:15", end: "15:00", label: "14h15 - 15h00" }
];

// Options pour le nombre d'heures par semaine
export const HOURS_PER_WEEK_OPTIONS = [
  { value: 5, label: "5 heures par semaine" },
  { value: 10, label: "10 heures par semaine" },
  { value: 15, label: "15 heures par semaine" },
  { value: 20, label: "20 heures par semaine" },
  { value: 25, label: "25 heures par semaine" }
];

// Ordre d'importance des matières pour la génération automatique
export const SUBJECT_PRIORITY = [
  'Français',
  'Mathématiques', 
  'Sciences',
  'Univers social',
  'Arts',
  'ÉPS',
  'CCQ'
];

// Types pour les jours de la semaine
export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export const WEEK_DAYS: { key: WeekDay; label: string; short: string }[] = [
  { key: 'monday', label: 'Lundi', short: 'LUN' },
  { key: 'tuesday', label: 'Mardi', short: 'MAR' },
  { key: 'wednesday', label: 'Mercredi', short: 'MER' },
  { key: 'thursday', label: 'Jeudi', short: 'JEU' },
  { key: 'friday', label: 'Vendredi', short: 'VEN' }
];

// Types pour les hooks et états
export interface CalendarState {
  selectedChild: Child | null;
  selectedWeek: CalendarWeek | null;
  availableCourses: Course[];
  hoursPerWeek: number;
  loading: boolean;
  error: string | null;
}

// Types pour les actions de calendrier
export type CalendarAction = 
  | { type: 'SET_SELECTED_CHILD'; payload: Child }
  | { type: 'SET_SELECTED_WEEK'; payload: CalendarWeek }
  | { type: 'SET_AVAILABLE_COURSES'; payload: Course[] }
  | { type: 'SET_HOURS_PER_WEEK'; payload: number }
  | { type: 'ADD_EVENT'; payload: CalendarEvent }
  | { type: 'UPDATE_EVENT'; payload: { id: string; event: Partial<CalendarEvent> } }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Types pour les filtres
export interface CourseFilters {
  grade?: GradeKey;
  subject?: string;
}

export interface CalendarFilters {
  childId?: string;
  weekStartISO?: string;
}
