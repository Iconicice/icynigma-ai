import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectFile = (file: string) => readFileSync(resolve(process.cwd(), file), "utf8");

describe("website interaction and link integrity", () => {
  it("keeps every original section anchor and the animated logo controls", () => {
    const navigation = projectFile("client/src/components/Navigation.tsx");
    for (const anchor of ["#home", "#services", "#beats", "#about", "#contact"]) expect(navigation).toContain(anchor);
    for (const timing of ["7000", "7600", "9500", "10000", "12000"]) expect(navigation).toContain(timing);
    expect(navigation).toContain("siteAssets.logo");
    expect(navigation).toContain("startLogin");
    expect(navigation).toContain("/nova");
  });

  it("keeps all original beat purchase and social destinations", () => {
    const beats = projectFile("client/src/components/Beats.tsx");
    const connect = projectFile("client/src/components/Connect.tsx");
    for (const url of ["voloco.resonantcavity.com/applinks/beats?id=9d5c3d23", "voloco.resonantcavity.com/applinks/beats?id=6e61688e", "voloco.resonantcavity.com/applinks/beats?id=af995cb4", "voloco.resonantcavity.com/applinks/creator?id=2511866"]) expect(beats).toContain(url);
    for (const url of ["facebook.com/ino.mokgoko", "tiktok.com/@Icynigma", "instagram.com/ino.m", "x.com/InoM", "youtube.com/@IconicMediaEntertainment", "soundcloud.com/iconic-records-325509286", "beatstars.com/iconicmediaentertainment"]) expect(connect).toContain(url);
  });

  it("retains both floating controls, assistant streaming endpoint, AudioGuide support, video scenes, and managed media paths", () => {
    const home = projectFile("client/src/pages/Home.tsx");
    const assistant = projectFile("client/src/components/ImeAssistant.tsx");
    const audioGuide = projectFile("client/src/components/AudioGuide.tsx");
    const video = projectFile("client/src/components/video/VideoTemplate.tsx");
    const assets = projectFile("client/src/lib/siteAssets.ts");
    expect(home).toContain("<AudioGuide />"); expect(home).toContain("<ImeAssistant />");
    expect(assistant).toContain('fetch("/api/assistant/chat"'); expect(assistant).toContain("getReader()");
    expect(audioGuide).toContain("speechSynthesis"); expect(audioGuide).toContain("Read Along");
    for (const scene of ["Scene1", "Scene2", "Scene3", "Scene4", "Scene5"]) expect(video).toContain(scene);
    expect(assets.match(/\/manus-storage\//g)?.length).toBe(22);
  });
});
