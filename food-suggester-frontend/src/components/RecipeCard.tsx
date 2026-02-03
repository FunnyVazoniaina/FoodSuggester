import { useState } from "react";
import { Icon } from "@iconify/react";
import { recipeService } from "../services/api";

interface RecipeCardProps {
  recipe: {
    id: number;
    title: string;
    image: string;
    usedIngredientCount: number;
    missedIngredientCount: number;
    likes?: number;
    isFavorite?: boolean;
    sourceUrl?: string;
    instructions?: string;
    readyInMinutes?: number;
    preparationMinutes?: number;
    cookingMinutes?: number;
    steps?: Array<{
      number: number;
      step: string;
    }>;
  };
  onFavoriteToggle?: () => void;
  showFavoriteButton?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onFavoriteToggle,
  showFavoriteButton = true,
}) => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleFavoriteClick = async () => {
    try {
      if (recipe.isFavorite) {
        await recipeService.removeFavorite(recipe.id);
      } else {
        await recipeService.addFavorite(recipe.id, recipe.title, recipe.image);
      }
      onFavoriteToggle?.();
    } catch (error) {
      console.error("Error toggling favorite", error);
    }
  };

  const handleOpenSourceUrl = () => {
    if (recipe.sourceUrl) {
      window.open(recipe.sourceUrl, "_blank");
    }
  };

  const InfoItem = ({
    icon,
    color,
    text,
  }: {
    icon: string;
    color: string;
    text: string;
  }) => (
    <div className="flex items-center mb-2">
      <Icon icon={icon} className={`w-5 h-5 ${color} mr-2`} />
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  );

  return (
    <>
      {/* Recipe Card */}
      <div className="max-w-sm h-full flex flex-col bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-45 object-cover rounded-t-lg"
        />

        <div className="flex-1 p-4">
          <h3
            className="text-lg font-semibold mb-3 truncate"
            title={recipe.title}
          >
            {recipe.title}
          </h3>

          <InfoItem
            icon="mdi:check-circle"
            color="text-green-500"
            text={`${recipe.usedIngredientCount} ingrédients utilisés`}
          />
          <InfoItem
            icon="mdi:alert-circle"
            color="text-orange-500"
            text={`${recipe.missedIngredientCount} ingrédients manquants`}
          />
          {recipe.readyInMinutes && (
            <InfoItem
              icon="mdi:clock-outline"
              color="text-blue-500"
              text={`Prêt en ${recipe.readyInMinutes} minutes`}
            />
          )}
        </div>

        <div className="flex items-center justify-between p-4 pt-0">
          <div className="flex items-center gap-2">
            {showFavoriteButton && (
              <button
                onClick={handleFavoriteClick}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title={
                  recipe.isFavorite
                    ? "Retirer des favoris"
                    : "Ajouter aux favoris"
                }
              >
                <Icon
                  icon={recipe.isFavorite ? "mdi:heart" : "mdi:heart-outline"}
                  className={`w-6 h-6 ${recipe.isFavorite ? "text-red-500" : "text-gray-500"}`}
                />
              </button>
            )}
            <button
              onClick={() => setOpenDialog(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Voir la recette"
            >
              <Icon
                icon="mdi:book-open-variant"
                className="w-6 h-6 text-gray-700"
              />
            </button>
          </div>

          {recipe.likes !== undefined && (
            <div className="flex items-center">
              <Icon
                icon="mdi:thumb-up"
                className="w-5 h-5 text-gray-500 mr-1"
              />
              <span className="text-sm text-gray-600">{recipe.likes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Recipe Dialog - Improved for mobile */}
      {openDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto flex flex-col">
            {/* Dialog Header - Sticky */}
            <div className="sticky top-0 bg-gradient-to-r from-white to-gray-50 border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between z-10 rounded-t-3xl">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 flex-1 pr-4 line-clamp-2">
                {recipe.title}
              </h2>
              <button
                onClick={() => setOpenDialog(false)}
                className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Icon icon="mdi:close" className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Dialog Content */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
              {/* Hero Image */}
              <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg -mx-4 md:mx-0 md:rounded-2xl">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Info Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {recipe.readyInMinutes && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="mdi:clock-outline"
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="text-xs font-semibold text-blue-700 uppercase">
                        Total
                      </span>
                    </div>
                    <p className="text-2xl md:text-3xl font-bold text-blue-900">
                      {recipe.readyInMinutes}
                    </p>
                    <p className="text-xs text-blue-700 mt-1">minutes</p>
                  </div>
                )}
                {recipe.preparationMinutes && (
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="mdi:knife"
                        className="w-5 h-5 text-purple-600"
                      />
                      <span className="text-xs font-semibold text-purple-700 uppercase">
                        Prépa
                      </span>
                    </div>
                    <p className="text-2xl md:text-3xl font-bold text-purple-900">
                      {recipe.preparationMinutes}
                    </p>
                    <p className="text-xs text-purple-700 mt-1">min</p>
                  </div>
                )}
                {recipe.cookingMinutes && (
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="mdi:pot-steam"
                        className="w-5 h-5 text-red-600"
                      />
                      <span className="text-xs font-semibold text-red-700 uppercase">
                        Cuisson
                      </span>
                    </div>
                    <p className="text-2xl md:text-3xl font-bold text-red-900">
                      {recipe.cookingMinutes}
                    </p>
                    <p className="text-xs text-red-700 mt-1">min</p>
                  </div>
                )}
              </div>

              {/* Ingredients Summary */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 md:p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Icon icon="mdi:leaf" className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Ingrédients
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-green-100">
                    <p className="text-2xl font-bold text-green-600">
                      {recipe.usedIngredientCount}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">utilisés</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-orange-100">
                    <p className="text-2xl font-bold text-orange-500">
                      {recipe.missedIngredientCount}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">manquants</p>
                  </div>
                </div>
              </div>

              {/* Instructions Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Icon
                      icon="mdi:book-open-variant"
                      className="w-5 h-5 text-white"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Instructions
                  </h3>
                </div>

                {recipe.instructions ? (
                  <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                      {recipe.instructions}
                    </p>
                  </div>
                ) : recipe.steps && recipe.steps.length > 0 ? (
                  <div className="space-y-3">
                    {recipe.steps.map((step) => (
                      <div key={step.number} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {step.number}
                          </div>
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                            {step.step}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                    <Icon
                      icon="mdi:information"
                      className="w-8 h-8 text-amber-600 mx-auto mb-2"
                    />
                    <p className="text-amber-800 text-sm">
                      Aucune instruction disponible. Consultez la source
                      originale.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Dialog Actions - Sticky Footer */}
            <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent border-t border-gray-100 px-4 md:px-8 py-4 flex gap-3 flex-col-reverse sm:flex-row">
              <button
                onClick={() => setOpenDialog(false)}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Fermer
              </button>
              {recipe.sourceUrl && (
                <button
                  onClick={handleOpenSourceUrl}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-semibold shadow-lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Icon icon="mdi:open-in-new" className="w-4 h-4" />
                    Voir la source
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecipeCard;
