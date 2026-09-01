import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Send, Sparkles, User, X } from "lucide-react";

type Message = { id: string; role: "user" | "assistant"; content: string; streaming?: boolean };
const BRAND = "Iconic Media Entertainment";
const FAQS = ["How do I buy a beat?", "What services do you offer?", "How do I send my vocals?", "Who is Ice?", "What's the cheapest beat?"];
const welcome: Message = { id: "welcome", role: "assistant", content: `Hey. I’m Icynigma.ai — your guide to everything ${BRAND}. Ask me about beats, services, avatars, the AudioGuide, or how to tap in with the crew.` };
const makeId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const linked = (text: string) => text.split(/(https?:\/\/[^\s]+)/g).map((part, index) => /^https?:\/\//.test(part) ? <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 break-all">{part}</a> : <span key={index}>{part}</span>);

export function ImeAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const reduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => { if (open) window.setTimeout(() => inputRef.current?.focus(), 180); }, [open]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [messages]);
  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape" && open) setOpen(false); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const send = async (raw: string) => {
    const content = raw.trim();
    if (!content || loading) return;
    abortRef.current?.abort();
    const user: Message = { id: makeId(), role: "user", content };
    const assistantId = makeId();
    setMessages((current) => [...current, user, { id: assistantId, role: "assistant", content: "", streaming: true }]);
    setInput("");
    setLoading(true);
    const controller = new AbortController();
    let timedOut = false;
    const timeout = window.setTimeout(() => { timedOut = true; controller.abort(); }, 20000);
    abortRef.current = controller;
    try {
      const history = [...messages.filter((message) => message.id !== "welcome"), user].slice(-11).map(({ role, content: messageContent }) => ({ role, content: messageContent }));
      const response = await fetch("/api/assistant/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history }), signal: controller.signal });
      if (!response.ok || !response.body) throw new Error("assistant unavailable");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let receivedContent = false;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() ?? "";
        for (const block of blocks) {
          for (const line of block.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const event = JSON.parse(data) as { content?: string; error?: string };
              if (event.error) throw new Error(event.error);
              if (event.content) {
                receivedContent = true;
                setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, content: message.content + event.content } : message));
              }
            } catch (error) {
              if (error instanceof Error && error.message !== "Unexpected end of JSON input") throw error;
            }
          }
        }
      }
      if (!receivedContent) throw new Error("empty assistant response");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError" && !timedOut) return;
      setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, content: "Connection issue. Check your network and try again." } : message));
    } finally {
      window.clearTimeout(timeout);
      if (abortRef.current === controller) abortRef.current = null;
      setLoading(false);
      setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, streaming: false } : message));
    }
  };

  return <>
    <motion.button data-testid="button-ime-assistant-toggle" aria-label={open ? "Close Icynigma.ai assistant" : "Open Icynigma.ai assistant"} aria-expanded={open} onClick={() => setOpen((value) => !value)} className="fixed bottom-4 left-3 sm:bottom-6 sm:left-6 z-50 w-14 h-14 rounded-full bg-primary text-black flex items-center justify-center shadow-2xl shadow-primary/30" whileHover={reduceMotion ? undefined : { scale: 1.08 }} whileTap={reduceMotion ? undefined : { scale: 0.94 }} title="Chat with Icynigma.ai">{open ? <X size={22} aria-hidden="true" /> : <Sparkles size={22} aria-hidden="true" />}</motion.button>
    <AnimatePresence>{open && <motion.aside role="dialog" aria-label="Icynigma.ai studio assistant" aria-describedby="ime-assistant-description" initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduceMotion ? undefined : { opacity: 0, y: 24, scale: 0.96 }} transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 28 }} className="fixed bottom-20 left-2 sm:bottom-24 sm:left-6 z-50 w-[350px] max-w-[calc(100vw-2rem)] h-[520px] rounded-2xl bg-[#0f0f0f] border border-white/10 shadow-2xl flex flex-col overflow-hidden">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-black/40"><div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 grid place-items-center"><Sparkles size={15} className="text-primary" aria-hidden="true" /></div><div><p className="text-sm font-bold text-white leading-none">Icynigma.ai</p><p id="ime-assistant-description" className="text-xs text-white/40 mt-0.5">{BRAND} AI</p></div><span className="ml-auto text-xs text-green-400" role="status">ready</span><button type="button" aria-label="Minimize chat" onClick={() => setOpen(false)} className="p-1 text-white/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"><ChevronDown size={16} aria-hidden="true" /></button></header>
      <main aria-live="polite" aria-busy={loading} className="flex-1 overflow-y-auto p-4 space-y-3">{messages.map((message) => <div key={message.id} className={`flex gap-2 ${message.role === "user" ? "flex-row-reverse" : ""}`}><div aria-hidden="true" className={`w-6 h-6 rounded-full grid place-items-center shrink-0 ${message.role === "assistant" ? "bg-primary/20 text-primary" : "bg-white/10 text-white/60"}`}>{message.role === "assistant" ? <Sparkles size={11} /> : <User size={11} />}</div><div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${message.role === "user" ? "bg-primary text-black font-medium" : "bg-white/5 text-white/90"}`}>{message.role === "assistant" ? linked(message.content) : message.content}{message.streaming && <span className="inline-block ml-1 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" aria-label="Assistant is responding" />}</div></div>)}<div ref={bottomRef} /></main>
      {messages.length <= 2 && <div className="px-4 pb-2 flex gap-1.5 flex-wrap">{FAQS.map((question) => <button type="button" key={question} onClick={() => void send(question)} disabled={loading} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-primary hover:border-primary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">{question}</button>)}</div>}
      <form onSubmit={(event) => { event.preventDefault(); void send(input); }} className="flex gap-2 p-4 border-t border-white/5"><input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} aria-label="Ask Icynigma.ai" placeholder="Ask anything about I.M.E..." disabled={loading} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50" /><button type="submit" aria-label="Send message" disabled={!input.trim() || loading} className="w-9 rounded-xl bg-primary text-black grid place-items-center disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"><Send size={15} aria-hidden="true" /></button></form>
    </motion.aside>}</AnimatePresence>
  </>;
}
