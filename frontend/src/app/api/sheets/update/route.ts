import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(req: NextRequest) {
  try {
    const { rowIndex, status } = await req.json();
    const token = req.cookies.get("google_access_token")?.value;
    if (!token) return NextResponse.json({ error: "NOT_AUTHENTICATED" }, { status: 401 });

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ access_token: token });

    const sheets = google.sheets({ version: "v4", auth: oauth2Client });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // The status is in column E, so update E${rowIndex}
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Sheet1!E${rowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[status]]
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
