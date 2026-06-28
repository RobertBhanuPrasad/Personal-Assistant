import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/api/auth/callback"
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    // In a real app, store this in DB. For now, store in secure HTTP cookie.
    const response = NextResponse.redirect("http://localhost:3000");
    
    response.cookies.set({
      name: "google_access_token",
      value: tokens.access_token || "",
      path: "/",
      httpOnly: true,
    });
    
    if (tokens.refresh_token) {
      response.cookies.set({
        name: "google_refresh_token",
        value: tokens.refresh_token,
        path: "/",
        httpOnly: true,
      });
    }

    return response;
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.json({ error: "Failed to authenticate" }, { status: 500 });
  }
}
