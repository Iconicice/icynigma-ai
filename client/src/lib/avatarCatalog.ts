export type AvatarCategory = "dark-anime" | "alien" | "lost-astronaut" | "robot-android";
export type AvatarKey = "dark-anime-01" | "dark-anime-02" | "alien-01" | "alien-02" | "lost-astronaut-01" | "lost-astronaut-02" | "robot-android-01" | "robot-android-02";

export type AvatarDefinition = { key: AvatarKey; label: string; category: AvatarCategory; imageUrl: string; accent: string };

export const AVATAR_ROTATION_MONTHS = 3;
export const AVATAR_CATALOG_VERSION = "ime-avatar-drop-v1";

export const avatarCatalog: AvatarDefinition[] = [
  { key: "dark-anime-01", label: "Neon Shadow", category: "dark-anime", imageUrl: "/manus-storage/ime-avatar-dark-anime-01_0231f57a.png", accent: "#00d4ff" },
  { key: "dark-anime-02", label: "Violet Signal", category: "dark-anime", imageUrl: "/manus-storage/ime-avatar-dark-anime-02_e5b1be44.png", accent: "#a855f7" },
  { key: "alien-01", label: "Teal Oracle", category: "alien", imageUrl: "/manus-storage/ime-avatar-alien-01_9480327a.png", accent: "#2dd4bf" },
  { key: "alien-02", label: "Copper Voyager", category: "alien", imageUrl: "/manus-storage/ime-avatar-alien-02_6bc64734.png", accent: "#f59e0b" },
  { key: "lost-astronaut-01", label: "Blue Drift", category: "lost-astronaut", imageUrl: "/manus-storage/ime-avatar-astronaut-01_7647e6db.png", accent: "#60a5fa" },
  { key: "lost-astronaut-02", label: "Amber Beacon", category: "lost-astronaut", imageUrl: "/manus-storage/ime-avatar-astronaut-02_b707399e.png", accent: "#fbbf24" },
  { key: "robot-android-01", label: "Cyan Logic", category: "robot-android", imageUrl: "/manus-storage/ime-avatar-robot-01_e9458892.png", accent: "#22d3ee" },
  { key: "robot-android-02", label: "Violet Core", category: "robot-android", imageUrl: "/manus-storage/ime-avatar-robot-02_86824084.png", accent: "#c084fc" },
];

export const avatarCategories: Array<{ key: AvatarCategory; label: string }> = [
  { key: "dark-anime", label: "Dark Anime" },
  { key: "alien", label: "Alien Type" },
  { key: "lost-astronaut", label: "Lost Astronaut" },
  { key: "robot-android", label: "Robot / Android" },
];

const quarterDrops: AvatarKey[][] = [
  ["dark-anime-01", "alien-02", "robot-android-01", "lost-astronaut-02", "dark-anime-02", "alien-01", "robot-android-02", "lost-astronaut-01"],
  ["alien-01", "lost-astronaut-01", "dark-anime-02", "robot-android-02", "alien-02", "lost-astronaut-02", "dark-anime-01", "robot-android-01"],
  ["lost-astronaut-02", "robot-android-01", "alien-02", "dark-anime-01", "lost-astronaut-01", "robot-android-02", "alien-01", "dark-anime-02"],
  ["robot-android-02", "dark-anime-02", "lost-astronaut-01", "alien-01", "robot-android-01", "dark-anime-01", "lost-astronaut-02", "alien-02"],
];

export function getAvatarByKey(key?: string | null) { return avatarCatalog.find((avatar) => avatar.key === key) ?? avatarCatalog[0]; }
export function getQuarterKey(date = new Date()) { return `${date.getUTCFullYear()}-Q${Math.floor(date.getUTCMonth() / AVATAR_ROTATION_MONTHS) + 1}`; }
export function getQuarterIndex(date = new Date()) { return Math.floor(date.getUTCMonth() / AVATAR_ROTATION_MONTHS); }
export function getAvatarKeysForQuarter(date = new Date()) { return quarterDrops[getQuarterIndex(date) % quarterDrops.length]; }
export function getAvatarCatalogForQuarter(date = new Date()) { const byKey = new Map(avatarCatalog.map((avatar) => [avatar.key, avatar])); return getAvatarKeysForQuarter(date).map((key) => byKey.get(key)!).filter(Boolean); }
export function getDefaultAvatarForQuarter(date = new Date()) { return getAvatarCatalogForQuarter(date)[0] ?? avatarCatalog[0]; }
export function getCurrentAvatarSet(date = new Date()) { const quarter = getQuarterKey(date); return { version: `${AVATAR_CATALOG_VERSION}-${quarter}`, quarter, defaultAvatarKey: getDefaultAvatarForQuarter(date).key, activeKeys: getAvatarKeysForQuarter(date) }; }
