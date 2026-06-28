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

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    
    // Fetch last 10 emails
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
    });

    const messages = response.data.messages || [];
    const emails = [];

    for (const msg of messages) {
      if (msg.id) {
        const msgDetails = await gmail.users.messages.get({
          userId: "me",
          id: msg.id,
        });
        
        const headers = msgDetails.data.payload?.headers || [];
        const subject = headers.find(h => h.name === "Subject")?.value || "No Subject";
        const from = headers.find(h => h.name === "From")?.value || "Unknown Sender";
        const date = headers.find(h => h.name === "Date")?.value || "";
        
        let snippet = msgDetails.data.snippet || "";
        
        emails.push({
          id: msg.id,
          subject,
          from,
          date,
          snippet
        });
      }
    }

    return NextResponse.json({ emails });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
