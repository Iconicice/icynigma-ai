import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const html = readFileSync(new URL("../client/index.html", import.meta.url), "utf8");
const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";
const keywords = html.match(/<meta name="keywords" content="([^"]+)"/)?.[1].split(",").map((keyword) => keyword.trim()).filter(Boolean) ?? [];

describe("root page SEO metadata", () => {
  it("keeps the document title between 30 and 60 characters", () => {
    expect(title.length).toBeGreaterThanOrEqual(30);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).toBe("Iconic Media Entertainment Studio");
  });

  it("contains between 3 and 8 focused keywords", () => {
    expect(keywords.length).toBeGreaterThanOrEqual(3);
    expect(keywords.length).toBeLessThanOrEqual(8);
    expect(keywords).toEqual([
      "Iconic Media Entertainment",
      "music production",
      "professional mixing",
      "custom beats",
      "studio recording",
      "artist services",
    ]);
  });
});
