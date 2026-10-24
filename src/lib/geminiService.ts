import { GoogleGenAI } from "@google/genai";
import { queryClinicalRag, ClinicalResponse } from "@/lib/clinicalRag";
import clinicalGuidelines from "@/data/clinicalGuidelines.json";

export interface GeminiRagResponse {
  answer: string;
  citation: string;
  actionSteps: string[];
  isEmergency: boolean;
  emergencyNotice?: string;
  source: "gemini-2.5-flash" | "clinical-rag-local";
}

export async function askSaheliWithGemini(
  query: string,
  language: "en" | "hi" = "en"
): Promise<GeminiRagResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  // 1. First run the safety & red-flag check from our clinical engine
  const localRag = queryClinicalRag(query, language);

  // If severe emergency, return clinical safeguard immediately without delay
  if (localRag.isEmergency) {
    return {
      answer: language === "hi" ? localRag.answerHi : localRag.answerEn,
      citation: localRag.citation,
      actionSteps: language === "hi" ? localRag.actionProtocolHi : localRag.actionProtocolEn,
      isEmergency: true,
      emergencyNotice: language === "hi" ? localRag.emergencyNoticeHi : localRag.emergencyNoticeEn,
      source: "clinical-rag-local",
    };
  }

  // 2. If no Gemini API key is configured, gracefully fall back to local RAG
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key_here") {
    return {
      answer: language === "hi" ? localRag.answerHi : localRag.answerEn,
      citation: localRag.citation,
      actionSteps: language === "hi" ? localRag.actionProtocolHi : localRag.actionProtocolEn,
      isEmergency: false,
      source: "clinical-rag-local",
    };
  }

  // 3. Assemble Grounded Context from Medical Guidelines
  const relevantGuidelines = clinicalGuidelines
    .map(
      (g) =>
        `[Source: ${g.source} | Category: ${g.category}]\nTitle: ${g.title_en} / ${g.title_hi}\nClinical Summary: ${g.summary_en}\nKey Takeaways: ${g.clinical_takeaways.join("; ")}`
    )
    .join("\n\n");

  const systemInstruction = `
You are Saheli (सहेली), an empathetic, culturally attuned, and evidence-grounded menstrual health companion.
Your mission is to provide accessible, compassionate reproductive healthcare literacy for Indian women and menstruators.

CORE CLINICAL DIRECTIVES:
1. GROUNDING: Answer based strictly on the approved clinical guidelines (FOGSI, ACOG, Monash Guidelines) provided below.
2. AESTHETIC & TONE: Warm Editorial Healthcare tone—respectful, literary, calming, non-judgmental, and validating.
3. CULTURAL CONTEXT: Ground advice in everyday Indian contexts (e.g. warm ajwain/jeera infusions, roasted chana & gur for iron, earthen pot hydration, somatic pelvic rest like Supta Baddha Konasana).
4. SCOPE & SAFETY: You are an educational guide, NOT a prescribing doctor. NEVER prescribe pharmaceuticals (only mention categories like NSAIDs/progestogens in general guideline terms). NEVER give definitive diagnostic verdicts.
5. LANGUAGE: Respond strictly in the requested language: ${language === "hi" ? "Hindi (हिंदी)" : "English"}.
6. STRUCTURE:
   - Provide a compassionate, clear 2-3 paragraph explanation.
   - Provide 3-4 bulleted actionable self-care or doctor discussion steps.
   - Mention the governing guideline citation (e.g., "FOGSI Good Clinical Practice Recommendations" or "ACOG Clinical Guidelines").

CLINICAL GUIDELINES CONTEXT:
${relevantGuidelines}
`;

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: query }],
        },
      ],
      config: {
        systemInstruction,
        temperature: 0.3, // Low temperature for high factual consistency
        maxOutputTokens: 800,
      },
    });

    const candidateText = response.text || "";

    if (!candidateText.trim()) {
      throw new Error("Empty candidate response from Gemini");
    }

    return {
      answer: candidateText.trim(),
      citation: localRag.citation || "FOGSI / ACOG / Monash Consensus Guidelines",
      actionSteps: language === "hi" ? localRag.actionProtocolHi : localRag.actionProtocolEn,
      isEmergency: false,
      source: "gemini-2.5-flash",
    };
  } catch (error) {
    console.warn("Gemini API call failed or rate-limited; falling back to local clinical RAG:", error);
    return {
      answer: language === "hi" ? localRag.answerHi : localRag.answerEn,
      citation: localRag.citation,
      actionSteps: language === "hi" ? localRag.actionProtocolHi : localRag.actionProtocolEn,
      isEmergency: false,
      source: "clinical-rag-local",
    };
  }
}
