# Supplied Source Catalogue

This catalogue records the original website package used as the authoritative rebuild source. The source application is a dark-themed Ice Media Entertainment website with a public home route and a dedicated video route. Its original section order is Navigation, Hero, Services, Beats, About, Connect, and Footer, followed by the floating AudioGuide and assistant interfaces.

## Routes and application shell

| Original source file | Original responsibility | Rebuild treatment |
| --- | --- | --- |
| `src/App.tsx` | Configures the home route (`/`), video route (`/video`), fallback route, dark mode, query client, toaster, and tooltip provider. | Recreated with the same public routes, dark theme, and supporting providers. |
| `src/pages/home.tsx` | Assembles Navigation, Hero, Services, Beats, About, Connect, Footer, AudioGuide, and I.M.E. Assistant in that exact sequence. | Preserved in the same sequence and without copy changes. |
| `src/pages/video.tsx` | Renders the full-screen `VideoTemplate` inside a black, overflow-hidden main element. | Preserved at `/video`. |
| `src/pages/not-found.tsx` | Provides the fallback page. | Retained as the fallback route. |
| `src/main.tsx` | Browser application bootstrap. | Recreated using the host template’s bootstrap while preserving the application behavior. |

## Original user-facing components

| Component | Original source file | Original content or behavior retained |
| --- | --- | --- |
| Navigation | `components/Navigation.tsx` | Fixed transparent-to-blurred header, desktop anchors, responsive menu, authentication buttons, and the cycling centre-logo teleport animation. |
| Hero | `components/Hero.tsx` | Full-screen, textured hero with the original “Next Gen Audio Production” badge, welcome copy, slogan, and two section-anchor calls to action. |
| Services | `components/Services.tsx` | Original three-card service catalogue with active Remote Production & Mixing and Custom I.M.E Beats cards, plus the paused on-site-recording card. |
| Beats | `components/Beats.tsx` | Original Voloco-linked beat cards, pricing, vibe labels, premium treatment, and catalogue call to action. |
| About | `components/About.tsx` | Original I.M.E. story, identity links, founder credit, and currently unavailable-contact indicator. |
| Connect | `components/Connect.tsx` | Original social-link grid, identity badge, external social URLs, and unavailable-contact tooltips. |
| Footer | `components/Footer.tsx` | Original copyright treatment, supplemented only with the required visible creator credit “Inolofatseng Mokgoko”. |
| AudioGuide | `components/AudioGuide.tsx` | Original browser-speech narration, playback and pause states, speed controls, section selection, read-along controls, floating trigger, and subtitle/read-along bar. It is copied unchanged apart from import-path adaptation required by the host application. |
| ImeAssistant | `components/ImeAssistant.tsx` | Original left-floating trigger, unread indicator, animated 350px chat panel, streaming-message treatment, external-link rendering, quick FAQ chips, and input controls. Its visible brand becomes `Icynigma.ai` exactly as required; its original visual behavior and knowledge base remain intact. |

## Video experience

| Original source file | Original responsibility | Rebuild treatment |
| --- | --- | --- |
| `components/video/VideoTemplate.tsx` | Full-screen, timed five-scene motion composition with a background treatment and scene transitions. | Preserved at `/video`. |
| `components/video/video_scenes/Scene1.tsx` | Opening scene. | Retained intact. |
| `components/video/video_scenes/Scene2.tsx` | Services scene. | Retained intact. |
| `components/video/video_scenes/Scene3.tsx` | First beats scene. | Retained intact. |
| `components/video/video_scenes/Scene4.tsx` | Second beats scene. | Retained intact. |
| `components/video/video_scenes/Scene5.tsx` | Closing scene. | Retained intact. |
| `lib/video.ts` | Video-player timing and scene progression hook. | Preserved to maintain original timing and controls. |

## Supporting source modules

| Category | Original files retained |
| --- | --- |
| Site utilities | `hooks/use-mobile.tsx`, `hooks/use-toast.ts`, `lib/utils.ts`, `index.css`. |
| Shared UI primitives | `accordion.tsx`, `alert-dialog.tsx`, `alert.tsx`, `aspect-ratio.tsx`, `avatar.tsx`, `badge.tsx`, `breadcrumb.tsx`, `button-group.tsx`, `button.tsx`, `calendar.tsx`, `card.tsx`, `carousel.tsx`, `chart.tsx`, `checkbox.tsx`, `collapsible.tsx`, `command.tsx`, `context-menu.tsx`, `dialog.tsx`, `drawer.tsx`, `dropdown-menu.tsx`, `empty.tsx`, `field.tsx`, `form.tsx`, `hover-card.tsx`, `input-group.tsx`, `input-otp.tsx`, `input.tsx`, `item.tsx`, `kbd.tsx`, `label.tsx`, `menubar.tsx`, `navigation-menu.tsx`, `pagination.tsx`, `popover.tsx`, `progress.tsx`, `radio-group.tsx`, `resizable.tsx`, `scroll-area.tsx`, `select.tsx`, `separator.tsx`, `sheet.tsx`, `sidebar.tsx`, `skeleton.tsx`, `slider.tsx`, `sonner.tsx`, `spinner.tsx`, `switch.tsx`, `table.tsx`, `tabs.tsx`, `textarea.tsx`, `toast.tsx`, `toaster.tsx`, `toggle-group.tsx`, `toggle.tsx`, and `tooltip.tsx`. |

## Original media and metadata

| Category | Original files |
| --- | --- |
| Attached images | `1764081159129_1780890871781.png`, `20251120_014717_1780890871806.jpg`, `20260115_013226(1)_1780890871762.jpg`, `41smXfAQgjL._AC_UF1000,1000_QL80__1780890871830.jpg`, `Area_51_Wallpaper_1780890871799.jpg`, `Crazy_night_edited_1780890871824.jpg`, `STK-20241113-WA0002_1780890871837.webp`, `Screenshot_20260417_040528_1780890871736.jpg`, `Screenshot_20260417_040627_1780890871747.jpg`, `Screenshot_20260417_040859_1780890871654.jpg`, `Screenshot_20260417_040949_1780890871671.jpg`, `Screenshot_20260417_041014_1780890871663.jpg`, `Screenshot_20260417_041023_1780890871706.jpg`, `Screenshot_20260417_041418_1780890871720.jpg`, `Screenshot_20260417_041722_1780890871647.jpg`, and `astronaut_edited_1780890871817.jpg`. |
| Attached video | `20260115_013420_1780890871770.mp4` and `20260527_024359_1780890871626.mp4`. |
| Original public images | `public/images/crystal.png`, `public/images/soundwaves.png`, and `public/images/studio-bg.png`. |
| SEO and browser files | `public/favicon.svg`, `public/opengraph.jpg`, `public/robots.txt`, and the original document head in `index.html`. These are retained without content changes, except for the additional creator-credit metadata required by the user. |

## Original interaction cross-check

| Area | Original behavior that must be retained |
| --- | --- |
| Header motion | The centre logo runs a seven-second dance, flashes out, appears at the I.M.E. position after 7.6 seconds, leaves after 9.5 seconds, returns to the centre at 10 seconds, and repeats the cycle every 12 seconds. The header gains blur and a lower border after 50px of scrolling. |
| Navigation | Desktop links point to `#home`, `#services`, `#beats`, `#about`, and `#contact`. The mobile toggle opens a vertically animated menu and closes it after a link is selected. |
| Anchor and external links | Hero calls to action use section anchors. Beat cards and the catalogue use their original Voloco destinations. Social and identity controls preserve their original external destinations and unavailable states. |
| Audio guide | The original guide uses the browser Speech Synthesis API with selectable narration sections, play/pause, rate changes, state-driven controls, and visible read-along feedback. |
| Assistant | A user message is appended with a streaming assistant placeholder. The original UI reads server-sent `data:` chunks progressively, handles cancellation and failure text, scrolls to the latest message, and exposes five quick questions until the conversation advances. |
| Video | The video shell switches through Scene1, Scene2, Scene3, Scene4, and Scene5 using the source player hook and animated scene mounting. |

The rebuilt project will preserve this inventory, retain original textual content and layout order, and use only production-hosted copies of the supplied original media assets.
