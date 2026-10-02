# Iconic Media Entertainment Enhancement

**Creator credit:** Inolofatseng Mokgoko  
**Project:** Iconic Media Entertainment  
**Latest release checkpoint:** `c9a1fc2`  
**Managed production domain:** https://icemediaent-kbysc8ud.manus.space  
**GitHub Pages:** https://iconicice.github.io/icynigma-ai/

## Summary

This release extends the faithful Iconic Media Entertainment rebuild with a server-side ElevenLabs voice path for the existing AudioGuide, a browser speech fallback, a responsive avatar studio at `/avatars`, a site-aware Icynigma.ai assistant, and strict SEO/social metadata. The implementation preserves the original dark visual language, animated logo treatment, original navigation, supplied media, media routes, login behavior, and creator credit.

The AudioGuide posts narration text to `/api/tts`. The API key remains server-side, the endpoint bounds input to 5,000 characters, returns `audio/mpeg` bytes on success, and normalizes upstream failures to a safe `502` response. The browser first attempts ElevenLabs playback. If the request or audio playback fails, the component uses `speechSynthesis`; pause, resume, stop, and read-along behavior remain available.

The avatar studio contains eight original generated profile assets in four categories: two dark anime, two alien, two lost astronaut, and two robot/android. Visitors can preview and locally retain a selection. Authenticated users save the validated avatar key to `users.avatarKey` and restore it after login. Quarter rotation is represented by UTC helpers and durable `siteRotation` state; the production Heartbeat `iconic-media-quarterly-avatar-rotation` runs at `0 0 0 1 1,4,7,10 *` UTC.

## SEO and social metadata

The root page now uses the document title `Iconic Media Entertainment Studio` (35 characters), six focused meta keywords, an updated description, and complete Open Graph/Twitter card metadata. Regression coverage enforces the strict title and keyword limits.

## Implementation map

| Area | Implementation |
|---|---|
| ElevenLabs voice | `server/tts.ts`, mounted from `server/_core/index.ts` |
| Browser fallback | `client/src/components/AudioGuide.tsx` |
| Icynigma assistant | `client/src/components/ImeAssistant.tsx` |
| Avatar catalog | `client/src/lib/avatarCatalog.ts` |
| Avatar picker | `client/src/pages/Avatars.tsx` |
| Avatar route | `/avatars` in `client/src/App.tsx` |
| Profile persistence | `profile.avatar` and `profile.setAvatar` in `server/routers.ts` |
| Rotation state | `siteRotation` table and `server/avatarRotation.ts` |
| Scheduled callback | `/api/scheduled/avatar-rotation` |
| Tests | Avatar, TTS, AudioGuide, assistant, interaction, and metadata regression tests |

## Verification

The latest local verification includes a clean TypeScript check, a successful production build, and 18 passing Vitest tests. The managed domain previously returned `200` for `/` and `/avatars`, `400` for invalid `/api/tts` input, and `403` for an unauthenticated direct rotation callback.

## Custom-domain status

The intended custom domains are `icynigma.co.za` and `www.icynigma.co.za`. A public DNS check on 2026-10-02 found both names resolving to `157.90.205.139`, with no visible CNAME to `cname.manus.space`; HTTPS requests failed with `SSL_ERROR_SYSCALL`. The custom domain therefore remains pending registrar/Manus DNS binding and certificate provisioning. The managed `*.manus.space` deployment and GitHub Pages mirror remain available.

## Notes for future avatar drops

The current catalog is centralized in `client/src/lib/avatarCatalog.ts`. Future quarterly visual drops should replace or extend the asset URLs in that manifest, update `AVATAR_CATALOG_VERSION`, and preserve the eight-key category contract unless a schema migration is deliberately planned. Existing users retain saved choices; new users receive the quarter-aware default.

## References

[1]: https://elevenlabs.io/docs/api-reference/text-to-speech "ElevenLabs Text to Speech API reference"  
[2]: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis "MDN SpeechSynthesis API reference"
