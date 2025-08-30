import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@profs-academie/ui";
import { Badge } from "@profs-academie/ui";
import { Target, Clock, List } from "lucide-react";
import { Competence, MATIERES_LABELS } from "../../types/lms";

interface CompetencesNiveauPanelProps {
  competencesParMatiere: Record<string, Competence[]>;
  niveau: string;
  loading: boolean;
}

export function CompetencesNiveauPanel({ competencesParMatiere, niveau, loading }: CompetencesNiveauPanelProps) {
  if (loading) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Compétences officielles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Chargement des compétences...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const matieres = Object.keys(competencesParMatiere);

  if (matieres.length === 0) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Compétences officielles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune compétence disponible pour ce niveau</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Compétences officielles
        </CardTitle>
        <CardDescription>
          Compétences du programme québécois pour {niveau}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matieres.map((matiere) => (
            <div key={matiere}>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Badge variant="secondary" className="mr-2">
                  {MATIERES_LABELS[matiere] || matiere}
                </Badge>
                <span className="text-sm text-gray-500">
                  ({competencesParMatiere[matiere].length} compétences)
                </span>
              </h4>
              <div className="space-y-2">
                {competencesParMatiere[matiere].map((competence) => (
                  <div 
                    key={competence.id} 
                    className="p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm text-gray-900">{competence.nom}</h5>
                        {competence.description && (
                          <p className="text-xs text-gray-600 mt-1">{competence.description}</p>
                        )}
                        {competence.contenus && competence.contenus.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-600 mb-1 flex items-center">
                              <List className="w-3 h-3 mr-1" />
                              Contenus d'apprentissage :
                            </p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {competence.contenus.slice(0, 3).map((contenu) => (
                                <li key={contenu.id} className="flex items-start">
                                  <span className="text-green-500 mr-1">•</span>
                                  <div className="flex-1">
                                    <span className="font-medium">{contenu.nom}</span>
                                    {contenu.dureeEstimee && (
                                      <span className="text-gray-500 ml-2">
                                        ({contenu.dureeEstimee} min)
                                      </span>
                                    )}
                                  </div>
                                </li>
                              ))}
                              {competence.contenus.length > 3 && (
                                <li className="text-gray-500 italic">
                                  +{competence.contenus.length - 3} autres contenus...
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        #{competence.ordre}
                      </Badge>
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
