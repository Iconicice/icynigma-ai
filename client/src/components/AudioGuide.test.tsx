// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AudioGuide } from "./AudioGuide";

describe("AudioGuide browser fallback", () => {
  afterEach(() => { vi.restoreAllMocks(); document.body.innerHTML = ""; });

  it("uses speech synthesis when the ElevenLabs request fails", async () => {
    const speak = vi.fn();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    vi.stubGlobal("SpeechSynthesisUtterance", class { rate = 0; pitch = 0; lang = ""; onboundary?: (event: { name: string; charIndex: number }) => void; onend?: () => void; onerror?: () => void; constructor(public text: string) {} });
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: { cancel: vi.fn(), pause: vi.fn(), resume: vi.fn(), speak } });
    const root = createRoot(document.body);
    await act(async () => { root.render(<AudioGuide />); });
    await act(async () => { (document.querySelector('[data-testid="button-audio-guide-toggle"]') as HTMLButtonElement).click(); });
    await act(async () => { (document.querySelector('[data-testid="button-play-summary"]') as HTMLButtonElement).click(); await Promise.resolve(); });
    expect(fetch).toHaveBeenCalledWith("/api/tts", expect.objectContaining({ method: "POST" }));
    expect(speak).toHaveBeenCalledTimes(1);
    root.unmount();
  });
});
