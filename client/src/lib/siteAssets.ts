/**
 * Production-hosted originals from the supplied Iconic Media Entertainment source package.
 * These paths are returned by managed asset storage and must not be replaced with placeholders.
 */
export const siteAssets = {
  logo: "/manus-storage/STK-20241113-WA0002_1780890871837_8cb89c8e.webp",
  opengraph: "/manus-storage/opengraph_9c8287b1.jpg",
  crystal: "/manus-storage/crystal_0459f6f8.png",
  soundwaves: "/manus-storage/soundwaves_42224325.png",
  studioBackground: "/manus-storage/studio-bg_c700fa4d.png",
  attached: {
    artwork: "/manus-storage/1764081159129_1780890871781_abf5c666.png",
    portrait: "/manus-storage/20251120_014717_1780890871806_d577d916.jpg",
    artworkAlt: "/manus-storage/20260115_013226(1)_1780890871762_65463210.jpg",
    studioVideo: "/manus-storage/20260115_013420_1780890871770_bca34387.mp4",
    performanceVideo: "/manus-storage/20260527_024359_1780890871626_6f0c10bf.mp4",
    productImage: "/manus-storage/41smXfAQgjL._AC_UF1000,1000_QL80__1780890871830_dfc70c59.jpg",
    wallpaper: "/manus-storage/Area_51_Wallpaper_1780890871799_0e63d28b.jpg",
    crazyNight: "/manus-storage/Crazy_night_edited_1780890871824_7b641132.jpg",
    screenshot040528: "/manus-storage/Screenshot_20260417_040528_1780890871736_fa03d539.jpg",
    screenshot040627: "/manus-storage/Screenshot_20260417_040627_1780890871747_330f4fa8.jpg",
    screenshot040859: "/manus-storage/Screenshot_20260417_040859_1780890871654_0c255273.jpg",
    screenshot040949: "/manus-storage/Screenshot_20260417_040949_1780890871671_1cb0e0b5.jpg",
    screenshot041014: "/manus-storage/Screenshot_20260417_041014_1780890871663_65953458.jpg",
    screenshot041023: "/manus-storage/Screenshot_20260417_041023_1780890871706_fabebdfc.jpg",
    screenshot041418: "/manus-storage/Screenshot_20260417_041418_1780890871720_ec6533db.jpg",
    screenshot041722: "/manus-storage/Screenshot_20260417_041722_1780890871647_55895a53.jpg",
    astronaut: "/manus-storage/astronaut_edited_1780890871817_28301f37.jpg",
  },
} as const;

export const originalAssetManifest = Object.values({
  logo: siteAssets.logo,
  opengraph: siteAssets.opengraph,
  crystal: siteAssets.crystal,
  soundwaves: siteAssets.soundwaves,
  studioBackground: siteAssets.studioBackground,
  ...siteAssets.attached,
});
