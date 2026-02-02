import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Layout from '../components/Layout';
import RecipeCard from '../components/RecipeCard';
import { recipeService } from '../services/api';
import { useNavigate } from 'react-router-dom';

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
  const [error, setError] = useState('');
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
      console.error('Error fetching favorites:', err);
      setError('Une erreur est survenue lors de la récupération de vos favoris');
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
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-amber-900 flex items-center mb-3 ">
          <Icon icon="mdi:heart" className="w-8 h-8 text-red-500 mr-3" />
          Mes recettes favorites
        </h1>
        
        <p className="text-amber-800/80 mb-4 ">
          Retrouvez ici toutes les recettes que vous avez ajoutées à vos favoris.
        </p>
        
        <hr className="border-amber-200 mb-6" />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <div className="flex items-center">
            <Icon icon="mdi:alert-circle" className="w-5 h-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Icon icon="mdi:loading" className="w-8 h-8 text-orange-600 animate-spin mb-3" />
          <p className="text-amber-800/80 ">
            Chargement de vos favoris...
          </p>
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((recipe) => (
            <RecipeCard 
              key={recipe.id}
              recipe={recipe} 
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-orange-50/50 rounded-xl border border-dashed border-amber-200">
          <Icon icon="mdi:heart-outline" className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-amber-900 mb-2 ">
            Vous n'avez pas encore de recettes favorites
          </h3>
          <p className="text-amber-800/70 mb-6 max-w-md mx-auto ">
            Explorez des recettes et ajoutez-les à vos favoris pour les retrouver facilement ici.
          </p>
          <button 
            onClick={() => navigate('/search')}
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium  shadow-lg hover:shadow-xl"
          >
            <Icon icon="mdi:magnify" className="w-5 h-5 mr-2" />
            Rechercher des recettes
          </button>
        </div>
      )}
    </Layout>
  );
};

export default FavoritesPage;
