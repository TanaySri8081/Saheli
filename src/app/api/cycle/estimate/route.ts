import { NextRequest, NextResponse } from "next/server";
import { predictCycle } from "@/lib/cycleMath";
import { getDefaultProfile } from "@/lib/storage";
import { PeriodLog, UserProfile } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lastPeriodDate = searchParams.get("lastPeriodDate") || "2026-10-12";
    const avgCycleLength = parseInt(searchParams.get("avgCycleLength") || "28", 10);
    const avgPeriodDuration = parseInt(searchParams.get("avgPeriodDuration") || "5", 10);

    const mockProfile: UserProfile = {
      ...getDefaultProfile(),
      last_period_date: lastPeriodDate,
      avg_cycle_length: avgCycleLength,
      avg_period_duration: avgPeriodDuration,
    };

    const mockLogs: PeriodLog[] = [
      {
        id: "log_hist_1",
        start_date: lastPeriodDate,
        flow_intensity: "medium",
        cycle_length_days: avgCycleLength,
        is_predicted: false,
        created_at: new Date().toISOString(),
      },
    ];

    const prediction = predictCycle(mockProfile, mockLogs);

    return NextResponse.json({
      status: "success",
      source: "Saheli Mathematical Prediction Engine",
      prediction,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to compute cycle prediction", details: String(error) },
      { status: 500 }
    );
  }
}
