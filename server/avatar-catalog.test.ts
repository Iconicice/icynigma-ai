import { describe, expect, it } from "vitest";
import { avatarCatalog, getAvatarByKey, getDefaultAvatarForQuarter, getQuarterKey } from "../client/src/lib/avatarCatalog";

describe("Iconic Media Entertainment avatar catalog", () => {
  it("contains exactly eight avatars across the four required categories", () => {
    expect(avatarCatalog).toHaveLength(8);
    expect(new Set(avatarCatalog.map((avatar) => avatar.category))).toEqual(new Set(["dark-anime", "alien", "lost-astronaut", "robot-android"]));
    for (const category of ["dark-anime", "alien", "lost-astronaut", "robot-android"]) {
      expect(avatarCatalog.filter((avatar) => avatar.category === category)).toHaveLength(2);
    }
  });

  it("calculates UTC quarter boundaries deterministically", () => {
    expect(getQuarterKey(new Date("2026-01-01T00:00:00Z"))).toBe("2026-Q1");
    expect(getQuarterKey(new Date("2026-04-01T00:00:00Z"))).toBe("2026-Q2");
    expect(getQuarterKey(new Date("2026-10-01T00:00:00Z"))).toBe("2026-Q4");
    expect(getDefaultAvatarForQuarter(new Date("2026-07-01T00:00:00Z")).category).toBe("lost-astronaut");
  });

  it("falls back to the first safe avatar for an unknown saved key", () => {
    expect(getAvatarByKey("not-a-real-avatar").key).toBe(avatarCatalog[0].key);
  });
});
