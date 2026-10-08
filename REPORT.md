# REPORT: Dr. Ghina Yassine Dental Clinic demo site

Last updated: 2026-10-08, end of Phase 3.

Status: **Phase 3 polish done and pushed. Vercel deployment NOT done: the connected Vercel
account is not allowed to create projects (403). One-minute manual import steps are under
"Deferred / not done"; everything else is ready to deploy as is.**

---

## Completed

### Phase 0: Setup and asset intake

- Next.js 16.4 (App Router) + TypeScript + Tailwind CSS 4 + ESLint scaffold. Default starter
  page replaced in Phase 2. `npm run build` passes.
- Folders: `assets-raw/{instagram,logo,maps}/`, `data/`, `scripts/`.
- `scripts/fetch-maps.ts` (`npm run fetch:maps`): Places API (New) route as specified.
  Tested, but **not run for real: no API key could be created.**
- `scripts/fetch-maps-browser.ts` (`npm run fetch:maps:browser`): reads the public Google Maps
  listing with headless Chromium and writes the same files. **This produced the current
  data** (run 2026-10-08): listing facts, 5 reviews in their original wording, 9 photos with
  contributor credits, and the clinic's Google profile photo, which is her logo.
- `.env*` and `.env.local` git-ignored; `.env.example` committed with an empty key.

Facts confirmed from the listing: rating **4.9 from 54 reviews** (53 five-star, 1 one-star);
Rubik building, 5th floor, Alfred Naccash, Beirut (plus code VGMC+38); +961 3 698 486;
Monday to Saturday 8 AM to 8 PM, Sunday closed; wheelchair accessible restroom and seating;
"Identifies as women-owned". Google's review topics: dental experience (6), comforting
atmosphere (4), and 2 each for thoroughness, gentle care, clear explanations, excellent work,
cleanliness, trustworthy, patient care, humble.

The 5 reviews (exact text in `data/reviews.json`):

| Reviewer | When | Theme |
| --- | --- | --- |
| ghida kassab | 8 months ago | Professional, friendly, makes sure you're comfortable |
| Karen Ghafary (Local Guide) | 8 months ago | Anxiety: listens, pauses, punctual, never rushed, explains everything, fair prices |
| Maryam Ab | a year ago | Toddler, gentle, "a perfect dentist for kids" |
| sawsan h | a year ago | No longer a nightmare, light and comforting, soothing background music |
| Alia Al hajj | a year ago | Clean and hygienic, good vibes, warm welcome |

### Phase 1: Asset processing

- Viewed every image in `assets-raw/` at full size and categorized it (table below).
- `data/assets.json`: every usable image with source, category, description, suggested
  section, alt text, crop, flags, plus (filled by the script) its Google Maps credit line,
  output sizes and a blur placeholder. Excluded images are listed with the reason.
- `scripts/process-images.ts` (`npm run process:images`): `sharp` converts each entry to WebP
  in `public/images/`: `{id}.webp` (max 1920px wide, never upscaled) and `{id}-card.webp`
  (max 720px wide). 8 images, 16 files, 1.1 MB total. Originals in `assets-raw/` are read
  only; git confirms they are unchanged.
- `scripts/process-logo.ts` (`npm run process:logo`): clean logo set in `public/brand/` and
  app icons (details below).
- `data/design-tokens.json`: proposed palette with WCAG contrast checks, typography, radii.
- `data/services.json`: services backed by evidence, the approach points from reviews, and
  the `[CONFIRM]` list.
- No `captions.txt`, so services come only from her logo text and her reviews (see below).
- New dev dependencies: `sharp` 0.35.5, `potrace` 2.1.8 (with a small type declaration in
  `scripts/types/potrace.d.ts`).

### Asset inventory

| Raw file | Source / contributor | Category | What it shows | Decision |
| --- | --- | --- | --- | --- |
| maps-07.jpg | Maps, clinic account | doctor portrait | Woman in coral scrubs, peach wall, banana leaves; professional shoot | **Use** → `dr-ghina-portrait-coral` (hero) |
| maps-06.jpg | Maps, clinic account | doctor portrait / treatment room | Same woman in lime scrubs on the dental chair, intraoral scanner, playful tooth pin | **Use** → `dr-ghina-portrait-treatment-room` (about, or kids section) |
| maps-03.jpg | Maps, Darine Ali (visitor) | reception | Frosted glass desk with gold logo, oak cabinets, sunflowers | **Use** → `reception` (anxious patients section, gallery) |
| maps-04.jpg | Maps, Mona Itani (visitor) | reception | Desk close-up; also a sign with the **Wi-Fi name and password**, a third-party water flosser display, a cardboard cutout of Dr. Ghina, QR codes | **Use cropped only** → `reception-desk-logo` (optional gallery detail) |
| maps-05.jpg | Maps, clinic account | exterior | Rubik building collage (tower, green wall sign, lobby); looks like the developer's marketing image | **Use cropped** (tower only) → `building-exterior` (location) |
| maps-01.jpg | Maps, clinic account | before/after (result only) | Macro of smooth, even front teeth on black | **Use, consent-gated** → `smile-closeup` |
| maps-02.jpg | Maps, clinic account | before/after (result only) | Editorial smile shot, deep red lips | Processed → `smile-red-lips`; **not planned** (tone) |
| maps-09.jpg | Maps, clinic account | before/after (result only) | Editorial smile shot, deep red lips, compressed | Processed → `smile-red-lips-2`; **not planned** (tone) |
| maps-08.jpg | Maps, Lina Badran (visitor) | before/after (result only) | Patient's lower face, smile with sugar crystals on lips | **Excluded**: not from her own posts |
| owner-profile-photo.jpg | Maps, clinic account | logo | Her logo | Processed as the logo (duplicate of the next row) |
| logo/logo-from-google-profile.jpg | copy of the above | logo | Gold mark, script name, "DENTAL AND FACIAL ESTHETICS" | **Use** → `public/brand/*` |

No Instagram images exist yet. No stock images were used.

Supporting evidence that the portraits show Dr. Ghina: both were uploaded by the clinic's own
Google account, and a life-size cardboard cutout of the same woman stands on the reception
desk in maps-04. Still marked "confirm" until she says so.

### Image plan by section

| Section | Image | Notes |
| --- | --- | --- |
| Hero | `dr-ghina-portrait-coral` | Warm peach and green, matches the palette |
| About Dr. Ghina | `dr-ghina-portrait-treatment-room` | Shows her at work, relaxed |
| For anxious patients | `reception` | "Calm space" visual: oak, sunflowers, soft light |
| For kids | none yet (or `dr-ghina-portrait-treatment-room` if About uses the coral one) | The tooth pin reads as kid-friendly. No photos of children exist, and none will be invented |
| Clinic gallery | `reception`, `reception-desk-logo`, `dr-ghina-portrait-treatment-room` | Thin: only 2 real interior photos. Instagram would fix this |
| Services | `smile-closeup` (optional) | Only if you are comfortable showing a patient's teeth before consent is confirmed; otherwise icons only |
| Hours and location | `building-exterior` | Card size only (low resolution) |
| Header, footer, favicon | `public/brand/logo.svg`, `logo-light.svg`, `src/app/icon.png` | |

Every Maps photo carries a credit line on the site, e.g. "Photo: Darine Ali, Google Maps"
(stored per image in `data/assets.json` → `attribution`).

### Logo

Source: the clinic's Google profile photo, a 1024px JPEG on white. Outputs in `public/brand/`:

- `logo.svg`: vector trace. Gold and ink were separated by colour and traced with potrace at
  4x; the four-point sparkle, which overlaps the tooth in the same gold, was redrawn as a
  vector from measurements so its points stay sharp. Gold gradient uses colours sampled from
  the original.
- `logo-light.svg`: wordmark in cream for dark backgrounds (footer).
- `logo-mark.svg`: gold tooth and implant mark only.
- `logo-1200.png`, `logo-600.png`, `logo-300.png`: transparent PNGs rendered from the SVG.
- `logo-mark-512.png`, `logo-mark-192.png`; `src/app/icon.png` and `src/app/apple-icon.png`
  (gold mark on a cream tile; Next.js picks these up as favicon and touch icon). The
  scaffold's default Next.js `src/app/favicon.ico` was removed so it cannot override them.

It is a cleanup of a raster, not her designer's file: stroke edges are slightly less smooth
than the original at very large sizes. Fine for the demo; ask her for the vector original.

### Proposed palette (full detail in `data/design-tokens.json`)

Soft warm neutrals from the clinic itself (cream walls, oak, stone floor) and one accent: the
honey gold of her logo, which also matches the oak in reception. No clinical blue.

| Token | Hex | Use |
| --- | --- | --- |
| bg (cream) | `#FBF7F1` | Page background |
| surface (porcelain) | `#FFFDF9` | Cards, fields, header |
| sand | `#F3EADF` | Alternate sections |
| line (linen) | `#E6DACB` | Borders |
| text (espresso) | `#2A221D` | Headings, body |
| muted (taupe) | `#6B5E54` | Secondary text |
| accent (honey gold) | `#C9A15A` | Primary buttons with espresso text, stars, icons. Never text on light |
| accentHover | `#BE9550` | Button hover |
| accentStrong (bronze) | `#76522A` | Links, small accent text, focus ring |
| accentSoft (gold tint) | `#F1E4C8` | Badges, chips |
| dark (walnut) | `#2E241E` | Footer |
| darkMuted (oat) | `#CDBFB0` | Secondary text on walnut |

All text pairs pass WCAG AA (body text 14.6:1, muted 5.9:1, bronze links 6.5:1, button text
on gold 6.5:1). Typography proposal: Fraunces (soft serif) for headings, DM Sans for body.

### Services (from `data/services.json`)

Confirmed by her own branding or her patients' reviews:

1. **Dental esthetics**: her logo and reception sign say "Dental and Facial Esthetics"; her
   account posted smile close-ups. Which treatments: `[CONFIRM]`.
2. **Facial esthetics**: same source. Which treatments: `[CONFIRM]`.
3. **Dental care for children, including toddlers**: Maryam Ab's review.
4. **Dental care for adults**: dental clinic listing; reviews mention treatments and a
   "dental care journey". Which treatments: `[CONFIRM]`.

Approach points from reviews (for the anxious patients and kids sections): listens and takes
time, knows when to pause, punctual and never rushed, explains everything, gentle with
children, soothing background music, clean and hygienic, warm welcome.

Everything else stays a placeholder: check-ups and cleaning, fillings, root canal, crowns and
bridges, implants (the logo mark shows an implant, which is not proof she places them),
orthodontics or aligners, whitening, veneers, emergency appointments.

### Phase 2: Build the site

One page (`src/app/page.tsx`), statically prerendered, with a sticky header and smooth-scroll
anchors. All facts come from `data/` (place facts, hours, rating, reviews, image metadata), so
nothing is retyped by hand. Fonts: Fraunces (headings) and DM Sans (body) via `next/font`.
Palette from `data/design-tokens.json` wired into Tailwind in `src/app/globals.css`.

Sections, top to bottom:

1. **Header** (`src/components/Header.tsx`): her traced logo, 7 anchor links (About,
   Services, Gentle care, Kids, Clinic, Reviews, Visit), Instagram icon, "Book on WhatsApp"
   button. Turns solid with a soft shadow on scroll. Below 1024px the links move into a menu
   (Escape closes it, links close it). On phones the header button hides because a floating
   "Book" button takes over.
2. **Hero** (`sections/Hero.tsx`): "Gentle dentistry that *doesn't feel scary.*", subtext
   built from review themes (listens first, explains every step, never rushes), WhatsApp and
   Call buttons, hours and street, her coral portrait in an arched frame with a thin gold arch,
   and a "4.9 on Google, 54 reviews" badge linking to her Maps listing. Photo credit below.
3. **About Dr. Ghina** (`sections/About.tsx`): where the clinic is, what patients describe,
   five "what her patients notice" points (from reviews), treatment-room portrait with credit,
   and two visible `[CONFIRM]` markers for credentials.
4. **Services** (`sections/Services.tsx`): four cards from the confirmed list (adults,
   children, dental esthetics, facial esthetics), each with its own `[CONFIRM]` marker, plus a
   dashed "[CONFIRM: services list]" panel naming what is still unknown. Icons only: the smile
   close-up is behind `SHOW_SMILE_PHOTO = false` until consent is confirmed.
5. **Gentle care / anxious patients** (`sections/GentleCare.tsx`): "You set the pace." Five
   what-to-expect steps built from review themes (listens first, every step explained, pauses,
   on time and never rushed, a calm room with soft music), sawsan h's full review, and Google's
   review topics with counts (comforting atmosphere 4, gentle care 2, clear explanations 2,
   cleanliness 2).
6. **Kids** (`sections/Kids.tsx`): "Gentle visits for little ones", three points (toddlers
   welcome, gentle first, message ahead on WhatsApp), Maryam Ab's full review, a large faint
   gold sparkle from the logo, and a `[CONFIRM]` marker for ages and first-visit details.
7. **Clinic gallery** (`sections/Gallery.tsx`): reception (large), building exterior (tall),
   front desk crop, and an "More on Instagram" tile. Every photo shows its Google Maps credit.
8. **Reviews** (`sections/Reviews.tsx`): rating summary (4.9, 54 reviews, 53 of them five
   stars), Karen Ghafary's review featured large, ghida kassab and Alia Al hajj beside it, and
   "Read all 54 reviews on Google". Each card: stars, "Google review" label, the exact text,
   the author's Google photo, name linked to their profile, and relative time.
9. **Booking** (`sections/Booking.tsx`, `BookingForm.tsx`): name, phone, preferred day (Any
   day or Monday to Saturday), optional reason. Inline validation (focus moves to the first
   problem), a live preview of the exact message, and "Continue on WhatsApp", which opens
   `wa.me/9613698486` with the message prefilled. A fallback link appears in case the popup is
   blocked. No backend; nothing is sent until the visitor presses send in WhatsApp.
10. **Hours and location** (`sections/Visit.tsx`, `OpeningHours.tsx`): weekly hours table
    with today highlighted and an "Open now / Closed now" badge computed in Beirut time in the
    visitor's browser, address, phone, wheelchair access note (from Google Maps), "Get
    directions" (Google Maps directions URL with her Place ID), and a Google Maps iframe embed
    (no API key) that shows her listing card.
11. **Footer** (`Footer.tsx`): light logo, contact, hours, Instagram and WhatsApp icons,
    footer nav, a Google Maps source line, and "Demo by Nexlor".

Plus a **floating WhatsApp "Book" button** on phones (`FloatingWhatsApp.tsx`) and a "Skip to
content" link for keyboard users.

How it was checked:

- `npm run build` (static prerender), `npm run lint` and `tsc` pass.
- Screenshots at 1280px, 768px and 375px: no horizontal scrolling at any width, no console
  errors or failed requests.
- Scripted browser test on a phone viewport: menu opens and closes, header button hidden and
  floating button shown, empty form shows both errors and focuses the name field, a filled
  form opens WhatsApp (`api.whatsapp.com/send/?phone=9613698486&text=...`) with this message:

  ```
  Hello Dr. Ghina, I would like to book an appointment.

  Name: Rana Haddad
  Phone: +961 70 123 456
  Preferred day: Saturday
  Reason for the visit: First visit & a check, please?
  ```
- The map embed was checked separately: it renders her listing card (4.9, 54 reviews).
- Copy check: no em or en dashes in any site copy. The only one on the page is inside Maryam
  Ab's review ("We highly recommend her – she's a perfect dentist for kids!"), left exactly as
  she wrote it because review text is never edited.

Bugs found and fixed while testing: Google's hours use a narrow no-break space ("8\u202fAM"),
which broke the "8:00 AM" formatting and made "Open now" always read "Closed"; the header
button showed on phones because `hidden` lost to the button's own display class; the hero
rating badge overlapped the photo credit at 768px; review avatars failed through the image
optimizer (now served directly from Google, unoptimized, which also works on Vercel).

### Phase 3: Polish and deploy

- **Responsive check** at 375px, 768px and 1280px after every change: no horizontal
  scrolling, no console errors, no failed requests.
- **Animations** (`src/components/RevealOnScroll.tsx`, CSS in `src/app/globals.css`): a calm
  fade and 18px rise as sections, cards and steps enter the screen (0.8s, small staggers on
  card rows). Tested three ways: normal (off-screen elements start hidden and appear on
  scroll), `prefers-reduced-motion: reduce` (everything visible immediately, no movement), and
  JavaScript disabled (everything visible). The hero is never animated so the first paint is
  not delayed. Hidden elements are hidden instantly at load and only transition on the way in.
- **SEO** (`src/app/layout.tsx`): title, meta description, canonical, Open Graph and Twitter
  card tags, theme color. `src/app/opengraph-image.jpg` and `twitter-image.jpg` (1200x630,
  with alt text): logo, headline, "4.9 on Google, 54 reviews", her coral portrait in the
  arch, and the photo's Google Maps credit. Rendered from HTML with the site's own fonts by
  `npm run make:og` (`scripts/make-og-image.ts`). `robots.txt` and `sitemap.xml`.
- **Structured data** (`src/components/StructuredData.tsx`): `Dentist` JSON-LD with name,
  alternate name, URL, logo, images, phone, address, coordinates, map link, opening hours
  (Monday to Saturday 08:00 to 20:00, derived from `data/place.json`), Instagram and Maps as
  `sameAs`. No `aggregateRating`: Google does not allow businesses to mark up reviews about
  themselves for star rich results, so the rating stays visible on the page only.
- **Demo mode is `noindex`** (`src/lib/site-url.ts`): with no `NEXT_PUBLIC_SITE_URL` set, the
  page carries `noindex, nofollow` so the demo never shows up in search next to her real
  listing, with `[CONFIRM]` markers. Setting `NEXT_PUBLIC_SITE_URL` to her real domain at
  launch switches indexing on and adds the sitemap to robots.txt.
- **Accessibility**: every image has alt text (decorative ones are empty and hidden),
  visible focus ring on everything focusable (2px bronze, 6.5:1 on cream), skip link, labelled
  form fields with inline errors, unique navigation labels, all text pairs WCAG AA (see the
  palette table). Lighthouse accessibility: 100.
- **Performance fixes** (first Lighthouse mobile run was 75):
  - Heading font loaded without extra variable axes: preloaded fonts 307 KB to 118 KB.
  - CSS inlined (`experimental.inlineCss`, recommended by Next.js for Tailwind): no
    render-blocking stylesheet request.
  - Logo SVG coordinates rounded (invisible change): 51 KB to 27 KB gzipped; the header now
    uses an optimized PNG of the logo (a few KB).
  - Hero photo no longer requested at high priority (on phones it sits below the headline,
    which is the Largest Contentful Paint).
  - Body font no longer preloaded, so the headline font arrives first; metric-matched
    fallback keeps layout shift at 0.

**Lighthouse** (v13.5, local production build, `next start`):

| Run | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Mobile, before fixes | 75 | 100 | 100 | 100 |
| Mobile, final, launch mode (3 runs) | 95, 96, 94 | 100 | 100 | 100 |
| Desktop, launch mode | 100 | 100 | 100 | 100 |
| Mobile, demo mode (`noindex`) | 91 to 96 | 100 | 100 | 69 |

Final mobile metrics: First Contentful Paint 1.2s, Largest Contentful Paint 2.8 to 3.1s,
Total Blocking Time 50ms, Cumulative Layout Shift 0. The demo-mode SEO score is below 90 only
because of "Page is blocked from indexing", which is the deliberate `noindex` above; every
other SEO check passes. Reports: run `lighthouse` against `npm run build && npm start`.

- **Deploy**: attempted through the Vercel connection (team `moeseccs-projects`). Both
  creating a project linked to `mhmdnab/ghina.yassine` and a direct deployment returned
  `403 forbidden: You don't have permission to create a project`. No Vercel CLI token exists
  in this environment. Not deployed; see Deferred for the manual steps.

---

## Assets used

| Image | From | Where it appears | Credit shown on the page |
| --- | --- | --- | --- |
| `dr-ghina-portrait-coral` | maps-07.jpg (clinic's Google account) | Hero | Photo: Dr.ghina yassine clinic, Google Maps |
| `dr-ghina-portrait-treatment-room` | maps-06.jpg (clinic's Google account) | About | Photo: Dr.ghina yassine clinic, Google Maps |
| `reception` | maps-03.jpg (Darine Ali) | Clinic gallery (large) | Photo: Darine Ali, Google Maps |
| `reception-desk-logo` | maps-04.jpg, cropped (Mona Itani) | Clinic gallery (small) | Photo: Mona Itani, Google Maps |
| `building-exterior` | maps-05.jpg, cropped (clinic's Google account) | Clinic gallery (tall) | Photo: Dr.ghina yassine clinic, Google Maps |
| `smile-closeup` | maps-01.jpg (clinic's Google account) | Not shown (`SHOW_SMILE_PHOTO = false` in Services) | Would show its credit |
| `smile-red-lips`, `smile-red-lips-2` | maps-02.jpg, maps-09.jpg | Not shown | n/a |
| `public/brand/logo.svg` | traced from her Google profile logo | Header | n/a (her logo) |
| `public/brand/logo-light.svg` | same | Footer | n/a |
| `src/app/icon.png`, `apple-icon.png` | same (mark only) | Browser tab, home screen | n/a |
| Review author photos | Google profile photos, hotlinked from `lh3.googleusercontent.com` | Review cards (5) | Author name links to their Google profile |
| Map | Google Maps embed (no key) | Hours and location | Google's own attribution inside the map |
| `src/app/opengraph-image.jpg`, `twitter-image.jpg` | rendered from logo + `dr-ghina-portrait-coral` | Link previews (WhatsApp, social) | "Photo: Dr.ghina yassine clinic, Google Maps" printed on the card |

The anxious-patients section uses a review card instead of the reception photo, so no photo
appears twice on the page. No stock images are used anywhere.

---

## Placeholders

Visible on the page as dashed `[CONFIRM: ...]` markers (`Confirm` component in
`src/components/ui.tsx`). 8 markers in total:

| Marker text | Section | Code |
| --- | --- | --- |
| `[CONFIRM: education, degrees and years in practice]` | About | `src/components/sections/About.tsx:74` |
| `[CONFIRM: professional memberships]` | About | `src/components/sections/About.tsx:75` |
| `[CONFIRM: which treatments, e.g. check-ups, cleaning, fillings]` | Services, adults card | `src/components/sections/Services.tsx:26` |
| `[CONFIRM: from what age, and which treatments]` | Services, children card | `src/components/sections/Services.tsx:32` |
| `[CONFIRM: which treatments]` | Services, dental esthetics card | `src/components/sections/Services.tsx:38` |
| `[CONFIRM: which facial treatments]` | Services, facial esthetics card | `src/components/sections/Services.tsx:44` |
| `[CONFIRM: services list]` (with the list of unconfirmed treatments) | Services, bottom panel | `src/components/sections/Services.tsx:99` |
| `[CONFIRM: from what age she sees children, and what a first visit includes]` | Kids | `src/components/sections/Kids.tsx:64` |

Not shown as markers, still to confirm:

| Item | Where it lives |
| --- | --- |
| The two portraits are Dr. Ghina | `data/assets.json` → flags; used in Hero and About |
| Smile close-up consent | `SHOW_SMILE_PHOTO` in `src/components/sections/Services.tsx:11` |
| Team names and roles | Not on the page at all (nothing invented) |
| Full services list | `data/services.json` → `placeholders` |

---

## Deferred / not done

- **Vercel deployment (blocked)**: the Vercel connection can read the team's projects but
  gets `403` on creating one, so I could not deploy. It takes about a minute by hand:
  1. Open https://vercel.com/new and import the GitHub repo `mhmdnab/ghina.yassine` into the
     `moeseccs-projects` team. Name it e.g. `ghina-yassine-demo`. Framework is detected as
     Next.js; no environment variables needed.
  2. Deploy. The repo's default branch is `claude/kind-ramanujan-ovzhki`, so this first
     deploy is a production deploy and gets `https://ghina-yassine-demo.vercel.app`.
  3. Share that `.vercel.app` URL, not a preview URL: on this team, preview and
     per-deployment URLs redirect to a Vercel login (checked on `flybeirut-concept-demo`:
     its `.vercel.app` URL is public, its deployment URL returns 302 to Vercel SSO). A
     preview link would not open for Dr. Ghina.
  Alternatively, give the connected Vercel account permission to create projects and I can
  deploy and verify it myself.
- **Public GitHub repo**: `mhmdnab/ghina.yassine` is public and contains her photos, the
  reviewers' names and profile links, and the scraped data files. Consider making it private
  (Vercel deploys private repos the same way).
- **Lighthouse on the live URL** not run (no deployment). Local production-build results
  are above; Vercel's CDN typically matches or beats them.
- **`experimental.inlineCss`** is an experimental Next.js flag. If a future Next.js upgrade
  misbehaves, removing it only costs a little first-load speed.

- **Instagram**: not read (login wall from this environment). No Instagram images or
  captions, so the gallery is thin and services are mostly placeholders. Dropping images and
  `captions.txt` into `assets-raw/instagram/` and re-running Phase 1 steps would fill this.
- **Places API route not used** (no key). `npm run fetch:maps` is ready if a key appears.
- **Reviews capped at 5**: Google shows signed-out visitors 5 reviews; the rest need sign-in.
  Not worked around. The 1-star review's content is unknown.
- **Google terms**: scraping and long-term storage of Maps content is restricted. One-off read
  of her own listing for a demo. For launch: her own original photo files, reviews via the
  API or with permission.
- **Consent before any real launch**:
  - `smile-closeup`, `smile-red-lips`, `smile-red-lips-2` show patients' teeth (her uploads).
  - Portraits: confirm they are her and she is happy to use them.
  - `building-exterior` looks like the building developer's marketing photo: confirm use.
  - Visitor photos (`reception`, `reception-desk-logo`) keep their contributor credit.
- **maps-08 excluded**: before/after-type image uploaded by a visitor, not by her.
- **maps-04 uncropped not used**: it shows the clinic Wi-Fi password and a third-party
  product display. Only a desk crop is used.
- **Reception sign missing a letter**: the physical desk sign in maps-04 reads "D NTA AND
  FACIAL ESTHETICS". That close-up is kept small/optional so the demo does not spotlight it.
- **Red-lips smile shots not planned**: dramatic editorial tone clashes with the calm
  direction. Processed in case you want a "smile results" strip.
- **Logo is a trace**, not her vector original.
- **Kids section has no image of children** and none will be created. It uses icons, a
  review and a decorative sparkle.
- **Review details that age**: "8 months ago" / "a year ago" are Google's relative times as
  of 2026-10-08 and will drift. A real launch should pull reviews fresh (API) or show dates.
- **Review author photos are hotlinked** from Google. If a reviewer changes their photo the
  link can break; the card then falls back to an initial only if the URL is missing, not if it
  404s. Fine for a demo.
- **The 1-star review is not shown** (it is not among the 5 Google exposes). The rating
  summary does state "53 of them five stars", so it is not hidden.
- **Map embed** uses the classic no-key `maps.google.com/maps?...&output=embed` URL, which
  Google redirects to its current embed. The official Maps Embed API needs a key.
- **Smooth scrolling** is CSS-only and turns off for `prefers-reduced-motion`.
- **npm audit**: 10 advisories, all in dev tooling, none shipped to the browser: 5 high in the
  ESLint chain (`eslint-config-next` → `fast-glob` → `micromatch` → `braces`) and 5 moderate
  in potrace's old `jimp` (its `phin` HTTP client; the logo script only passes local
  buffers). Left as is.
- Not in scope for this demo: Arabic and French versions, a real booking backend, Vercel
  deployment (Phase 3), Lighthouse pass (Phase 3).

---

## Questions for the client

- Which services do you offer? (check-ups, cleaning, fillings, root canal, crowns, veneers,
  whitening, implants, orthodontics or aligners, emergency visits, anything else?)
- Your logo says "Dental and Facial Esthetics": which facial treatments do you offer?
- For children: from what age do you see them? Anything special you do for little ones?
- Do you want prices on the site, or "contact us for pricing"?
- What should the "About" section say: where you trained, degrees, years in practice,
  memberships?
- Are the two portraits on your Google listing of you? May we use them?
- Team: who works with you, and do they want to be named or pictured?
- Photos: may we use your Instagram and Google Maps photos? Any you would rather we did not?
  Do you have more photos of the clinic (treatment room, waiting area)?
- Smile close-ups and before/after photos: do you have written patient consent to publish
  them on a website?
- The Rubik building photo: is it yours to use, or the developer's?
- Do you have the logo as a vector file (SVG, AI, PDF) from your designer?
- Booking: is WhatsApp the preferred channel? Who answers it? Is the prefilled message
  format OK, or should it ask for something else (e.g. morning or evening)?
- Is "Gentle dentistry that doesn't feel scary" a message you are comfortable with?
- Do you want Arabic and/or French versions?
- Domain: do you own one already? Preferred name? (At launch it goes into
  `NEXT_PUBLIC_SITE_URL`, which also turns search indexing on.)
