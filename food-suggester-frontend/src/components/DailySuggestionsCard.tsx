import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import {
  suggestionsService,
  type DailySuggestion,
} from "../services/suggestions";

interface DailySuggestionsCardProps {
  type?: "aliment" | "conseil" | "suggestion";
}

export const DailySuggestionsCard: React.FC<DailySuggestionsCardProps> = ({
  type = "aliment",
}) => {
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
      <div className="bg-gray-100 rounded-2xl p-8 animate-pulse h-40 flex items-center justify-center">
        <div className="text-gray-400">Chargement...</div>
      </div>
    );
  }

  if (!suggestions) {
    return null;
  }

  // Render Aliment Vedette
  if (type === "aliment") {
    return (
      <div className="w-full h-full flex flex-col justify-center">
        <div className="bg-white border border-[#ede5df] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <Icon
              icon="mdi:leaf"
              className="w-8 h-8 text-[#2d6a4f] flex-shrink-0 mt-1"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[0.7rem] font-bold uppercase tracking-widest text-[#2d6a4f] bg-[#e6f4ea] rounded-full px-3 py-1 inline-block mb-3">
                Aliment vedette
              </span>
              <p className="text-[#2d6a4f] font-semibold text-lg sm:text-xl mb-2 break-words">
                {suggestions.featuredIngredient}
              </p>
              <p className="text-gray-600 text-sm">
                Découvrez les délicieuses recettes avec cet ingrédient
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Conseil du Jour
  if (type === "conseil") {
    return (
      <div className="w-full h-full flex flex-col justify-center">
        <div className="bg-white border border-[#ede5df] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <Icon
              icon="mdi:lightbulb"
              className="w-8 h-8 text-[#92400e] flex-shrink-0 mt-1"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[0.7rem] font-bold uppercase tracking-widest text-[#92400e] bg-[#fef3cd] rounded-full px-3 py-1 inline-block mb-3">
                Conseil du jour
              </span>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed break-words">
                {suggestions.tip}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Suggestion du Jour
  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div
        className="rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        style={{
          background: "linear-gradient(135deg,#fff5ee 0%,#ffe8d6 100%)",
          border: "1px solid #f5d5c0",
        }}
      >
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#FF6B35] opacity-[0.08]" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-[#E8472C] opacity-[0.06]" />

        <div className="relative z-10 flex items-start gap-4">
          <Icon
            icon="mdi:chef-hat"
            className="w-8 h-8 text-[#c2410c] flex-shrink-0 mt-1"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[0.7rem] font-bold uppercase tracking-widest text-[#c2410c] bg-[#ffe0cc] rounded-full px-3 py-1 inline-block mb-3">
              Suggestion du jour
            </span>
            <p className="text-[#4A4238] font-semibold text-lg sm:text-xl break-words">
              {suggestions.dailySuggestion}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
