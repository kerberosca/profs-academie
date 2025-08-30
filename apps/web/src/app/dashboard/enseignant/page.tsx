"use client";

import { useState } from "react";
import { Button } from "@profs-academie/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@profs-academie/ui";
import { Badge } from "@profs-academie/ui";
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Calendar,
  Plus,
  Settings,
  LogOut,
  User,
  Star,
  Target,
  Clock,
  Edit,
  Eye,
  BarChart3,
  MessageSquare,
  Award
} from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "../../../components/ProtectedRoute";

// Données de démonstration
const mockCourses = [
  {
    id: 1,
    title: "Mathématiques - Les fractions",
    subject: "Mathématiques",
    grade: "3ème année",
    students: 24,
    progress: 85,
    status: "active",
    lastUpdated: "Il y a 2 heures",
    rating: 4.8,
    lessons: 12,
    completedLessons: 8
  },
  {
    id: 2,
    title: "Français - La lecture",
    subject: "Français",
    grade: "2ème année",
    students: 18,
    progress: 65,
    status: "active",
    lastUpdated: "Il y a 1 jour",
    rating: 4.6,
    lessons: 15,
    completedLessons: 10
  },
  {
    id: 3,
    title: "Sciences - Les plantes",
    subject: "Sciences",
    grade: "4ème année",
    students: 22,
    progress: 45,
    status: "draft",
    lastUpdated: "Il y a 3 jours",
    rating: 0,
    lessons: 8,
    completedLessons: 3
  }
];

const mockStudents = [
  {
    id: 1,
    name: "Emma Tremblay",
    grade: "3ème année",
    avatar: "👧",
    progress: 92,
    lastActivity: "Il y a 30 min",
    completedCourses: 8,
    totalCourses: 10,
    performance: "excellent"
  },
  {
    id: 2,
    name: "Lucas Bouchard",
    grade: "3ème année",
    avatar: "👦",
    progress: 78,
    lastActivity: "Il y a 2 heures",
    completedCourses: 6,
    totalCourses: 10,
    performance: "good"
  },
  {
    id: 3,
    name: "Sophie Martin",
    grade: "3ème année",
    avatar: "👧",
    progress: 85,
    lastActivity: "Il y a 1 heure",
    completedCourses: 7,
    totalCourses: 10,
    performance: "excellent"
  }
];

const mockStats = {
  totalStudents: 64,
  activeCourses: 3,
  totalLessons: 35,
  averageRating: 4.7,
  monthlyEarnings: 1250
};

function EnseignantDashboardContent() {
  const [selectedCourse, setSelectedCourse] = useState(mockCourses[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Profs Académie" className="w-8 h-8" />
            <span className="text-xl font-bold text-gray-900">Profs Académie</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-gray-700">Jean Bouchard</span>
            </div>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bonjour Jean ! 👨‍🏫
          </h1>
          <p className="text-gray-600">
            Voici un aperçu de vos cours et de vos élèves
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Élèves</p>
                  <p className="text-xl font-bold text-gray-900">{mockStats.totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cours actifs</p>
                  <p className="text-xl font-bold text-gray-900">{mockStats.activeCourses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Leçons</p>
                  <p className="text-xl font-bold text-gray-900">{mockStats.totalLessons}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Note moyenne</p>
                  <p className="text-xl font-bold text-gray-900">{mockStats.averageRating}/5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Revenus</p>
                  <p className="text-xl font-bold text-gray-900">${mockStats.monthlyEarnings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mes Cours</h2>
            <Button className="btn-child">
              <Plus className="w-4 h-4 mr-2" />
              Créer un cours
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockCourses.map((course) => (
              <Card 
                key={course.id} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedCourse.id === course.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedCourse(course)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription>
                        {course.subject} • {course.grade}
                      </CardDescription>
                    </div>
                    <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                      {course.status === 'active' ? 'Actif' : 'Brouillon'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Élèves</span>
                      <span className="font-medium">{course.students}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progression</span>
                      <span className="font-medium">{course.completedLessons}/{course.lessons} leçons</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-warning fill-current" />
                        <span className="text-sm font-medium">{course.rating}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">{course.lastUpdated}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Selected Course Details */}
        {selectedCourse && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{selectedCourse.title}</CardTitle>
                  <CardDescription>
                    {selectedCourse.subject} • {selectedCourse.grade} • {selectedCourse.students} élèves
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Messages
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Course Progress */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Target className="w-4 h-4 mr-2 text-primary" />
                    Progression du cours
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Leçons créées</span>
                        <span>{selectedCourse.completedLessons}/{selectedCourse.lessons}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${(selectedCourse.completedLessons/selectedCourse.lessons)*100}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Élèves actifs</span>
                        <span>{Math.round(selectedCourse.students * 0.8)}/{selectedCourse.students}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-success h-2 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Note moyenne</span>
                        <span>{selectedCourse.rating}/5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-warning h-2 rounded-full" style={{ width: `${(selectedCourse.rating/5)*100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-primary" />
                    Activité récente
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 p-2 bg-success/10 rounded">
                      <Users className="w-4 h-4 text-success" />
                      <span className="text-sm">5 nouveaux élèves inscrits</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-primary/10 rounded">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="text-sm">Leçon 8 complétée par 18 élèves</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-warning/10 rounded">
                      <Star className="w-4 h-4 text-warning" />
                      <span className="text-sm">Nouvelle évaluation 5 étoiles</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Edit className="w-4 h-4 mr-2 text-primary" />
                    Actions rapides
                  </h4>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter une leçon
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Voir les statistiques
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Envoyer un message
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier le cours
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Students */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Meilleurs Élèves</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockStudents.map((student) => (
              <Card key={student.id} className="cursor-pointer hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{student.avatar}</div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                      <CardDescription>{student.grade}</CardDescription>
                    </div>
                    <Badge variant={student.performance === 'excellent' ? 'default' : 'secondary'}>
                      {student.performance === 'excellent' ? 'Excellent' : 'Bon'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progression</span>
                      <span className="font-medium">{student.progress}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Cours complétés</span>
                      <span className="font-medium">{student.completedCourses}/{student.totalCourses}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">{student.lastActivity}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Créer un cours</h3>
              <p className="text-sm text-gray-600 mb-4">Développez de nouveaux contenus éducatifs</p>
              <Button variant="outline" className="w-full">Commencer</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold mb-2">Analytics</h3>
              <p className="text-sm text-gray-600 mb-4">Analysez les performances de vos cours</p>
              <Button variant="outline" className="w-full">Voir</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-warning" />
              </div>
              <h3 className="font-semibold mb-2">Messages</h3>
              <p className="text-sm text-gray-600 mb-4">Communiquez avec vos élèves</p>
              <Button variant="outline" className="w-full">Ouvrir</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function EnseignantDashboard() {
  return (
    <ProtectedRoute allowedRoles={['TEACHER']}>
      <EnseignantDashboardContent />
    </ProtectedRoute>
  );
}
