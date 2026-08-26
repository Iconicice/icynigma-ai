import { describe, expect, it } from "vitest";

describe("ElevenLabs configuration", () => {
  it("has a server-side API key configured", () => {
    expect(process.env.ELEVENLABS_API_KEY).toBeTruthy();
  });
});
