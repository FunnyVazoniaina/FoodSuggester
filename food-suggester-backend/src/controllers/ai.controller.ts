import { Request, Response } from "express";
import { Groq } from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * System prompt for the AI chef assistant
 * Instructs the AI to stay focused on culinary topics while remaining friendly
 */
const SYSTEM_PROMPT = `Tu es un expert en cuisine, nutrition et recettes saines. 
Réponds uniquement dans ce domaine. Sois toujours amical et courtois.
Si quelqu'un te pose une question hors de ces sujets, réponds poliment:
"Je suis spécialisé en cuisine et nutrition. Je peux t'aider sur les recettes, les régimes, les valeurs nutritionnelles et les conseils culinaires!"

Sois concis (maximum 2-3 phrases), utile et encourageant.`;

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

    // Check API key
    if (!process.env.GROQ_API_KEY) {
      console.error("❌ Groq API key is not configured");
      res.status(500).json({
        error: "AI service is not properly configured",
      });
      return;
    }

    // Call Groq API with LLaMA 3.1 70B
    const response = await groq.chat.completions.create({
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
