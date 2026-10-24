import { NextRequest, NextResponse } from "next/server";
import { PeriodLog, FlowIntensity } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { startDate, endDate, flowIntensity, notes } = body;

    if (!startDate || !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      return NextResponse.json(
        { status: "error", message: "Invalid startDate format. Expected YYYY-MM-DD." },
        { status: 400 }
      );
    }

    const newLog: PeriodLog = {
      id: "srv_log_" + Date.now().toString(36),
      start_date: startDate,
      end_date: endDate || null,
      flow_intensity: (flowIntensity as FlowIntensity) || "medium",
      cycle_length_days: 28,
      is_predicted: false,
      notes: notes || null,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({
      status: "success",
      message: "Period cycle log created successfully",
      log: newLog,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to process cycle log", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "success",
    description: "Period logs endpoint. Use POST to record a new menstrual log.",
    guidance: "All records are preserved on-device in guest mode by default.",
  });
}
