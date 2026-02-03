import { useEffect, useState } from "react";
import {
  suggestionsService,
  type DailySuggestion,
} from "../services/suggestions";

export const DailySuggestionsCard = () => {
  const [suggestions, setSuggestions] = useState<DailySuggestion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const data = await suggestionsService.getSuggestions();
        setSuggestions(data);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-100 rounded-lg p-4 animate-pulse h-20"></div>
        <div className="bg-gray-100 rounded-lg p-4 animate-pulse h-20"></div>
        <div className="bg-gray-100 rounded-lg p-4 animate-pulse h-20"></div>
      </div>
    );
  }

  if (!suggestions) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Aliment Vedette */}
      <div className="bg-white border border-[#ede5df] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[0.68rem] font-bold uppercase tracking-widest text-[#2d6a4f] bg-[#e6f4ea] rounded-full px-2 py-0.5">
                Aliment vedette
              </span>
            </div>
            <p className="text-[#2d6a4f] font-semibold text-sm mb-1">
              {suggestions.featuredIngredient}
            </p>
            <p className="text-gray-600 text-xs">
              Découvrez les délicieuses recettes avec cet ingrédient
            </p>
          </div>
        </div>
      </div>

      {/* Conseil du Jour */}
      <div className="bg-white border border-[#ede5df] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[0.68rem] font-bold uppercase tracking-widest text-[#92400e] bg-[#fef3cd] rounded-full px-2 py-0.5">
                Conseil du jour
              </span>
            </div>
            <p className="text-gray-700 text-sm">{suggestions.tip}</p>
          </div>
        </div>
      </div>

      {/* Suggestion du Jour */}
      <div
        className="rounded-2xl p-5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        style={{
          background: "linear-gradient(135deg,#fff5ee 0%,#ffe8d6 100%)",
          border: "1px solid #f5d5c0",
        }}
      >
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#FF6B35] opacity-[0.08]" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-[#E8472C] opacity-[0.06]" />

        <div className="relative z-10 flex items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[0.68rem] font-bold uppercase tracking-widest text-[#c2410c] bg-[#ffe0cc] rounded-full px-2 py-0.5">
                Suggestion du jour
              </span>
            </div>
            <p className="text-[#4A4238] font-semibold text-sm mb-1">
              {suggestions.dailySuggestion}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
