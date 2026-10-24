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

export async function askSaheliWithGemini(
  query: string,
  language: "en" | "hi" = "en"
): Promise<CarePathResponse> {
  // CRITICAL SECURITY GUARANTEE:
  // process.env.GEMINI_API_KEY is read strictly on the Node.js server runtime.
  // It has NO NEXT_PUBLIC_ prefix, ensuring it is NEVER exposed or bundled in the client browser.
  const apiKey = process.env.GEMINI_API_KEY;

  // 1. Red-Flag & Urgent Safety Check
  const localRag = queryClinicalRag(query, language);

  if (localRag.isEmergency) {
    return {
      answer:
        language === "hi"
          ? "🚨 आपके द्वारा बताए गए लक्षण तत्काल चिकित्सकीय ध्यान की मांग करते हैं। कृपया बिना देर किए किसी डॉक्टर या आपातकालीन चिकित्सा केंद्र (Emergency Clinic) से संपर्क करें।"
          : "🚨 The symptoms you described require immediate professional clinical evaluation. Please seek prompt in-person medical care at a hospital emergency or gynecology clinic.",
      citation: "WHO & FOGSI Emergency Triage Protocol",
      carePathStep: "04 Guide",
      comfortMeasures: [
        language === "hi" ? "स्थानीय इमरजेंसी क्लिनिक पर जाएं" : "Seek immediate urgent clinical care",
        language === "hi" ? "अकेले यात्रा न करें, किसी परिजन को साथ रखें" : "Have a family member or friend accompany you",
        language === "hi" ? "पैड बदलने की आवृत्ति और समय नोट करें" : "Note the frequency and timing of bleeding or symptoms",
      ],
      isEmergency: true,
      emergencyNotice: language === "hi" ? localRag.emergencyNoticeHi : localRag.emergencyNoticeEn,
      source: "clinical-rag-local",
    };
  }

  // 2. Assemble Reviewed Clinical Knowledge Base from Credible Authorities (WHO, NHS, Office on Women's Health, FOGSI, ACOG)
  const knowledgeBaseContext = clinicalGuidelines
    .map(
      (g) =>
        `[AUTHORITY: ${g.source} | TOPIC: ${g.title_en} / ${g.title_hi}]\nSummary: ${g.summary_en}\nClinical Takeaways: ${g.clinical_takeaways.join("; ")}`
    )
    .join("\n\n");

  // Fallback defaults if Gemini key is missing or call fails
  const fallbackResponse: CarePathResponse = {
    answer: language === "hi" ? localRag.answerHi : localRag.answerEn,
    citation: localRag.citation || "WHO & NHS Clinical Guidance",
    carePathStep: "03 Inform",
    clarifyingQuestions:
      language === "hi"
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
    comfortMeasures: language === "hi" ? localRag.actionProtocolHi : localRag.actionProtocolEn,
    doctorDiscussionPoint:
      language === "hi"
        ? "डॉक्टर से चर्चा: 'मेरा माहवारी दर्द दैनिक कार्यों और कॉलेज को प्रभावित कर रहा है। क्या हमें पेल्विक अल्ट्रासाउंड या एंडोमेट्रियोसिस की जांच करनी चाहिए?'"
        : "Doctor discussion point: 'My period pain severely impacts my college/work routine. Could we evaluate for secondary dysmenorrhea or endometriosis?'",
    isEmergency: false,
    source: "clinical-rag-local",
  };

  if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key_here") {
    return fallbackResponse;
  }

  // 3. Gemini System Prompt configured for the official "Saheli CarePath" Journey
  const systemInstruction = `
You are Saheli (सहेली), a compassionate and evidence-grounded menstrual health companion.
You implement the signature "Saheli CarePath" 5-step journey:
- 01 Listen: Acknowledge the user's concern with deep validation, warmth, and dignity.
- 02 Understand: Ask 2-3 gentle clarifying questions (severity 0-10, duration, whether it impacts college/work, whether new or worsening) WITHOUT collecting unnecessary sensitive data.
- 03 Inform: Ground your explanation strictly in the reviewed credible sources provided (WHO, NHS, Office on Women's Health, FOGSI, ACOG).
  CRITICAL: If the user reports pain that disrupts college, school, or daily life, NEVER say dismissive things like "period pain is just common". Explain that severe or disruptive pain deserves clinical assessment.
- 04 Guide: Provide practical, non-judgmental comfort measures (localized 40°C heat therapy, warm ajwain/jeera infusions, roasted chana/jaggery, Supta Baddha Konasana pelvic rest).
- 05 Prepare: Provide a concise symptom summary talking point for their next healthcare appointment.

Language requirement: Respond strictly in ${language === "hi" ? "Hindi (हिंदी)" : "English"}.

Output Format: Strictly valid JSON object with the following schema:
{
  "empathyValidation": string,
  "clarifyingQuestions": string[],
  "reviewedInformation": string,
  "sourcesCitations": string[],
  "comfortMeasures": string[],
  "doctorDiscussionPoint": string
}

REVIEWED MEDICAL GUIDELINES CONTEXT:
${knowledgeBaseContext}
`;

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: query }],
        },
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.2,
        maxOutputTokens: 2500,
      },
    });

    const candidateText = response.text || "";
    if (!candidateText.trim()) {
      throw new Error("Empty response from Gemini");
    }

    let parsed: any = null;
    try {
      const cleaned = candidateText.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // Regex extraction fallback if JSON has trailing comma or format anomaly
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
        citation: "World Health Organization (WHO), NHS & FOGSI Reviewed Guidelines",
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
      clarifyingQuestions: Array.isArray(parsed.clarifyingQuestions) && parsed.clarifyingQuestions.length > 0
        ? parsed.clarifyingQuestions
        : fallbackResponse.clarifyingQuestions,
      comfortMeasures: Array.isArray(parsed.comfortMeasures) && parsed.comfortMeasures.length > 0
        ? parsed.comfortMeasures
        : fallbackResponse.comfortMeasures,
      doctorDiscussionPoint: parsed.doctorDiscussionPoint || fallbackResponse.doctorDiscussionPoint,
      isEmergency: false,
      source: "gemini-3.8-flash",
    };
  } catch (error) {
    console.warn("Gemini API call failed; gracefully falling back to local reviewed clinical RAG:", error);
    return fallbackResponse;
  }
}
