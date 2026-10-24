import { NextRequest, NextResponse } from "next/server";
import { getPainLevelInfo } from "@/lib/painScale";
import { SymptomLog } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { logDate, painLevel, symptoms, mood, flowLevel, waterMl, reflection } = body;

    const parsedPain = typeof painLevel === "number" ? Math.min(Math.max(painLevel, 0), 10) : 0;
    const painInfo = getPainLevelInfo(parsedPain);

    const isSevere = parsedPain >= 8;
    const hasRedFlagSymptom = Array.isArray(symptoms) && (
      symptoms.includes("fainting_syncope") ||
      symptoms.includes("severe_nausea") ||
      symptoms.includes("flooding_clots")
    );

    const newLog: SymptomLog = {
      id: "srv_sym_" + Date.now().toString(36),
      log_date: logDate || new Date().toISOString().split("T")[0],
      pain_level: parsedPain,
      symptoms: Array.isArray(symptoms) ? symptoms : [],
      mood: mood || "calm",
      flow_level: flowLevel || "none",
      water_ml: waterMl || 1500,
      reflection: reflection || null,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({
      status: "success",
      log: newLog,
      painAssessment: {
        score: parsedPain,
        category: painInfo.category,
        labelEn: painInfo.labelEn,
        labelHi: painInfo.labelHi,
        clinicalDescriptionEn: painInfo.clinicalDescriptionEn,
        clinicalDescriptionHi: painInfo.clinicalDescriptionHi,
        homeRemedyEn: painInfo.homeRemedyEn,
        homeRemedyHi: painInfo.homeRemedyHi,
        isRedFlag: painInfo.isRedFlag,
      },
      triageWarning: isSevere || hasRedFlagSymptom
        ? {
            isRedFlag: true,
            warningEn: "Severe pain or acute symptoms detected. Consult a gynecologist or visit a healthcare clinic if pain is unmanageable.",
            warningHi: "अत्यधिक दर्द या गंभीर लक्षण पाए गए हैं। यदि दर्द असहनीय हो तो तुरंत किसी स्त्री रोग विशेषज्ञ से परामर्श लें।",
          }
        : null,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to process symptom log", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "success",
    description: "Symptom logs API endpoint. POST daily logs with 0-10 stepped pain scale assessment.",
  });
}
