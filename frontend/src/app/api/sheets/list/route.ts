import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("google_access_token")?.value;
    if (!token) return NextResponse.json({ error: "NOT_AUTHENTICATED" }, { status: 401 });

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ access_token: token });

    const sheets = google.sheets({ version: "v4", auth: oauth2Client });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A:E", // LOG_ID, ACTION, TIMESTAMP, DESCRIPTION, STATUS
    });

    const rows = response.data.values || [];
    // Convert to objects, assuming no header row or we just handle all rows
    const tasks = rows.map((row, index) => ({
      rowIndex: index + 1, // 1-indexed for sheets updates
      logId: row[0] || "",
      action: row[1] || "",
      timestamp: row[2] || "",
      description: row[3] || "",
      status: row[4] || "PENDING",
    })).filter(t => t.logId.startsWith("LOG-")); // Filter valid logs

    return NextResponse.json({ tasks: tasks.reverse() }); // Newest first
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
