import { describe, expect, it } from "vitest";
import { originalAssetManifest, siteAssets } from "./siteAssets";

describe("original asset manifest", () => {
  it("references every supplied original media asset through managed storage", () => {
    expect(originalAssetManifest).toHaveLength(22);
    expect(originalAssetManifest.every((path) => path.startsWith("/manus-storage/"))).toBe(true);
    expect(siteAssets.logo).toMatch(/STK-20241113/);
    expect(siteAssets.opengraph).toMatch(/opengraph/);
    expect(siteAssets.attached.studioVideo).toMatch(/\.mp4$/);
    expect(siteAssets.attached.performanceVideo).toMatch(/\.mp4$/);
  });
});
