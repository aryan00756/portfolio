import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.github.com/users/aryxn-builds/repos?per_page=100",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "aryxn-portfolio",
        },
        next: { revalidate: 300 },
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
      headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch repos" }, { status: 500 });
  }
}
