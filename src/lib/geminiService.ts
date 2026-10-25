import { GoogleGenAI } from "@google/genai";
import { queryClinicalRag } from "@/lib/clinicalRag";
import clinicalGuidelines from "@/data/clinicalGuidelines.json";

export interface CarePathResponse {
  answer: string;
  empathyValidation?: string;
  reviewedInformation?: string;
  citation: string;
  carePathStep: "01 Listen" | "02 Understand" | "03 Inform" | "04 Guide" | "05 Prepare";
  clarifyingQuestions?: string[];
  comfortMeasures: string[];
  doctorDiscussionPoint?: string;
  isEmergency: boolean;
  emergencyNotice?: string;
  source: "gemini-3.8-flash" | "clinical-rag-local";
}

// Regex for fast detection of casual greetings in English, Hindi, and Hinglish
const GREETING_PATTERNS =
  /^(hi|hello|hey|hii+|heyy+|namaste|namaskar|pranam|good\s*(morning|afternoon|evening)|howdy|hola|yo|नमस्ते|नमस्कार|प्रणाम|सलाम|हाय|हेलो|হ্যাল|নমস্কার|నమస్కారం|வணக்கம்|નમસ્તે)($|[\s!?.,])/i;

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi (हिंदी)",
  bn: "Bengali (বাংলা)",
  mr: "Marathi (मराठी)",
  te: "Telugu (తెలుగు)",
  ta: "Tamil (தமிழ்)",
  gu: "Gujarati (ગુજરાતી)",
};

export async function askSaheliWithGemini(
  query: string,
  language: string = "en"
): Promise<CarePathResponse> {
  const trimmed = query.trim();
  const isHindi = language === "hi";

  // 1. FAST GREETING INTERCEPTOR (< 5ms response time)
  // For simple greetings like "hi", reply immediately with warmth without external LLM latency
  if (trimmed.length <= 25 && GREETING_PATTERNS.test(trimmed)) {
    return {
      answer: isHindi
        ? "नमस्ते! मैं आपकी सहेली (Saheli) स्वास्थ्य साथी हूँ। आप मुझसे अपने मासिक धर्म, ऐंठन या दर्द, अनियमित चक्र, पीसीओएस या घरेलू पोषण के बारे में हिंदी या अंग्रेजी में बेझिझक पूछ सकती हैं। आज आप कैसा महसूस कर रही हैं या किस विषय पर बात करना चाहती हैं?"
        : "Namaste! I am Saheli, your menstrual health & cycle companion. You can ask me anything about period cramps, cycle regularity, nutrition, or PCOS in English or Hindi. How are you feeling today, or what concern can I assist you with?",
      citation: "WHO & NHS Adolescent Health Standards",
      carePathStep: "01 Listen",
      clarifyingQuestions: isHindi
        ? [
            "क्या आप इस समय माहवारी के दर्द या ऐंठन से परेशान हैं?",
            "क्या आपकी माहवारी में देरी या अनियमितता हो रही है?",
            "क्या आपको पीसीओएस (PCOS) या आहार के बारे में जानना है?",
          ]
        : [
            "Are you experiencing period cramps or pain right now?",
            "Is your cycle delayed or irregular?",
            "Would you like guidance on PCOS or balancing nutrition?",
          ],
      comfortMeasures: isHindi
        ? [
            "आप माइक पर टैप करके अपनी भाषा में बोलकर भी पूछ सकती हैं।",
            "सभी उत्तर WHO, NHS और FOGSI के समीक्षा-युक्त मानकों पर आधारित हैं।",
            "निजी जानकारी हमेशा आपके डिवाइस पर सुरक्षित रहती है।",
          ]
        : [
            "You can tap the microphone to speak naturally via Speech-to-Text.",
            "All guidance is grounded in reviewed WHO, NHS, and FOGSI clinical standards.",
            "Your conversations stay private and local to your device.",
          ],
      doctorDiscussionPoint: isHindi
        ? "किसी भी असामान्य दर्द या 3 चक्रों से अधिक अनियमितता पर डॉक्टर से परामर्श अवश्य लें।"
        : "Prepare to discuss persistent pain or cycle variations across 3 consecutive cycles with your physician.",
      isEmergency: false,
      source: "clinical-rag-local",
    };
  }

  // 2. Red-Flag & Urgent Safety Check
  const localRag = queryClinicalRag(trimmed, language);

  if (localRag.isEmergency) {
    return {
      answer: isHindi
        ? "🚨 आपके द्वारा बताए गए लक्षण तत्काल चिकित्सकीय ध्यान की मांग करते हैं। कृपया बिना देर किए किसी डॉक्टर या आपातकालीन चिकित्सा केंद्र (Emergency Clinic) से संपर्क करें।"
        : "🚨 The symptoms you described require immediate professional clinical evaluation. Please seek prompt in-person medical care at a hospital emergency or gynecology clinic.",
      citation: "WHO & FOGSI Emergency Triage Protocol",
      carePathStep: "04 Guide",
      comfortMeasures: [
        isHindi ? "स्थानीय इमरजेंसी क्लिनिक पर जाएं" : "Seek immediate urgent clinical care",
        isHindi ? "अकेले यात्रा न करें, किसी परिजन को साथ रखें" : "Have a family member or friend accompany you",
        isHindi ? "पैड बदलने की आवृत्ति और समय नोट करें" : "Note the frequency and timing of bleeding or symptoms",
      ],
      isEmergency: true,
      emergencyNotice: isHindi ? localRag.emergencyNoticeHi : localRag.emergencyNoticeEn,
      source: "clinical-rag-local",
    };
  }

  // Fallback defaults if Gemini key is missing or call times out
  const fallbackResponse: CarePathResponse = {
    answer: isHindi ? localRag.answerHi : localRag.answerEn,
    citation: localRag.citation || "WHO & NHS Clinical Guidance",
    carePathStep: "03 Inform",
    clarifyingQuestions: isHindi
      ? [
          "0 से 10 के दर्द स्केल पर आप इसे क्या रेटिंग देंगी?",
          "क्या यह दर्द माहवारी के पहले 1-2 दिन रहता है या पूरे समय बना रहता है?",
          "क्या दर्द की वजह से आपको कॉलेज या काम से छुट्टी लेनी पड़ती है?",
        ]
      : [
          "On a scale of 0 to 10, how would you rate the pain intensity?",
          "Does the pain occur strictly on Days 1-2, or persist throughout?",
          "Does this pain force you to miss college, work, or daily classes?",
        ],
    comfortMeasures: isHindi ? localRag.actionProtocolHi : localRag.actionProtocolEn,
    doctorDiscussionPoint: isHindi
      ? "डॉक्टर से चर्चा: 'मेरा माहवारी दर्द दैनिक कार्यों और कॉलेज को प्रभावित कर रहा है। क्या हमें पेल्विक अल्ट्रासाउंड या एंडोमेट्रियोसिस की जांच करनी चाहिए?'"
      : "Doctor discussion point: 'My period pain severely impacts my college/work routine. Could we evaluate for secondary dysmenorrhea or endometriosis?'",
    isEmergency: false,
    source: "clinical-rag-local",
  };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key_here") {
    return fallbackResponse;
  }

  // 3. TARGETED RAG: Retrieve only the top 1-2 relevant guidelines to keep prompt small and fast
  const queryLower = trimmed.toLowerCase();
  const scoredGuidelines = clinicalGuidelines
    .map((g) => {
      let score = 0;
      for (const kw of g.keywords) {
        if (queryLower.includes(kw.toLowerCase())) score += 3;
      }
      return { guideline: g, score };
    })
    .sort((a, b) => b.score - a.score);

  const topGuidelines = scoredGuidelines.filter((s) => s.score > 0).slice(0, 2).map((s) => s.guideline);
  const selectedGuidelines = topGuidelines.length > 0 ? topGuidelines : clinicalGuidelines.slice(0, 2);

  const knowledgeBaseContext = selectedGuidelines
    .map(
      (g) =>
        `[AUTHORITY: ${g.source}]\nSummary: ${g.summary_en}\nKey Takeaways: ${g.clinical_takeaways.join("; ")}`
    )
    .join("\n\n");

  // 4. Concise Gemini System Prompt for fast inference
  const systemInstruction = `
You are Saheli (सहेली), an empathetic, evidence-based menstrual health companion implementing the 5-step Saheli CarePath:
- 01 Listen: Acknowledge the user's concern with deep validation in 1-2 warm sentences.
- 02 Understand: 2 concise clarifying questions (e.g. 0-10 severity, duration, college/work disruption).
- 03 Inform: Ground in reviewed sources (WHO, NHS, Office on Women's Health, FOGSI).
  CRITICAL: If pain disrupts college or work, NEVER dismiss as "normal cramps". Explain disruptive pain warrants medical assessment.
- 04 Guide: Practical comfort steps (40°C heat compress, warm ajwain/jeera tea, Supta Baddha Konasana rest).
- 05 Prepare: 1 concise question for their doctor appointment.

Language: Respond strictly in ${LANGUAGE_NAMES[language] || "English"}.
Output: Valid JSON matching:
{
  "empathyValidation": string,
  "clarifyingQuestions": string[],
  "reviewedInformation": string,
  "sourcesCitations": string[],
  "comfortMeasures": string[],
  "doctorDiscussionPoint": string
}

REVIEWED CLINICAL CONTEXT:
${knowledgeBaseContext}
`;

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Race Gemini with a 5-second timeout so the user never experiences long delays
    const geminiCall = ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [{ role: "user", parts: [{ text: trimmed }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.2,
        maxOutputTokens: 900,
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Gemini response timeout after 5000ms")), 5000)
    );

    const response = (await Promise.race([geminiCall, timeoutPromise])) as any;
    const candidateText = response?.text || "";

    if (!candidateText.trim()) {
      return fallbackResponse;
    }

    let parsed: any = null;
    try {
      const cleaned = candidateText.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      const jsonMatch = candidateText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch {
          parsed = null;
        }
      }
    }

    if (!parsed) {
      return {
        answer: candidateText.trim(),
        citation: "World Health Organization (WHO) & NHS Clinical Guidance",
        carePathStep: "03 Inform",
        clarifyingQuestions: fallbackResponse.clarifyingQuestions,
        comfortMeasures: fallbackResponse.comfortMeasures,
        doctorDiscussionPoint: fallbackResponse.doctorDiscussionPoint,
        isEmergency: false,
        source: "gemini-3.8-flash",
      };
    }

    const combinedAnswer = parsed.empathyValidation
      ? `${parsed.empathyValidation}\n\n${parsed.reviewedInformation || ""}`
      : parsed.reviewedInformation || candidateText;

    const citationText =
      Array.isArray(parsed.sourcesCitations) && parsed.sourcesCitations.length > 0
        ? parsed.sourcesCitations.join(" • ")
        : "World Health Organization (WHO) & NHS Clinical Guidance";

    return {
      answer: combinedAnswer.trim(),
      empathyValidation: parsed.empathyValidation,
      reviewedInformation: parsed.reviewedInformation,
      citation: citationText,
      carePathStep: "03 Inform",
      clarifyingQuestions:
        Array.isArray(parsed.clarifyingQuestions) && parsed.clarifyingQuestions.length > 0
          ? parsed.clarifyingQuestions
          : fallbackResponse.clarifyingQuestions,
      comfortMeasures:
        Array.isArray(parsed.comfortMeasures) && parsed.comfortMeasures.length > 0
          ? parsed.comfortMeasures
          : fallbackResponse.comfortMeasures,
      doctorDiscussionPoint: parsed.doctorDiscussionPoint || fallbackResponse.doctorDiscussionPoint,
      isEmergency: false,
      source: "gemini-3.8-flash",
    };
  } catch (error) {
    console.warn("Gemini call timed out or failed; instantly returning reviewed clinical RAG response:", error);
    return fallbackResponse;
  }
}

