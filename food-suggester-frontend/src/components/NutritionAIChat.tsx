import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import aiChatService from "../services/aiChatService";

// ============================================================================
// INTERFACES
// ============================================================================

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface NutritionAIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Position {
  x: number;
  y: number;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

const NutritionAIChat: React.FC<NutritionAIChatProps> = ({
  isOpen,
  onClose,
}) => {
  // =========================================================================
  // STATE
  // =========================================================================

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Bonjour! 👋 Je suis votre assistant culinaire et nutritionnel. Je peux vous aider avec des questions sur l'alimentation saine, les recettes, les valeurs nutritionnelles, et les bienfaits des aliments. Comment puis-je vous aider?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [position, setPosition] = useState<Position>({
    x: window.innerWidth - 420,
    y: window.innerHeight - 700,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // =========================================================================
  // REFS
  // =========================================================================

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // =========================================================================
  // EFFECTS - HISTORY LOADING
  // =========================================================================

  useEffect(() => {
    if (isOpen) {
      const savedHistory = aiChatService.getHistory();
      if (savedHistory.length > 0) {
        const loadedMessages: Message[] = [
          {
            id: "welcome",
            text: "Bonjour! 👋 Je suis votre assistant culinaire et nutritionnel. Je peux vous aider avec des questions sur l'alimentation saine, les recettes, les valeurs nutritionnelles, et les bienfaits des aliments. Comment puis-je vous aider?",
            sender: "assistant",
            timestamp: new Date(),
          },
          ...savedHistory.map((msg, idx) => ({
            id: `msg-${idx}`,
            text: msg.content,
            sender: msg.role as "user" | "assistant",
            timestamp: new Date(),
          })),
        ];
        setMessages(loadedMessages);
        console.log(
          "✅ Historique de chat restauré:",
          loadedMessages.length - 1,
          "messages",
        );
      }
    }
  }, [isOpen]);

  // =========================================================================
  // EFFECTS - RESPONSIVE DESIGN
  // =========================================================================

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // =========================================================================
  // EFFECTS - AUTO-SCROLL
  // =========================================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // =========================================================================
  // EFFECTS - DRAG HANDLING
  // =========================================================================

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;

    const target = e.target as HTMLElement;
    if (!target.closest("[data-no-drag]")) {
      setIsDragging(true);
      const rect = chatWindowRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || isMobile) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      const maxX = window.innerWidth - 320;
      const maxY = window.innerHeight - 100;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, isMobile]);

  // =========================================================================
  // HANDLERS
  // =========================================================================

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userInputText = inputValue;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: userInputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const conversationHistory: ChatMessage[] = messages
        .filter((msg) => msg.id !== "welcome")
        .map((msg) => ({
          role: msg.sender,
          content: msg.text,
        }));

      conversationHistory.push({
        role: "user",
        content: userInputText,
      });

      const response = await aiChatService.sendMessage(
        userInputText,
        conversationHistory,
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      const updatedHistory: ChatMessage[] = [
        ...conversationHistory,
        {
          role: "assistant",
          content: response,
        },
      ];
      aiChatService.saveHistory(updatedHistory);
      console.log("✅ Historique sauvegardé");
    } catch (error: any) {
      console.error("Error getting AI response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text:
          error.message ||
          "Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer.",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================================
  // RENDER
  // =========================================================================

  if (!isOpen) return null;

  // Mobile layout
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />

        <div className="relative bg-white w-full h-full flex flex-col border-t border-[#FFE0CC] z-10">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FF6B35] to-[#E85826] text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <Icon icon="mdi:brain" className="w-6 h-6" />
              <div>
                <h3 className="font-bold text-lg">Assistant Culinaire</h3>
                <p className="text-xs text-white/80">Nutrition & Recettes</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-white/80 transition-colors text-2xl"
              aria-label="Fermer"
              data-no-drag
            >
              <Icon icon="mdi:close" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-[#FFF8F1]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } animate-fade-in`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-[#FF6B35] to-[#E85826] text-white rounded-br-none"
                      : "bg-[#FFF0E5] text-[#4A4238] border border-[#FFE0CC] rounded-bl-none"
                  } shadow-sm leading-relaxed text-sm`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#FFF0E5] text-[#4A4238] px-4 py-3 rounded-2xl rounded-bl-none border border-[#FFE0CC] flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#FF6B35] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#FF6B35] rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-[#FF6B35] rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-[#FFE0CC] bg-white">
            <div className="flex gap-2 items-end">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Posez votre question..."
                className="flex-1 px-4 py-3 border border-[#FFE0CC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] resize-none text-sm bg-[#FFF8F1]"
                rows={2}
                disabled={loading}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !inputValue.trim()}
                className="bg-gradient-to-r from-[#FF6B35] to-[#E85826] text-white p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                aria-label="Envoyer"
                data-no-drag
              >
                <Icon icon="mdi:send" className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Questions sur l'alimentation, nutrition et recettes
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose}>
      <div
        ref={chatWindowRef}
        className={`fixed z-50 w-96 h-[600px] bg-white rounded-3xl shadow-2xl border border-[#FFE0CC] flex flex-col overflow-hidden transition-shadow ${
          isDragging ? "shadow-2xl" : "hover:shadow-xl"
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="bg-gradient-to-r from-[#FF6B35] to-[#E85826] text-white p-4 flex items-center justify-between shadow-md cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          data-no-drag="false"
        >
          <div className="flex items-center gap-3 pointer-events-none">
            <Icon icon="mdi:brain" className="w-6 h-6" />
            <div>
              <h3 className="font-bold text-lg">Assistant Culinaire</h3>
              <p className="text-xs text-white/80">Nutrition & Recettes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-white/80 transition-colors text-2xl pointer-events-auto"
            aria-label="Fermer"
            data-no-drag
          >
            <Icon icon="mdi:close" />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-[#FFF8F1]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } animate-fade-in pointer-events-none`}
            >
              <div
                className={`max-w-sm px-4 py-3 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-gradient-to-r from-[#FF6B35] to-[#E85826] text-white rounded-br-none"
                    : "bg-[#FFF0E5] text-[#4A4238] border border-[#FFE0CC] rounded-bl-none"
                } shadow-sm leading-relaxed text-sm`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start pointer-events-none">
              <div className="bg-[#FFF0E5] text-[#4A4238] px-4 py-3 rounded-2xl rounded-bl-none border border-[#FFE0CC] flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FF6B35] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#FF6B35] rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-[#FF6B35] rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-[#FFE0CC] bg-white">
          <div className="flex gap-2 items-end">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Posez votre question..."
              className="flex-1 px-4 py-3 border border-[#FFE0CC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] resize-none text-sm bg-[#FFF8F1]"
              rows={3}
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !inputValue.trim()}
              className="bg-gradient-to-r from-[#FF6B35] to-[#E85826] text-white p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              aria-label="Envoyer"
              data-no-drag
            >
              <Icon icon="mdi:send" className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Questions sur l'alimentation, nutrition et recettes
          </p>
        </div>
      </div>
    </div>
  );
};

export default NutritionAIChat;
