# Project Handoff: Iconic Media Entertainment

## Identity and constraints

The site name is **Iconic Media Entertainment** and must be used exclusively. Credit **Inolofatseng Mokgoko** on site-facing and project-facing materials. Preserve the original dark-mode aesthetic, animated centre logo, supplied media, AudioGuide narration, floating Icynigma.ai assistant, `/video` route, original login behavior, and existing production domain.

## Stack

The project uses React 19, Vite, Tailwind CSS 4, Framer Motion, Express, tRPC, Drizzle ORM with MySQL/TiDB, Vitest, and managed web deployment. The project root is `/home/ubuntu/ice-media-entertainment`.

## Important routes

| Route | Purpose |
|---|---|
| `/` | Original Iconic Media Entertainment landing page |
| `/video` | Lazy-loaded original animated video experience |
| `/icynigma-ai` | General-purpose Icynigma AI destination page |
| `/avatars` | Responsive profile avatar picker |
| `/api/tts` | Server-side ElevenLabs text-to-speech endpoint |
| `/api/scheduled/avatar-rotation` | Authenticated Heartbeat callback |

## Avatar contract

The canonical manifest is `client/src/lib/avatarCatalog.ts`. It contains exactly eight keys: `dark-anime-01`, `dark-anime-02`, `alien-01`, `alien-02`, `lost-astronaut-01`, `lost-astronaut-02`, `robot-android-01`, and `robot-android-02`. The client supports local selection for visitors and authenticated persistence through `profile.avatar` and `profile.setAvatar`. The server validates the key with a zod enum before updating `users.avatarKey` and `users.avatarUpdatedAt`.

Quarter selection is UTC-based. `getQuarterKey()` uses calendar quarters, and `getDefaultAvatarForQuarter()` produces a deterministic category/default for new users. The `siteRotation` row stores `quarterKey`, `catalogVersion`, `scheduleCronTaskUid`, and `updatedAt`. The production Heartbeat `iconic-media-quarterly-avatar-rotation` uses cron `0 0 0 1 1,4,7,10 *` and calls the scheduled callback. Future visual drops should update the manifest and catalog version while preserving key validation or introducing a deliberate migration.

## AudioGuide contract

`client/src/components/AudioGuide.tsx` preserves the original narration and controls. It first posts narration text to `/api/tts`. Successful responses are played as `audio/mpeg`; network, service, and playback failures invoke browser `speechSynthesis`. Audio read-along progress is estimated from the audio element’s current-time ratio, while browser speech uses word boundary events. Stop revokes object URLs and cancels both playback modes.

## Verification commands

Use `pnpm run check` for TypeScript validation, `pnpm test -- --run` for Vitest, and `pnpm run build` for the production bundle. The recovered stable tree is TypeScript-clean, has 10 passing Vitest files with 16 tests, and produces a successful Vite plus esbuild production build. The deployed domain returned `200` for `/` and `/avatars`, `400` for invalid TTS input, and `403` for unauthenticated rotation calls.

## Current release

The managed deployment checkpoint is `7845315e`. The source repository is `https://github.com/Iconicice/icynigma-ai`, and GitHub Pages is active at `https://iconicice.github.io/icynigma-ai/`. A Pages Actions workflow is prepared locally; GitHub rejected publishing that workflow because the connected GitHub App token lacks the `workflows` permission. The existing `gh-pages` branch deployment remains active.

## Maintenance cautions

Never put API keys in client code. Do not store media bytes in the database. Do not use in-process timers for quarterly work; use the platform Heartbeat callback. Do not fabricate reviews, ratings, testimonials, or user-generated content. Do not alter the original creator credit or branding without explicit instruction.
