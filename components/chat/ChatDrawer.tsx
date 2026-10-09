"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LogoMark } from "../layout/LogoMark";
import { X, Send, Sparkles, Calendar, RefreshCw, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAppContext } from "@/lib/app-context";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
  toolCalls?: any[];
}

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
}

function getWelcomeMessageByLang(lang: string) {
  if (lang === "ar") {
    return "مرحباً بكم. أنا المساعد الافتراضي لعيادة MindCare Center (الدكتورة العربي نصيبة). كيف يمكنني مساعدتكم اليوم؟";
  }
  if (lang === "en") {
    return "Hello and welcome. I am the virtual assistant for MindCare Center (Dr. Larbi Nassiba). How may I assist you today?";
  }
  return "Bonjour et bienvenue. Je suis l'assistante virtuelle du cabinet MindCare Center (Dr. Larbi Nassiba). Comment puis-je vous accompagner aujourd'hui ?";
}

function getNowTimestamp() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

let chatMsgIdCounter = 0;
function createChatMsgId(role: string) {
  chatMsgIdCounter += 1;
  return `${role}-${Date.now()}-${chatMsgIdCounter}`;
}

export function ChatDrawer({ isOpen, onClose, onOpenBooking }: ChatDrawerProps) {
  const { language, t } = useAppContext();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome-1",
      role: "model",
      text: getWelcomeMessageByLang(language),
      timestamp: getNowTimestamp(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: createChatMsgId("user"),
      role: "user",
      text: textToSend,
      timestamp: getNowTimestamp(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!overrideText) setInputText("");
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
          language,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur de communication avec le serveur.");
      }

      const botMsg: ChatMessage = {
        id: createChatMsgId("model"),
        role: "model",
        text: data.reply || (language === "ar" ? "أنا في خدمتكم." : "Je reste à votre disposition."),
        timestamp: getNowTimestamp(),
        toolCalls: data.toolCalls,
      };

      setMessages((prev) => [...prev, botMsg]);

      if (data.toolCalls && data.toolCalls.length > 0) {
        const proposal = data.toolCalls.find((tCall: any) => tCall.name === "propose_booking");
        if (proposal) {
          setTimeout(() => {
            onOpenBooking();
          }, 1200);
        }
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: createChatMsgId("err"),
          role: "model",
          text: language === "ar"
            ? "عذراً، حدث خطأ أثناء الاتصال. يمكنكم التواصل المباشر مع العيادة على الرقم: 0554813911"
            : "Désolé, une erreur s'est produite. Vous pouvez contacter le cabinet directement au 0554 81 39 11.",
          timestamp: getNowTimestamp(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: "welcome-1",
        role: "model",
        text: getWelcomeMessageByLang(language),
        timestamp: getNowTimestamp(),
      },
    ]);
  };

  const suggestedPrompts = language === "ar"
    ? [
        "أرغب في حجز موعد استشارة",
        "كيف تتم الجلسة الأولى؟",
        "ما هي المواعيد وأوقات العمل؟",
        "هل المعالجة سرية تماماً؟",
      ]
    : language === "en"
    ? [
        "I would like to book an appointment",
        "What happens during the first session?",
        "What are your working hours?",
        "Is therapy confidential?",
      ]
    : [
        "Je souhaite prendre rendez-vous",
        "Comment se passe la première séance ?",
        "Quels sont vos tarifs et horaires ?",
        "Est-ce confidentiel ?",
      ];

  const disclaimerText = language === "ar"
    ? "هذه المساعدة الذكية للإرشاد وتسهيل الحجز، ولا تعوض الاستشارة الطبية المباشرة مع الدكتورة."
    : language === "en"
    ? "This assistant answers your questions and helps you book. It does not replace a medical consultation."
    : "Cet assistant répond à vos questions et vous aide à prendre rendez-vous. Il ne remplace pas une consultation médicale.";

  return (
    <div className="fixed inset-0 z-[120] flex justify-end bg-[#10201F]/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md h-full bg-[#FCFAF6] dark:bg-[#12201E] border-l border-[#EFE7DA] dark:border-[#243B37] shadow-2xl flex flex-col justify-between">
        {/* Top Header */}
        <div className="p-4 px-6 border-b border-[#EFE7DA] dark:border-[#243B37] bg-[#F7F2E9] dark:bg-[#172927] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoMark className="w-8 h-8 text-[#4E7F77] dark:text-[#7FB5AB]" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-display text-base font-medium text-[#10201F] dark:text-white">
                  {language === "ar" ? "المساعد الذكي MindCare" : "Assistante MindCare"}
                </h3>
                <span className="w-2 h-2 rounded-full bg-[#4E7F77] dark:bg-[#7FB5AB] animate-pulse" />
              </div>
              <p className="text-[10px] uppercase tracking-wider text-[#718684] dark:text-[#B3CFC8]">
                Dr. Larbi Nassiba · Gemini 3.5
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClear}
              className="p-2 rounded-full hover:bg-[#E3F0EC] dark:hover:bg-[#223B37] text-[#718684] dark:text-[#B3CFC8] hover:text-[#10201F] transition-colors"
              title="Effacer la conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#E3F0EC] dark:hover:bg-[#223B37] text-[#4A605E] dark:text-[#B3CFC8] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Disclaimer Warning Banner */}
        <div className="p-3 px-4 bg-[#F2F8F6] dark:bg-[#172927] border-b border-[#C7E1DA] dark:border-[#243B37] text-[11px] text-[#3D655F] dark:text-[#A5CEC4] flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-[#7FB5AB] shrink-0 mt-0.5" />
          <p>{disclaimerText}</p>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 scrollbar-none">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#4E7F77] text-white rounded-br-xs shadow-xs"
                    : "bg-[#F7F2E9] dark:bg-[#172927] border border-[#EFE7DA] dark:border-[#243B37] text-[#10201F] dark:text-white rounded-bl-xs"
                }`}
              >
                {msg.role === "model" ? (
                  <div className="prose prose-sm prose-emerald max-w-none text-[#10201F] dark:text-white">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  <p>{msg.text}</p>
                )}
              </div>
              <span className="text-[10px] text-[#718684] dark:text-[#B3CFC8] mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#718684] dark:text-[#B3CFC8] p-3 rounded-xl bg-[#F7F2E9] dark:bg-[#172927] w-max">
              <Sparkles className="w-4 h-4 text-[#4E7F77] dark:text-[#7FB5AB] animate-spin" />
              <span>{language === "ar" ? "جاري التفكير..." : "Réflexion en cours..."}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="text-xs px-3 py-1.5 rounded-full bg-[#E3F0EC] dark:bg-[#1C2D2A] border border-[#C7E1DA] dark:border-[#2A423D] text-[#3D655F] dark:text-[#A5CEC4] hover:bg-[#C7E1DA] transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-[#EFE7DA] dark:border-[#243B37] bg-[#FCFAF6] dark:bg-[#12201E] space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenBooking}
              className="p-2.5 rounded-xl bg-[#E3F0EC] dark:bg-[#1C2D2A] border border-[#C7E1DA] dark:border-[#2A423D] text-[#3D655F] dark:text-[#A5CEC4] hover:bg-[#C7E1DA] transition-colors text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">{t.hero.bookBtn}</span>
            </button>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex-1 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={language === "ar" ? "اكتب سؤالك هنا..." : language === "en" ? "Type your question..." : "Posez votre question..."}
                className="w-full px-4 py-2.5 rounded-full bg-[#F7F2E9] dark:bg-[#172927] border border-[#EFE7DA] dark:border-[#243B37] text-sm text-[#10201F] dark:text-white focus:border-[#4E7F77] focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-2.5 rounded-full bg-[#4E7F77] text-white disabled:opacity-40 transition-colors shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
