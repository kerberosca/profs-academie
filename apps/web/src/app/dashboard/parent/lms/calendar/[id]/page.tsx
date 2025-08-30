"use client";

import { useState, useEffect } from "react";
import { Button } from "@profs-academie/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@profs-academie/ui";
import { Badge } from "@profs-academie/ui";
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  ArrowLeft,
  Play,
  Pause,
  CheckCircle,
  CalendarDays,
  Users,
  Target,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "../../../../../../contexts/AuthContext";
import { StatutProgression } from "../../../../../../types/lms";

interface Session {
  id: string;
  titre: string;
  description?: string;
  dateDebut: string;
  dateFin?: string;
  dureePlanifiee: number;
  typeCours: string;
  statut: StatutProgression;
  notes?: string;
}

interface Calendrier {
  id: string;
  nom: string;
  description?: string;
  actif: boolean;
  createdAt: string;
  updatedAt: string;
  enfant: {
    id: string;
    prenom: string;
    nom?: string;
    niveauScolaire?: string;
  };
  sessions: Session[];
}

export default function CalendarViewPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [calendrier, setCalendrier] = useState<Calendrier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCalendrier = async () => {
      try {
        const response = await fetch(`/api/lms/calendriers/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCalendrier(data.calendrier);
        } else {
          setError("Calendrier non trouvé");
        }
      } catch (error) {
        setError("Erreur lors du chargement du calendrier");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCalendrier();
    }
  }, [id]);

  const getStatutColor = (statut: StatutProgression) => {
    switch (statut) {
      case 'NON_COMMENCE': return 'bg-gray-100 text-gray-800';
      case 'EN_COURS': return 'bg-blue-100 text-blue-800';
      case 'TERMINE': return 'bg-green-100 text-green-800';
      case 'EN_PAUSE': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutIcon = (statut: StatutProgression) => {
    switch (statut) {
      case 'NON_COMMENCE': return <Play className="w-4 h-4" />;
      case 'EN_COURS': return <TrendingUp className="w-4 h-4" />;
      case 'TERMINE': return <CheckCircle className="w-4 h-4" />;
      case 'EN_PAUSE': return <Pause className="w-4 h-4" />;
      default: return <Play className="w-4 h-4" />;
    }
  };

  const getStatutLabel = (statut: StatutProgression) => {
    switch (statut) {
      case 'NON_COMMENCE': return 'Non commencé';
      case 'EN_COURS': return 'En cours';
      case 'TERMINE': return 'Terminé';
      case 'EN_PAUSE': return 'En pause';
      default: return 'Non commencé';
    }
  };

  const groupSessionsByWeek = (sessions: Session[]) => {
    const weeks: { [key: string]: Session[] } = {};
    
    sessions.forEach(session => {
      const date = new Date(session.dateDebut);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Début de semaine (dimanche)
      
      const weekKey = weekStart.toISOString().split('T')[0];
      if (!weeks[weekKey]) {
        weeks[weekKey] = [];
      }
      weeks[weekKey].push(session);
    });

    return Object.entries(weeks).sort(([a], [b]) => a.localeCompare(b));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du calendrier...</p>
        </div>
      </div>
    );
  }

  if (error || !calendrier) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur</h3>
          <p className="text-gray-600 mb-4">{error || "Calendrier non trouvé"}</p>
          <Link href="/dashboard/parent/lms">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au LMS
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const weeks = groupSessionsByWeek(calendrier.sessions);
  const totalSessions = calendrier.sessions.length;
  const completedSessions = calendrier.sessions.filter(s => s.statut === 'TERMINE').length;
  const inProgressSessions = calendrier.sessions.filter(s => s.statut === 'EN_COURS').length;
  const totalDuration = calendrier.sessions.reduce((sum, s) => sum + s.dureePlanifiee, 0);

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

        {/* En-tête du calendrier */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{calendrier.nom}</h1>
              <p className="text-gray-600">{calendrier.description}</p>
            </div>
            <Badge variant={calendrier.actif ? "default" : "secondary"}>
              {calendrier.actif ? "Actif" : "Inactif"}
            </Badge>
          </div>

          {/* Informations sur l'enfant */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {calendrier.enfant.prenom} {calendrier.enfant.nom}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Niveau: {calendrier.enfant.niveauScolaire || "Non spécifié"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sessions totales</p>
                    <p className="text-xl font-bold text-gray-900">{totalSessions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Terminées</p>
                    <p className="text-xl font-bold text-gray-900">{completedSessions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">En cours</p>
                    <p className="text-xl font-bold text-gray-900">{inProgressSessions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Durée totale</p>
                    <p className="text-xl font-bold text-gray-900">
                      {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sessions par semaine */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900">Sessions par semaine</h2>
          
          {weeks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune session</h3>
                <p className="text-gray-600">Aucune session n'a été planifiée dans ce calendrier.</p>
              </CardContent>
            </Card>
          ) : (
            weeks.map(([weekStart, sessions]) => {
              const weekDate = new Date(weekStart);
              const weekEnd = new Date(weekDate);
              weekEnd.setDate(weekDate.getDate() + 6);

              return (
                <Card key={weekStart}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Semaine du {weekDate.toLocaleDateString('fr-CA')} au {weekEnd.toLocaleDateString('fr-CA')}
                    </CardTitle>
                    <CardDescription>
                      {sessions.length} session{sessions.length > 1 ? 's' : ''} planifiée{sessions.length > 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{session.titre}</h4>
                                {session.description && (
                                  <p className="text-sm text-gray-600">{session.description}</p>
                                )}
                                <div className="flex items-center space-x-4 mt-2">
                                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                                    <Clock className="w-4 h-4" />
                                    <span>{session.dureePlanifiee} min</span>
                                  </div>
                                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(session.dateDebut).toLocaleDateString('fr-CA')}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge className={getStatutColor(session.statut)}>
                              {getStatutIcon(session.statut)}
                              <span className="ml-1">{getStatutLabel(session.statut)}</span>
                            </Badge>
                            <Button variant="outline" size="sm">
                              Démarrer
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
