import { describe, expect, it } from "vitest";
import { ICYNIGMA_SYSTEM_PROMPT } from "./routers/assistant";

describe("Icynigma.ai site context", () => {
  it("contains the full I.M.E. service, catalogue, navigation, social, and attribution context", () => {
    expect(ICYNIGMA_SYSTEM_PROMPT).toContain("Icynigma.ai");
    expect(ICYNIGMA_SYSTEM_PROMPT).toContain("Inolofatseng Mokgoko");
    expect(ICYNIGMA_SYSTEM_PROMPT).toContain("Remote Production & Mixing");
    expect(ICYNIGMA_SYSTEM_PROMPT).toContain("Custom I.M.E Beats");
    expect(ICYNIGMA_SYSTEM_PROMPT).toContain("Fairies | R75");
    expect(ICYNIGMA_SYSTEM_PROMPT).toContain("Abracadabra | R200");
    expect(ICYNIGMA_SYSTEM_PROMPT).toContain("https://www.tiktok.com/@Icynigma");
    expect(ICYNIGMA_SYSTEM_PROMPT).toContain("Video (/video)");
  });
});
