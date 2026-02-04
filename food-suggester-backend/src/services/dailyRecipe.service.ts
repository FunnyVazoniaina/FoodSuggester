import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
// Service for daily recipe suggestions

const apiKey = process.env.SPOONACULAR_API_KEY;
const baseURL = process.env.SPOONACULAR_URL_BASE;

if (!apiKey) {
  throw new Error("SPOONACULAR_API_KEY is missing in .env file");
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

    console.log("🔄 Fetching random recipe from Spoonacular API...");

    // Try without tags first (some API tiers might have restrictions)
    let response;
    try {
      response = await axios.get(`${baseURL}/recipes/random`, {
        params: {
          number: 1,
          apiKey,
          tags: "vegetarian,breakfast,dessert,dinner,lunch,snack",
        },
        timeout: 8000,
      });
    } catch (error: any) {
      console.warn("⚠️ Request with tags failed, trying without tags");
      // Fallback to request without tags
      response = await axios.get(`${baseURL}/recipes/random`, {
        params: {
          number: 1,
          apiKey,
        },
        timeout: 8000,
      });
    }

    console.log("📦 Spoonacular API Response:", {
      status: response.status,
      hasRecipes: !!response.data.recipes,
      recipesLength: response.data.recipes?.length || 0,
      dataKeys: Object.keys(response.data || {}),
    });

    if (!response.data.recipes || response.data.recipes.length === 0) {
      console.warn("⚠️ No recipes returned from Spoonacular API");
      console.warn(
        "📋 Full response data:",
        JSON.stringify(response.data, null, 2),
      );
      return null;
    }

    const recipe = response.data.recipes[0];
    console.log("✅ Recipe fetched:", recipe.title);

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

    return null;
  }
};

/**
 * Search for recipes by a specific tag or category
 */
export const getRecipeByTag = async (
  tag: string,
): Promise<DailyRecipe | null> => {
  try {
    const response = await axios.get(`${baseURL}/recipes/random`, {
      params: {
        number: 1,
        apiKey,
        tags: tag,
      },
      timeout: 8000,
    });

    if (!response.data.recipes || response.data.recipes.length === 0) {
      return null;
    }

    const recipe = response.data.recipes[0];

    // Fetch detailed information
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

    const details = detailedResponse.data;

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
