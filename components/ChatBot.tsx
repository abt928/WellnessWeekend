"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "Hi! I'm here to answer your questions about Wellness Weekend — schedule, tickets, practitioners, camping, and more. What would you like to know?",
        },
      ]);
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok || !res.body) {
        setMessages([...next, { role: "assistant", content: "Sorry, something went wrong. Please try again or email support@thesoundspace.us." }]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";

      setMessages([...next, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: reply }]);
      }
    } catch {
      setMessages([...next, { role: "assistant", content: "Sorry, I couldn't connect. Please email support@thesoundspace.us." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        className="chatbot-fab"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Ask a question"}
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="chatbot-panel" role="dialog" aria-label="Wellness Weekend chat assistant">
          <div className="chatbot-header">
            <span className="chatbot-header-title">Ask Us Anything</span>
            <span className="chatbot-header-sub">Wellness Weekend · Aug 7–9</span>
          </div>

          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chatbot-msg chatbot-msg-${m.role}`}>
                {m.content || (loading && i === messages.length - 1 ? <span className="chatbot-typing">●●●</span> : "")}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="chatbot-input-row">
            <input
              ref={inputRef}
              className="chatbot-input"
              type="text"
              placeholder="Ask about schedule, tickets, camping…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              disabled={loading}
            />
            <button
              className="chatbot-send"
              onClick={send}
              disabled={loading || !input.trim()}
              aria-label="Send"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
