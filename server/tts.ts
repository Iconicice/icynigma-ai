import type { Express, Request, Response } from "express";
import { ENV } from "./_core/env";

const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";
const ELEVENLABS_MODEL = "eleven_multilingual_v2";

export function registerTtsRoute(app: Express) {
  app.post("/api/tts", async (req: Request, res: Response) => {
    const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
    if (!text || text.length > 5000) {
      res.status(400).json({ error: "Audio text must be between 1 and 5000 characters." });
      return;
    }
    if (!ENV.elevenLabsApiKey) {
      res.status(503).json({ error: "ElevenLabs is not configured." });
      return;
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${DEFAULT_VOICE_ID}`, {
        method: "POST",
        headers: {
          accept: "audio/mpeg",
          "content-type": "application/json",
          "xi-api-key": ENV.elevenLabsApiKey,
        },
        body: JSON.stringify({
          text,
          model_id: ELEVENLABS_MODEL,
          voice_settings: { stability: 0.48, similarity_boost: 0.78, style: 0.18, use_speaker_boost: true },
        }),
      });
      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        console.error(`[TTS] ElevenLabs returned ${response.status}: ${detail.slice(0, 200)}`);
        res.status(502).json({ error: "ElevenLabs did not return audio." });
        return;
      }
      const audio = Buffer.from(await response.arrayBuffer());
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Cache-Control", "private, max-age=3600");
      res.send(audio);
    } catch (error) {
      console.error("[TTS] Request failed:", error);
      res.status(502).json({ error: "Unable to generate audio." });
    }
  });
}
