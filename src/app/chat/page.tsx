"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { queryClinicalRag, ClinicalResponse } from "@/lib/clinicalRag";

interface ChatMessage {
  id: string;
  sender: "user" | "saheli";
  textEn: string;
  textHi: string;
  timestamp: string;
  clinicalData?: ClinicalResponse;
}

const STORAGE_KEY = "saheli_chat_history";

export default function ChatPage() {
  const { language, speakText, isSpeaking, stopSpeaking } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  const welcomeMessage: ChatMessage = {
    id: "welcome_1",
    sender: "saheli",
    textEn:
      "Namaste! I am your Saheli companion. You can ask me anything about your menstrual cycle, pain management, hormonal nutrition, or reproductive symptoms in English or Hindi. What is on your mind today?",
    textHi:
      "नमस्ते! मैं आपकी सहेली साथी हूँ। आप मुझसे अपने मासिक धर्म, दर्द प्रबंधन, पोषण या स्वास्थ्य संबंधी कोई भी प्रश्न हिंदी या अंग्रेजी में बेझिझक पूछ सकती हैं। आज आप क्या जानना चाहती हैं?",
    timestamp: "Just now",
    clinicalData: {
      answerEn: "All responses are aligned with official FOGSI and ACOG evidence-based standards.",
      answerHi: "सभी परामर्श FOGSI और ACOG के आधिकारिक दिशानिर्देशों पर आधारित हैं।",
      citation: "FOGSI / ACOG Clinical Standards",
      actionProtocolEn: [
        "Ask about cramps, irregular cycles, PCOS, or soothing Indian meals.",
        "Tap the speaker icon on any message to listen to the explanation aloud.",
      ],
      actionProtocolHi: [
        "माहवारी के दर्द, अनियमित चक्र, पीसीओएस या घरेलू आहार के बारे में पूछें।",
        "किसी भी उत्तर को सुनने के लिए स्पीकर आइकन पर टैप करें।",
      ],
      isEmergency: false,
    },
  };

  // Load from local storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setMessages(JSON.parse(raw));
      } else {
        setMessages([welcomeMessage]);
      }
    } catch {
      setMessages([welcomeMessage]);
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: "usr_" + Date.now(),
      sender: "user",
      textEn: text,
      textHi: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText("");
    setIsTyping(true);

    // Simulate gentle clinical processing
    setTimeout(() => {
      const clinicalResult = queryClinicalRag(text, language);
      const assistantMsg: ChatMessage = {
        id: "sah_" + Date.now(),
        sender: "saheli",
        textEn: clinicalResult.answerEn,
        textHi: clinicalResult.answerHi,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        clinicalData: clinicalResult,
      };

      const updated = [...newMessages, assistantMsg];
      setMessages(updated);
      setIsTyping(false);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Storage full", e);
      }
    }, 700);
  };

  const handleClearChat = () => {
    if (confirm(language === "hi" ? "क्या आप बातचीत का इतिहास साफ़ करना चाहती हैं?" : "Clear all conversation history on this device?")) {
      setMessages([welcomeMessage]);
      localStorage.removeItem(STORAGE_KEY);
      stopSpeaking();
    }
  };

  const handleReadResponse = (msg: ChatMessage) => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    const textToRead = language === "hi" ? msg.textHi : msg.textEn;
    speakText(textToRead);
  };

  const promptSuggestions = [
    { en: "Why do menstrual cramps happen?", hi: "माहवारी में मरोड़ क्यों होती है?" },
    { en: "PCOS signs & everyday diet", hi: "पीसीओएस के लक्षण व आहार" },
    { en: "Difference between cramps and Endometriosis", hi: "सामान्य ऐंठन और एंडोमेट्रियोसिस में अंतर" },
    { en: "Is bleeding for 7 days normal?", hi: "7 दिन रक्तस्राव क्या सामान्य है?" },
  ];

  return (
    <main className="flex-1 w-full px-4 pt-4 pb-24 flex flex-col justify-between max-w-md mx-auto min-h-[calc(100vh-8rem)]">
      {/* 1. Header with FOGSI / ACOG Badge */}
      <section className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-base">
              verified
            </span>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
              FOGSI / ACOG Aligned
            </span>
          </div>
          <h1 className="font-serif text-xl font-medium text-primary">
            {language === "hi" ? "सहेली AI स्वास्थ्य साथी" : "Ask Saheli AI Companion"}
          </h1>
        </div>

        <button
          onClick={handleClearChat}
          className="p-2 rounded-full bg-surface-container hover:bg-surface-container-high text-outline hover:text-error transition-colors"
          title="Clear Conversation"
        >
          <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
        </button>
      </section>

      {/* 2. Suggested Prompt Chips */}
      <section className="py-2.5 overflow-x-auto flex gap-1.5 scrollbar-none">
        {promptSuggestions.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(language === "hi" ? prompt.hi : prompt.en)}
            className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-[11px] font-medium text-on-surface-variant hover:text-primary whitespace-nowrap transition-colors flex-shrink-0"
          >
            {language === "hi" ? prompt.hi : prompt.en}
          </button>
        ))}
      </section>

      {/* 3. Conversation Message Stream */}
      <div className="flex-1 space-y-4 py-3 overflow-y-auto">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";

          if (isUser) {
            return (
              <div key={msg.id} className="flex flex-col items-end animate-fadeIn">
                <div className="p-3.5 rounded-2xl rounded-tr-sm bg-primary text-white text-xs max-w-[85%] shadow-warm-sm leading-relaxed">
                  <p>{language === "hi" ? msg.textHi : msg.textEn}</p>
                </div>
                <span className="text-[10px] text-outline mt-1 px-1">{msg.timestamp}</span>
              </div>
            );
          }

          // Assistant Response Card
          const isEmergency = msg.clinicalData?.isEmergency;
          return (
            <div key={msg.id} className="flex flex-col items-start animate-fadeIn max-w-[95%]">
              <div className="p-4 rounded-2xl rounded-tl-sm bg-surface-container border border-outline-variant/30 text-xs text-on-surface shadow-warm-sm space-y-2.5 w-full">
                {/* Assistant Header & Citation */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-primary text-white font-serif text-[11px] flex items-center justify-center font-bold">
                      स
                    </span>
                    <span className="font-semibold text-primary text-xs">Saheli</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {msg.clinicalData?.citation && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container-high text-outline">
                        {msg.clinicalData.citation}
                      </span>
                    )}
                    <button
                      onClick={() => handleReadResponse(msg)}
                      className="p-1 rounded-full hover:bg-surface-container-highest text-primary transition-colors"
                      title="Read Aloud"
                    >
                      <span className="material-symbols-outlined text-[16px]">volume_up</span>
                    </button>
                  </div>
                </div>

                {/* Emergency Triage Banner */}
                {isEmergency && (
                  <div className="p-3 rounded-xl bg-error-container text-[#93000a] border border-error/40 space-y-1 animate-pulse">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span className="material-symbols-outlined text-[18px]">warning</span>
                      <span>
                        {language === "hi" ? "आपातकालीन चेतावनी (Red Flag)" : "Emergency Triage Warning"}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {language === "hi"
                        ? msg.clinicalData?.emergencyNoticeHi
                        : msg.clinicalData?.emergencyNoticeEn}
                    </p>
                  </div>
                )}

                {/* Main Explanation */}
                <p className="leading-relaxed text-on-surface-variant font-sans">
                  {language === "hi" ? msg.textHi : msg.textEn}
                </p>

                {/* Protocol Action Bullets */}
                {msg.clinicalData?.actionProtocolEn && msg.clinicalData.actionProtocolEn.length > 0 && (
                  <div className="pt-2 border-t border-outline-variant/20 space-y-1.5 bg-surface-container-low p-2.5 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-outline block">
                      {language === "hi" ? "घरेलू राहत व स्व-देखभाल प्रोटोकॉल:" : "Self-Care Protocol:"}
                    </span>
                    <ul className="space-y-1">
                      {(language === "hi" ? msg.clinicalData.actionProtocolHi : msg.clinicalData.actionProtocolEn).map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[11px] text-on-surface-variant">
                          <span className="text-secondary font-bold">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-outline mt-1 px-1">{msg.timestamp}</span>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-surface-container w-28 text-xs text-outline animate-pulse">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="w-2 h-2 rounded-full bg-primary animation-delay-200" />
            <span className="w-2 h-2 rounded-full bg-primary animation-delay-400" />
            <span className="text-[11px]">Thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Sticky Input Dock */}
      <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto px-4 z-30 pb-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-warm-md"
        >
          {/* Voice Sanctuary Link */}
          <Link
            href="/voice"
            className="p-2.5 rounded-xl bg-surface-container text-primary hover:bg-surface-container-high transition-colors"
            title="Switch to Voice Waves Sanctuary"
          >
            <span className="material-symbols-outlined text-[20px] block">mic</span>
          </Link>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              language === "hi"
                ? "माहवारी, दर्द या पोषण के बारे में पूछें..."
                : "Ask about cramps, symptoms, or meals..."
            }
            className="flex-1 px-3 py-2 text-xs bg-transparent text-on-surface placeholder:text-outline focus:outline-none"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-40 hover:bg-primary-container transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </form>

        <p className="text-[10px] text-outline text-center mt-1">
          {language === "hi"
            ? "शैक्षिक मार्गदर्शन। व्यक्तिगत फोन पर गोपनीय व सुरक्षित।"
            : "Educational guidance. Confidential & stored on this device only."}
        </p>
      </div>
    </main>
  );
}
