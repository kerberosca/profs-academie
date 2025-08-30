import { Button } from "@profs-academie/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@profs-academie/ui";
import { Calendar, Settings, Wand2 } from "lucide-react";
import { ConfigurationPeriode, FREQUENCES_DEFAUT, MATIERES_LABELS } from "../../types/lms";

interface PlanificateurPeriodeProps {
  configuration: ConfigurationPeriode;
  onMettreAJourConfiguration: (config: Partial<ConfigurationPeriode>) => void;
  onGenererPlan: () => void;
  loading: boolean;
  enfantSelectionne: boolean;
}

export function PlanificateurPeriode({ 
  configuration, 
  onMettreAJourConfiguration, 
  onGenererPlan, 
  loading,
  enfantSelectionne 
}: PlanificateurPeriodeProps) {
  
  const handleDateDebutChange = (date: string) => {
    onMettreAJourConfiguration({ dateDebut: date });
  };

  const handleDateFinChange = (date: string) => {
    onMettreAJourConfiguration({ dateFin: date });
  };

  const handleFrequenceChange = (matiere: string, frequence: number) => {
    onMettreAJourConfiguration({
      frequencesMatiere: {
        ...configuration.frequencesMatiere,
        [matiere]: frequence
      }
    });
  };

  const peutGenerer = enfantSelectionne && 
                      configuration.dateDebut && 
                      configuration.dateFin && 
                      new Date(configuration.dateFin) > new Date(configuration.dateDebut);

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Planification par périodes
        </CardTitle>
        <CardDescription>
          Configurez la période d'apprentissage et les fréquences par matière
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuration des dates */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Période d'apprentissage
          </h4>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début
              </label>
              <input
                type="date"
                value={configuration.dateDebut}
                onChange={(e) => handleDateDebutChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin
              </label>
              <input
                type="date"
                value={configuration.dateFin}
                onChange={(e) => handleDateFinChange(e.target.value)}
                min={configuration.dateDebut}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Configuration des fréquences */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Fréquences hebdomadaires par matière</h4>
          
          <div className="space-y-3">
            {Object.entries(FREQUENCES_DEFAUT).map(([matiere, frequenceDefaut]) => (
              <div key={matiere} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  {MATIERES_LABELS[matiere] || matiere}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={configuration.frequencesMatiere[matiere] || frequenceDefaut}
                    onChange={(e) => handleFrequenceChange(matiere, parseInt(e.target.value) || 0)}
                    className="w-16 p-1 border border-gray-300 rounded text-sm text-center"
                    disabled={loading}
                  />
                  <span className="text-xs text-gray-500">/semaine</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bouton de génération */}
        <div className="pt-4 border-t">
          <Button 
            onClick={onGenererPlan}
            disabled={!peutGenerer || loading}
            className="w-full"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            {loading ? 'Génération en cours...' : 'Générer le plan d\'apprentissage'}
          </Button>
          
          {!enfantSelectionne && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Sélectionnez d'abord un enfant
            </p>
          )}
          
          {enfantSelectionne && (!configuration.dateDebut || !configuration.dateFin) && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Définissez les dates de début et de fin
            </p>
          )}
          
          {enfantSelectionne && configuration.dateDebut && configuration.dateFin && 
           new Date(configuration.dateFin) <= new Date(configuration.dateDebut) && (
            <p className="text-xs text-red-500 mt-2 text-center">
              La date de fin doit être après la date de début
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
