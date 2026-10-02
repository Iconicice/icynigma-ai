import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const html = readFileSync(new URL("../client/index.html", import.meta.url), "utf8");
const getMeta = (pattern: RegExp) => html.match(pattern)?.[1] ?? "";

describe("social sharing metadata", () => {
  it("defines a canonical root URL and complete Open Graph identity", () => {
    expect(html).toContain('<link rel="canonical" href="https://ime.manus.space/" />');
    expect(getMeta(/property="og:locale" content="([^"]+)"/)).toBe("en_ZA");
    expect(getMeta(/property="og:site_name" content="([^"]+)"/)).toBe("Iconic Media Entertainment");
    expect(getMeta(/property="og:title" content="([^"]+)"/)).toBe("Iconic Media Entertainment Studio");
    expect(getMeta(/property="og:type" content="([^"]+)"/)).toBe("website");
    expect(getMeta(/property="og:url" content="([^"]+)"/)).toBe("https://ime.manus.space/");
    expect(getMeta(/property="og:image" content="([^"]+)"/)).toBe("https://ime.manus.space/manus-storage/opengraph_9c8287b1.jpg");
    expect(getMeta(/property="og:image:alt" content="([^"]+)"/)).toContain("Iconic Media Entertainment");
  });

  it("aligns Twitter/X cards with the Open Graph share identity", () => {
    expect(getMeta(/name="twitter:card" content="([^"]+)"/)).toBe("summary_large_image");
    expect(getMeta(/name="twitter:title" content="([^"]+)"/)).toBe("Iconic Media Entertainment Studio");
    expect(getMeta(/name="twitter:description" content="([^"]+)"/)).toBe("Iconic Media Entertainment creates custom beats, professional mixing, and next-generation sound for artists.");
    expect(getMeta(/name="twitter:image" content="([^"]+)"/)).toBe("https://ime.manus.space/manus-storage/opengraph_9c8287b1.jpg");
    expect(getMeta(/name="twitter:image:alt" content="([^"]+)"/)).toContain("professional music production");
  });
});
