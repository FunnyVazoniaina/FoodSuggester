import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
// Service for daily recipe suggestions

// Utiliser process.env directement dans les fonctions pour éviter les problèmes de chargement
const getApiKey = () => process.env.SPOONACULAR_API_KEY;
const getBaseURL = () =>
  process.env.SPOONACULAR_URL_BASE || "https://api.spoonacular.com";

const apiKey = getApiKey();
const baseURL = getBaseURL();

// Vérification immédiate
if (!apiKey) {
  console.warn("⚠️ SPOONACULAR_API_KEY not found at module load time");
}

interface DailyRecipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  preparationMinutes: number;
  cookingMinutes: number;
  servings: number;
  calories?: number;
  carbs?: number;
  protein?: number;
  fat?: number;
  instructions?: string;
  sourceUrl?: string;
  steps?: Array<{
    number: number;
    step: string;
  }>;
  timestamp: string;
}

// Cache with timestamp
let cachedRecipe: DailyRecipe | null = null;
let cacheDate: string = "";

// Fallback recipe for when API fails
const FALLBACK_RECIPE: DailyRecipe = {
  id: 1,
  title: "Salade Méditerranéenne Fraîche",
  image:
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=500&fit=crop",
  readyInMinutes: 15,
  preparationMinutes: 15,
  cookingMinutes: 0,
  servings: 2,
  calories: 280,
  protein: 12,
  carbs: 25,
  fat: 15,
  instructions:
    "1. Lavez et coupez les tomates\n2. Coupez le concombre en dés\n3. Émiettez la feta\n4. Préparez la vinaigrette\n5. Mélangez tous les ingrédients",
  sourceUrl: "https://www.example.com/recipe",
  steps: [],
  timestamp: new Date().toISOString(),
};

/**
 * Get a different recipe each day from Spoonacular API
 * Uses the day of year to ensure consistent recipe per day
 */
export const getDailyRecipe = async (): Promise<DailyRecipe | null> => {
  try {
    const today = new Date().toDateString();

    // Log API configuration
    console.log("🔐 API Configuration:", {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length || 0,
      baseURL,
      hasBaseURL: !!baseURL,
    });

    // Return cached recipe if it's the same day
    if (cachedRecipe && cacheDate === today) {
      console.log("✅ Returning cached recipe for", today);
      return cachedRecipe;
    }

    // Validate API key
    if (!apiKey) {
      console.error("❌ SPOONACULAR_API_KEY is not configured");
      return null;
    }

    console.log(
      "🔄 Fetching daily recipe from Spoonacular API using complexSearch...",
    );

    // Use complexSearch instead of random (more reliable)
    const response = await axios.get(`${baseURL}/recipes/complexSearch`, {
      params: {
        number: 10, // Get multiple recipes to select from
        apiKey,
        tags: "vegetarian,breakfast,dessert,dinner,lunch,snack",
        addRecipeNutrition: true,
        fillIngredients: true,
      },
      timeout: 10000,
    });

    console.log("📦 Spoonacular complexSearch Response:", {
      status: response.status,
      totalResults: response.data.totalResults,
      recipesLength: response.data.results?.length || 0,
    });

    if (!response.data.results || response.data.results.length === 0) {
      console.warn("⚠️ No recipes returned from complexSearch API");
      console.warn(
        "📋 Full response data:",
        JSON.stringify(response.data, null, 2),
      );
      console.log("📌 Using fallback recipe due to empty API response");

      // Update cache with fallback recipe
      cachedRecipe = {
        ...FALLBACK_RECIPE,
        timestamp: new Date().toISOString(),
      };
      cacheDate = today;

      return cachedRecipe;
    }

    // Select recipe deterministically based on day of year
    const todayDateObj = new Date();
    const dayOfYear = Math.floor(
      (todayDateObj.getTime() -
        new Date(todayDateObj.getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const recipeIndex = dayOfYear % response.data.results.length;
    const recipe = response.data.results[recipeIndex];

    console.log(
      `✅ Recipe fetched: "${recipe.title}" (index ${recipeIndex}/${response.data.results.length})`,
    );

    // Fetch detailed nutrition information (optional - don't fail if this fails)
    let details = recipe;
    try {
      const detailedResponse = await axios.get(
        `${baseURL}/recipes/${recipe.id}/information`,
        {
          params: {
            apiKey,
            includeNutrition: true,
          },
          timeout: 8000,
        },
      );
      details = detailedResponse.data;
      console.log("✅ Detailed recipe info fetched");
    } catch (detailError: any) {
      console.warn("⚠️ Failed to fetch detailed info, using basic recipe:", {
        message: detailError.message,
      });
      // Continue with basic recipe info
    }

    // Extract nutrition info
    let calories = 0;
    let carbs = 0;
    let protein = 0;
    let fat = 0;

    if (details.nutrition && details.nutrition.nutrients) {
      const nutrients = details.nutrition.nutrients;
      const calorieObj = nutrients.find((n: any) => n.name === "Calories");
      const carbsObj = nutrients.find((n: any) => n.name === "Carbohydrates");
      const proteinObj = nutrients.find((n: any) => n.name === "Protein");
      const fatObj = nutrients.find((n: any) => n.name === "Fat");

      calories = calorieObj
        ? Math.round(calorieObj.amount / (recipe.servings || 1))
        : 0;
      carbs = carbsObj
        ? Math.round((carbsObj.amount / (recipe.servings || 1)) * 10) / 10
        : 0;
      protein = proteinObj
        ? Math.round((proteinObj.amount / (recipe.servings || 1)) * 10) / 10
        : 0;
      fat = fatObj
        ? Math.round((fatObj.amount / (recipe.servings || 1)) * 10) / 10
        : 0;
    }

    const dailyRecipe: DailyRecipe = {
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes || 0,
      preparationMinutes: details.preparationMinutes || 0,
      cookingMinutes: details.cookingMinutes || 0,
      servings: recipe.servings || 1,
      calories,
      carbs,
      protein,
      fat,
      instructions: details.instructions || "",
      sourceUrl: details.sourceUrl || "",
      steps: details.analyzedInstructions?.[0]?.steps || [],
      timestamp: new Date().toISOString(),
    };

    // Cache the recipe
    cachedRecipe = dailyRecipe;
    cacheDate = today;
    console.log("💾 Recipe cached for", today);

    return dailyRecipe;
  } catch (error: any) {
    console.error("❌ Error fetching daily recipe:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
    });

    // Return fallback recipe if API fails
    if (cachedRecipe) {
      console.log("📦 Returning previously cached recipe as fallback");
      return cachedRecipe;
    }

    console.log("📌 Using default fallback recipe due to API error");
    return {
      ...FALLBACK_RECIPE,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Search for recipes by a specific tag or category
 * Uses complexSearch for better reliability
 */
export const getRecipeByTag = async (
  tag: string,
): Promise<DailyRecipe | null> => {
  try {
    // Use complexSearch instead of random for better reliability
    const response = await axios.get(`${baseURL}/recipes/complexSearch`, {
      params: {
        number: 10,
        apiKey,
        tags: tag,
        addRecipeNutrition: true,
        fillIngredients: true,
      },
      timeout: 10000,
    });

    if (!response.data.results || response.data.results.length === 0) {
      console.warn(`⚠️ No recipes found for tag: ${tag}`);
      return null;
    }

    // Select first recipe from results
    const recipe = response.data.results[0];
    console.log(`✅ Recipe found for tag "${tag}":`, recipe.title);

    // Fetch detailed information for instructions
    let details = recipe;
    try {
      const detailedResponse = await axios.get(
        `${baseURL}/recipes/${recipe.id}/information`,
        {
          params: {
            apiKey,
            includeNutrition: true,
          },
          timeout: 8000,
        },
      );
      details = detailedResponse.data;
      console.log("✅ Detailed recipe info fetched");
    } catch (detailError: any) {
      console.warn("⚠️ Failed to fetch detailed info, using basic recipe:", {
        message: detailError.message,
      });
      // Continue with basic recipe info
    }

    // Extract nutrition info
    let calories = 0;
    let carbs = 0;
    let protein = 0;
    let fat = 0;

    if (details.nutrition && details.nutrition.nutrients) {
      const nutrients = details.nutrition.nutrients;
      const calorieObj = nutrients.find((n: any) => n.name === "Calories");
      const carbsObj = nutrients.find((n: any) => n.name === "Carbohydrates");
      const proteinObj = nutrients.find((n: any) => n.name === "Protein");
      const fatObj = nutrients.find((n: any) => n.name === "Fat");

      calories = calorieObj
        ? Math.round(calorieObj.amount / (recipe.servings || 1))
        : 0;
      carbs = carbsObj
        ? Math.round((carbsObj.amount / (recipe.servings || 1)) * 10) / 10
        : 0;
      protein = proteinObj
        ? Math.round((proteinObj.amount / (recipe.servings || 1)) * 10) / 10
        : 0;
      fat = fatObj
        ? Math.round((fatObj.amount / (recipe.servings || 1)) * 10) / 10
        : 0;
    }

    const dailyRecipe: DailyRecipe = {
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes || 0,
      preparationMinutes: details.preparationMinutes || 0,
      cookingMinutes: details.cookingMinutes || 0,
      servings: recipe.servings || 1,
      calories,
      carbs,
      protein,
      fat,
      instructions: details.instructions || "",
      sourceUrl: details.sourceUrl || "",
      steps: details.analyzedInstructions?.[0]?.steps || [],
      timestamp: new Date().toISOString(),
    };

    return dailyRecipe;
  } catch (error: any) {
    console.error("Error fetching recipe by tag:", error.message);
    return null;
  }
};
