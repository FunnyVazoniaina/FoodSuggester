import { Request, Response } from "express";
import { Groq } from "groq-sdk";

// Initialize Groq client with validation
let groq: Groq | null = null;

const initializeGroq = () => {
  if (!groq) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GROQ_API_KEY environment variable is not set. Please configure it in your environment.",
      );
    }
    groq = new Groq({ apiKey });
  }
  return groq;
};

/**
 * System prompt for the AI chef assistant
 * Instructs the AI to stay focused on culinary topics while remaining friendly
 */
const SYSTEM_PROMPT = `
Tu es un expert bienveillant en cuisine, nutrition et alimentation saine.

Ton rôle est d’adapter la longueur et le niveau de détail de ta réponse selon :
1) la formulation de la question,
2) le niveau apparent de connaissance de l’utilisateur,
3) la précision qu'il semble rechercher.

Si l’utilisateur semble débutant, explique calmement avec plus de détails pratiques 
et des exemples simples. Si l’utilisateur semble expérimenté, sois plus direct, 
plus technique et plus concis.

Tu dois être flexible dans ta longueur : 
— réponse courte pour une question simple, 
— réponse plus détaillée quand l'utilisateur demande "comment", "pourquoi",
  ou cherche à apprendre ou comprendre.

Ton ton doit être chaleureux, amical et encourageant.

Tu réponds exclusivement sur les sujets liés à la cuisine, aux ingrédients, 
aux recettes, à la nutrition, ou à l’alimentation saine. 
Si la question sort du domaine, réponds gentiment :
"Je suis spécialisé en cuisine et nutrition. Je peux t’aider avec les recettes, 
les ingrédients, les conseils culinaires ou l’alimentation saine !"
`;

/**
 * Chat with the AI chef assistant using Groq API
 * @route POST /api/ai/chat
 * @param {Request} req - Express request object with question in body
 * @param {Response} res - Express response object
 */
export const chatWithAI = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { message } = req.body;

    // Validate input
    if (!message || typeof message !== "string" || message.trim() === "") {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    // Initialize Groq client
    const groqClient = initializeGroq();

    // Call Groq API with LLaMA 3.1 70B
    const response = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: message.trim(),
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    // Extract the AI response
    const aiMessage = response.choices[0]?.message?.content;

    if (!aiMessage) {
      throw new Error("No response from AI");
    }

    console.log("✅ AI response generated successfully");
    res.status(200).json({
      response: aiMessage,
      timestamp: new Date(),
    });
  } catch (error: any) {
    console.error("❌ Error calling Groq API:", {
      message: error.message,
      status: error.status,
    });

    // Handle specific errors
    if (error.status === 401) {
      res.status(401).json({
        error: "Groq API key is invalid or expired",
      });
      return;
    }

    if (error.status === 429) {
      res.status(429).json({
        error: "Rate limit exceeded. Please try again later.",
      });
      return;
    }

    // Generic error response
    res.status(500).json({
      error: "Failed to get AI response. Please try again.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
