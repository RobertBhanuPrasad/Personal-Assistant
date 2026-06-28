import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const token = req.cookies.get("google_access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "NOT_AUTHENTICATED" }, { status: 401 });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ access_token: token });

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Tools definition
    const tools = [{
      functionDeclarations: [
        {
          name: "create_calendar_event",
          description: "Creates an event in the user's primary Google Calendar.",
          parameters: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING, description: "Title of the event" },
              location: { type: Type.STRING, description: "Location of the event" },
              startTime: { type: Type.STRING, description: "ISO date string of start time" },
              endTime: { type: Type.STRING, description: "ISO date string of end time" }
            },
            required: ["summary", "startTime", "endTime"]
          }
        },
        {
          name: "append_sheet_row",
          description: "Appends a task or row into the user's Google Sheet.",
          parameters: {
            type: Type.OBJECT,
            properties: {
              taskName: { type: Type.STRING, description: "Description or name of the task" }
            },
            required: ["taskName"]
          }
        },
        {
          name: "send_email",
          description: "Sends an email using the user's Gmail account.",
          parameters: {
            type: Type.OBJECT,
            properties: {
              to: { type: Type.STRING, description: "The recipient's email address" },
              subject: { type: Type.STRING, description: "The subject of the email" },
              body: { type: Type.STRING, description: "The body content of the email" }
            },
            required: ["to", "subject", "body"]
          }
        }
      ]
    }];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: tools,
        systemInstruction: "You are JARVIS. Use tools to execute user requests. If they ask to add a task, use append_sheet_row. If they ask to schedule, use create_calendar_event. If they ask to send an email, use send_email. Today's date is " + new Date().toISOString()
      }
    });

    const funcCall = response.functionCalls?.[0];

    if (!funcCall) {
      return NextResponse.json({ message: response.text || "No actionable intent recognized." });
    }

    if (funcCall.name === "create_calendar_event") {
      const args = funcCall.args as any;
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });
      await calendar.events.insert({
        calendarId: "primary",
        requestBody: {
          summary: args.summary,
          location: args.location || "",
          start: { dateTime: args.startTime, timeZone: "America/Los_Angeles" }, // fallback tz
          end: { dateTime: args.endTime, timeZone: "America/Los_Angeles" },
        }
      });
      return NextResponse.json({ message: `Created event "${args.summary}" in Google Calendar.` });
    }

    if (funcCall.name === "append_sheet_row") {
      const args = funcCall.args as any;
      const sheets = google.sheets({ version: "v4", auth: oauth2Client });
      const spreadsheetId = process.env.GOOGLE_SHEET_ID;
      
      const logId = "LOG-" + Math.random().toString(36).substring(7);
      const action = "sheets.append";
      const timestamp = new Date().toISOString();
      const description = args.taskName;
      const status = "SUCCESS";

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "Sheet1!A:E",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[logId, action, timestamp, description, status]]
        }
      });
      return NextResponse.json({ message: `Task "${args.taskName}" appended to Google Sheet.` });
    }

    if (funcCall.name === "send_email") {
      const args = funcCall.args as any;
      const gmail = google.gmail({ version: "v1", auth: oauth2Client });
      
      const utf8Subject = `=?utf-8?B?${Buffer.from(args.subject).toString('base64')}?=`;
      const messageParts = [
        `To: ${args.to}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${utf8Subject}`,
        '',
        args.body
      ];
      const message = messageParts.join('\n');
      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage
        }
      });
      return NextResponse.json({ message: `Email sent successfully to ${args.to}.` });
    }

    return NextResponse.json({ message: "Action processed but unknown tool called." });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
