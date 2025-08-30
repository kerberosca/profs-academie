"use client";

import { useState, useEffect } from "react";
import { Button } from "@profs-academie/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@profs-academie/ui";
import { Badge } from "@profs-academie/ui";

import { 
  BookOpen, 
  Calendar, 
  Users, 
  Plus,
  Settings,
  LogOut,
  User,
  Play,
  Trash2,
  Wand2,
  FileText,
  Clock,
  Info
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../../../contexts/AuthContext";
import { useCalendar } from "../../../../hooks/useCalendar";
import { PlaceholderSuivi } from "../../../../components/PlaceholderSuivi";
import { getGradeLabel, WEEK_DAYS, DEFAULT_TIME_SLOTS, HOURS_PER_WEEK_OPTIONS } from "../../../../types/lms";

interface Enfant {
  id: string;
  prenom: string;
  nom?: string;
  anneeNaissance: number;
  niveauScolaire?: string;
}

interface EnfantData {
  id: string;
  name: string;
  age: number;
  grade: string;
  avatar: string;
  niveauScolaire?: string;
}

export default function LMSPage() {
  const { user } = useAuth();
  const [children, setChildren] = useState<EnfantData[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Hook pour la gestion du calendrier
  const {
    selectedChild,
    selectedWeek,
    availableCourses,
    hoursPerWeek,
    loading: calendarLoading,
    error,
    fetchChild,
    setHoursPerWeek,
    generateWeek,
    createEmptyWeek,
    addEvent,
    updateEvent,
    deleteEvent
  } = useCalendar();

  // Charger les enfants du parent
  useEffect(() => {
    const fetchChildren = async () => {
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
            grade: enfant.niveauScolaire || 'Niveau non défini',
            avatar: enfant.prenom.charAt(0).toUpperCase(),
            niveauScolaire: enfant.niveauScolaire
          }));
          setChildren(enfantsFormatted);
          
          // Sélectionner automatiquement le premier enfant
          if (enfantsFormatted.length > 0 && !selectedChildId) {
            setSelectedChildId(enfantsFormatted[0].id);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des enfants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, [user, selectedChildId]);

  // Charger les données de l'enfant sélectionné
  useEffect(() => {
    if (selectedChildId) {
      fetchChild(selectedChildId);
    }
  }, [selectedChildId, fetchChild]);

  // Obtenir le lundi de la semaine courante
  const getCurrentWeekStart = () => {
    const now = new Date();
    const monday = new Date(now);
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Ajuster pour lundi
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString();
  };

  // Générer automatiquement une semaine
  const handleGenerateWeek = async () => {
    if (!selectedChildId) return;
    const weekStart = getCurrentWeekStart();
    await generateWeek(selectedChildId, weekStart, hoursPerWeek);
  };

  // Créer une semaine vide
  const handleCreateEmptyWeek = async () => {
    if (!selectedChildId) return;
    const weekStart = getCurrentWeekStart();
    await createEmptyWeek(selectedChildId, weekStart);
  };

  // Ajouter un cours au calendrier
  const handleAddCourse = async (course: any, dayIndex: number, timeSlotIndex: number) => {
    if (!selectedChildId || !selectedWeek) return;

    const weekStart = new Date(selectedWeek.weekStartISO);
    const targetDate = new Date(weekStart);
    targetDate.setDate(weekStart.getDate() + dayIndex);

    const timeSlot = DEFAULT_TIME_SLOTS[timeSlotIndex];
    const [hours, minutes] = timeSlot.start.split(':').map(Number);
    targetDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(targetDate);
    endDate.setMinutes(endDate.getMinutes() + course.durationMinutes);

    await addEvent({
      childId: selectedChildId,
      courseId: course.id,
      startISO: targetDate.toISOString(),
      endISO: endDate.toISOString()
    });
  };

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
              <Button variant="ghost" size="sm">
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
              ← Retour au tableau de bord
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Système de Gestion de l'Apprentissage</h1>
          <p className="text-gray-600">Générez et gérez les calendriers d'apprentissage pour vos enfants</p>
        </div>

        {/* Sélection d'enfant */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sélectionner un enfant</h2>
          <div className="flex space-x-4">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedChildId === child.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 bg-white hover:border-primary/50'
                }`}
              >
                <div className="text-2xl mb-2">{child.avatar}</div>
                <div className="text-sm font-medium">{child.name}</div>
                <div className="text-xs text-gray-500">{child.grade}</div>
              </button>
            ))}
          </div>
        </div>

        {selectedChild && (
          <>
            {/* Bandeau avec les informations de l'enfant et configuration */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedChild.firstName}</h2>
                  <p className="text-gray-600">{getGradeLabel(selectedChild.grade)}</p>
                </div>
                <div className="flex items-center space-x-4">
                  {/* Sélection du nombre d'heures par semaine */}
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Heures par semaine:</span>
                    <select
                      value={hoursPerWeek.toString()}
                      onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                      className="p-2 border border-gray-300 rounded-md text-sm w-48"
                    >
                      {HOURS_PER_WEEK_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value.toString()}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex space-x-3">
                    <Button onClick={handleGenerateWeek} disabled={calendarLoading}>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Générer automatiquement
                    </Button>
                    <Button variant="outline" onClick={handleCreateEmptyWeek} disabled={calendarLoading}>
                      <FileText className="w-4 h-4 mr-2" />
                      Créer semaine vide
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Colonne gauche : Cours disponibles */}
              <div className="lg:col-span-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Cours offerts pour ce niveau
                </h3>
                <div className="space-y-3">
                  {availableCourses.map((course) => (
                    <Card key={course.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{course.title}</CardTitle>
                          <Badge variant="outline">{course.subject}</Badge>
                        </div>
                        <CardDescription className="text-sm">
                          {course.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {/* Aperçu du cours */}
                        {course.outline && (
                          <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Info className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">Aperçu du cours</span>
                            </div>
                            <p className="text-sm text-blue-700">{course.outline}</p>
                          </div>
                        )}
                        
                        {/* Compétences */}
                        {course.competences && course.competences.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-gray-600 mb-1">Compétences attendues:</p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {course.competences.slice(0, 3).map((competence, index) => (
                                <li key={index} className="flex items-start space-x-1">
                                  <span className="text-blue-500 mt-1">•</span>
                                  <span>{competence}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex justify-between text-sm text-gray-600 mb-3">
                          <span>Durée: {course.durationMinutes} min</span>
                          <span>Fréquence: {course.weeklyFrequency}/semaine</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleAddCourse(course, 0, 0)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Ajouter
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Colonne droite : Calendrier de la semaine */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Calendrier de la semaine
                  {selectedWeek && (
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      ({selectedWeek.totalHours} heures totales)
                    </span>
                  )}
                </h3>
                
                {calendarLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement du calendrier...</p>
                  </div>
                ) : selectedWeek ? (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* En-tête avec les jours */}
                    <div className="grid grid-cols-6 bg-gray-50 border-b">
                      <div className="p-3 text-sm font-medium text-gray-500">Heure</div>
                      {WEEK_DAYS.map((day) => (
                        <div key={day.key} className="p-3 text-sm font-medium text-gray-900 text-center">
                          {day.short}
                        </div>
                      ))}
                    </div>

                    {/* Grille des créneaux horaires */}
                    <div className="divide-y">
                      {DEFAULT_TIME_SLOTS.map((timeSlot, timeIndex) => (
                        <div key={timeIndex} className="grid grid-cols-6">
                          <div className="p-3 text-sm text-gray-500 border-r">
                            {timeSlot.label}
                          </div>
                          {WEEK_DAYS.map((day, dayIndex) => {
                            const event = selectedWeek.events.find(event => {
                              const eventDate = new Date(event.startISO);
                              const eventDay = eventDate.getDay();
                              const eventHour = eventDate.getHours();
                              const eventMinute = eventDate.getMinutes();
                              
                              return eventDay === (dayIndex + 1) && 
                                     eventHour === parseInt(timeSlot.start.split(':')[0]) &&
                                     eventMinute === parseInt(timeSlot.start.split(':')[1]);
                            });

                            return (
                              <div 
                                key={day.key} 
                                className="p-2 border-r min-h-[80px] relative"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  // Logique de drop pour ajouter un cours
                                }}
                              >
                                {event ? (
                                  <div className="bg-primary/10 border border-primary/20 rounded p-2 text-xs">
                                    <div className="font-medium text-primary">{event.title}</div>
                                    <div className="text-gray-600">{event.course?.subject}</div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="absolute top-1 right-1 h-6 w-6 p-0"
                                      onClick={() => deleteEvent(event.id)}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                                    Libre
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun calendrier créé</h3>
                      <p className="text-gray-600 mb-4">
                        Créez votre premier calendrier d'étude pour {selectedChild.firstName}
                      </p>
                      <div className="flex space-x-3 justify-center">
                        <Button onClick={handleGenerateWeek}>
                          <Wand2 className="w-4 h-4 mr-2" />
                          Générer automatiquement
                        </Button>
                        <Button variant="outline" onClick={handleCreateEmptyWeek}>
                          <FileText className="w-4 h-4 mr-2" />
                          Créer semaine vide
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Espace réservé pour le suivi de progression */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Suivi de progression</h2>
              <PlaceholderSuivi />
            </div>
          </>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
