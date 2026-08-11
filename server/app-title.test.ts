import { describe, expect, it } from "vitest";

describe("managed application title", () => {
  it("uses the requested Iconic Media Entertainment title in the configured runtime environment", () => {
    expect(process.env.VITE_APP_TITLE).toBe("Iconic Media Entertainment");
  });
});
