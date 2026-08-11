import type { Express } from "express";
import { z } from "zod";
import { ENV } from "./_core/env";
import { ICYNIGMA_SYSTEM_PROMPT } from "./routers/assistant";

const bodySchema = z.object({ messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(2000) })).min(1).max(12) });

export function registerAssistantStream(app: Express) {
  app.post("/api/assistant/chat", async (req, res) => {
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid request body" }); return; }
    const controller = new AbortController();
    let finished = false;
    res.on("close", () => { if (!finished) controller.abort(); });
    try {
      const endpoint = `${ENV.forgeApiUrl.replace(/\/$/, "")}/v1/chat/completions`;
      const upstream = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${ENV.forgeApiKey}` }, signal: controller.signal, body: JSON.stringify({ stream: true, max_tokens: 600, messages: [{ role: "system", content: ICYNIGMA_SYSTEM_PROMPT }, ...parsed.data.messages] }) });
      if (!upstream.ok || !upstream.body) throw new Error(`Assistant upstream returned ${upstream.status}`);
      res.status(200).set({ "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive", "X-Accel-Buffering": "no" });
      const reader = upstream.body.getReader(); const decoder = new TextDecoder(); let buffer = "";
      while (true) { const { done, value } = await reader.read(); if (done) break; buffer += decoder.decode(value, { stream: true }); const blocks = buffer.split("\n\n"); buffer = blocks.pop() ?? ""; for (const block of blocks) { for (const line of block.split("\n")) { if (!line.startsWith("data: ")) continue; const data = line.slice(6); if (data === "[DONE]") { res.write("data: {\"done\":true}\n\n"); continue; } try { const chunk = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> }; const content = chunk.choices?.[0]?.delta?.content; if (content) res.write(`data: ${JSON.stringify({ content })}\n\n`); } catch { /* ignore malformed upstream events */ } } } }
      finished = true; res.write("data: {\"done\":true}\n\n"); res.end();
    } catch (error) { if (!controller.signal.aborted) { res.write(`data: ${JSON.stringify({ error: "Something went wrong. Try again." })}\n\n`); res.end(); } }
  });
}
