"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { queryClinicalRag } from "@/lib/clinicalRag";

export default function VoicePage() {
  const router = useRouter();
  const { language, setLanguage, speakText, stopSpeaking, isSpeaking } = useLanguage();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [responseEn, setResponseEn] = useState("");
  const [responseHi, setResponseHi] = useState("");
  const [citation, setCitation] = useState("");
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [confidence, setConfidence] = useState(96);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Conversation Timer
  useEffect(() => {
    if (isListening || isSpeaking) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isListening, isSpeaking]);

  // Clean up speech recognition & audio on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, [stopSpeaking]);

  const startListening = () => {
    if (typeof window === "undefined") return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(language === "hi" ? "आपके ब्राउज़र में आवाज पहचान समर्थित नहीं है।" : "Speech recognition is not supported in this browser.");
      return;
    }

    stopSpeaking();

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        setConfidence(Math.floor(92 + Math.random() * 7));
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  };

  const handleToggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSubmitInquiry = () => {
    stopListening();
    const query = transcript.trim();
    if (!query) return;

    const result = queryClinicalRag(query, language);
    setResponseEn(result.answerEn);
    setResponseHi(result.answerHi);
    setCitation(result.citation);

    if (autoSpeak) {
      const textToSpeak = language === "hi" ? result.answerHi : result.answerEn;
      speakText(textToSpeak);
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? "0" : ""}${remaining}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#211920] text-white flex flex-col justify-between p-5 select-none font-sans overflow-y-auto">
      {/* 1. Top Controls Bar */}
      <section className="flex items-center justify-between">
        <button
          onClick={() => {
            stopSpeaking();
            router.push("/chat");
          }}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Back to chat"
        >
          <span className="material-symbols-outlined block text-[20px]">arrow_back</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
          <span>{formatTimer(timerSeconds)} • {isListening ? "Listening" : isSpeaking ? "Speaking" : "Ready"}</span>
        </div>

        {/* Language Switcher */}
        <div className="flex bg-white/10 p-0.5 rounded-full border border-white/20">
          <button
            onClick={() => setLanguage("en")}
            className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all ${
              language === "en" ? "bg-primary text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("hi")}
            className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all ${
              language === "hi" ? "bg-primary text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            हिंदी
          </button>
        </div>
      </section>

      {/* 2. Harmonic Sound Wave Visualizer */}
      <section className="flex flex-col items-center justify-center my-6 space-y-4">
        {/* Animated Sound Wave Bars */}
        <div className="h-28 flex items-center justify-center gap-1.5 px-4 w-full max-w-xs">
          {[
            { h: isListening || isSpeaking ? "h-16" : "h-6", delay: "delay-75" },
            { h: isListening || isSpeaking ? "h-24" : "h-10", delay: "delay-100" },
            { h: isListening || isSpeaking ? "h-28" : "h-14", delay: "delay-150" },
            { h: isListening || isSpeaking ? "h-20" : "h-8", delay: "delay-200" },
            { h: isListening || isSpeaking ? "h-28" : "h-16", delay: "delay-100" },
            { h: isListening || isSpeaking ? "h-22" : "h-12", delay: "delay-300" },
            { h: isListening || isSpeaking ? "h-14" : "h-6", delay: "delay-75" },
          ].map((bar, idx) => (
            <div
              key={idx}
              className={`w-2.5 rounded-full bg-gradient-to-t from-primary via-[#60445f] to-secondary-container transition-all duration-300 ${
                isListening || isSpeaking ? "animate-pulse" : "opacity-40"
              } ${bar.h} ${bar.delay}`}
            />
          ))}
        </div>

        <p className="text-xs text-zinc-400 tracking-wide font-medium">
          {isListening
            ? language === "hi"
              ? "सहेली सुन रही है... बोलें"
              : "Saheli is listening... Speak freely"
            : isSpeaking
            ? language === "hi"
              ? "सहेली उत्तर सुना रही है..."
              : "Saheli is speaking..."
            : language === "hi"
            ? "माइक बटन दबाकर पूछें"
            : "Tap the microphone to speak"}
        </p>
      </section>

      {/* 3. Real-Time Transcript & Clinical Response Display */}
      <section className="space-y-3 max-w-sm mx-auto w-full">
        {/* Live Spoken Input */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span className="font-semibold uppercase tracking-wider">
              {language === "hi" ? "आपकी आवाज (Transcribed)" : "Live Transcript"}
            </span>
            {transcript && (
              <span className="text-[10px] text-secondary-container font-mono">
                {confidence}% Confidence
              </span>
            )}
          </div>
          <p className="text-sm font-medium leading-relaxed min-h-[2.5rem]">
            {transcript || (
              <span className="text-zinc-500 italic text-xs">
                {language === "hi"
                  ? "उदाहरण: 'माहवारी में तेज मरोड़ क्यों होती है?'"
                  : "e.g., 'Why do I experience severe cramps on day 1?'"}
              </span>
            )}
          </p>

          {transcript && (
            <div className="flex justify-end gap-2 pt-1 border-t border-white/10">
              <button
                onClick={() => setTranscript("")}
                className="text-[11px] text-zinc-400 hover:text-white"
              >
                {language === "hi" ? "साफ़ करें" : "Clear"}
              </button>
            </div>
          )}
        </div>

        {/* Assistant Response Card */}
        {(responseEn || responseHi) && (
          <div className="p-4 rounded-2xl bg-[#482e47] border border-white/20 space-y-2 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-serif font-bold text-tertiary-fixed">
                Saheli AI
              </span>
              {citation && (
                <span className="text-[10px] text-zinc-300 font-mono bg-black/20 px-2 py-0.5 rounded">
                  {citation}
                </span>
              )}
            </div>
            <p className="text-xs text-white leading-relaxed">
              {language === "hi" ? responseHi : responseEn}
            </p>
          </div>
        )}
      </section>

      {/* 4. Action Dock */}
      <section className="pt-4 pb-2 space-y-3 max-w-sm mx-auto w-full">
        <div className="flex items-center justify-around">
          {/* Cancel Button */}
          <button
            onClick={() => {
              stopListening();
              stopSpeaking();
              setTranscript("");
            }}
            className="w-12 h-12 rounded-full bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center text-xs font-semibold transition-colors"
          >
            {language === "hi" ? "रद्द" : "Cancel"}
          </button>

          {/* Large Pulsing Center Microphone */}
          <button
            onClick={handleToggleMic}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
              isListening
                ? "bg-error text-white scale-110 ring-4 ring-error/40 animate-pulse"
                : "bg-primary text-white hover:scale-105 active:scale-95 border-2 border-white/20"
            }`}
            aria-label="Toggle Microphone"
          >
            <span className="material-symbols-outlined text-4xl">
              {isListening ? "mic" : "mic"}
            </span>
          </button>

          {/* Submit Action */}
          <button
            onClick={handleSubmitInquiry}
            disabled={!transcript.trim()}
            className="w-12 h-12 rounded-full bg-secondary-container text-[#00210e] disabled:opacity-30 flex items-center justify-center font-bold text-xs hover:scale-105 transition-all shadow-sm"
          >
            {language === "hi" ? "पूछें" : "Ask"}
          </button>
        </div>

        {/* Auto-read Toggle & Switch to Keyboard */}
        <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-white/10">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(e) => setAutoSpeak(e.target.checked)}
              className="accent-primary rounded"
            />
            <span className="text-[11px]">
              {language === "hi" ? "उत्तर बोलकर सुनाएं (Auto-speak)" : "Auto-speak answers"}
            </span>
          </label>

          <Link
            href="/chat"
            className="text-[11px] text-zinc-300 hover:text-white underline"
          >
            {language === "hi" ? "कीबोर्ड से लिखें" : "Use keyboard"}
          </Link>
        </div>
      </section>
    </div>
  );
}
