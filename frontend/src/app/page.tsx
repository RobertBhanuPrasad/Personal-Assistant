"use client";

import { useEffect, useState, FormEvent, useRef } from "react";
import { CheckSquare, Mail, Shield, Terminal, Send, Power, Mic } from "lucide-react";

type Message = {
  id: string;
  sender: "user" | "jarvis";
  text: string;
  type?: "text" | "action" | "email-preview";
  timestamp: string;
};

export default function JarvisDashboard() {
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [command, setCommand] = useState("");
  const [status, setStatus] = useState<"IDLE" | "PROCESSING" | "AWAITING_CONFIRMATION" | "SUCCESS">("IDLE");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "jarvis",
      text: "System initialized. Core modules offline. Awaiting Google Authentication.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [activeTab, setActiveTab] = useState("JARVIS CHAT");
  
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    fetch("/api/auth/status")
      .then(res => res.json())
      .then(data => {
        setIsAuthenticated(data.authenticated);
        if (data.authenticated) {
          setMessages([{
            id: "1",
            sender: "jarvis",
            text: "Google Authentication Confirmed. All core modules online. Awaiting directive.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (sender: "user" | "jarvis", text: string, type: "text" | "action" | "email-preview" = "text") => {
    setMessages(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      sender,
      text,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const handleCommandSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const userCmd = command.trim();
    addMessage("user", userCmd);
    setCommand("");
    setStatus("PROCESSING");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userCmd })
      });

      if (res.status === 401) {
        addMessage("jarvis", "[AUTH REQUIRED] Redirecting to Google Authentication...");
        window.location.href = "/api/auth/google";
        return;
      }

      const data = await res.json();
      
      if (res.ok) {
        addMessage("jarvis", data.message || "Command executed.");
        setStatus("SUCCESS");
      } else {
        addMessage("jarvis", `Error: ${data.error}`, "action");
        setStatus("IDLE");
      }
    } catch (err) {
      addMessage("jarvis", "Network error occurred.", "action");
      setStatus("IDLE");
    }
    
    setTimeout(() => setStatus("IDLE"), 2000);
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#050508] text-gray-300 font-sans flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* Top Navbar */}
      <header className="flex justify-between items-center w-full px-6 py-4 border-b border-white/5 bg-[#0a0a0c]">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-widest text-cyan-400 uppercase leading-none">
              JARVIS OS
            </h1>
            <span className="text-[10px] tracking-[0.3em] text-gray-500 uppercase">Command Center</span>
          </div>
        </div>
        
        <div className="flex items-center gap-8 text-[10px] font-bold tracking-widest">
          <div className="flex gap-6">
            <span className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-green-500 glow' : 'bg-red-500'}`} />GMAIL: <span className={isAuthenticated ? "text-green-500" : "text-red-500"}>{isAuthenticated ? 'CONNECTED' : 'DISCONNECTED'}</span></span>
            <span className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-green-500 glow' : 'bg-red-500'}`} />CALENDAR: <span className={isAuthenticated ? "text-green-500" : "text-red-500"}>{isAuthenticated ? 'CONNECTED' : 'DISCONNECTED'}</span></span>
            <span className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-green-500 glow' : 'bg-red-500'}`} />SHEETS: <span className={isAuthenticated ? "text-green-500" : "text-red-500"}>{isAuthenticated ? 'CONNECTED' : 'DISCONNECTED'}</span></span>
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_cyan]" />GEMINI: <span className="text-cyan-400">SYNAPSE ONLINE</span></span>
          </div>
          
          <div className="flex items-center gap-4 border-l border-white/10 pl-6">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-white/10 rounded bg-white/5 cursor-pointer hover:bg-white/10 transition">
              <div className="w-5 h-5 rounded bg-gray-600 flex items-center justify-center text-white">{isAuthenticated ? 'R' : '?'}</div>
              <span className="normal-case tracking-normal">{isAuthenticated ? 'robert@example.com' : 'Not logged in'}</span>
            </div>
            {isAuthenticated ? (
              <button onClick={() => window.location.href = '/api/auth/logout'} className="flex items-center gap-2 px-3 py-1.5 border border-red-500/30 text-red-400 rounded bg-red-500/5 hover:bg-red-500/10 transition uppercase tracking-widest">
                <Power className="w-3 h-3" /> Disconnect
              </button>
            ) : (
              <button onClick={() => window.location.href = '/api/auth/google'} className="flex items-center gap-2 px-3 py-1.5 border border-green-500/30 text-green-400 rounded bg-green-500/5 hover:bg-green-500/10 transition uppercase tracking-widest">
                <Power className="w-3 h-3" /> Connect Google
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden p-4 gap-4">
        
        {/* LEFT COLUMN - Dashboard & Core */}
        <div className="w-[45%] flex flex-col gap-4">
          
          {/* Top Stats Grid (2x2) */}
          <div className="grid grid-cols-2 gap-4">
            {/* Card 1 */}
            <div className="bg-[#0c0c10] border border-white/5 rounded-xl p-5 relative flex flex-col gap-2">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Focus Score</h2>
                <CheckSquare className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-black text-white">50%</div>
              <div className="mt-4">
                <div className="flex justify-between text-[9px] text-gray-500 mb-1 font-mono uppercase">
                  <span>Efficiency</span>
                  <span>50%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-1/2 h-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                </div>
                <p className="text-[9px] text-gray-600 mt-2 uppercase tracking-wider">Completed Tasks Ratio</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0c0c10] border border-white/5 rounded-xl p-5 relative flex flex-col gap-2">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inbox Cleanliness</h2>
                <Mail className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-white">100%</div>
              <div className="mt-4">
                <div className="flex justify-between text-[9px] text-gray-500 mb-1 font-mono uppercase">
                  <span>Efficiency</span>
                  <span>100%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                </div>
                <p className="text-[9px] text-gray-600 mt-2 uppercase tracking-wider">Read VS Unread Emails</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#0c0c10] border border-white/5 rounded-xl p-5 relative flex flex-col gap-2">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tasks Done</h2>
                <Shield className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-3xl font-black text-white">0</div>
              <div className="mt-4 pt-3">
                <p className="text-[9px] text-gray-600 uppercase tracking-wider">Rows Updated In Sheets</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#0c0c10] border border-white/5 rounded-xl p-5 relative flex flex-col gap-2">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Automation Streak</h2>
                <Terminal className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-black text-white">18d</div>
              <div className="mt-4 pt-3">
                <p className="text-[9px] text-gray-600 uppercase tracking-wider">Actions This Session</p>
              </div>
            </div>
          </div>

          {/* AI Core Component */}
          <div className="flex-1 bg-[#0c0c10] border border-white/5 rounded-xl relative flex flex-col items-center justify-center p-6">
            <div className="absolute top-4 left-4 text-[9px] text-gray-500 uppercase tracking-widest font-bold">Assistant Sync Core</div>
            
            <div className="relative flex items-center justify-center flex-1 w-full my-8">
              {/* Orb Glow */}
              <div className={`absolute w-64 h-64 rounded-full blur-[80px] transition-all duration-700 ${status === 'PROCESSING' ? 'bg-cyan-500/20' : status === 'SUCCESS' ? 'bg-green-500/10' : status === 'AWAITING_CONFIRMATION' ? 'bg-yellow-500/10' : 'bg-cyan-900/10'}`} />
              
              {/* Outer Dashed Ring */}
              <div className={`absolute w-52 h-52 rounded-full border-2 border-dashed border-cyan-500/30 ${status === 'PROCESSING' ? 'animate-[spin_4s_linear_infinite]' : 'animate-[spin_20s_linear_infinite]'}`} style={{ animationDirection: 'reverse' }} />
              
              {/* Middle Solid Ring with blip */}
              <div className={`absolute w-36 h-36 rounded-full border border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.2)_inset] ${status === 'PROCESSING' ? 'animate-[spin_1s_linear_infinite]' : 'animate-[spin_10s_linear_infinite]'}`}>
                <div className="absolute -top-1 left-1/2 w-2 h-2 bg-cyan-300 rounded-full shadow-[0_0_10px_rgba(34,211,238,1)]" />
              </div>

              {/* Inner ring */}
              <div className="absolute w-24 h-24 rounded-full border border-cyan-300/20" />

              {/* Core Center Dot */}
              <div className={`w-6 h-6 rounded-full transition-all duration-300 ${status === 'PROCESSING' ? 'bg-cyan-300 shadow-[0_0_30px_rgba(103,232,249,1)] scale-125 animate-pulse' : status === 'SUCCESS' ? 'bg-green-400 shadow-[0_0_30px_rgba(74,222,128,1)]' : status === 'AWAITING_CONFIRMATION' ? 'bg-yellow-400 shadow-[0_0_30px_rgba(250,204,21,1)] animate-ping' : 'bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.8)]'}`} />
            </div>

            <div className="text-center w-full mt-auto">
              <div className="text-[9px] text-cyan-500 tracking-[0.3em] uppercase mb-1">Jarvis System Online</div>
              <h3 className="text-sm font-bold tracking-[0.15em] text-white uppercase mb-1">
                Jarvis Cognitive Core: <span className={status === 'PROCESSING' ? 'text-cyan-400' : status === 'SUCCESS' ? 'text-green-400' : status === 'AWAITING_CONFIRMATION' ? 'text-yellow-400' : 'text-gray-400'}>{status}</span>
              </h3>
              <p className="text-[10px] text-gray-500">State: {status.toLowerCase()}. Feed a mission to the OS using voice or natural language text.</p>
            </div>
          </div>

          {/* System Query Input (Command Prompt) */}
          <div className="bg-[#0c0c10] border border-white/5 rounded-xl p-4 flex flex-col gap-2">
            <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-2">System Query Input</div>
            <form onSubmit={handleCommandSubmit} className="flex gap-2">
              <div className="flex-1 bg-black/40 border border-white/10 rounded flex items-center px-4 focus-within:border-cyan-500/50 transition">
                <span className="text-cyan-500 font-mono text-sm mr-3">{">_"}</span>
                <input 
                  type="text" 
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  disabled={status === 'PROCESSING' || !isAuthenticated}
                  placeholder={isAuthenticated ? "Ask JARVIS to draft replies, schedule calls, add tasks..." : "Please Connect Google Account to issue commands..."}
                  className="flex-1 bg-transparent py-3 border-none outline-none text-white placeholder-gray-600 text-xs tracking-wide disabled:opacity-50"
                />
              </div>
              <button type="button" disabled={!isAuthenticated} className="px-4 bg-black/40 border border-white/10 rounded text-red-500 hover:bg-red-500/10 transition disabled:opacity-50">
                <Mic className="w-4 h-4" />
              </button>
              <button 
                type="submit" 
                disabled={status === 'PROCESSING' || !command.trim() || !isAuthenticated}
                className="px-6 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-black rounded flex items-center justify-center transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex justify-between items-center text-[9px] text-gray-600 mt-1">
              <span>💡 Try: "Summarize my unread emails"</span>
              <span className="uppercase tracking-widest">Press Enter to Submit</span>
            </div>
          </div>
          
        </div>

        {/* RIGHT COLUMN - Chat / Logs / Feed */}
        <div className="flex-1 bg-[#0c0c10] border border-white/5 rounded-xl flex flex-col">
          
          {/* Tabs */}
          <div className="flex border-b border-white/5 px-2">
            {['JARVIS CHAT', 'INBOX FEED', 'TIMELINE', 'SHEET TASKS', 'AUDIT LOGS'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-[10px] font-bold tracking-widest uppercase transition-colors border-b-2 ${activeTab === tab ? 'text-cyan-400 border-cyan-400' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
              >
                {tab === 'JARVIS CHAT' && '⬡ '}
                {tab === 'INBOX FEED' && '✉ '}
                {tab === 'TIMELINE' && '◷ '}
                {tab === 'SHEET TASKS' && '▤ '}
                {tab === 'AUDIT LOGS' && '>_ '}
                {tab}
              </button>
            ))}
          </div>

          {/* Chat / Feed Area */}
          <div className="flex-1 overflow-y-auto p-6 font-mono text-xs flex flex-col gap-6" ref={chatRef}>
            <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-4">Jarvis Quantum Console</div>
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start'}`}>
                <div className="text-[9px] text-gray-600 mb-1 uppercase tracking-widest flex items-center gap-2">
                  {msg.sender === 'user' ? (
                    <>COMMANDER - {msg.timestamp}</>
                  ) : (
                    <>JARVIS - {msg.timestamp}</>
                  )}
                </div>
                
                {msg.sender === 'user' ? (
                  <div className="bg-[#1a1025] border border-purple-500/30 text-purple-200 px-4 py-3 rounded-xl rounded-tr-sm shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                    {msg.text}
                  </div>
                ) : (
                  msg.type === 'action' ? (
                    <div className="text-yellow-500/90 py-2">
                      {msg.text}
                    </div>
                  ) : msg.type === 'email-preview' ? (
                    <div className="mt-2 bg-[#050508] border border-cyan-900/50 rounded-lg p-4 w-full max-w-md shadow-xl relative overflow-hidden">
                      <div className="absolute left-0 top-0 w-1 h-full bg-cyan-500" />
                      {(() => {
                        try {
                          const emailData = JSON.parse(msg.text);
                          return (
                            <div className="flex flex-col gap-2">
                              <div className="text-cyan-400 font-sans text-sm font-bold">{emailData.from}</div>
                              <div className="text-white font-sans font-medium">{emailData.subject}</div>
                              <div className="text-gray-400 font-sans mt-2">{emailData.body}</div>
                            </div>
                          );
                        } catch(e) {
                          return <div>{msg.text}</div>
                        }
                      })()}
                    </div>
                  ) : (
                    <div className="bg-[#050508] border border-white/10 text-cyan-50 px-4 py-3 rounded-xl rounded-tl-sm text-sm">
                      {msg.text}
                    </div>
                  )
                )}
              </div>
            ))}
            
            {status === 'PROCESSING' && (
              <div className="self-start flex items-center gap-2 mt-2">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-100" />
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-200" />
              </div>
            )}
            
            {status === 'AWAITING_CONFIRMATION' && (
              <div className="self-start mt-4 bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg flex gap-4 items-center">
                <button 
                  onClick={() => {
                    addMessage("user", "Confirm Action");
                    setStatus("PROCESSING");
                    setTimeout(() => {
                      addMessage("jarvis", "COMMAND STAGE CONFIRMED: Action has been successfully compiled and sent to Google API matrix.", "action");
                      setStatus("SUCCESS");
                      setTimeout(() => setStatus("IDLE"), 2000);
                    }, 1500);
                  }}
                  className="px-4 py-2 bg-yellow-500 text-black text-xs font-bold rounded uppercase tracking-widest hover:bg-yellow-400 transition"
                >
                  Approve Mission
                </button>
                <button 
                  onClick={() => {
                    addMessage("user", "Abort Action");
                    setStatus("IDLE");
                    addMessage("jarvis", "Mission aborted by commander.", "action");
                  }}
                  className="px-4 py-2 bg-black/40 border border-white/10 text-gray-400 text-xs font-bold rounded uppercase tracking-widest hover:bg-white/10 transition"
                >
                  Abort
                </button>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Footer bar */}
      <footer className="w-full text-center py-2 text-[8px] text-gray-600 uppercase tracking-[0.3em] bg-black">
        JARVIS OS COGNITIVE WORKSPACE OPERATING LAYER // ENCRYPTED SQLITE SHIELD ENGAGED.
      </footer>
    </div>
  );
}
