import { z } from "zod";

// Schémas d'authentification
export const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const registerSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  role: z.enum(["PARENT", "TEACHER"]).default("PARENT"),
});

export const enfantSchema = z.object({
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  anneeNaissance: z.number().min(2000).max(new Date().getFullYear()),
  pin: z.string().length(4, "Le code PIN doit contenir exactement 4 chiffres"),
});

// Schémas de cours
export const coursSchema = z.object({
  titre: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  matiere: z.string().min(1, "La matière est requise"),
  niveau: z.string().min(1, "Le niveau est requis"),
  resume: z.string().optional(),
});

export const leconSchema = z.object({
  titre: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  mdx: z.string().min(10, "Le contenu doit contenir au moins 10 caractères"),
  dureeMin: z.number().min(1, "La durée doit être d'au moins 1 minute"),
});

export const questionSchema = z.object({
  type: z.enum(["SINGLE", "MULTIPLE", "SHORT"]),
  enonce: z.string().min(5, "L'énoncé doit contenir au moins 5 caractères"),
  options: z.array(z.string()).optional(),
  cleReponse: z.union([z.string(), z.array(z.string())]),
});

// Schémas d'abonnement
export const planSchema = z.object({
  key: z.string(),
  nom: z.string(),
  prixCents: z.number().positive(),
  intervalle: z.enum(["MONTH", "YEAR"]),
  nbEnfants: z.number().positive(),
  description: z.string().optional(),
  features: z.array(z.string()),
});

// Types TypeScript dérivés
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type EnfantInput = z.infer<typeof enfantSchema>;
export type CoursInput = z.infer<typeof coursSchema>;
export type LeconInput = z.infer<typeof leconSchema>;
export type QuestionInput = z.infer<typeof questionSchema>;
export type PlanInput = z.infer<typeof planSchema>;
