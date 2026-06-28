# JARVIS - AI Operating System

JARVIS is a production-grade AI Personal Assistant designed to feel like an autonomous command center. It is a full-stack AI Operating System that connects seamlessly to Google Workspace, built with modern web technologies and a modular architecture.

## Overview

JARVIS acts as an intelligent agent that understands natural language and interacts directly with Google APIs to manage emails, calendar events, spreadsheets, documents, and more. It goes beyond a simple chatbot, offering a futuristic, highly interactive UI and an autonomous AI agent layer.

### Key Capabilities
- **Gmail:** Read, summarize, reply, draft, and prioritize emails.
- **Calendar:** Schedule, update, resolve conflicts, and view agenda.
- **Google Sheets:** Create sheets, track data, perform analytics, and insert natural language data.
- **Google Docs:** Create, edit, summarize, translate, and grammar check.
- **Drive:** Search, upload, download, and manage permissions.
- **Contacts & Tasks:** Find contacts, suggest meetings, and manage daily planner tasks.
- **Voice Mode:** Continuous listening, interrupt support, and a wake word ("Jarvis").

## Technology Stack

### Frontend
- **Framework:** Next.js (Latest App Router) with React and TypeScript
- **Styling:** Tailwind CSS, Framer Motion, GSAP, shadcn/ui
- **State & Data Management:** Zustand, React Query
- **Forms & Validation:** React Hook Form, Zod

### Backend
- **Framework:** NestJS with Node.js and TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Realtime:** WebSockets

### AI & Integrations
- **AI Model:** Google Gemini API (gemini-2.5-flash initially, model abstraction for OpenAI/Anthropic support)
- **Authentication:** Google OAuth 2.0
- **Integrations:** Gmail API, Calendar API, Drive API, Sheets API, Docs API, People API, Tasks API

### Deployment
- Docker & Docker Compose
- Environment variable configuration
- Production architecture with rate limiting, caching, and CI/CD readiness

## Architecture

Follows **Clean Architecture**:

Frontend
↓
API Gateway
↓
AI Agent Layer
↓
Tool Calling Layer
↓
Google APIs
↓
Google Workspace

### Backend Modules
The backend is highly modular to ensure scalability:
- `gmail.module`
- `calendar.module`
- `drive.module`
- `docs.module`
- `sheet.module`
- `contacts.module`
- `tasks.module`
- `meet.module`

## Design & UI Theme

The user interface is designed as a futuristic command center, avoiding typical dashboard layouts.
- **Theme:** Dark Mode, Glassmorphism
- **Colors:** Neon Blue, Electric Cyan, Purple Accent
- **Effects:** Animated gradients, floating particles, blur effects, smooth transitions
- **Components:**
  - **AI Orb:** Pulses (speaking), rotates (thinking), emits energy waves (executing), glows (finished).
  - **Left Sidebar:** Navigation links (Dashboard, Gmail, Calendar, Settings, Logs, Memory, Integrations).
  - **Right Sidebar:** Contextual updates (Today's Schedule, Unread Emails, Quick Notes, AI Suggestions).
  - **AI Chat Window:** Streaming markdown, code highlighting, dynamic charts, function execution cards, voice waveform.

## Features

- **Agent Memory:** Conversation memory, task memory, user preferences, pinned documents, meeting history.
- **AI Features:** Context aware, tool calling, reasoning, self-verification, retry failed actions.
- **Notification Center:** Toast notifications, execution logs, live API logs, success/failure animations.
- **Performance:** Lazy loading, React Query caching, streaming, optimistic updates, background sync.
- **Security:** OAuth, Encrypted/Refresh Tokens, Secure Cookies, CSRF, RBAC, Rate Limiting, Audit Logs.

## Setup Instructions

1. **Clone the repository.**
2. **Install dependencies:**
   - Frontend: `cd frontend && npm install`
   - Backend: `cd backend && npm install`
3. **Configure Environment Variables:**
   Create `.env` files in both the frontend and backend based on the provided sample configurations.
4. **Run Services:**
   - Database: `docker-compose up -d`
   - Backend: `cd backend && npm run start:dev`
   - Frontend: `cd frontend && npm run dev`