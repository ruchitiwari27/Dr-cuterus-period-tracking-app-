import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import snehaAvatar from "@/assets/sneha-avatar.png";
import { getChatResponse } from "@/lib/gemini";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

const QUICK_QUESTIONS = [
  "Why is my period late?",
  "How to reduce cramps?",
  "What does discharge mean?",
  "Tips for PMS relief",
  "Is irregular cycle normal?"
];

const MessagesSection = ({ onOpenProfile }: { onOpenProfile?: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi there! 👋 I'm your health assistant. Ask me anything about your cycle, symptoms, or wellness tips!",
      time: "Now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;
    
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      time: now,
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Prepare history for Gemini - Limit to last 10 messages to stay within token limits
    const history = messages
      .filter(m => m.id !== "1") // Skip welcome message
      .slice(-10) // Only take the last 10 messages for context
      .map(m => ({
        role: m.role === "user" ? "user" as const : "model" as const,
        parts: [{ text: m.content }]
      }));

    const response = await getChatResponse(text.trim(), history);
    
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  };

  return (
    <div className="flex-1 flex flex-col pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button onClick={onOpenProfile} className="transition-transform active:scale-95 text-left shrink-0">
          <Avatar className="w-10 h-10 border-2 border-dc-pink shadow-sm overflow-hidden flex-shrink-0 text-foreground">
            <AvatarImage src={snehaAvatar} alt="Sneha" className="object-cover" />
            <AvatarFallback><User size={20} /></AvatarFallback>
          </Avatar>
        </button>
        <div className="flex-1">
          <h2 className="font-semibold text-base">Health Assistant</h2>
          <p className="text-[10px] text-muted-foreground">Online • AI Powered</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-dc-pink flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={14} className="text-dc-pink-deep" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-dc-pink-deep text-white rounded-br-md shadow-sm"
                  : "dc-glass-strong rounded-bl-md text-foreground border border-white/40 shadow-sm"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <p className={`text-[9px] mt-1.5 font-medium ${msg.role === "user" ? "text-white/60" : "text-muted-foreground/60"}`}>
                {msg.time}
              </p>
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 justify-start"
          >
            <div className="w-7 h-7 rounded-full bg-dc-pink flex items-center justify-center flex-shrink-0 mt-1">
              <Bot size={14} className="text-dc-pink-deep" />
            </div>
            <div className="dc-glass-strong rounded-2xl rounded-bl-md px-4 py-3 border border-white/40 shadow-sm">
              <div className="flex gap-1">
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-1.5 h-1.5 rounded-full bg-dc-pink-deep"
                />
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                  className="w-1.5 h-1.5 rounded-full bg-dc-pink-deep"
                />
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                  className="w-1.5 h-1.5 rounded-full bg-dc-pink-deep"
                />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      <div className="px-5 py-3">
        <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-widest pl-1">Quick questions</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              disabled={isTyping}
              className="text-[11px] font-bold px-4 py-2 rounded-full dc-glass-strong border border-white/40 text-foreground hover:bg-dc-pink/30 hover:border-dc-pink-deep/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 py-3 pb-6">
        <div className="flex items-center gap-2 dc-glass-strong rounded-[2rem] px-4 py-2.5 border border-white/50 shadow-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Type a message..."
            disabled={isTyping}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60 px-1"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="w-9 h-9 rounded-full bg-dc-pink-deep flex items-center justify-center shadow-md active:scale-90 transition-all disabled:opacity-50 disabled:grayscale"
          >
            {isTyping ? <Loader2 size={16} className="text-white animate-spin" /> : <Send size={16} className="text-white" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagesSection;
