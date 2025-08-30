"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@profs-academie/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@profs-academie/ui";
import { Badge } from "@profs-academie/ui";
import {
  Calendar,
  Clock,
  BookOpen,
  ArrowLeft,
  FileText,
  Database,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../../contexts/AuthContext";
import { NiveauScolaire } from "../../../../../types/lms";

interface Enfant {
  id: string;
  prenom: string;
  nom: string;
  niveauScolaire: string | null;
}

export default function GenerateCalendarPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [enfants, setEnfants] = useState<Enfant[]>([]);
  const [selectedChild, setSelectedChild] = useState<Enfant | null>(null);
  const [selectedNiveau, setSelectedNiveau] = useState<NiveauScolaire | "">("");
  const [dureeHebdomadaire, setDureeHebdomadaire] = useState(300);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchEnfants = useCallback(async () => {
    try {
      if (!user?.id) return;
      
      const response = await fetch(`/api/parent/enfants?parentId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setEnfants(data.enfants);
      } else {
        console.error('Erreur lors de la récupération des enfants:', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des enfants:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      fetchEnfants();
    }
  }, [user, fetchEnfants]);

  const handleGenerateCalendar = async () => {
    if (!selectedChild || !selectedNiveau) {
      setError("Veuillez sélectionner un enfant et un niveau scolaire");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch('/api/lms/programmes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          niveauScolaire: selectedNiveau,
          enfantId: selectedChild.id,
          parentId: user?.id,
          dureeHebdomadaire
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Calendrier généré avec succès !");
        // Rediriger vers le calendrier créé
        setTimeout(() => {
          router.push(`/dashboard/parent/lms/calendar/${data.calendrier.id}`);
        }, 2000);
      } else {
        setError(data.error || "Erreur lors de la génération du calendrier");
      }
    } catch (error) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const niveauxScolaires = [
    { value: NiveauScolaire.MATERNELLE_4_ANS, label: "Maternelle 4 ans" },
    { value: NiveauScolaire.MATERNELLE_5_ANS, label: "Maternelle 5 ans" },
    { value: NiveauScolaire.PRIMAIRE_1, label: "1ère année du primaire" },
    { value: NiveauScolaire.PRIMAIRE_2, label: "2ème année du primaire" },
    { value: NiveauScolaire.PRIMAIRE_3, label: "3ème année du primaire" },
    { value: NiveauScolaire.PRIMAIRE_4, label: "4ème année du primaire" },
    { value: NiveauScolaire.PRIMAIRE_5, label: "5ème année du primaire" },
    { value: NiveauScolaire.PRIMAIRE_6, label: "6ème année du primaire" },
  ];

  const dureesHebdomadaires = [
    { value: 180, label: "3 heures par semaine" },
    { value: 240, label: "4 heures par semaine" },
    { value: 300, label: "5 heures par semaine" },
    { value: 360, label: "6 heures par semaine" },
    { value: 420, label: "7 heures par semaine" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Profs Académie" className="w-8 h-8" />
            <span className="text-xl font-bold text-gray-900">Profs Académie</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/dashboard/parent/lms">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au LMS
            </Button>
          </Link>
        </div>

        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Générer un calendrier d'étude
          </h1>
          <p className="text-gray-600">
            Créez un calendrier d'étude personnalisé basé sur le programme québécois officiel
          </p>
        </div>

        {/* Formulaire */}
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Configuration du calendrier
              </CardTitle>
              <CardDescription>
                Sélectionnez un enfant et un niveau scolaire pour générer un calendrier basé sur le programme officiel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                             {/* Sélection de l'enfant */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Enfant
                 </label>
                 {enfants.length === 0 ? (
                   <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                     <p className="text-yellow-800 text-sm">
                       Aucun enfant trouvé. Veuillez d'abord créer un enfant dans votre tableau de bord.
                     </p>
                     <Link href="/dashboard/parent">
                       <Button variant="outline" size="sm" className="mt-2">
                         Aller au tableau de bord
                       </Button>
                     </Link>
                   </div>
                 ) : (
                   <select
                     value={selectedChild?.id || ""}
                     onChange={(e) => {
                       const enfant = enfants.find(enfant => enfant.id === e.target.value);
                       setSelectedChild(enfant || null);
                     }}
                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   >
                     <option value="">Sélectionnez un enfant</option>
                     {enfants.map((enfant) => (
                       <option key={enfant.id} value={enfant.id}>
                         {enfant.prenom} {enfant.nom}
                       </option>
                     ))}
                   </select>
                 )}
               </div>

              {/* Sélection du niveau scolaire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau scolaire
                </label>
                <select
                  value={selectedNiveau}
                  onChange={(e) => setSelectedNiveau(e.target.value as NiveauScolaire)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez un niveau</option>
                  {niveauxScolaires.map((niveau) => (
                    <option key={niveau.value} value={niveau.value}>
                      {niveau.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Durée hebdomadaire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée hebdomadaire d'étude
                </label>
                <select
                  value={dureeHebdomadaire}
                  onChange={(e) => setDureeHebdomadaire(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {dureesHebdomadaires.map((duree) => (
                    <option key={duree.value} value={duree.value}>
                      {duree.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Informations sur le processus */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Ce que fait cette fonctionnalité :</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Lit le programme québécois officiel depuis le fichier texte
                  </li>
                  <li className="flex items-center">
                    <Database className="w-4 h-4 mr-2" />
                    Extrait la structure des compétences et contenus d'apprentissage
                  </li>
                  <li className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Génère un calendrier d'étude personnalisé avec des sessions planifiées
                  </li>
                  <li className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Crée des sessions d'étude basées sur les contenus du programme officiel
                  </li>
                </ul>
              </div>

              {/* Messages d'erreur et de succès */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-800">{error}</span>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-green-800">{success}</span>
                  </div>
                </div>
              )}

              {/* Bouton de génération */}
              <Button
                onClick={handleGenerateCalendar}
                disabled={loading || !selectedChild || !selectedNiveau}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Générer le calendrier
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
