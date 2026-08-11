import { describe, expect, it } from "vitest";
import { NOVA_SYSTEM_PROMPT } from "./novaStream";

describe("NOVA independent assistant", () => {
  it("uses an independent general-purpose identity without claiming to be Icynigma.ai", () => {
    expect(NOVA_SYSTEM_PROMPT).toContain("You are NOVA");
    expect(NOVA_SYSTEM_PROMPT).toContain("general-purpose");
    expect(NOVA_SYSTEM_PROMPT).toContain("Do not claim to be Icynigma.ai");
    expect(NOVA_SYSTEM_PROMPT).toContain("Inolofatseng Mokgoko");
  });
});
