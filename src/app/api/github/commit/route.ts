import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const repo = request.nextUrl.searchParams.get("repo");
  const sha = request.nextUrl.searchParams.get("sha");

  if (!repo || !sha) {
    return NextResponse.json({ error: "Missing repo or sha" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/commits/${sha}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "aryxn-portfolio",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `GitHub API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const message: string = data.commit?.message?.split("\n")[0] ?? "";
    return NextResponse.json(
      { message: message || null },
      { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate" } }
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch commit" }, { status: 500 });
  }
}
