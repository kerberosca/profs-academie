import { Button } from "@profs-academie/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@profs-academie/ui";
import { Badge } from "@profs-academie/ui";
import { Calendar, Clock, Target, Play } from "lucide-react";
import { PlanPeriode } from "../../types/lms";

interface PlanHebdomadaireDisplayProps {
  plan: PlanPeriode;
  onPlanifierSemaine: (semaine: number, competenceId: string) => void;
}

export function PlanHebdomadaireDisplay({ plan, onPlanifierSemaine }: PlanHebdomadaireDisplayProps) {
  return (
    <div className="space-y-6">
      {/* En-tête du plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Plan d'apprentissage généré
          </CardTitle>
          <CardDescription>
            {plan.enfantNom} • {plan.niveau} • {plan.semaines.length} semaines
            <br />
            Du {new Date(plan.configuration.dateDebut).toLocaleDateString('fr-CA')} 
            au {new Date(plan.configuration.dateFin).toLocaleDateString('fr-CA')}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Plan par semaines */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Plan hebdomadaire</h3>
        
        {plan.semaines.map((semaine) => (
          <Card key={semaine.semaine} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Semaine {semaine.semaine}
                </CardTitle>
                <Badge variant="outline">
                  {semaine.sessions.length} sessions
                </Badge>
              </div>
              <CardDescription>
                Du {new Date(semaine.dateDebut).toLocaleDateString('fr-CA')} 
                au {new Date(semaine.dateFin).toLocaleDateString('fr-CA')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Sessions par matière */}
                {semaine.sessions.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {semaine.sessions.map((session) => (
                      <div 
                        key={session.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {session.matiere}
                            </Badge>
                            <span className="text-xs text-gray-500">{session.jour}</span>
                          </div>
                          <h6 className="font-medium text-sm text-gray-900 mt-1">
                            {session.competenceNom}
                          </h6>
                          {session.contenuNom && (
                            <p className="text-xs text-gray-600 mt-1">
                              {session.contenuNom}
                            </p>
                          )}
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            {session.dureeMinutes} minutes
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onPlanifierSemaine(semaine.semaine, session.competenceId)}
                          className="ml-3"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Planifier
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Aucune session planifiée pour cette semaine</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Note sur les placeholders */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-2">
            <Target className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">
                Fonctionnalité de suivi à venir
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Les boutons "Planifier" sont des placeholders. 
                Le système de suivi de progression sera implémenté dans une version future.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
