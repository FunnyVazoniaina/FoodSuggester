import { useState } from "react";
import { Icon } from "@iconify/react";
import Layout from "../components/Layout";
import RecipeCard from "../components/RecipeCard";
import { recipeService } from "../services/api";

const commonIngredients = [
  "tomato",
  "potato",
  "onion",
  "garlic",
  "chicken",
  "beef",
  "pork",
  "rice",
  "pasta",
  "cheese",
  "milk",
  "egg",
  "butter",
  "olive oil",
  "flour",
  "sugar",
  "salt",
  "pepper",
  "carrot",
  "broccoli",
  "spinach",
  "lettuce",
  "cucumber",
  "bell pepper",
  "mushroom",
  "lemon",
  "lime",
  "orange",
  "apple",
  "banana",
];

const SearchPage: React.FC = () => {
  const [ingredient, setIngredient] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [, setFavorites] = useState<number[]>([]);

  const handleAddIngredient = () => {
    if (ingredient && !ingredients.includes(ingredient.toLowerCase())) {
      setIngredients([...ingredients, ingredient.toLowerCase()]);
      setIngredient("");
    }
  };

  const handleRemoveIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter((ing) => ing !== ingredientToRemove));
  };

  const handleSearch = async () => {
    if (ingredients.length === 0)
      return setError("Veuillez ajouter au moins un ingrédient");
    setLoading(true);
    setError("");
    try {
      const data = await recipeService.suggestRecipes(ingredients.join(","));
      const favoritesData = await recipeService.getFavorites();
      const favoriteIds = favoritesData.map((fav: any) => fav.id);
      setFavorites(favoriteIds);
      setRecipes(
        data.map((recipe: any) => ({
          ...recipe,
          isFavorite: favoriteIds.includes(recipe.id),
        })),
      );
    } catch (err: any) {
      setError(err.message || "Erreur lors de la recherche de recettes");
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      const favoritesData = await recipeService.getFavorites();
      const favoriteIds = favoritesData.map((fav: any) => fav.id);
      setFavorites(favoriteIds);
      setRecipes(
        recipes.map((r) => ({ ...r, isFavorite: favoriteIds.includes(r.id) })),
      );
    } catch (err) {
      console.error("Erreur favoris", err);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50/40 via-amber-50/30 to-yellow-50/40">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Hero Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl mb-6 shadow-2xl">
              <Icon icon="mdi:chef-hat" className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-700 via-amber-700 to-orange-800 bg-clip-text text-transparent mb-3">
              Recherche de recettes
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Découvrez des recettes délicieuses avec les ingrédients que vous
              avez sous la main
            </p>
          </div>

          {/* Search Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center mr-4">
                <Icon icon="mdi:food" className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 ">
                Quels ingrédients avez-vous ?
              </h2>
            </div>

            {/* Input Section */}
            <div className="mb-6">
              <div className="flex gap-3 mb-4">
                <div className="flex-grow relative">
                  <input
                    value={ingredient}
                    onChange={(e) => setIngredient(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleAddIngredient()
                    }
                    placeholder="Tapez un ingrédient..."
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200 text-lg  bg-white shadow-sm"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Icon
                      icon="mdi:food-outline"
                      className="w-5 h-5 text-gray-400"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddIngredient}
                  disabled={!ingredient}
                  className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200  font-semibold text-lg hover:scale-105 active:scale-95"
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mdi:plus"
                      className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200"
                    />
                    Ajouter
                  </div>
                </button>
              </div>
            </div>

            {/* Ingredients Display */}
            <div className="mb-6">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border-2 border-dashed border-orange-200 p-6 min-h-[120px] transition-all duration-300">
                {ingredients.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Vos ingrédients ({ingredients.length})
                      </h3>
                      <button
                        onClick={() => setIngredients([])}
                        className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                      >
                        <Icon icon="mdi:close-circle" className="w-4 h-4" />
                        Tout effacer
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {ingredients.map((ing, i) => (
                        <span
                          key={i}
                          className="group inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-orange-700 border-2 border-orange-200 shadow-sm hover:shadow-md transition-all duration-200  font-medium"
                        >
                          <Icon icon="mdi:food-apple" className="w-4 h-4" />
                          {ing}
                          <button
                            onClick={() => handleRemoveIngredient(ing)}
                            className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors ml-1"
                          >
                            <Icon
                              icon="mdi:close"
                              className="w-3 h-3 text-red-600"
                            />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                      <Icon
                        icon="mdi:food-outline"
                        className="w-8 h-8 text-orange-400"
                      />
                    </div>
                    <p className="text-gray-500 text-lg">
                      Commencez à ajouter vos ingrédients
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Tapez le nom d'un ingrédient et appuyez sur Ajouter
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={ingredients.length === 0 || loading}
              className="group w-full py-5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-2xl shadow-xl text-xl font-bold hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex justify-center items-center gap-3">
                <Icon
                  icon="mdi:magnify"
                  className="w-6 h-6 group-hover:scale-110 transition-transform"
                />
                {loading ? "Recherche en cours..." : "Rechercher des recettes"}
                {!loading && (
                  <Icon
                    icon="mdi:arrow-right"
                    className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                  />
                )}
              </div>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8 rounded-r-2xl shadow-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Icon
                    icon="mdi:alert-circle"
                    className="w-6 h-6 text-red-600"
                  />
                </div>
                <div>
                  <h3 className="text-red-800 font-semibold text-lg">Erreur</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-12 text-center border border-white/20">
              <div className="relative inline-block">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full flex items-center justify-center mb-6 shadow-xl">
                  <Icon
                    icon="mdi:loading"
                    className="w-10 h-10 text-white animate-spin"
                  />
                </div>
                <div className="absolute -inset-3 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full opacity-20 animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2 ">
                Recherche en cours...
              </h3>
              <p className="text-gray-600  text-lg">
                Nous trouvons les meilleures recettes pour vous
              </p>
            </div>
          )}

          {/* Results Section */}
          {!loading && recipes.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mr-4">
                    <Icon
                      icon="mdi:silverware-fork-knife"
                      className="w-7 h-7 text-green-600"
                    />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 ">
                      Résultats trouvés
                    </h2>
                    <p className="text-gray-600  text-lg">
                      {recipes.length} recette{recipes.length > 1 ? "s" : ""}{" "}
                      disponible{recipes.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full  font-medium">
                    <Icon icon="mdi:check-circle" className="w-4 h-4 mr-2" />
                    Recherche terminée
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="transform hover:scale-105 transition-transform duration-200"
                  >
                    <RecipeCard
                      recipe={recipe}
                      onFavoriteToggle={handleFavoriteToggle}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results State */}
          {!loading &&
            ingredients.length > 0 &&
            recipes.length === 0 &&
            !error && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon
                    icon="mdi:silverware-fork-knife"
                    className="w-12 h-12 text-gray-400"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3 ">
                  Aucune recette trouvée
                </h3>
                <p className="text-gray-500  text-lg max-w-md mx-auto mb-6">
                  Essayez d'ajouter d'autres ingrédients ou de modifier votre
                  sélection pour découvrir plus de recettes.
                </p>
                <button
                  onClick={() => setIngredients([])}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl hover:shadow-lg transition-all duration-200  font-medium"
                >
                  <Icon icon="mdi:refresh" className="w-5 h-5 mr-2" />
                  Recommencer
                </button>
              </div>
            )}

          {/* Welcome State */}
          {!loading &&
            ingredients.length === 0 &&
            recipes.length === 0 &&
            !error && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12 text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Icon
                    icon="mdi:magnify"
                    className="w-16 h-16 text-orange-500"
                  />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4 ">
                  Commencez votre recherche
                </h3>
                <p className="text-gray-600  text-xl max-w-2xl mx-auto leading-relaxed">
                  Ajoutez vos ingrédients disponibles et nous vous proposerons
                  des recettes adaptées à ce que vous avez
                </p>

                {/* Quick Start Suggestions */}
                <div className="mt-8">
                  <p className="text-gray-500  mb-4">
                    Suggestions populaires :
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
                    {commonIngredients.slice(0, 8).map((ing) => (
                      <button
                        key={ing}
                        onClick={() => {
                          if (!ingredients.includes(ing)) {
                            setIngredients([...ingredients, ing]);
                          }
                        }}
                        className="px-4 py-2 bg-orange-50 text-orange-700 rounded-full border border-orange-200 hover:bg-orange-100 hover:border-orange-300 transition-all duration-200  text-sm hover:scale-105"
                      >
                        {ing}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
