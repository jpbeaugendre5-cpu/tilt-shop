import { trpc } from "@/lib/trpc";
import { Brain, MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Bonjour ! Je suis l'assistant IA de TILT.SHOP. Comment puis-je vous aider à trouver le produit parfait aujourd'hui ? 🛍️" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chat = trpc.ai.chat.useMutation({
    onSuccess: (data) => {
      const reply = typeof data.reply === "string" ? data.reply : "Je suis là pour vous aider !";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    },
    onError: () => {
      setMessages((prev) => [...prev, { role: "assistant", content: "Désolé, je rencontre un problème. Réessayez dans un instant." }]);
    },
  });

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chat.isPending) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    chat.mutate({
      message: userMsg,
      history: messages.slice(-6),
    });
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
          open
            ? "bg-[#333] border border-[#3d3d3d] rotate-0"
            : "bg-[#FFD700] hover:bg-[#FFE55C] hover:shadow-[0_0_20px_rgba(255,215,0,0.5)]"
        }`}
        aria-label="Assistant IA"
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Brain className="w-7 h-7 text-black" />
        )}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#1a1a1a] animate-pulse" />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 bg-[#111] border-b border-[#2a2a2a]">
            <div className="w-9 h-9 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Assistant TILT.SHOP</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-green-400">IA disponible</span>
              </div>
            </div>
            <div className="ml-auto ai-badge text-[10px]">
              <Sparkles className="w-2.5 h-2.5" /> IA
            </div>
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 bg-[#FFD700]/10 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                    <Brain className="w-3.5 h-3.5 text-[#FFD700]" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#FFD700] text-black font-medium"
                      : "bg-[#252525] text-gray-200 border border-[#2a2a2a]"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {chat.isPending && (
              <div className="flex justify-start">
                <div className="w-6 h-6 bg-[#FFD700]/10 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <Brain className="w-3.5 h-3.5 text-[#FFD700]" />
                </div>
                <div className="bg-[#252525] border border-[#2a2a2a] px-3 py-2 rounded-xl">
                  <Loader2 className="w-4 h-4 text-[#FFD700] animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-[#2a2a2a] flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question..."
              className="flex-1 px-3 py-2 bg-[#252525] border border-[#2a2a2a] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FFD700]/50 transition-colors"
              disabled={chat.isPending}
            />
            <button
              type="submit"
              disabled={!input.trim() || chat.isPending}
              className="w-9 h-9 bg-[#FFD700] text-black rounded-xl flex items-center justify-center hover:bg-[#FFE55C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
