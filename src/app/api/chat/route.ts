import { NextRequest, NextResponse } from "next/server";
import { askSaheliWithGemini } from "@/lib/geminiService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, language } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { status: "error", message: "A message string is required." },
        { status: 400 }
      );
    }

    const lang = language === "hi" ? "hi" : "en";
    const ragResult = await askSaheliWithGemini(message.trim(), lang);

    return NextResponse.json({
      status: "success",
      query: message,
      language: lang,
      response: ragResult.answer,
      citation: ragResult.citation,
      actionSteps: ragResult.actionSteps,
      isEmergency: ragResult.isEmergency,
      emergencyNotice: ragResult.emergencyNotice,
      source: ragResult.source,
      disclaimer:
        lang === "hi"
          ? "यह एआई सहायता केवल शैक्षिक मार्गदर्शन के लिए है और डॉक्टर के परामर्श का विकल्प नहीं है।"
          : "Educational companion only. Not a medical diagnosis or prescription. Consult a gynecologist for acute symptoms.",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to process chat message", details: String(error) },
      { status: 500 }
    );
  }
}
