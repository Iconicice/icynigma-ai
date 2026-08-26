# Iconic Media Entertainment Enhancement

**Creator credit:** Inolofatseng Mokgoko  
**Project:** Iconic Media Entertainment  
**Release checkpoint:** `7845315e`  
**Production domain:** https://icemediaent-kbysc8ud.manus.space

## Summary

This release extends the faithful Iconic Media Entertainment rebuild with a server-side ElevenLabs voice path for the existing AudioGuide, a browser speech fallback, and a new responsive avatar studio at `/avatars`. The implementation preserves the existing dark visual language, animated logo treatment, original navigation, site assistant, media routes, and creator credit.

The AudioGuide posts narration text to `/api/tts`. The API key remains server-side, the endpoint bounds input to 5,000 characters, returns `audio/mpeg` bytes on success, and normalizes upstream failures to a safe `502` response. The browser first attempts ElevenLabs playback. If the request or audio playback fails, the component uses `speechSynthesis`; pause, resume, stop, and read-along behavior remain available. Read-along progress follows browser speech boundaries or the audio element’s current-time ratio.

The avatar studio contains eight original generated profile assets in four categories: two dark anime, two alien, two lost astronaut, and two robot/android. Visitors can preview and locally retain a selection. Authenticated users save the validated avatar key to the `users.avatarKey` field and restore it after login. Unknown saved keys resolve to the first safe catalog entry in the client, while the server mutation accepts only the eight catalog keys.

Quarter rotation is represented by UTC quarter helpers and durable `siteRotation` state. The `/api/scheduled/avatar-rotation` callback authenticates cron identities, records the active quarter and catalog version, persists the task UID, and is idempotent. A production Heartbeat named `iconic-media-quarterly-avatar-rotation` runs at `0 0 0 1 1,4,7,10 *` UTC.

## Implementation map

| Area | Implementation |
|---|---|
| ElevenLabs voice | `server/tts.ts`, mounted from `server/_core/index.ts` |
| Browser fallback | `client/src/components/AudioGuide.tsx` |
| Avatar catalog | `client/src/lib/avatarCatalog.ts` |
| Avatar picker | `client/src/pages/Avatars.tsx` |
| Avatar route | `/avatars` in `client/src/App.tsx` |
| Profile persistence | `profile.avatar` and `profile.setAvatar` in `server/routers.ts` |
| User fields | `users.avatarKey`, `users.avatarUpdatedAt` |
| Rotation state | `siteRotation` table and `server/avatarRotation.ts` |
| Scheduled callback | `/api/scheduled/avatar-rotation` |
| Tests | `server/avatar-catalog.test.ts`, `server/tts.test.ts`, `client/src/components/AudioGuide.test.tsx` |

## Verification

The final local verification includes a clean TypeScript check, a production build, and a passing Vitest suite with 10 test files and 16 tests. The deployed domain returned `200` for `/` and `/avatars`, `400` for invalid `/api/tts` input, and `403` for an unauthenticated direct rotation callback, confirming the expected route protections. Desktop and mobile screenshots confirmed the responsive avatar grid, category filters, selected state, and readable mobile stacking.

## Notes for future avatar drops

The current catalog is centralized in `client/src/lib/avatarCatalog.ts`. Future quarterly visual drops should replace or extend the asset URLs in that manifest, update `AVATAR_CATALOG_VERSION`, and preserve the eight-key category contract unless a schema migration is deliberately planned. Existing users retain saved choices; new users receive the quarter-aware default.

## References

[1]: https://elevenlabs.io/docs/api-reference/text-to-speech "ElevenLabs Text to Speech API reference"
[2]: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis "MDN SpeechSynthesis API reference"
