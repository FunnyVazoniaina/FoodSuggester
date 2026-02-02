import { useState } from 'react';
import { Icon } from '@iconify/react';
import { recipeService } from '../services/api';

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
  showFavoriteButton = true
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
      console.error('Error toggling favorite', error);
    }
  };

  const handleOpenSourceUrl = () => {
    if (recipe.sourceUrl) {
      window.open(recipe.sourceUrl, '_blank');
    }
  };

  const InfoItem = ({ icon, color, text }: { icon: string; color: string; text: string }) => (
    <div className="flex items-center mb-2">
      <Icon icon={icon} className={`w-5 h-5 ${color} mr-2`} />
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  );

  const TimeInfo = ({ icon, color, label, value }: { icon: string; color: string; label: string; value: number }) => (
    <div className="flex items-center mb-2">
      <Icon icon={icon} className={`w-6 h-6 ${color} mr-2`} />
      <span className="text-base">{label}: {value} minutes</span>
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
          <h3 className="text-lg font-semibold mb-3 truncate" title={recipe.title}>
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
                title={recipe.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                <Icon 
                  icon={recipe.isFavorite ? "mdi:heart" : "mdi:heart-outline"} 
                  className={`w-6 h-6 ${recipe.isFavorite ? 'text-red-500' : 'text-gray-500'}`}
                />
              </button>
            )}
            <button
              onClick={() => setOpenDialog(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Voir la recette"
            >
              <Icon icon="mdi:book-open-variant" className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          
          {recipe.likes !== undefined && (
            <div className="flex items-center">
              <Icon icon="mdi:thumb-up" className="w-5 h-5 text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">{recipe.likes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Recipe Dialog */}
      {openDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Dialog Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">{recipe.title}</h2>
              <button
                onClick={() => setOpenDialog(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <Icon icon="mdi:close" className="w-6 h-6" />
              </button>
            </div>
            
            {/* Dialog Content */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row mb-6">
                <div className="md:w-2/5 md:mr-6 mb-4 md:mb-0">
                  <img 
                    src={recipe.image} 
                    alt={recipe.title} 
                    className="w-full rounded-lg" 
                  />
                </div>
                
                <div className="md:w-3/5">
                  <h3 className="text-lg font-semibold mb-4">Temps de préparation</h3>
                  <div className="space-y-2 mb-6">
                    {recipe.readyInMinutes && (
                      <TimeInfo icon="mdi:clock-outline" color="text-blue-500" label="Temps total" value={recipe.readyInMinutes} />
                    )}
                    {recipe.preparationMinutes && (
                      <TimeInfo icon="mdi:knife" color="text-purple-500" label="Préparation" value={recipe.preparationMinutes} />
                    )}
                    {recipe.cookingMinutes && (
                      <TimeInfo icon="mdi:pot-steam" color="text-red-500" label="Cuisson" value={recipe.cookingMinutes} />
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">Ingrédients</h3>
                  <p className="text-gray-600 mb-4">
                    {recipe.usedIngredientCount} ingrédients utilisés, {recipe.missedIngredientCount} ingrédients manquants
                  </p>
                </div>
              </div>
              
              <hr className="my-6" />
              
              <h3 className="text-lg font-semibold mb-4">Instructions</h3>
              
              {recipe.instructions ? (
                <p className="text-base leading-relaxed mb-4">{recipe.instructions}</p>
              ) : recipe.steps && recipe.steps.length > 0 ? (
                <div className="space-y-4">
                  {recipe.steps.map((step) => (
                    <div key={step.number} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-blue-700 mb-1">Étape {step.number}</h4>
                      <p className="text-gray-700">{step.step}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mb-4">
                  Aucune instruction disponible. Consultez la source originale pour plus de détails.
                </p>
              )}
              
              {recipe.sourceUrl && (
                <p className="text-sm text-gray-500 mt-4">
                  Pour des instructions plus détaillées, consultez la source originale.
                </p>
              )}
            </div>
            
            {/* Dialog Actions */}
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
              {recipe.sourceUrl && (
                <button
                  onClick={handleOpenSourceUrl}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Voir la source originale
                </button>
              )}
              <button
                onClick={() => setOpenDialog(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecipeCard;
