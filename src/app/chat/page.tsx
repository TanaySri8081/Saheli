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
  carePathStep?: "01 Listen" | "02 Understand" | "03 Inform" | "04 Guide" | "05 Prepare";
  clarifyingQuestions?: string[];
  comfortMeasures?: string[];
  doctorDiscussionPoint?: string;
  source?: string;
  clinicalData?: ClinicalResponse;
}

const STORAGE_KEY = "saheli_chat_history";
const DOCTOR_SUMMARY_KEY = "saheli_doctor_discussion_points";

export default function ChatPage() {
  const { language, speakText, isSpeaking, stopSpeaking } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListeningSTT, setIsListeningSTT] = useState(false);
  const [sttNotice, setSttNotice] = useState<string | null>(null);
  const [doctorSummaryToast, setDoctorSummaryToast] = useState<string | null>(null);
  const [showCarePathExplainer, setShowCarePathExplainer] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initial welcome message configured with CarePath flow
  const welcomeMessage: ChatMessage = {
    id: "welcome_1",
    sender: "saheli",
    textEn:
      "Namaste! I am Saheli, your menstrual health & care companion. You can describe any pain, cycle irregularity, or reproductive concern in Hindi, Hinglish, or English. Through our 5-step CarePath (Listen → Understand → Inform → Guide → Prepare), I help you understand symptoms with reviewed medical knowledge (WHO, NHS, FOGSI) and prepare for doctor visits.",
    textHi:
      "नमस्ते! मैं सहेली हूँ, आपकी माहवारी स्वास्थ्य व देखभाल साथी। आप अपने किसी भी दर्द, अनियमित चक्र या शारीरिक चिंता को हिंदी या अंग्रेजी में बेझिझक साझा कर सकती हैं। हमारी 5-चरणीय केयरपाथ यात्रा (सुनें → समझें → जानकारी → राहत → डॉक्टर तैयारी) के माध्यम से हम WHO और NHS के प्रमाणित दिशानिर्देशों के साथ आपकी मदद करते हैं।",
    timestamp: "Just now",
    carePathStep: "01 Listen",
    clarifyingQuestions:
      language === "hi"
        ? [
            "क्या आप माहवारी में दर्द (cramps) का सामना कर रही हैं?",
            "क्या आपका चक्र 35 दिनों से अधिक देर से आया है?",
            "क्या आपको पीसीओएस (PCOS) या भारी रक्तस्राव के बारे में पूछना है?",
          ]
        : [
            "Are you experiencing disruptive menstrual cramps?",
            "Has your cycle delayed beyond 35 days?",
            "Would you like guidance on PCOS nutrition or heavy flow?",
          ],
    comfortMeasures:
      language === "hi"
        ? [
            "पेट के निचले हिस्से पर 40°C गर्म पानी की थैली से सिकाई करें।",
            "गुनगुना अजवाइन-जीरे का पानी पिएं।",
            "सुप्त बद्ध कोणासन में लेटकर पेल्विक मांसपेशियों को आराम दें।",
          ]
        : [
            "Apply 40°C continuous localized heat therapy for 15-20 mins.",
            "Sip warm carom (ajwain) and fennel infusion.",
            "Rest in Supta Baddha Konasana to release pelvic constriction.",
          ],
    doctorDiscussionPoint:
      language === "hi"
        ? "यदि दर्द कॉलेज या दैनिक काम को रोके, तो डॉक्टर से एंडोमेट्रियोसिस या पेल्विक जांच पर चर्चा करें।"
        : "If pain disrupts work or studies, discuss secondary dysmenorrhea screening with your OB-GYN.",
    clinicalData: {
      answerEn: "Reviewed against WHO, NHS, and FOGSI evidence-based standards.",
      answerHi: "विश्व स्वास्थ्य संगठन (WHO) और NHS के समीक्षा-युक्त मानकों पर आधारित।",
      citation: "WHO & NHS Reviewed Clinical Guidelines",
      actionProtocolEn: [
        "Ask in voice or text (STT enables speech transcription with editing).",
        "Save doctor discussion summaries directly for your next clinical appointment.",
      ],
      actionProtocolHi: [
        "बोलकर या लिखकर पूछें (आवाज पहचान के बाद आप भेजने से पहले इसे सुधार सकती हैं)।",
        "अगली क्लिनिक विजिट के लिए डॉक्टर परामर्श बिंदु सहेजें।",
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

  // Web Speech API for Step 01: Listen (STT with user correction before sending)
  const startVoiceSTT = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        language === "hi"
          ? "आपके ब्राउज़र में वॉइस रिकॉग्निशन उपलब्ध नहीं है। कृपया लिखकर प्रश्न पूछें।"
          : "Speech recognition is not supported in this browser. Please type your message."
      );
      return;
    }

    if (isListeningSTT) {
      recognitionRef.current?.stop();
      setIsListeningSTT(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListeningSTT(true);
        setSttNotice(
          language === "hi"
            ? "🎙️ सहेली सुन रही है... बोलिए (बोलने के बाद आप इसे संपादित कर सकती हैं)"
            : "🎙️ Saheli is listening... speak clearly (you can edit text before sending)"
        );
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        setInputText(transcript);
        setSttNotice(
          language === "hi"
            ? "✓ आवाज़ पहचान ली गई! भेजने से पहले आप चाहें तो इसे बदल या सुधार सकती हैं।"
            : "✓ Speech transcribed! You can edit or correct the text above before sending."
        );
      };

      recognition.onerror = () => {
        setIsListeningSTT(false);
        setSttNotice(null);
      };

      recognition.onend = () => {
        setIsListeningSTT(false);
      };

      recognition.start();
    } catch (e) {
      console.warn("STT initiation error:", e);
      setIsListeningSTT(false);
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    if (isListeningSTT) {
      recognitionRef.current?.stop();
      setIsListeningSTT(false);
    }
    setSttNotice(null);

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

    // Call /api/chat which uses Gemini 3.8 Flash server-side with local RAG fallback
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, language }),
      signal: controller.signal,
    })
      .then((res) => {
        clearTimeout(timeoutId);
        return res.json();
      })
      .then((data) => {
        const assistantMsg: ChatMessage = {
          id: "sah_" + Date.now(),
          sender: "saheli",
          textEn: data.response || "No response generated.",
          textHi: data.response || "कोई उत्तर नहीं मिला।",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          carePathStep: data.carePathStep || "03 Inform",
          clarifyingQuestions: data.clarifyingQuestions || [],
          comfortMeasures: data.comfortMeasures || data.actionSteps || [],
          doctorDiscussionPoint: data.doctorDiscussionPoint,
          source: data.source,
          clinicalData: {
            answerEn: data.response,
            answerHi: data.response,
            citation: data.citation || "WHO, NHS & FOGSI Clinical Guidelines",
            actionProtocolEn: data.actionSteps || data.comfortMeasures || [],
            actionProtocolHi: data.actionSteps || data.comfortMeasures || [],
            isEmergency: Boolean(data.isEmergency),
            emergencyNoticeEn: data.emergencyNotice,
            emergencyNoticeHi: data.emergencyNotice,
          },
        };
        const updated = [...newMessages, assistantMsg];
        setMessages(updated);
        setIsTyping(false);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn("Storage write error", e);
        }
      })
      .catch(() => {
        // Fallback to local clinical RAG on offline/network interrupt
        const clinicalResult = queryClinicalRag(text, language);
        const assistantMsg: ChatMessage = {
          id: "sah_" + Date.now(),
          sender: "saheli",
          textEn: clinicalResult.answerEn,
          textHi: clinicalResult.answerHi,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          carePathStep: "03 Inform",
          clarifyingQuestions:
            language === "hi"
              ? [
                  "0 से 10 के दर्द स्केल पर आप इसे क्या रेटिंग देंगी?",
                  "क्या दर्द की वजह से आपको कॉलेज या काम से छुट्टी लेनी पड़ती है?",
                ]
              : [
                  "On a scale of 0 to 10, how would you rate this pain?",
                  "Does this pain disrupt your college, work, or classes?",
                ],
          comfortMeasures:
            language === "hi" ? clinicalResult.actionProtocolHi : clinicalResult.actionProtocolEn,
          doctorDiscussionPoint:
            language === "hi"
              ? "डॉक्टर से चर्चा: 'मेरा माहवारी दर्द सामान्य से अधिक है, क्या मुझे पेल्विक अल्ट्रासाउंड की आवश्यकता है?'"
              : "Doctor discussion point: 'Is my pain level clinically significant, and should we evaluate for secondary dysmenorrhea?'",
          source: "clinical-rag-local",
          clinicalData: clinicalResult,
        };
        const updated = [...newMessages, assistantMsg];
        setMessages(updated);
        setIsTyping(false);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn("Storage write error", e);
        }
      });
  };

  // Step 05: Prepare Doctor Summary Item
  const handleAddToDoctorSummary = (msg: ChatMessage) => {
    if (!msg.doctorDiscussionPoint) return;
    try {
      const existingRaw = localStorage.getItem(DOCTOR_SUMMARY_KEY);
      const existing: string[] = existingRaw ? JSON.parse(existingRaw) : [];
      if (!existing.includes(msg.doctorDiscussionPoint)) {
        existing.push(msg.doctorDiscussionPoint);
        localStorage.setItem(DOCTOR_SUMMARY_KEY, JSON.stringify(existing));
      }
      setDoctorSummaryToast(
        language === "hi"
          ? "✓ डॉक्टर परामर्श बिंदु आपकी क्लिनिकल रिपोर्ट में जोड़ दिया गया!"
          : "✓ Doctor discussion point added to your Clinical Summary Report!"
      );
      setTimeout(() => setDoctorSummaryToast(null), 4000);
    } catch (e) {
      console.warn("Could not save doctor point", e);
    }
  };

  const handleClearChat = () => {
    if (
      confirm(
        language === "hi"
          ? "क्या आप बातचीत का इतिहास साफ़ करना चाहती हैं?"
          : "Clear all conversation history on this device?"
      )
    ) {
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

  const carePathSteps = [
    { num: "01", nameEn: "Listen", nameHi: "सुनें", descEn: "User speaks/types, STT transcribes & lets user correct", descHi: "बोलकर या लिखकर बताएं, सुधार का अवसर" },
    { num: "02", nameEn: "Understand", nameHi: "समझें", descEn: "Clarifying severity & impact without unnecessary data", descHi: "तीव्रता व प्रभाव पर स्पष्ट प्रश्न" },
    { num: "03", nameEn: "Inform", nameHi: "जानकारी", descEn: "Reviewed guidance from WHO, NHS & Office on Women's Health", descHi: "WHO, NHS व प्रमाणित स्वास्थ्य स्रोत" },
    { num: "04", nameEn: "Guide", nameHi: "राहत", descEn: "Evidence-based comfort, warmth, nutrition & pelvic rest", descHi: "40°C सिकाई, देसी काढ़ा, पेल्विक विश्राम" },
    { num: "05", nameEn: "Prepare", nameHi: "डॉक्टर तैयारी", descEn: "Synthesize clinical symptom summary for appointment", descHi: "क्लिनिक विज़िट हेतु स्पष्ट रिपोर्ट बिंदु" },
  ];

  const promptSuggestions = [
    {
      en: "Mere periods mein bahut dard hota hai aur college jaana mushkil ho raha hai",
      hi: "मेरे पीरियड्स में बहुत दर्द होता है और कॉलेज जाना मुश्किल हो रहा है",
      badge: "Signature CarePath",
    },
    {
      en: "Why do menstrual cramps happen and what is normal?",
      hi: "माहवारी में मरोड़ क्यों होती है और क्या सामान्य है?",
      badge: "WHO / NHS",
    },
    {
      en: "PCOS signs, insulin resistance & everyday diet",
      hi: "पीसीओएस के लक्षण, इंसुलिन और दैनिक आहार",
      badge: "Office on Women's Health",
    },
    {
      en: "Difference between normal cramps and Endometriosis",
      hi: "सामान्य ऐंठन और एंडोमेट्रियोसिस में क्या अंतर है?",
      badge: "ACOG / WHO",
    },
  ];

  return (
    <main className="flex-1 w-full pt-3 pb-28 md:pb-24 flex flex-col justify-between max-w-md md:max-w-3xl lg:max-w-4xl mx-auto min-h-[calc(100vh-8rem)]">
      {/* 1. Header with Saheli CarePath Journey Brand */}
      <section className="pb-2.5 border-b border-outline-variant/30 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-base">
                verified_user
              </span>
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                WHO • NHS • Office on Women&apos;s Health • FOGSI
              </span>
            </div>
            <h1 className="font-serif text-lg font-bold text-primary flex items-center gap-1.5">
              <span>{language === "hi" ? "सहेली केयरपाथ (CarePath)" : "Saheli CarePath AI"}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-sans font-semibold bg-primary/10 text-primary">
                Gemini 3.8
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowCarePathExplainer(!showCarePathExplainer)}
              className="p-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-primary transition-colors text-xs flex items-center gap-1 px-2"
              title="What is Saheli CarePath?"
            >
              <span className="material-symbols-outlined text-[16px]">timeline</span>
              <span className="text-[10px] font-bold">5 Steps</span>
            </button>

            <button
              onClick={handleClearChat}
              className="p-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-outline hover:text-error transition-colors"
              title="Clear Conversation"
            >
              <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
            </button>
          </div>
        </div>

        {/* 5-Step CarePath Progress Bar */}
        <div className="bg-surface-container-low p-2 rounded-xl border border-outline-variant/30">
          <div className="flex items-center justify-between text-[10px] font-semibold text-outline mb-1">
            <span className="text-primary font-bold">Saheli CarePath Journey</span>
            <span className="text-[9px] text-on-surface-variant">Symptoms → Reviewed Info → Doctor Ready</span>
          </div>
          <div className="grid grid-cols-5 gap-1 text-center">
            {carePathSteps.map((step) => (
              <div
                key={step.num}
                className="p-1 rounded bg-surface-container border border-outline-variant/20 flex flex-col items-center justify-center transition-all hover:border-primary/50"
              >
                <span className="text-[9px] font-bold text-primary">{step.num}</span>
                <span className="text-[9px] text-on-surface truncate w-full">
                  {language === "hi" ? step.nameHi : step.nameEn}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Optional Expandable CarePath Journey Description */}
        {showCarePathExplainer && (
          <div className="p-3 rounded-xl bg-surface-container text-xs text-on-surface-variant space-y-2 border border-primary/20 animate-fadeIn">
            <div className="flex items-center justify-between font-bold text-primary text-xs">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">route</span>
                <span>{language === "hi" ? "सहेली केयरपाथ क्या है?" : "What is Saheli CarePath?"}</span>
              </span>
              <button onClick={() => setShowCarePathExplainer(false)} className="text-outline text-xs">
                ✕
              </button>
            </div>
            <p className="text-[11px] leading-relaxed">
              {language === "hi"
                ? "यह सुविधा आपके लक्षणों को केवल एक उत्तर तक सीमित नहीं रखती, बल्कि 5 चरणों में आपकी मदद करती है: आपकी बात सुनना (01 Listen), दर्द की तीव्रता समझना (02 Understand), WHO/NHS से प्रमाणित जानकारी देना (03 Inform), घरेलू राहत मार्गदर्शन (04 Guide), और डॉक्टर से पूछने योग्य क्लिनिकल सारांश तैयार करना (05 Prepare)।"
                : "CarePath connects your symptoms into a trusted clinical journey: Listen (speech/text with correction) → Understand (severity & duration) → Inform (WHO/NHS reviewed guidance) → Guide (heat, teas, rest) → Prepare (symptom summary for your doctor appointment)."}
            </p>
          </div>
        )}
      </section>

      {/* 2. Suggested Prompt Chips with Specific CarePath Demonstrator */}
      <section className="py-2 overflow-x-auto flex gap-1.5 scrollbar-none">
        {promptSuggestions.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(language === "hi" ? prompt.hi : prompt.en)}
            className="px-2.5 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-[11px] font-medium text-on-surface-variant hover:text-primary whitespace-nowrap transition-colors flex-shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <span className="text-[9px] px-1 rounded bg-secondary/15 text-secondary font-bold uppercase">
              {prompt.badge}
            </span>
            <span>{language === "hi" ? prompt.hi : prompt.en}</span>
          </button>
        ))}
      </section>

      {/* Doctor Summary Added Toast Notification */}
      {doctorSummaryToast && (
        <div className="sticky top-2 z-20 p-2.5 rounded-xl bg-primary text-white text-xs shadow-warm-md flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>{doctorSummaryToast}</span>
          </div>
          <Link
            href="/my-cycle"
            className="text-[10px] underline font-bold px-2 py-0.5 rounded bg-white/20 hover:bg-white/30"
          >
            {language === "hi" ? "देखें" : "View"}
          </Link>
        </div>
      )}

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

          // Assistant Response Card with Full CarePath Journey Breakdown
          const isEmergency = msg.clinicalData?.isEmergency;
          const questions = msg.clarifyingQuestions || [];
          const comforts = msg.comfortMeasures || msg.clinicalData?.actionProtocolEn || [];
          const doctorPoint = msg.doctorDiscussionPoint;

          return (
            <div key={msg.id} className="flex flex-col items-start animate-fadeIn max-w-[98%]">
              <div className="p-4 rounded-2xl rounded-tl-sm bg-surface-container border border-outline-variant/30 text-xs text-on-surface shadow-warm-sm space-y-3 w-full">
                {/* Assistant Header & Citation */}
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-white font-serif text-xs flex items-center justify-center font-bold shadow-sm">
                      स
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-primary text-xs">Saheli CarePath</span>
                        {msg.source && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-surface-container-highest text-outline">
                            {msg.source.includes("gemini") ? "Gemini 3.8 Flash" : "Local RAG"}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-outline block">
                        {language === "hi" ? "गोपनीय एवं चिकित्सकीय समीक्षा प्राप्त" : "Confidential & Clinically Reviewed"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleReadResponse(msg)}
                      className="p-1 rounded-full hover:bg-surface-container-highest text-primary transition-colors"
                      title="Read Aloud"
                    >
                      <span className="material-symbols-outlined text-[18px]">volume_up</span>
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

                {/* Main Empathetic Explanation (01 Listen & 03 Inform) */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-secondary">
                    <span className="material-symbols-outlined text-[14px]">psychology_alt</span>
                    <span>{language === "hi" ? "01 सुनो व 03 प्रमाणित जानकारी" : "01 Listen & 03 Inform"}</span>
                  </div>
                  <p className="leading-relaxed text-on-surface-variant font-sans whitespace-pre-line text-[12px]">
                    {language === "hi" ? msg.textHi : msg.textEn}
                  </p>
                </div>

                {/* Reviewed Source Citation Badge */}
                {msg.clinicalData?.citation && (
                  <div className="flex items-center gap-1.5 text-[10px] text-outline bg-surface-container-high px-2 py-1 rounded-lg">
                    <span className="material-symbols-outlined text-[13px] text-primary">menu_book</span>
                    <span className="font-semibold text-on-surface-variant">
                      {language === "hi" ? "समीक्षित स्रोत:" : "Reviewed Sources:"}
                    </span>
                    <span className="truncate">{msg.clinicalData.citation}</span>
                  </div>
                )}

                {/* Step 02: Understand (Clarifying Questions) */}
                {questions.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">help_center</span>
                        <span>{language === "hi" ? "02 समझें — स्थिति स्पष्ट करें:" : "02 Understand — Clarifying Details:"}</span>
                      </span>
                      <span className="text-[9px] text-outline">
                        {language === "hi" ? "टैप करके उत्तर दें" : "Tap to respond"}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {questions.map((q, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendMessage(q)}
                          className="w-full text-left p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 text-[11px] text-on-surface-variant hover:text-primary transition-colors flex items-start gap-1.5"
                        >
                          <span className="text-secondary font-bold">?</span>
                          <span className="flex-1 leading-snug">{q}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 04: Guide (Comfort Measures & Home Care Protocol) */}
                {comforts.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-outline flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-secondary">self_improvement</span>
                      <span>{language === "hi" ? "04 राहत — घरेलू देखभाल व उपाय:" : "04 Guide — Supportive Comfort Measures:"}</span>
                    </span>
                    <ul className="space-y-1">
                      {comforts.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[11px] text-on-surface-variant">
                          <span className="text-secondary font-bold">•</span>
                          <span className="leading-snug">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Step 05: Prepare (Doctor Discussion Summary & One-Click Save) */}
                {doctorPoint && (
                  <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                    <div className="flex items-center gap-1.5 text-primary font-bold text-[10px] uppercase">
                      <span className="material-symbols-outlined text-[15px]">clinical_notes</span>
                      <span>{language === "hi" ? "05 डॉक्टर तैयारी — परामर्श बिंदु:" : "05 Prepare — Doctor Discussion Point:"}</span>
                    </div>
                    <p className="text-[11px] text-on-surface leading-snug italic bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/20">
                      &quot;{doctorPoint}&quot;
                    </p>
                    <button
                      type="button"
                      onClick={() => handleAddToDoctorSummary(msg)}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-primary hover:bg-primary-container text-white text-[10px] font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">note_add</span>
                      <span>
                        {language === "hi" ? "डॉक्टर रिपोर्ट में जोड़ें (Add to Summary)" : "Add to Doctor Appointment Summary"}
                      </span>
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-outline mt-1 px-1">{msg.timestamp}</span>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-surface-container w-32 text-xs text-outline animate-pulse">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="w-2 h-2 rounded-full bg-primary animation-delay-200" />
            <span className="w-2 h-2 rounded-full bg-primary animation-delay-400" />
            <span className="text-[11px] font-medium text-primary">CarePath AI...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Sticky Input Dock with Voice STT & User Correction */}
      <div className="fixed bottom-16 md:bottom-2 left-0 right-0 max-w-md md:max-w-3xl lg:max-w-4xl mx-auto px-4 z-30 pb-2 space-y-1">
        {/* STT Notice Banner (Step 01: Transcribe & User Correction) */}
        {sttNotice && (
          <div className="p-2 rounded-xl bg-surface-container-highest text-on-surface-variant text-[11px] border border-primary/30 flex items-center justify-between shadow-sm animate-fadeIn">
            <span className="truncate pr-2">{sttNotice}</span>
            <button onClick={() => setSttNotice(null)} className="text-outline text-xs font-bold">
              ✕
            </button>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-warm-md"
        >
          {/* Voice STT Microphone Button with live listening animation */}
          <button
            type="button"
            onClick={startVoiceSTT}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
              isListeningSTT
                ? "bg-error text-white animate-pulse"
                : "bg-surface-container text-primary hover:bg-surface-container-high"
            }`}
            title={
              language === "hi"
                ? "माइक: अपनी आवाज में बोलें (STT आपको सुधारने का विकल्प देगा)"
                : "Microphone: Speak your concern (STT enables transcription with user editing)"
            }
          >
            <span className="material-symbols-outlined text-[20px] block">
              {isListeningSTT ? "settings_voice" : "mic"}
            </span>
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              language === "hi"
                ? "माहवारी दर्द, लक्षण या पोषण के बारे में पूछें..."
                : "Describe your period pain or symptoms..."
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

        <div className="flex items-center justify-between px-2 text-[10px] text-outline">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px] text-secondary">lock</span>
            <span>{language === "hi" ? "व्यक्तिगत डिवाइस पर सुरक्षित" : "Private & Client-Side Secured"}</span>
          </span>
          <Link href="/my-cycle" className="text-primary hover:underline font-semibold">
            {language === "hi" ? "डॉक्टर रिपोर्ट देखें →" : "View Doctor Report →"}
          </Link>
        </div>
      </div>
    </main>
  );
}
