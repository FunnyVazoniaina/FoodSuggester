// Service for daily dynamic suggestions using free AI APIs

export interface DailySuggestion {
  featuredIngredient: string;
  tip: string;
  dailySuggestion: string;
  timestamp: string;
}

const CACHE_KEY = "daily_suggestions";

export const suggestionsService = {
  // Check if cached suggestions are still valid (same day)
  isCacheValid: (): boolean => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return false;

    const data = JSON.parse(cached);
    const cachedDate = new Date(data.timestamp).toDateString();
    const todayDate = new Date().toDateString();

    return cachedDate === todayDate;
  },

  // Get cached suggestions
  getCached: (): DailySuggestion | null => {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  },

  // Generate suggestions using free OpenRouter or Hugging Face API
  generateSuggestions: async (): Promise<DailySuggestion> => {
    // Try to use free tier API (can be replaced with your preferred service)
    try {
      // Using a simple fallback approach with predefined suggestions
      // You can replace this with actual API calls to free services
      const suggestions = await suggestionsService.fetchFromAPI();

      // Cache the result
      const suggestionWithTimestamp: DailySuggestion = {
        ...suggestions,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(suggestionWithTimestamp));

      return suggestionWithTimestamp;
    } catch (error) {
      console.error("Error generating suggestions:", error);
      // Return default suggestions if API fails
      return suggestionsService.getDefaultSuggestions();
    }
  },

  // Fetch from free API (example with default fallback)
  fetchFromAPI: async (): Promise<Omit<DailySuggestion, "timestamp">> => {
    // Using a simple list of rotating suggestions as fallback
    // Replace with actual API call if needed
    const ingredients = [
      "Tomate",
      "Basilic",
      "Citron",
      "Ail",
      "Oignon",
      "Poivron",
      "Courgette",
      "Courge",
      "Brocoli",
      "Chou-fleur",
      "Carottes",
      "Betterave",
      "Épinards",
      "Poisson blanc",
      "Saumon",
      "Poulet fermier",
      "Œufs bio",
      "Riz complet",
      "Pâtes complètes",
      "Quinoa",
    ];

    const tips = [
      "Pour les soins de la peau: consommez des aliments riche en antioxydants comme les baies et les légumes verts",
      "Privilégiez les aliments locaux et de saison pour meilleur saveur et nutrition",
      "Les herbes fraîches ajoutent de la saveur sans calories supplémentaires",
      "La cuisson à la vapeur préserve plus de nutriments que la ébullition",
      "Variez vos sources de protéines pour un régime équilibré",
      "Les épices ont des propriétés anti-inflammatoires et digestives",
      "Buvez de l'eau avant les repas pour une meilleure digestion",
      "Les repas colorés contiennent généralement plus de variété nutritionnelle",
      "Préparez vos repas à l'avance pour manger plus sainement",
      "Les grains entiers fournissent plus de fibre et d'énergie durable",
    ];

    const suggestions = [
      "Essayez une salade méditerranéenne avec des tomates fraîches et du basilic",
      "Préparez un bouillon de légumes maison pour plus de saveur authentique",
      "Explorez les recettes végétariennes pour découvrir de nouvelles saveurs",
      "Cuisinez un curry épicé avec des légumes de saison",
      "Préparez un smoothie santé avec des fruits frais et des légumes verts",
      "Essayez une recette de grain entier pour plus de nutrition",
      "Préparez un marinage pour sublimer vos viandes et poissons",
      "Découvrez les recettes de la cuisine mondiale et fusion",
      "Préparez des snacks sains comme des chips de légumes faits maison",
      "Essayez une recette de dessert sain avec fruits et yaourt",
    ];

    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        1000 /
        60 /
        60 /
        24,
    );

    return {
      featuredIngredient: ingredients[dayOfYear % ingredients.length],
      tip: tips[dayOfYear % tips.length],
      dailySuggestion: suggestions[dayOfYear % suggestions.length],
    };
  },

  // Get default suggestions (in case API fails)
  getDefaultSuggestions: (): DailySuggestion => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        1000 /
        60 /
        60 /
        24,
    );

    const ingredients = ["Tomate", "Basilic", "Citron", "Ail", "Oignon"];
    const tips = [
      "Consommez des aliments riches en antioxydants",
      "Privilégiez les aliments locaux et de saison",
      "Variez vos sources de protéines",
      "Buvez beaucoup d'eau",
      "Mangez des aliments colorés",
    ];
    const suggestions = [
      "Essayez une salade fraîche",
      "Préparez un bouillon maison",
      "Explorez les recettes végétariennes",
      "Cuisinez un curry épicé",
      "Préparez un smoothie santé",
    ];

    return {
      featuredIngredient: ingredients[dayOfYear % ingredients.length],
      tip: tips[dayOfYear % tips.length],
      dailySuggestion: suggestions[dayOfYear % suggestions.length],
      timestamp: new Date().toISOString(),
    };
  },

  // Get suggestions (with caching)
  getSuggestions: async (): Promise<DailySuggestion> => {
    if (suggestionsService.isCacheValid()) {
      const cached = suggestionsService.getCached();
      if (cached) return cached;
    }

    return suggestionsService.generateSuggestions();
  },
};
