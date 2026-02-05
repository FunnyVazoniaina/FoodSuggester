import api from "./api";

/**
 * AI Chat Service - Handles communication with the backend AI endpoint
 * Uses Groq's LLaMA 3.1 70B model for culinary assistance
 * Supports conversation context for stateful interactions
 */

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatResponse {
  response: string;
  timestamp: string;
}

/**
 * Send a message to the AI chef assistant with conversation context
 * @param message - The user's message/question
 * @param conversationHistory - Previous messages for context
 * @returns The AI's response
 * @throws Error if the request fails
 */
export const sendChatMessage = async (
  message: string,
  conversationHistory: ChatMessage[] = [],
): Promise<string> => {
  try {
    // Validate input
    if (!message || message.trim() === "") {
      throw new Error("Message cannot be empty");
    }

    // Send request to backend with conversation history
    const response = await api.post<ChatResponse>("/ai/chat", {
      message: message.trim(),
      conversationHistory: conversationHistory,
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
 * Get conversation history from session storage
 * @returns Array of previous messages or empty array
 */
export const getConversationHistory = (): ChatMessage[] => {
  try {
    const stored = sessionStorage.getItem("aiChatHistory");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * Save conversation history to session storage
 * @param history - Messages to save
 */
export const saveConversationHistory = (history: ChatMessage[]): void => {
  try {
    // Keep only last 20 messages to avoid storage overflow
    const limitedHistory = history.slice(-20);
    sessionStorage.setItem("aiChatHistory", JSON.stringify(limitedHistory));
  } catch (error) {
    console.warn("⚠️ Failed to save chat history:", error);
  }
};

/**
 * Clear conversation history
 */
export const clearConversationHistory = (): void => {
  try {
    sessionStorage.removeItem("aiChatHistory");
  } catch (error) {
    console.warn("⚠️ Failed to clear chat history:", error);
  }
};

/**
 * Export the AI service object for use in components
 */
export const aiChatService = {
  sendMessage: sendChatMessage,
  getHistory: getConversationHistory,
  saveHistory: saveConversationHistory,
  clearHistory: clearConversationHistory,
};

export default aiChatService;
