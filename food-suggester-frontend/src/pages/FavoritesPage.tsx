import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Layout from "../components/Layout";
import RecipeCard from "../components/RecipeCard";
import { recipeService } from "../services/api";
import { useNavigate } from "react-router-dom";

interface Recipe {
  id: number;
  title: string;
  image: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  likes?: number;
  isFavorite?: boolean;
  sourceUrl?: string;
  steps?: any[];
  // Ajoute les autres propriétés si nécessaires
}

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await recipeService.getFavorites();
      const formattedFavorites = data.map((fav: any) => ({
        id: fav.id,
        title: fav.title,
        image: fav.image_url,
        usedIngredientCount: fav.usedIngredientCount ?? 0,
        missedIngredientCount: fav.missedIngredientCount ?? 0,
        likes: fav.likes,
        isFavorite: true,
        sourceUrl: fav.sourceUrl,
        steps: fav.steps,
      }));
      setFavorites(formattedFavorites);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError(
        "Une erreur est survenue lors de la récupération de vos favoris",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleFavoriteToggle = () => {
    fetchFavorites();
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
              <Icon icon="mdi:heart" className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Mes favoris
              </h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">
                {favorites.length}{" "}
                {favorites.length === 1 ? "recette" : "recettes"}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
            <Icon
              icon="mdi:alert-circle"
              className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
            />
            <p className="text-red-800 text-sm font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium text-sm">Chargement...</p>
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-max">
            {favorites.map((recipe) => (
              <div key={recipe.id} className="h-full">
                <RecipeCard
                  recipe={recipe}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon
                icon="mdi:heart-outline"
                className="w-8 h-8 text-gray-400"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune recette favorite
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Vos recettes favorites apparaîtront ici
            </p>
            <button
              onClick={() => navigate("/search")}
              className="inline-flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm border border-gray-200 hover:border-gray-300"
            >
              <Icon icon="mdi:magnify" className="w-4 h-4 mr-2" />
              Rechercher des recettes
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FavoritesPage;
