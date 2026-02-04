import api from "./api";

/**
 * AI Chat Service - Handles communication with the backend AI endpoint
 * Uses Groq's LLaMA 3.1 70B model for culinary assistance
 */

interface ChatResponse {
  response: string;
  timestamp: string;
}


/**
 * Send a message to the AI chef assistant
 * @param message - The user's message/question
 * @returns The AI's response
 * @throws Error if the request fails
 */
export const sendChatMessage = async (message: string): Promise<string> => {
  try {
    // Validate input
    if (!message || message.trim() === "") {
      throw new Error("Message cannot be empty");
    }

    // Send request to backend
    const response = await api.post<ChatResponse>("/ai/chat", {
      message: message.trim(),
    });

    if (!response.data?.response) {
      throw new Error("No response from AI");
    }

    return response.data.response;
  } catch (error: any) {
    console.error("❌ Chat API Error:", error);

    // Handle specific HTTP errors
    if (error.response?.status === 401) {
      throw new Error("Authentication required. Please log in again.");
    }

    if (error.response?.status === 429) {
      throw new Error("Too many requests. Please wait a moment and try again.");
    }

    if (error.response?.status === 400) {
      throw new Error("Invalid message. Please check your input.");
    }

    // Generic error
    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      "Failed to get response from AI";

    throw new Error(errorMessage);
  }
};

/**
 * Export the AI service object for use in components
 */
export const aiChatService = {
  sendMessage: sendChatMessage,
};

export default aiChatService;
