'use client';
import { useState, useEffect } from "react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from "@profs-academie/ui";
import { Calendar, Clock, BookOpen, Target, Plus, CalendarDays, Users, FileText } from "lucide-react";
import { useAuth } from "../../../../contexts/AuthContext";
import { useLearningPlan } from "../../../../hooks/useLearningPlan";
import { getGradeLabel } from "../../../../types/lms";

interface EnfantData {
  id: string;
  prenom: string;
  nom?: string;
  anneeNaissance: number;
  niveauScolaire?: string;
}

export default function LearningPlansPage() {
  const { user } = useAuth();
  const [children, setChildren] = useState<EnfantData[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const {
    currentPlan,
    loading: planLoading,
    error,
    generatePlan,
    planWeek,
    clearPlan,
    clearError
  } = useLearningPlan();

  useEffect(() => {
    const fetchChildren = async () => {
      if (!user) return;
      try {
        const userData = localStorage.getItem('userData');
        const response = await fetch(`/api/parent/enfants-secure`, {
          headers: { 
            'Content-Type': 'application/json', 
            'x-user-data': userData || JSON.stringify(user) 
          },
        });
        if (response.ok) {
          const data = await response.json();
          setChildren(data.enfants || []);
          if (data.enfants && data.enfants.length > 0) {
            setSelectedChildId(data.enfants[0].id);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des enfants:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, [user]);

  const handleGeneratePlan = async () => {
    if (!selectedChildId || !startDate || !endDate) {
      alert('Veuillez sélectionner un enfant et définir les dates de début et fin');
      return;
    }

    try {
      await generatePlan({
        childId: selectedChildId,
        startDate,
        endDate
      });
    } catch (error) {
      console.error('Erreur lors de la génération du plan:', error);
    }
  };

  const handlePlanWeek = async (weekNumber: number, subject: string, competencyId: string) => {
    if (!selectedChildId) return;
    
    try {
      await planWeek({
        weekNumber,
        childId: selectedChildId,
        subject,
        competencyId
      });
    } catch (error) {
      console.error('Erreur lors de la planification:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Plans d'apprentissage</h1>
          <p className="text-gray-600">
            Générez des plans d'apprentissage par périodes pour vos enfants
          </p>
        </div>

        {/* Configuration */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Configuration du plan</span>
            </CardTitle>
            <CardDescription>
              Sélectionnez un enfant et définissez la période d'apprentissage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enfant
                </label>
                <select
                  value={selectedChildId || ''}
                  onChange={(e) => setSelectedChildId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Sélectionner un enfant</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.prenom} {child.nom} ({child.niveauScolaire ? getGradeLabel(convertNiveauToGradeKey(child.niveauScolaire)) : 'Niveau non défini'})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de début
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={handleGeneratePlan} 
                  disabled={planLoading || !selectedChildId || !startDate || !endDate}
                  className="w-full"
                >
                  {planLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Générer le plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-red-700">
                <span className="text-sm font-medium">Erreur:</span>
                <span className="text-sm">{error}</span>
                <Button variant="ghost" size="sm" onClick={clearError} className="ml-auto">
                  ✕
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plan Display */}
        {currentPlan && (
          <div className="space-y-6">
            {/* Plan Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5" />
                      <span>Plan d'apprentissage - {currentPlan.childName}</span>
                    </CardTitle>
                    <CardDescription>
                      {getGradeLabel(currentPlan.grade)} • {currentPlan.totalWeeks} semaines
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <CalendarDays className="w-4 h-4" />
                      <span>{formatDate(currentPlan.startDate)} - {formatDate(currentPlan.endDate)}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={clearPlan}>
                      Nouveau plan
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Weeks */}
            <div className="space-y-6">
              {currentPlan.weeks.map((week) => (
                <Card key={week.weekNumber}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <CalendarDays className="w-5 h-5" />
                        <span>Semaine {week.weekNumber}</span>
                      </span>
                      <div className="text-sm text-gray-600">
                        {formatDate(week.startDate)} - {formatDate(week.endDate)}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {week.subjects.map((subject) => (
                        <div key={subject.subject} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-lg">{subject.title}</h4>
                            <Badge variant="outline">
                              {subject.weeklyFrequency} session{subject.weeklyFrequency > 1 ? 's' : ''}/semaine
                            </Badge>
                          </div>
                          
                          <div className="space-y-3">
                            {subject.sessions.map((session) => (
                              <div key={session.id} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h5 className="font-medium text-gray-900 mb-1">
                                      {session.contenuNom || session.competencyTitle}
                                    </h5>
                                    <p className="text-sm text-gray-600 mb-2">
                                      {session.contenuDescription || session.competencyDescription}
                                    </p>
                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                      <span className="flex items-center space-x-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{session.durationMinutes} min</span>
                                      </span>
                                      <span className="flex items-center space-x-1">
                                        <Target className="w-3 h-3" />
                                        <span>Session {session.order}</span>
                                      </span>
                                    </div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePlanWeek(
                                      week.weekNumber,
                                      subject.subject,
                                      session.competencyId
                                    )}
                                    className="ml-4"
                                  >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Planifier cette semaine
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!currentPlan && !planLoading && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucun plan d'apprentissage
              </h3>
              <p className="text-gray-600 mb-6">
                Générez votre premier plan d'apprentissage en sélectionnant un enfant et en définissant une période.
              </p>
              <div className="text-sm text-gray-500">
                <p>Le plan inclura :</p>
                <ul className="mt-2 space-y-1">
                  <li>• Répartition hebdomadaire des matières</li>
                  <li>• Sessions basées sur les compétences officielles</li>
                  <li>• Mélange équilibré des apprentissages</li>
                  <li>• Boutons de planification pour chaque session</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Fonction utilitaire pour convertir les niveaux existants en GradeKey
function convertNiveauToGradeKey(niveauScolaire: string | null): string {
  if (!niveauScolaire) return 'P1';

  const mapping: Record<string, string> = {
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

  return mapping[niveauScolaire] || 'P1';
}
