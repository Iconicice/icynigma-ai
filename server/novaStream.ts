import type { Express } from "express";
import { z } from "zod";
import { ENV } from "./_core/env";

const bodySchema = z.object({ messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(2000) })).min(1).max(12) });

export const NOVA_SYSTEM_PROMPT = `You are NOVA, an independent general-purpose conversational assistant created for Iconic Media Entertainment by Inolofatseng Mokgoko. You help with open-ended questions across everyday knowledge, learning, writing, creativity, ideas, and thoughtful conversation. Be accurate, calm, candid about uncertainty, and respectful. Do not claim to be Icynigma.ai or represent the I.M.E. studio assistant. For music-production or booking questions specifically about Iconic Media Entertainment, suggest using the site’s dedicated studio assistant instead.`;

export function registerNovaStream(app: Express) {
  app.post("/api/nova/chat", async (req, res) => {
    const parsed = bodySchema.safeParse(req.body); if (!parsed.success) { res.status(400).json({ error: "Invalid request body" }); return; }
    const controller = new AbortController(); let finished = false; res.on("close", () => { if (!finished) controller.abort(); });
    try {
      const upstream = await fetch(`${ENV.forgeApiUrl.replace(/\/$/, "")}/v1/chat/completions`, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${ENV.forgeApiKey}` }, signal: controller.signal, body: JSON.stringify({ stream: true, max_tokens: 700, messages: [{ role: "system", content: NOVA_SYSTEM_PROMPT }, ...parsed.data.messages] }) });
      if (!upstream.ok || !upstream.body) throw new Error(`NOVA upstream returned ${upstream.status}`);
      res.status(200).set({ "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive", "X-Accel-Buffering": "no" }); const reader = upstream.body.getReader(); const decoder = new TextDecoder(); let buffer = "";
      while (true) { const { done, value } = await reader.read(); if (done) break; buffer += decoder.decode(value, { stream: true }); const blocks = buffer.split("\n\n"); buffer = blocks.pop() ?? ""; for (const block of blocks) for (const line of block.split("\n")) { if (!line.startsWith("data: ")) continue; const data = line.slice(6); if (data === "[DONE]") continue; try { const content = (JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> }).choices?.[0]?.delta?.content; if (content) res.write(`data: ${JSON.stringify({ content })}\n\n`); } catch { /* ignore malformed upstream event */ } } }
      finished = true; res.write("data: {\"done\":true}\n\n"); res.end();
    } catch { if (!controller.signal.aborted) { res.write(`data: ${JSON.stringify({ error: "NOVA could not respond right now. Please try again." })}\n\n`); res.end(); } }
  });
}
