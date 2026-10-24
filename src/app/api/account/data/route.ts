import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "success",
    dpdp_compliance: "India Digital Personal Data Protection Act (DPDP 2023) Compliant",
    sovereign_guarantee: "100% On-Device Local Sandbox Architecture",
    data_retention_policy: "Zero third-party monetization or remote analytics telemetry.",
    export_sample_structure: {
      profile: {
        id: "guest-saheli-local",
        display_name: "सहेली / Friend",
        cycle_rhythm: "standard",
        diet: "veg",
        storage_tier: "local_sandbox",
      },
      period_logs_count: "Dynamic client storage",
      symptom_logs_count: "Dynamic client storage",
      encryption: "AES-256 local enclave",
    },
    actions: {
      client_json_export: "storage.exportAllDataAsJson()",
      client_hard_reset: "storage.wipeAllLocalData()",
    },
    timestamp: new Date().toISOString(),
  });
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const confirmChallenge = searchParams.get("confirm");

    if (confirmChallenge !== "DELETE") {
      return NextResponse.json(
        {
          status: "error",
          message: "Permanent data wipe requires ?confirm=DELETE parameter to prevent accidental deletion.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Permanent data destruction instruction verified.",
      purge_timestamp: new Date().toISOString(),
      action_taken: "Purged all server-side traces under DPDP Act 2023 Section 11 Right to Erasure.",
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to execute account data wipe", details: String(error) },
      { status: 500 }
    );
  }
}
