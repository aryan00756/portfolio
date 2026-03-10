import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get("page") ?? "1";

  try {
    const res = await fetch(
      `https://api.github.com/users/aryxn-builds/events/public?per_page=100&page=${page}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "aryxn-portfolio",
        },
        // Revalidate edge cache every 60 s
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `GitHub API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
