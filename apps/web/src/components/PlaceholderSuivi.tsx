import { TrendingUp } from "lucide-react";

export function PlaceholderSuivi() {
  return (
    <div className="rounded border p-3 text-sm text-gray-600 bg-gray-50">
      <div className="flex items-center space-x-2">
        <TrendingUp className="w-4 h-4 text-gray-400" />
        <span>Ici s'affichera la progression (à venir).</span>
      </div>
    </div>
  );
}
