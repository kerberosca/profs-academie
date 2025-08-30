"use client";

import { useState, useEffect } from "react";
import { Button } from "@profs-academie/ui";
import { Settings, LogOut, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../../../contexts/AuthContext";
import { useLMSStandard } from "../../../../hooks/useLMSStandard";
import { EnfantSelector } from "../../../../components/lms/EnfantSelector";
import { CoursNiveauPanel } from "../../../../components/lms/CoursNiveauPanel";
import { CompetencesNiveauPanel } from "../../../../components/lms/CompetencesNiveauPanel";
import { PlanificateurPeriode } from "../../../../components/lms/PlanificateurPeriode";
import { PlanHebdomadaireDisplay } from "../../../../components/lms/PlanHebdomadaireDisplay";
import { PlaceholderSuivi } from "../../../../components/PlaceholderSuivi";
import { EnfantData, Enfant, getGradeLabel } from "../../../../types/lms";

export default function LMSStandardPage() {
  const { user, logout } = useAuth();
  const [enfants, setEnfants] = useState<EnfantData[]>([]);
  const [loadingEnfants, setLoadingEnfants] = useState(true);

  const {
    enfantSelectionne,
    coursDisponibles,
    competencesNiveau,
    planGenere,
    configuration,
    loading,
    error,
    selectionnerEnfant,
    mettreAJourConfiguration,
    genererPlan,
    planifierSemaine
  } = useLMSStandard();

  // Charger les enfants du parent
  useEffect(() => {
    const fetchEnfants = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(`/api/parent/enfants-secure`, {
          headers: {
            'Content-Type': 'application/json',
            'x-user-data': localStorage.getItem('userData') || JSON.stringify(user),
          },
        });

        if (response.ok) {
          const data = await response.json();
          const enfantsFormatted = data.enfants.map((enfant: Enfant) => ({
            id: enfant.id,
            name: enfant.prenom,
            age: new Date().getFullYear() - enfant.anneeNaissance,
            grade: getGradeLabel(enfant.niveauScolaire || null),
            avatar: enfant.prenom.charAt(0).toUpperCase(),
            niveauScolaire: enfant.niveauScolaire
          }));
          setEnfants(enfantsFormatted);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des enfants:', error);
      } finally {
        setLoadingEnfants(false);
      }
    };

    fetchEnfants();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/logo.png" alt="Profs Académie" className="w-8 h-8" />
              <span className="text-xl font-bold text-dark-900">Profs Académie</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">{user?.email}</span>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/dashboard/parent">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au tableau de bord
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Système de Gestion de l'Apprentissage
          </h1>
          <p className="text-gray-600">
            Gérez les cours et compétences de vos enfants selon le programme québécois
          </p>
        </div>

        {/* Sélection d'enfant */}
        {loadingEnfants ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des enfants...</p>
          </div>
        ) : (
          <EnfantSelector 
            enfants={enfants}
            enfantSelectionne={enfantSelectionne}
            onSelectionner={selectionnerEnfant}
          />
        )}

        {/* Affichage des erreurs */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Contenu principal - Affiché seulement si un enfant est sélectionné */}
        {enfantSelectionne && (
          <>
            {/* En-tête enfant sélectionné */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{enfantSelectionne.name}</h2>
                  <p className="text-gray-600">{enfantSelectionne.grade}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Âge</p>
                  <p className="text-lg font-semibold text-gray-900">{enfantSelectionne.age} ans</p>
                </div>
              </div>
            </div>

            {/* Trois panneaux principaux */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Panneau 1 : Cours du niveau */}
              <div>
                <CoursNiveauPanel 
                  coursParMatiere={coursDisponibles}
                  niveau={enfantSelectionne.grade}
                  loading={loading}
                />
              </div>

              {/* Panneau 2 : Compétences du niveau */}
              <div>
                <CompetencesNiveauPanel 
                  competencesParMatiere={competencesNiveau}
                  niveau={enfantSelectionne.grade}
                  loading={loading}
                />
              </div>

              {/* Panneau 3 : Planification par périodes */}
              <div>
                <PlanificateurPeriode 
                  configuration={configuration}
                  onMettreAJourConfiguration={mettreAJourConfiguration}
                  onGenererPlan={genererPlan}
                  loading={loading}
                  enfantSelectionne={!!enfantSelectionne}
                />
              </div>
            </div>

            {/* Affichage du plan généré */}
            {planGenere && (
              <div className="mb-8">
                <PlanHebdomadaireDisplay 
                  plan={planGenere}
                  onPlanifierSemaine={planifierSemaine}
                />
              </div>
            )}

            {/* Placeholder pour le suivi de progression */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Suivi de progression</h2>
              <PlaceholderSuivi />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
