import { NextRequest, NextResponse } from "next/server";
import clinicalGuidelines from "@/data/clinicalGuidelines.json";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || "").toLowerCase().trim();
    const category = (searchParams.get("category") || "").toLowerCase().trim();

    let results = clinicalGuidelines;

    if (category && category !== "all") {
      results = results.filter((item) => item.category.toLowerCase() === category);
    }

    if (query) {
      results = results.filter((item) => {
        const titleEn = item.title_en.toLowerCase();
        const titleHi = item.title_hi.toLowerCase();
        const summaryEn = item.summary_en.toLowerCase();
        const keywords = item.keywords.join(" ").toLowerCase();
        return (
          titleEn.includes(query) ||
          titleHi.includes(query) ||
          summaryEn.includes(query) ||
          keywords.includes(query)
        );
      });
    }

    return NextResponse.json({
      status: "success",
      count: results.length,
      query: query || null,
      category: category || "all",
      articles: results,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to search education articles", details: String(error) },
      { status: 500 }
    );
  }
}
