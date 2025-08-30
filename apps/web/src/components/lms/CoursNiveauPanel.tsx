import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@profs-academie/ui";
import { Badge } from "@profs-academie/ui";
import { BookOpen, Clock, ExternalLink } from "lucide-react";
import { CoursGouvernemental, MATIERES_LABELS } from "../../types/lms";

interface CoursNiveauPanelProps {
  coursParMatiere: Record<string, CoursGouvernemental[]>;
  niveau: string;
  loading: boolean;
}

export function CoursNiveauPanel({ coursParMatiere, niveau, loading }: CoursNiveauPanelProps) {
  if (loading) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Cours du niveau
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Chargement des cours...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const matieres = Object.keys(coursParMatiere);

  if (matieres.length === 0) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Cours du niveau
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun cours disponible pour ce niveau</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          Cours du niveau
        </CardTitle>
        <CardDescription>
          Cours officiels disponibles pour {niveau}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matieres.map((matiere) => (
            <div key={matiere}>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Badge variant="outline" className="mr-2">
                  {MATIERES_LABELS[matiere] || matiere}
                </Badge>
                <span className="text-sm text-gray-500">
                  ({coursParMatiere[matiere].length} cours)
                </span>
              </h4>
              <div className="space-y-2">
                {coursParMatiere[matiere].map((cours) => (
                  <div 
                    key={cours.id} 
                    className="p-3 border border-gray-200 rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm text-gray-900">{cours.titre}</h5>
                        {cours.description && (
                          <p className="text-xs text-gray-600 mt-1">{cours.description}</p>
                        )}
                        {cours.competences && cours.competences.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-600 mb-1">Compétences :</p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {cours.competences.slice(0, 2).map((competence, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-primary mr-1">•</span>
                                  <span>{competence}</span>
                                </li>
                              ))}
                              {cours.competences.length > 2 && (
                                <li className="text-gray-500 italic">
                                  +{cours.competences.length - 2} autres...
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-1 ml-3">
                        {cours.dureeEstimee && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {cours.dureeEstimee} min
                          </div>
                        )}
                        {cours.urlPdf && (
                          <a 
                            href={cours.urlPdf} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-xs text-primary hover:text-primary/80"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            PDF
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
