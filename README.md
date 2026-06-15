# theselftape.com — Next.js rebuild

Marketing + booking site for The Selftape (Sherman Oaks), replacing the legacy
Wix site. Next.js 14 (App Router) + Tailwind, deploys to Vercel.

## Quick start

```bash
npm install
npm run dev   # http://localhost:3000
```

## Structure

```
app/
  layout.tsx        fonts, default metadata, JSON-LD, header/footer shell
  page.tsx          homepage (viewfinder hero, services, pricing, funnel)
  self-tapes/       primary money page
  demo-reels/  headshots/  pricing/  about/  contact/  book/
  sitemap.ts robots.ts not-found.tsx icon.svg
components/         Header, Footer, BookCta, AiFunnelBanner, JsonLd
lib/business.ts     ★ SINGLE SOURCE OF TRUTH — NAP, pricing, links
next.config.mjs     ★ 301 redirect map from old Wix slugs
```

**Rule:** never hardcode the address, phone, prices, or external links in a
page. Edit `lib/business.ts` and everything (including the LocalBusiness
schema) updates together. This is what keeps the NAP consistent for local SEO.

## TODO before launch

- [ ] **Confirm pricing** in `lib/business.ts` — current numbers come from the
      old Wix `/price_list` page and look like 2012-era rates.
- [ ] **Replace testimonial placeholders** in `lib/business.ts` with real
      quotes (Google reviews / Yelp). Do not ship the bracketed placeholders.
- [ ] **Booking embed** on `/book` — Cal.com or Calendly (instructions in
      `app/book/page.tsx`). Must be live before DNS cutover.
- [ ] **Studio hours** — `lib/business.ts` (`hours`) + the two "by
      appointment" mentions on home/contact.
- [ ] **Verify map pin** — `BUSINESS.geo` coordinates are approximate.
- [ ] **WeHo sister studio link** — `BUSINESS.sisterStudio.url` (the mention
      renders only once a URL exists).
- [ ] **selftape.ai URL + copy** — `BUSINESS.app` and `AiFunnelBanner.tsx`.
- [ ] **Photos** — add real studio shots to `/public` and into the pages;
      then create `/public/og.jpg` (1200×630) for social sharing.
- [ ] Read through every service page and fix any claim that isn't accurate —
      copy was written from the old site plus reasonable assumptions.

## Launch sequence (Wix → Vercel)

1. **Now, on Wix (already discussed):** turn indexing ON, delete the keyword
   blocks and dead content. The site should be earning while you build.
2. **Deploy a preview:** push to GitHub → import to Vercel. QA on the
   `*.vercel.app` URL — mobile, every page, every link.
3. **Booking live:** finish the `/book` embed and run one real test booking
   with payment.
4. **Google Search Console:** add a **Domain property** for `theselftape.com`
   verified via DNS TXT record (survives the platform switch; the old
   Wix meta-tag verification won't).
5. **DNS cutover:** in Vercel add `theselftape.com` + `www.theselftape.com`,
   then update the A/CNAME records at your registrar per Vercel's
   instructions. Keep the Wix subscription a few days as a rollback.
6. **Verify redirects** (see below), then submit `sitemap.xml` in GSC and
   request indexing on the homepage and `/self-tapes`.
7. **Google Business Profile:** confirm the Sherman Oaks address/phone match
   `lib/business.ts` exactly, set the website to `https://www.theselftape.com`,
   add fresh photos, and start asking taping clients for reviews — this is
   the single biggest local-ranking lever you have.

## Verify redirects after cutover

```bash
for p in price_list plans-pricing book-online appointments video-services \
         grid video_reel photography who-we-are testimonials blank \
         selftape-tv community-forum casting; do
  echo -n "/$p → "
  curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" "https://www.theselftape.com/$p"
done
```

Every line should show `308` or `301` with the new destination.

## SEO already baked in

- Per-page titles/descriptions targeting "self tape studio los angeles /
  sherman oaks" + service terms; canonical URLs; `metadataBase`.
- `LocalBusiness` JSON-LD fed from `lib/business.ts`.
- `robots.ts` (index everything — the old site shipped `noindex`!),
  `sitemap.ts`, semantic single-`h1` pages, 301 map for legacy URLs.
- Fast by construction: server components, no client JS beyond the nav
  toggle, system-optimized Google fonts via `next/font`.

## Post-launch ideas

- A small `/guides` section ("how to self-tape at home", "current casting
  framing specs") — ranks for actor queries and feeds the selftape.ai funnel.
- Service-area page for "Studio City / Valley Village self tapes" if GBP
  traction is slow.

## Animation system (v2)

One dependency: `framer-motion`. The shared vocabulary lives in `lib/motion.ts`
(easing + variants) so every section moves the same way.

| Layer | File | What it does |
| --- | --- | --- |
| Slate intro | `components/Preloader.tsx` | Clapper snaps shut, REC blinks, wipe up. Once per session. |
| REC HUD | `components/Hud.tsx` | Live timecode (bottom-left) + scroll scrubber (top) — the site "records" the visit. |
| Page transitions | `app/template.tsx` | Every route enters like a cut to a new take. |
| Film grain | `.grain` in `globals.css` | Fixed 5%-opacity noise overlay. |
| Scroll reveals | `components/Reveal.tsx` | Staggered fade-up on every section. |
| Spotlight cards | `components/SpotlightCard.tsx` | Tungsten glow tracks the cursor; hover lift. |
| Magnetic CTAs | `components/Magnetic.tsx` | Primary buttons lean toward the cursor. |
| Key light | `components/Hero.tsx` | Hero gradient follows the mouse like a warm key. |
| AI reader demo | `components/AiDemo.tsx` | Typewriter scene loop selling selftape.ai. |
| Marquee / CountUp | `components/Marquee.tsx`, `CountUp.tsx` | Ticker strip; years-of-tapes counter. |

**Every effect is gated on `prefers-reduced-motion`** — reduced-motion users
get the full site, statically. The global CSS kill-switch in `globals.css`
backs up the per-component `useReducedMotion` checks.

## selftape.ai on this domain

`/selftape-ai` is a full landing page (in nav, sitemap, with
`SoftwareApplication` JSON-LD) targeting "AI self tape app" / "AI scene
partner" queries. It funnels out to the app and reverse-funnels LA visitors
back to `/book`. Additional TODOs:

- [ ] Confirm the three feature claims on `/selftape-ai` match the live app.
- [ ] Swap the demo scene in `components/AiDemo.tsx` for real app content.
- [ ] Confirm `BUSINESS.app.url` + UTM params in `lib/business.ts`.

## v3 — selftape.ai palette + cinematic scroll

**Palette** now matches the app: `void #0A0A0F` background, `electric #4D7CFF`
indigo accent, `violet #8B5CF6` gradient companion, neon glow. All tokens in
`tailwind.config.ts`; `record` red is kept only for the REC dot. The old warm
"tungsten" scheme is fully removed.

**New cinematic scroll layer (all reduced-motion safe):**

| Component | Effect |
| --- | --- |
| `Aurora.tsx` | Fixed drifting electric/violet glow blobs behind everything; parallax with scroll. |
| `PinnedCreds.tsx` | **Signature moment** — a 400vh section that pins while scrubbing through 4 credential beats (original studio / NYT / 100k tapes / series-regular readers). |
| `ScrollReveal.tsx` | Opacity+Y+scale locked directly to scroll position (the NYT pull quote). |
| `Parallax.tsx` | Depth wrapper; the AI demo recedes as you scroll. |

**Credentials baked into copy + schema:** "The Godfather of Selftape" (NYT),
the original studio, 100,000+ tapes, one working CD + series-regular readers.
The `BUSINESS.creds` object in `lib/business.ts` holds these as data.

> Note on the NYT quote: it's corroborated across Jason's public bio and client
> reviews, but if you have the original article link/date, add it so the
> citation is airtight.

## Photos

Real photos go in `public/photos/`, replacing the labeled placeholders:

| File | Used on | Suggested shot |
| --- | --- | --- |
| `studio-1.jpg` | About | The taping room / Jason in studio |
| `studio-2.jpg`, `studio-3.jpg` | (spare slots) | Studio details / wide |
| `panel-1.jpg` | Home (founder), About | Jason speaking on a panel |
| `panel-2.jpg` | Home (founder), About | Jason hosting / with the industry |

Convert HEIC → JPEG on any Mac (no install needed):
```bash
for f in *.HEIC; do sips -s format jpeg -Z 1600 "$f" --out "${f%.HEIC}.jpg"; done
```
Keep the same filenames (or update the `src` props). `PhotoFrame` parallaxes
the image inside its frame on scroll and renders viewfinder brackets.

## Press / credentials

- **NYT**: "The Godfather of Selftape," The New York Times, Aug 30, 2019 —
  linked from the homepage pull quote (`BUSINESS.creds.nytUrl`). Article is
  paywalled; the link lets readers verify.
- **99 Actors Day 2.0** (Nov 2012): Jason appeared in the industry lineup
  hosted by Risa Bramon Garcia, alongside casting directors Randi Hiller and
  Marci Liroff and actors Clark Gregg and Keith David. Stored in
  `BUSINESS.panel`, shown on the homepage founder section. Framed as factual
  co-billing, not endorsement.

## Photos — current status (v5)

- ✅ `nyt-feature.jpg` — the framed NYT article, LIVE in the homepage press
  section ("As featured in" + the cited quote + link).
- ⏳ Still placeholders, waiting on conversion of the **two portraits of Jason**:
  - `panel-1.jpg` ← the **99 Actors Day stage shot** (Jason speaking)
  - `panel-2.jpg` ← the **Skybar industry-event shot** (Jason in the suit)
  - `studio-1/2/3.jpg` ← any studio interior shots (optional)

Convert just those two on a Mac and keep these names:
```bash
sips -s format jpeg -Z 1600 STAGE.HEIC --out panel-1.jpg
sips -s format jpeg -Z 1600 SKYBAR.HEIC --out panel-2.jpg
```
Drop into `public/photos/`, overwriting the placeholders. They appear instantly
in the homepage founder section and the About gallery.

## NYT citation — verified against the source

Headline: "Shh, Honey. I'm Auditioning Here." by Melissa Errico, NYT Theater,
print Sept 1, 2019 (online Aug 30). The article calls Jason "the godfather of
self-taping." Per Jay's direction the site uses the stylized "The Godfather of
Selftape," attributes to "The New York Times, 2019," and links the article.
Note: the 2019 piece quotes "just crossed over 10,000 self-tapes"; the site
states 100,000+ (today's figure) per Jay.

## IMDb credits (v6)

Jason's public IMDb (`imdb.com/name/nm2766232/`) is now cited on the homepage
founder section and the About page — naming X-Men: First Class, A Good Day to
Die Hard, and Date Night, linked out to the profile. Also added to the
LocalBusiness JSON-LD as the founder's `sameAs` for entity recognition.
Stored in `BUSINESS.creds.imdbUrl` / `imdbCredits`.

Founding year confirmed: **2008** (per Jay). Note other dates appear across the
old web presence (2011, "~6 years ago in 2017") — 2008 is the chosen canonical.

## Booking — Cal.com (v7)

### Setup (do this before DNS cutover — Wix Bookings dies with the old site)

1. **Create a Cal.com account** at cal.com — free tier is fine to start.
2. **Create three event types:**
   - `30-min-self-tape` — 30 min, price $50
   - `60-min-self-tape` — 60 min, price $75
   - `demo-reel-edit` — 60 min blocks, price $75/hr
3. **Set your Cal.com username** in `components/BookingEmbed.tsx` line 1:
   ```ts
   const CAL_USERNAME = 'theselftape'; // ← your actual username
   ```
4. **Enable Stripe** on each event (Apps → Stripe → connect) so bookings
   require payment upfront.
5. **Set availability** in Cal.com to match your actual studio hours.
6. Run `npm install` — this pulls in `@calcom/embed-react` for the first time.

### What's built

- Tabbed UI: 30-min tape / 60-min tape / demo reel — each tab switches the
  embedded Cal calendar to the right event type.
- Animated tab indicator (Framer spring) + animated event-detail panel.
- Auto-scroll bug fix: Cal's embed focuses itself on load which browser-scrolls
  to it. Fixed with a temporary `scroll-margin-top: 9999px` that resets after
  1.2s.
- Dynamic import so the Cal library never runs server-side (avoids SSR errors).
- Session packs section below the embed with email CTA.
- Studio logistics: what to bring, good-to-know, directions link.
- selftape.ai reverse funnel at the bottom.

## Digishot 3D/AR demo (v9)

The Digishot section on the homepage features a live, interactive 3D scan
of an actor using Google's `<model-viewer>` web component. The library is
lazy-loaded from CDN, and the model file is only fetched when the section
scrolls into the viewport (IntersectionObserver, `rootMargin: 200px`).

**Files:**
- `components/DigishotViewer.tsx` -- the lazy-mount, scan-loading-state viewer
- `public/digishot-demo.usdz` -- the demo scan (6 MB)
- `types/model-viewer.d.ts` -- TypeScript declarations for the custom element

**How AR works on each platform:**
- **iOS Safari**: tap the model -> native AR Quick Look opens (camera AR)
- **Android Chrome (ARCore)**: hands off to Scene Viewer
- **Desktop / unsupported devices**: model rotates and can be dragged in 3D

**Swapping the demo model:**
Replace `public/digishot-demo.usdz` with any USDZ scan. Update the `label`
prop on the homepage to match the actor's name. For best results across all
platforms, also export a `.glb` and update `DigishotViewer` to accept both
`src` (glb) and `ios-src` (usdz) -- model-viewer auto-picks the right one.

**Size note:** The 6 MB USDZ ships in the repo right now. For production you
might prefer to host the model on a CDN (Cloudflare R2, AWS S3) and update
the `src` to that URL -- keeps the deploy bundle smaller. Not urgent; Vercel
handles 6 MB static assets fine.

## v10 -- Render fix (invisible content bug)

**Symptom:** hero (and below-fold sections) showed the viewfinder brackets and
slate bar but the headline, buttons, and cards were invisible -- a large empty
dark panel.

**Cause:** components relied on Framer Motion parent->child *variant string*
propagation (`initial="hidden"` on a parent, `variants={fadeUp}` on children
expecting the parent to broadcast `"show"`). When the parent's show state
didn't resolve, children stayed at `opacity: 0` permanently.

**Fix:** every animated element now triggers its own entrance independently --
`initial` + `animate` (hero) or `initial` + `whileInView` (Reveal Items,
SpotlightCards). No element depends on a parent broadcasting a variant state,
so nothing can get stuck hidden. Scroll-scrubbed reveals (SceneReveal,
ScrollReveal) now complete their opacity ramp early (~60-62% of scrub) so
content is never left dimmed if you stop scrolling mid-section.

## v12 -- 3D depth scroll + clapboard removed

**Clapboard preloader: removed.** `Preloader.tsx` deleted and unwired from the
layout. Site loads straight into the hero.

**New section animation: `Scene3D`.** Replaces the old fade/wipe reveals
(SceneReveal, ScrollReveal -- both deleted). Each homepage section below the
hero is wrapped in `<Scene3D>`, which drives it through z-space on scroll:

  - enters from the bottom rising forward out of depth, tilted back
  - sits flat and fully opaque when centered (the resting frame)
  - recedes back "into itself" as it scrolls up and the next pane comes forward

Reads like panes of glass moving through a tunnel. Built on `transformPerspective`
+ `rotateX` + `z` + `scale`, spring-smoothed, scrubbed to scroll position.
Opacity stays full across the whole center band so content never gets stuck dim.
Disabled under prefers-reduced-motion (renders static).

`Scene3D` accepts an `intensity` prop (default 1) to dial the depth per section.

**Important constraint:** never wrap a `position: sticky` section in Scene3D --
a transformed ancestor breaks sticky. `PinnedCreds` is intentionally left
unwrapped for this reason.

**Digishot viewer reworked.** USDZ can't render in a desktop 3D viewer (it's an
iOS AR format; model-viewer needs GLB). The section is now a CSS/SVG animated
"scanner" -- wireframe head silhouette, sweeping scan line, depth points, mesh-
stat HUD -- that tilts with scroll. The "View in AR" button still opens the real
USDZ in native iOS AR Quick Look. No external library, no load-failure state.

## v13 -- Camera rig + full NYT article

**"As seen in" now shows the full, uncropped article.** Replaced the cropping
PhotoFrame with a plain framed `<img>` (object natural ratio) on both the
homepage and About page, so the entire framed NYT page is visible. PhotoFrame
component removed (no longer used anywhere).

**New signature animation: `CameraRig`.** A fixed, full-viewport SVG camera
lens lives behind all content. Driven by a cosine wave over scroll progress
(`SECTIONS = 8`), it:

  - **assembles + locks focus** at each section center -- aperture blades pull
    in to form a tight focus ring, barrel rings nest, a focus reticle sharpens
  - **disassembles** between sections -- blades fling outward and fan, rings
    separate and fade

So as you scroll, the camera literally comes apart and reassembles for each
section, focusing on the content like you're the subject in front of the lens.
Barrel and iris counter-rotate continuously; the whole rig drifts slowly.

Layering: Aurora (z-0) -> CameraRig (z-2) -> content (z-10). Transparent
sections let the lens show through; `bg-panel`/`bg-void` sections occlude it
(reads as the lens being behind them). Disabled under prefers-reduced-motion.

Tuning knobs in `components/CameraRig.tsx`: `SECTIONS` (focus pulse count),
`BLADE_COUNT`, the `opacity-60` on the SVG, and the `[0,1]` ranges in `Blade`
/ `Ring` for how far things travel between locked and apart.

## v14 -- Lens glass + the journey

**Full NYT article image.** `nyt-feature.jpg` replaced with the complete
framed page (the photo-grid + "Shh, Honey. I'm Auditioning Here." layout).
Both homepage and About show it uncropped.

**Glass reflection on the camera lens.** `CameraRig` now has a glass element:
a radial dome sheen + a soft specular crescent (upper-left) that brighten as
the lens locks focus, plus a bright glare band that sweeps across the glass as
you scroll. Clipped to the lens circle so it reads as light on curved glass.

**`JourneyToSet` -- "from self-tape to series regular."** A new pinned scroll
sequence (between Stats and Pricing). A single actor figure stays centered
while the world levels up around them across four scrubbed SVG scenes:

  01 bedroom self-tape -> 02 the studio -> 03 the callback -> 04 series regular on set

Each scene cross-fades with its stage caption, with a progress scrubber. Built
as pure inline SVG (no assets). Reduced-motion -> a clean stacked list of all
four stages. Like PinnedCreds, it uses `position: sticky` so it is NOT wrapped
in Scene3D.

To customize the scenes, edit the `SceneBedroom/Studio/Callback/Set` functions
in `components/JourneyToSet.tsx` -- each draws into a 320x240 viewBox.

## v15 -- Messaging

Three taglines, each placed where it works hardest:

- **Hero headline:** "Audition panic ends here." (emotional hook, "ends here"
  in the gradient). Eyebrow keeps the credential: "The original self-tape
  studio - Sherman Oaks, LA". Subhead leads with the actor's pain point
  (sides due in the morning).
- **selftape.ai section + page:** "We defined self-taping in 2008. We're
  redefining it in 2026." -- the bridge from legacy to the AI product.
- **SEO:** title tag stays keyword-first ("Self Tape Studio Los Angeles");
  meta description now opens with "Audition panic ends here." for click appeal
  without losing the keyword.

## v16 -- Realistic camera iris

Removed the glass dome / specular / glare-sweep reflection (overshot the brief).

`CameraRig` now reads like a real photographic lens:
- **Machined barrel**: three concentric rings + 72 knurling ticks, with engraved
  markings (ZOOM / 105 mm / 24-105 mm 1:4 / LENS) like a real lens barrel.
- **Inner focus ring**: counter-rotating, fine ticks.
- **Iris**: 9 curved leaf blades that overlap into the classic aperture spiral.
  `assembly` 1 = blades swing in and the iris closes to a small opening (locked
  focus); 0 = blades swing out, iris opens wide -- the lens "comes apart"
  between sections and re-stops-down on each.
- Barrel, focus ring, and iris all rotate at different speeds for depth.

Reference: a photographic zoom-lens iris (per Jay's reference images), not a
glassy app icon. Tuning in `components/CameraRig.tsx`: `BLADE_COUNT`, the petal
`d=` path in `Blade`, and the swing range `[-46, 0]`.

## v17 -- Real Digishot 3D/AR + richer palette

**Digishot is now a real interactive 3D product demo.** Jay supplied the GLB
(browser 3D) + USDZ (iOS AR). `DigishotViewer` uses `<model-viewer>` for real:
- **Desktop:** drag to rotate the full-body scan of Michael Galante; slow
  auto-rotate after idle.
- **iPhone:** "View in AR" -> native Quick Look, life-size in the room (USDZ).
- **Android:** Scene Viewer via GLB.
- Lazy-loads library + model only when scrolled near (300px rootMargin),
  with a scan-line loading state and poster fallback.
- CTAs: "Try Digishot" (spectrum gradient) + "See how it works".

Files: `public/digishot-1062.glb`, `public/digishot-1062.usdz`,
`public/photos/digishot-poster.jpg`. Model `1062` = Michael Galante
(client_info.json). To swap models, replace those files + the `name` prop.

**Expanded palette -- matches selftape.ai's spectrum.** Added `cyan #22D3EE`
and `magenta #E84DD8` to the existing electric/violet. New utilities:
`bg-spectrum`, `shadow-glow-cyan`, and a 4-stop `glow-line` / `text-gradient`.
Spectrum now flows through: the camera iris blades (cyan->blue->violet->magenta),
aurora glow blobs, marquee dots, and the Digishot section. No longer all-blue.

## v18 -- Digishot framing, journey removed, real selftape.ai embed

**1. Digishot loads full-body.** Camera pulled back (`camera-orbit 4.2m`,
`field-of-view 30deg`, `camera-target 0 0.9m 0`) and the frame made taller
(`aspect-[3/4.4]`) so Michael loads head-to-toe, not cropped at the torso.

**2. "Self-tape to series regular" journey removed** (JourneyToSet deleted).

**3. selftape.ai now embeds the LIVE app in a phone frame.** Replaced the fake
teleprompter (AiDemo, deleted) with `PhoneFrame`, which iframes the real
selftape.ai inside a phone mockup. Copy updated to the real product
(on-demand scene partner, Scene Intelligence, Actor Brain, best-take selector)
on both the homepage and /selftape-ai.

### IMPORTANT -- selftape.ai embed requires a header change

By default Next.js apps block being iframed. For the live phone embed to work,
**selftape.ai must allow theselftape.com as a frame ancestor.** Add this to
selftape.ai's `next.config.js` headers (or middleware):

```js
async headers() {
  return [{
    source: '/:path*',
    headers: [{
      key: 'Content-Security-Policy',
      value: "frame-ancestors 'self' https://theselftape.com https://www.theselftape.com",
    }],
  }];
}
```

Also ensure selftape.ai does NOT send `X-Frame-Options: DENY/SAMEORIGIN`
(remove it if present -- CSP frame-ancestors is the modern replacement).

Until that ships, `PhoneFrame` auto-detects the block (4s load timeout) and
shows an on-brand fallback card -- real app copy + a working "Open selftape.ai"
button -- so the section never looks broken. Once the header is live, the real
app appears inside the phone automatically.

## v19 -- Headshots -> Digishot, model framing fix

**Digishot full-body framing (reliable fix).** Switched from fixed-distance
metres (which cropped depending on model scale) to model-viewer's
**percentage-based orbit** (`camera-orbit 0deg 90deg 105%`). 105% frames
relative to the model's own bounding sphere, so the full body always fits
head-to-toe with breathing room, regardless of the scan's internal scale.

**Headshots replaced with Digishot site-wide:**
- Nav + footer: "Headshots" -> "Digishot" (anchors to `/#digishot` section).
- Homepage services grid: Headshots card -> Digishot card.
- `/headshots` page deleted; `app/headshots` removed.
- Redirects: `/headshots` and `/photography` -> `/#digishot` (preserves SEO).
- Sitemap: `/headshots` removed.
- Schema + pricing copy: "headshots" -> "Digishot 3D AR scans".
- PRICING.headshots -> PRICING.digishot (points to digishot.co for pricing).

## v20 -- Marquee + lens containment

- **Marquee:** "Headshots" -> "Digishot" in the scrolling ticker (was missed
  in v19).
- **Lens blades contained:** the iris is now clipped to the barrel
  (`clipPath` r=164) so blades never extend past the lens rim. Blade swing
  tightened (-28deg, was -46) and radial travel reduced so the iris opens
  *within* the barrel rather than flinging petals outside it.

## v22 -- Cleaner NYT photo (straight-on scan)

Replaced nyt-feature.jpg with the cleaner straight-on article scan (lighter,
more even, minimal frame -- just a 3%% edge trim). Same path, so the homepage
glow halo + About page pick it up automatically.

## v21 -- Photo crop, glows, real testimonials

- **NYT photo:** re-cropped to the article page (trimmed the black frame,
  re-centered), brightness/contrast nudged for crisp newsprint. Now wrapped in
  a spectrum glow halo on the homepage.
- **Glow under "defined in 2008 / redefining in 2026":** the line now sits on a
  soft spectrum glow pill with a glow-line accent beneath it (and reads in mist
  white instead of red for legibility on the glow).
- **Real testimonials** (replacing placeholders):
  - Jordan Belfi (Entourage · Snow Bride · Nefarious · NCIS: LA)
  - Pooch Hall (Ray Donovan · Chuck · The Game)
  Testimonials section got a heading ("Working actors keep coming back."),
  big quote mark, and name/credit typography split. Auto-flows to the About
  page too. (Jordan's credits verified via search; "is unmatched" typo fixed.)

## v23 -- Phone preview fix + load-at-top fix

**Phone box no longer blank.** PhoneFrame reworked: the on-brand app-preview
card (Audition panic ends here + Upload/Rehearse/Record/Ship + Open button) is
now ALWAYS rendered as the base layer, so the phone always looks intentional.
The live selftape.ai iframe is a progressive enhancement that only fades in
*over* the preview if it genuinely frames (confirmed via cross-origin
SecurityError on load). If selftape.ai blocks framing (current state, until the
frame-ancestors header ships), the preview just stays -- never a blank box.

**Page loads at the top again.** Two causes addressed:
1. `app/template.tsx` now sets `history.scrollRestoration = 'manual'` and
   `scrollTo(0,0)` on mount (unless the URL has an intentional #hash).
2. The selftape.ai iframe got `tabIndex={-1}`, `scrolling="no"`, and a delayed
   (1.2s, post-transition) mount, so a cross-origin frame can't pull the
   parent page's scroll down to the phone section on load.

## v24 -- NYT photo polish + real Yelp reviews

- **NYT photo:** added a black band across the top so the frame border is even
  on all sides; glow halo behind it increased (opacity 25->40, tighter blur,
  -inset-10) for a stronger featured-press feel.
- **Testimonials expanded with real 5-star Yelp reviews** (from the West
  Hollywood Selftape Creative Studios location -- all legit, all Jason-focused,
  glowing only, nothing under 5 stars, no link/attribution to the sold
  location). Now 6 total: the 2 named celebrity quotes (Jordan Belfi, Pooch
  Hall) lead, followed by 4 Yelp reviews credited generically ("Verified actor
  · Yelp · 5 stars"). Homepage shows the 4 strongest; About page shows all 6.
  Yelp quotes lightly cleaned for typos/length only.

## v25 -- Quote attributions + even photo border

- **Two Yelp quotes now attributed** to named actors (per Jay):
  - Kee Chan (Kung Fu · Mortal Engines) -- the "CDs compliment my tape" quote.
  - Maya Stojan (Agents of S.H.I.E.L.D.) -- the "booked a feature" quote.
  Homepage now shows 4 named-actor testimonials (Belfi, Hall, Chan, Stojan);
  the 2 remaining generic Yelp quotes show only on the About page.
- **NYT photo:** rebuilt with an even black border on all four sides (5% of
  width, applied equally) so top/bottom/sides all match.

## v26 -- selftape.ai copy + load-at-top (real fix)

**Copy reworked** (the "Audition panic" line is the hero already, so it's not
repeated here):
- Phone card: title is now just "selftape.ai"; eyebrow "Not in LA? Can't make
  the studio?"; body "Your on-demand reader and scene partner, with Scene
  Intelligence that breaks down your sides and a best-take selector. From sides
  to sent."
- Homepage section headline: "Not in LA? No problem." with matching body, so
  it welcomes remote/out-of-town actors without steering locals away from the
  studio.

**Load-at-top fix (root cause found).** The page was jumping to the Digishot
section on load because of **CSS scroll anchoring** + global `scroll-smooth`:
when the 3D model / iframe loaded below the fold, the browser anchored and
smooth-scrolled the viewport down to the shifting content. Fixes:
- `overflow-anchor: none` on html + body (kills scroll anchoring).
- Removed global `scroll-smooth` (was animating the downward jump).
- `template.tsx` now resets scroll to top on mount + rAF + 200ms + 800ms to
  catch late layout shifts (skipped when there's an intentional #hash).

## v27 -- Button entity, 90-min rate, demo-reel headline

- **Fixed the raw `&nearr;` text** in the "Try selftape.ai" buttons (selftape-ai
  + book pages). Named entity wasn't rendering in JSX; switched to numeric
  `&#8599;` (arrow). Also fixed the "Open in Maps" button on /book.
- **Added a 90-minute self-tape session at $125** ("Heavy sides, multiple
  roles, or extra coaching"). Homepage pricing teaser now shows the three
  sessions (30/60/90) in a clean 3-up; full list on /pricing picks it up too.
- **Demo-reels headline:** "Your best 60 seconds, cut by someone who casts." ->
  "Your best moments, cut by someone who casts."

## v28 -- Load-at-top (deeper fix)

The CSS-level fixes in v26 weren't enough; the jump is caused by async media
elements pulling the viewport toward themselves as they initialize. Addressed
at the source:

- **DigishotViewer:** the `<model-viewer>` now gets `tabindex=-1`, the
  IntersectionObserver is armed only after first paint with a small (120px)
  margin (so the model never mounts on initial load), and a scroll-position
  guard holds the page at its current Y through the model's load window --
  released the instant the user actively scrolls (wheel/touch/key).
- **PhoneFrame:** the live iframe now only attempts to load **after the user's
  first scroll** (was a 1.2s timer that could fire at the top), so a
  cross-origin frame can't pull the page down on initial paint.

If this still jumps, the next diagnostic step is to temporarily disable the
model and iframe to confirm which element is the cause.

## v29 -- Cal.com booking wired

BookingEmbed wired to username **theselftape** (public embed -- no API key
needed; never put a Cal.com API key in the site). Four event types:
- 30-min-self-tape ($50)
- 60-min-self-tape ($75)
- 90-min-self-tape ($125)  ← new
- demo-reel-edit ($75/hr)

**DASHBOARD SETUP STILL REQUIRED** (the code points at these slugs; the slugs
must exist in Cal.com): in cal.com → Event Types → create each with the exact
slug above, set duration + availability, and add Stripe under Payments to
collect a deposit. Until the event types exist, the embed shows Cal's
"not found" page.

## v30 -- Cal.com slugs matched to real event types

Updated calLinks to the ACTUAL slugs Jay created in Cal.com:
- 30min, 60min, 90-min-selftape-session, demo-reel
(Were placeholder guesses 30-min-self-tape etc.)

OPEN QUESTION: events appear under a personal profile AND two teams
(THE SELFTAPE - Sherman Oaks, Theselftape Team). Public URL differs:
personal = cal.com/theselftape/{slug}; team = cal.com/team/theselftape/{slug}.
Need the exact "Copy link" URL from the dashboard to confirm calLink path.
Code currently assumes personal (theselftape/{slug}).

## v31 -- Cal.com URLs confirmed

All four booking links confirmed live on the personal profile:
cal.com/theselftape/{30min,60min,90min,demo-reel}. Booking is wired and ready
(add Stripe per event type in the dashboard to collect deposits).

## v32 -- Booking embed switched to iframe (fixes 404)

The @calcom/embed-react component was throwing "404 Cal Link seems wrong" even
though cal.com/theselftape/30min resolves fine in a browser (verified). Swapped
CalEmbed to a plain iframe of the public booking URL
(https://cal.com/{calLink}?embed=true&theme=dark&layout=month_view) -- same
booking UI, can't 404 since the page is public. Tabs still switch event types
(30min/60min/90min/demo-reel). Removed the React-embed code path; @calcom/embed-
react dep left in package.json (harmless).

## v33 -- Fix unclickable "Open selftape.ai" button

The live iframe layer was stacking above the preview card and intercepting taps
(Safari iframes capture touches even at opacity-0). Re-layered: preview card +
its button are z-10; the not-ready iframe is z-0 (underneath) with
pointer-events-none; the iframe only rises to z-20 (above preview) once the
live app genuinely frames. Button is now always tappable while selftape.ai
blocks framing.

## v34 -- Open selftape.ai button tappable (real culprit)

The actual blocker wasn't the iframe -- it was the glow div behind the phone.
It used `-inset-8` (extends 32px beyond the phone on all sides, including over
the button at the bottom) with NO pointer-events-none, so it silently
intercepted taps. `aria-hidden` doesn't stop clicks. Added
`pointer-events-none z-0` to the glow. Button works now.
