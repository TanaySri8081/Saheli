import { NextRequest, NextResponse } from "next/server";
import { ReminderPreferences } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: Partial<ReminderPreferences> = await request.json();

    return NextResponse.json({
      status: "success",
      message: "Reminder preferences synced with on-device scheduler",
      syncedAt: new Date().toISOString(),
      updatedPreferences: body,
      lockScreenDisguiseActive: body.discreetMode ?? true,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to update reminder preferences", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "success",
    description: "Reminders sync API. Supports POST to synchronize on-device preferences.",
    lockScreenModes: {
      disguised: "Daily Pause: Drink warm water",
      standard: "Saheli: Period in 2 Days",
    },
  });
}
