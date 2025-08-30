import { EnfantData } from "../../types/lms";

interface EnfantSelectorProps {
  enfants: EnfantData[];
  enfantSelectionne: EnfantData | null;
  onSelectionner: (enfant: EnfantData) => void;
}

export function EnfantSelector({ enfants, enfantSelectionne, onSelectionner }: EnfantSelectorProps) {
  if (enfants.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Aucun enfant trouvé</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Sélectionner un enfant</h2>
      <div className="flex flex-wrap gap-4">
        {enfants.map((enfant) => (
          <button
            key={enfant.id}
            onClick={() => onSelectionner(enfant)}
            className={`p-4 rounded-lg border-2 transition-all min-w-[120px] ${
              enfantSelectionne?.id === enfant.id
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-200 bg-white hover:border-primary/50'
            }`}
          >
            <div className="text-2xl mb-2">{enfant.avatar}</div>
            <div className="text-sm font-medium">{enfant.name}</div>
            <div className="text-xs text-gray-500">{enfant.grade}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
