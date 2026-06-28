# JARVIS AI Operating System 🌐🤖

A futuristic, production-grade AI personal assistant that acts as a centralized command center for your digital life, directly inspired by Iron Man's JARVIS.

---

## 🛑 The Problem: Digital Fragmentation
Modern professionals and developers suffer from extreme digital fragmentation. Every day, we constantly context-switch between our Email clients, Calendars, Spreadsheets, and Task Managers. Managing our workflow requires jumping through dozens of browser tabs, manually copying and pasting information, and wasting immense cognitive energy on repetitive administrative tasks rather than deep, focused work. 

## 💡 The Solution: Autonomous Automation
**JARVIS OS** solves this by acting as a fully autonomous command center. Instead of *you* opening tools, the OS integrates your entire Google Workspace (Gmail, Calendar, Sheets) into a single, highly interactive dashboard. 

Powered by **Google's Gemini AI** with advanced function-calling, JARVIS allows you to manage your entire life through natural language commands. 
*   **Need to send an email?** Just tell JARVIS who and what to say.
*   **Need to track a task?** Tell JARVIS, and it instantly logs it into your Google Sheet database.
*   **Have an interview?** JARVIS schedules it on your calendar automatically.

## 🚀 Why It is Useful
By centralizing all operations into a single pane of glass, JARVIS drastically reduces context switching. The AI handles the syntax and API integrations in the background, transforming how you interact with your tools from *manual operation* to *executive delegation*.

---

## ✨ Key Features
*   **Jarvis Quantum Console:** A live-chat interface that parses natural language and executes real-time tool-calling via Gemini.
*   **Live Authentication:** Secure Google OAuth 2.0 flow integrated directly into Next.js.
*   **Inbox Feed:** Connects to the Gmail API to read and parse your latest emails in real-time.
*   **Event Timeline:** Visualizes your upcoming Google Calendar events perfectly formatted in Indian Standard Time (IST).
*   **Sheet Tasks:** A live-sync task manager that uses Google Sheets as a headless CMS/database. Mark tasks as "Completed" in the UI, and watch the cell update in Google Sheets!
*   **Immersive UI:** Built with Tailwind CSS, featuring Neon/Cyan accents, a pulsing AI Cognitive Core, and dynamic state-machine rendering.

---

## 🛠️ Technology Stack
*   **Frontend Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS, Framer Motion (for dynamic UI rendering), and Lucide React (icons)
*   **AI / LLM:** Google Gemini 2.5 Flash via `@google/genai`
*   **Integrations (Google Workspace):**
    *   Gmail API
    *   Google Calendar API
    *   Google Sheets API (v4)
*   **Authentication:** Custom Google OAuth 2.0 flow using `googleapis` and secure HTTP-only cookies

---

## ⚙️ Project Setup & Installation

### 1. Prerequisites
You need a Google Cloud Project with the following APIs enabled:
*   **Gmail API**
*   **Google Calendar API**
*   **Google Sheets API**
*   **Generative Language API** (for Gemini)

### 2. Google OAuth Configuration
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create an **OAuth 2.0 Client ID**.
3. Under **Authorized redirect URIs**, add: `http://localhost:3000/api/auth/callback`
4. *(Important)* If your app is in "Testing" mode, go to the **OAuth consent screen** and add your personal email address to the **Test users** list.

### 3. Environment Variables
Navigate to the `frontend/` directory and create a `.env.local` file with the following keys:
```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_SHEET_ID=your_google_sheet_id_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Installation & Running
From the root directory, navigate to the frontend folder and install the dependencies:
```bash
cd frontend
npm install
npm install googleapis @google/genai cookie
```

Start the development server:
```bash
npm run dev
```

### 5. How to Check & Test the Application
1. Open your browser to `http://localhost:3000`.
2. Notice the system is locked down. Click **Connect Google** in the top right.
3. Complete the Google Sign-in flow and grant the requested permissions.
4. Once redirected back, the system is online!
5. **Test Commands in the Input Box:**
   *   *"Create a meeting in my google calendar to have food at 6:00 PM today"*
   *   *"Send an email to john@example.com about the software developer role"*
   *   *"Add a task to my google sheet to review the pull request"*
6. **Check the Tabs:**
   *   Click **INBOX FEED** to see your latest emails.
   *   Click **TIMELINE** to see the meeting you just scheduled.
   *   Click **SHEET TASKS** to see the task you logged. Click "MARK DONE" to watch it update your actual Google Sheet!