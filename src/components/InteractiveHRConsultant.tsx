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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl h-[600px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden page-fade">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-coral-500 shadow-sm">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                Konsultasi & Tanya HR Savage
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">TARGET ROLE: {targetRole}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 border border-slate-200 transition soft-btn"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              {msg.sender === "hr" && (
                <div className="w-7 h-7 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-coral-500 flex-shrink-0 mt-1 shadow-sm"><Flame className="w-4 h-4" /></div>
              )}
              <div className={`p-3.5 rounded-3xl max-w-[85%] leading-relaxed ${msg.sender === "user" ? "bg-coral-600 text-white rounded-tr-none shadow-sm" : "bg-slate-50 text-slate-700 border border-slate-200 rounded-tl-none soft-shadow"}`}>
                <div className="prose prose-invert prose-xs max-w-none text-xs sm:text-sm"><ReactMarkdown>{msg.text}</ReactMarkdown></div>
                <div className={`text-[10px] mt-1 text-right font-mono ${msg.sender === "user" ? "text-coral-200" : "text-slate-400"}`}>{msg.timestamp}</div>
              </div>
              {msg.sender === "user" && (
                <div className="w-7 h-7 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-500 flex-shrink-0 mt-1 shadow-sm"><User className="w-4 h-4" /></div>
              )}
            </div>
          ))}
          {isSending && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-7 h-7 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-coral-500 flex-shrink-0 shadow-sm"><Flame className="w-4 h-4 animate-pulse" /></div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2 shadow-sm"><div className="w-2 h-2 rounded-full bg-coral-500 animate-pulse" /><span>HR sedang meracik jawaban...</span></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-5 py-3 bg-white border-t border-slate-200 flex overflow-x-auto gap-1.5 scrollbar-none">
          {QUICK_QUESTIONS.map((q, idx) => (
            <button key={idx} type="button" onClick={() => handleSendMessage(q)} className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 whitespace-nowrap border border-slate-200 transition flex items-center gap-1 soft-btn"><Sparkles className="w-3 h-3 text-coral-400" /> {q}</button>
          ))}
        </div>

        <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} placeholder="Tanyakan sesuatu atau minta HR rombak bagian tertentu..." className="flex-1 px-4 py-3 rounded-3xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-coral-400 focus-ring-soft" />
          <button onClick={() => handleSendMessage()} disabled={!inputText.trim() || isSending} className="p-2.5 rounded-3xl bg-coral-600 hover:bg-coral-700 text-white transition disabled:opacity-60 disabled:cursor-not-allowed shadow-md cursor-pointer soft-btn"><Send className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
};


