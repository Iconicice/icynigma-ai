import { describe, expect, it, vi } from "vitest";
import { registerTtsRoute } from "./tts";

function makeHarness(body: unknown) {
  let handler: ((req: any, res: any) => Promise<void>) | undefined;
  const app = { post: vi.fn((_path: string, callback: any) => { handler = callback; }) } as any;
  const res = { statusCode: 200, headers: {} as Record<string, string>, status(code: number) { this.statusCode = code; return this; }, json(value: unknown) { this.body = value; return this; }, setHeader(key: string, value: string) { this.headers[key] = value; }, send(value: Buffer) { this.body = value; return this; } } as any;
  registerTtsRoute(app);
  return { handler: handler!, req: { body }, res };
}

describe("ElevenLabs TTS route", () => {
  it("rejects missing or oversized text", async () => {
    const missing = makeHarness({});
    await missing.handler(missing.req, missing.res);
    expect(missing.res.statusCode).toBe(400);
    const oversized = makeHarness({ text: "x".repeat(5001) });
    await oversized.handler(oversized.req, oversized.res);
    expect(oversized.res.statusCode).toBe(400);
  });

  it("normalizes upstream failures to a safe 502 response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("upstream failed", { status: 500 })));
    const harness = makeHarness({ text: "hello" });
    await harness.handler(harness.req, harness.res);
    expect(harness.res.statusCode).toBe(502);
    vi.unstubAllGlobals();
  });

  it("returns audio/mpeg bytes on success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(new Uint8Array([1, 2, 3]), { status: 200, headers: { "content-type": "audio/mpeg" } })));
    const harness = makeHarness({ text: "hello" });
    await harness.handler(harness.req, harness.res);
    expect(harness.res.headers["Content-Type"]).toBe("audio/mpeg");
    expect(Buffer.isBuffer(harness.res.body)).toBe(true);
    vi.unstubAllGlobals();
  });
});
