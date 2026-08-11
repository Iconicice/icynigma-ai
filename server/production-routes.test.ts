import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("public production routes", () => {
  it("keeps the original home and video routes registered in the application shell", () => {
    const appSource = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
    expect(appSource).toContain('<Route path="/" component={Home} />');
    expect(appSource).toContain('<Route path="/video">');
    expect(appSource).toContain('lazy(() => import("@/pages/Video"))');
    expect(new URL("/video", "https://icynigma.ai").pathname).toBe("/video");
  });
});
