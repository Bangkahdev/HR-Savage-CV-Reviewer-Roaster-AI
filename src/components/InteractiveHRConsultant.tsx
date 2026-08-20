import React, { useState, useRef, useEffect } from "react";
import { X, Send, User, Flame, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ChatMessage, CVReviewResult } from "../types";
import { safeFetchJson } from "../utils/api";

interface InteractiveHRConsultantProps {
  isOpen: boolean;
  onClose: () => void;
  cvContext: CVReviewResult | null;
  targetRole: string;
}

const QUICK_QUESTIONS = [
  "Bagaimana cara nulis pengalaman kalau saya tidak tahu angka pastinya?",
  "Bantu buatkan Professional Summary yang mematikan untuk role ini.",
  "Bagaimana cara menutupi gap karir 6 bulan?",
  "Ubah deskripsi 'bertanggung jawab atas bug fixing' jadi kalimat kelas dunia.",
];

export const InteractiveHRConsultant: React.FC<InteractiveHRConsultantProps> = ({
  isOpen,
  onClose,
  cvContext,
  targetRole,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      sender: "hr",
      text: `Halo! Saya Head of Talent Acquisition & Savage HR yang baru saja menguliti CV kamu untuk posisi **${targetRole}**. Ada bagian yang bikin kamu bingung atau mau saya bantu rombak kalimat tertentu dengan formula STAR?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText("");
    setIsSending(true);

    try {
      const res = await safeFetchJson<{ reply: string }>("/api/chat-hr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory,
          cvContext: cvContext ? {
            score: cvContext.overallScore,
            verdict: cvContext.verdictTag,
            redFlags: cvContext.fatalRedFlags,
          } : undefined,
          targetRole,
        }),
      });

      if (res.success && res.data?.reply) {
        const botMsg: ChatMessage = {
          id: `hr-${Date.now()}`,
          sender: "hr",
          text: res.data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(res.error || "Gagal mendapatkan respon dari HR.");
      }
    } catch (err: any) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: `hr-err-${Date.now()}`,
        sender: "hr",
        text: err?.message || "Maaf, koneksi terputus saat menghubungi HR. Silakan coba kirim ulang pertanyaan Anda.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl h-[600px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-red-500">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-zinc-100 uppercase tracking-wide flex items-center gap-1.5">
                Konsultasi & Tanya HR Savage
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono">TARGET ROLE: {targetRole}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "hr" && (
                <div className="w-7 h-7 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-red-500 flex-shrink-0 mt-1">
                  <Flame className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-red-600 text-white rounded-tr-none shadow-md"
                    : "bg-zinc-950 text-zinc-200 border border-zinc-800 rounded-tl-none"
                }`}
              >
                <div className="prose prose-invert prose-xs max-w-none text-xs sm:text-sm">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                <div
                  className={`text-[10px] mt-1 text-right font-mono ${
                    msg.sender === "user" ? "text-red-200" : "text-zinc-500"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === "user" && (
                <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 flex-shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isSending && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-7 h-7 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-red-500 flex-shrink-0">
                <Flame className="w-4 h-4 animate-pulse" />
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>HR sedang meracik jawaban...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions Pills */}
        <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-800 flex overflow-x-auto gap-1.5 scrollbar-none">
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="text-[11px] px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white whitespace-nowrap border border-zinc-800 transition flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-red-400" /> {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Tanyakan sesuatu atau minta HR rombak bagian tertentu..."
            className="flex-1 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs sm:text-sm focus:outline-none focus:border-red-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isSending}
            className="p-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
