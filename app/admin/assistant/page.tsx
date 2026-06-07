"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTERS = [
  { label: "Draft a quote email", prompt: "Draft a professional quote email for a customer who needs a 10kW solar system installed." },
  { label: "Price a switchboard job", prompt: "How much should I charge to upgrade a 1970s rewirable fuse board to a modern switchboard with RCDs? Single-storey 3-bed house." },
  { label: "EV charger scope", prompt: "What do I need to consider when scoping a home EV charger installation? What are the common complications?" },
  { label: "QLD smoke alarm rules", prompt: "What are the current QLD smoke alarm requirements for rental properties? When do the new rules fully apply?" },
  { label: "Respond to a price dispute", prompt: "A customer is pushing back on my solar quote saying they got a cheaper price from another company. How should I respond professionally?" },
  { label: "STC calculation help", prompt: "How do I calculate STCs for a 10kW solar system installed on the Sunshine Coast? What zone are we in?" },
];

function MessageBubble({ msg, streaming }: { msg: Message; streaming?: boolean }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-sm border border-[#F5A623]/20 bg-[#F5A623]/8 flex items-center justify-center text-xs text-[#F5A623] shrink-0 mr-3 mt-0.5">
          ◈
        </div>
      )}
      <div
        className={`max-w-[80%] px-4 py-3 rounded-sm text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F0EDE8]"
            : "bg-[#0D1B2A] border border-white/8 text-[#F0EDE8]"
        }`}
      >
        {msg.content}
        {streaming && (
          <span className="inline-block w-1.5 h-3.5 bg-[#F5A623] ml-0.5 animate-pulse rounded-sm" />
        )}
      </div>
    </div>
  );
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [includeEnquiries, setIncludeEnquiries] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  async function sendMessage(text?: string) {
    const userText = (text ?? input).trim();
    if (!userText || streaming) return;

    setInput("");
    const userMsg: Message = { role: "user", content: userText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setStreaming(true);

    // Add empty assistant message to stream into
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          includeEnquiries,
        }),
      });

      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: accumulated };
          return updated;
        });
      }
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Something went wrong. Check the server and try again.",
        };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function clearChat() {
    setMessages([]);
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="shrink-0 border-b border-white/5 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-sm border border-[#F5A623]/20 bg-[#F5A623]/8 flex items-center justify-center text-sm text-[#F5A623]">
            ◈
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#F0EDE8] leading-tight">AI Assistant</h1>
            <p className="text-xs text-[#6B6B6B]">Protocol Electrics · Business Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Enquiry context toggle */}
          <button
            onClick={() => setIncludeEnquiries((v) => !v)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-sm border transition-all ${
              includeEnquiries
                ? "bg-[#F5A623]/10 border-[#F5A623]/30 text-[#F5A623]"
                : "border-white/8 text-[#6B6B6B] hover:border-white/20 hover:text-[#F0EDE8]"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {includeEnquiries ? "Enquiry context ON" : "Enquiry context OFF"}
          </button>

          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="px-3 py-1.5 text-xs border border-white/8 text-[#6B6B6B] hover:text-[#F0EDE8] hover:border-white/20 rounded-sm transition-all"
            >
              Clear chat
            </button>
          )}
          <Link
            href="/admin"
            className="px-3 py-1.5 text-xs border border-white/8 text-[#6B6B6B] hover:text-[#F0EDE8] hover:border-white/20 rounded-sm transition-all"
          >
            ← Dashboard
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-sm border border-[#F5A623]/20 bg-[#F5A623]/5 flex items-center justify-center text-2xl text-[#F5A623] mb-5">
              ◈
            </div>
            <h2 className="text-lg font-bold text-[#F0EDE8] mb-2">Your business assistant</h2>
            <p className="text-sm text-[#6B6B6B] leading-relaxed mb-8">
              Knows Protocol Electrics inside out — pricing, regulations, job scoping, and the Sunshine Coast market.
              Ask anything or use a starter below.
            </p>
            <div className="grid grid-cols-2 gap-2 w-full">
              {STARTERS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => sendMessage(s.prompt)}
                  className="text-left px-4 py-3 border border-white/8 hover:border-[#F5A623]/20 hover:bg-[#F5A623]/5 rounded-sm text-xs text-[#6B6B6B] hover:text-[#F0EDE8] transition-all"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {messages.map((msg, i) => (
              <MessageBubble
                key={i}
                msg={msg}
                streaming={streaming && i === messages.length - 1 && msg.role === "assistant"}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="shrink-0 border-t border-white/5 px-8 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything — pricing, compliance, draft a quote, scope a job…"
                rows={2}
                className="w-full bg-[#0D1B2A]/60 border border-white/8 focus:border-[#F5A623]/30 text-[#F0EDE8] text-sm px-4 py-3 rounded-sm outline-none transition-all resize-none placeholder:text-[#6B6B6B]/40"
                style={{ maxHeight: "160px" }}
              />
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || streaming}
              className="shrink-0 px-5 py-3 bg-[#F5A623] text-[#0A0A0A] font-bold text-sm rounded-sm hover:bg-[#FFD580] disabled:opacity-40 transition-colors self-end"
            >
              {streaming ? (
                <span className="w-4 h-4 rounded-full border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] animate-spin block" />
              ) : (
                "→"
              )}
            </button>
          </div>
          <p className="text-[10px] text-[#6B6B6B]/30 mt-2 text-center">
            Enter to send · Shift+Enter for new line
            {includeEnquiries && " · Enquiry data included in context"}
          </p>
        </div>
      </div>
    </div>
  );
}
