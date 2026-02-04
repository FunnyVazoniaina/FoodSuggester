import { useState } from "react";
import { Icon } from "@iconify/react";
import NutritionAIChat from "./NutritionAIChat";

const FloatingChatButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#FF6B35] to-[#E85826] text-white rounded-full p-4 md:p-5 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 group animate-fade-in"
        aria-label="Ouvrir le chat nutritionnel"
        title="Parler de l'alimentation avec notre assistant"
      >
        <Icon icon="mdi:brain" className="w-6 h-6 md:w-7 md:h-7" />

        {/* Tooltip on hover */}
        <div className="absolute bottom-full right-0 mb-3 bg-gray-800 text-white text-xs md:text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <span>Assistant culinaire</span>
          <div className="absolute top-full right-2 w-2 h-2 bg-gray-800 transform rotate-45"></div>
        </div>
      </button>

      {/* Chat Modal */}
      <NutritionAIChat isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default FloatingChatButton;
