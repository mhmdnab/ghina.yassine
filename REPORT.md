# REPORT: Dr. Ghina Yassine Dental Clinic demo site

Last updated: 2026-10-08, end of Phase 1.

Status: **Phase 1 done with Google Maps assets only (no Instagram yet). Waiting for your
go-ahead on the image plan and palette before Phase 2.**

---

## Completed

### Phase 0: Setup and asset intake

- Next.js 16.4 (App Router) + TypeScript + Tailwind CSS 4 + ESLint scaffold. Default starter
  page still in place until Phase 2. `npm run build` passes.
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

---

## Assets used

Nothing is on the page yet (Phase 2 builds it). Processed and ready:

| Output (`public/images/`) | From | Planned section | Credit shown |
| --- | --- | --- | --- |
| `dr-ghina-portrait-coral` (1600x2400) | maps-07.jpg | Hero | Photo: Dr.ghina yassine clinic, Google Maps |
| `dr-ghina-portrait-treatment-room` (1600x2400) | maps-06.jpg | About | Photo: Dr.ghina yassine clinic, Google Maps |
| `reception` (1024x768) | maps-03.jpg | Anxious patients, gallery | Photo: Darine Ali, Google Maps |
| `reception-desk-logo` (1200x800, cropped) | maps-04.jpg | Gallery (optional) | Photo: Mona Itani, Google Maps |
| `building-exterior` (548x1104, cropped) | maps-05.jpg | Location | Photo: Dr.ghina yassine clinic, Google Maps |
| `smile-closeup` (1600x900) | maps-01.jpg | Services (optional, consent-gated) | Photo: Dr.ghina yassine clinic, Google Maps |
| `smile-red-lips` (1600x1859) | maps-02.jpg | Not planned | Photo: Dr.ghina yassine clinic, Google Maps |
| `smile-red-lips-2` (1600x1859) | maps-09.jpg | Not planned | Photo: Dr.ghina yassine clinic, Google Maps |
| `public/brand/*` | logo-from-google-profile.jpg | Header, footer, icons | n/a (her logo) |

---

## Placeholders

No site copy exists yet. `[CONFIRM]` items recorded so far:

| Item | Where |
| --- | --- |
| Which dental esthetics treatments | `data/services.json` → `confirmed[dental-esthetics].unknown` |
| Which facial esthetics treatments | `data/services.json` → `confirmed[facial-esthetics].unknown` |
| Kids: from what age, which treatments | `data/services.json` → `confirmed[kids].unknown` |
| Which general treatments | `data/services.json` → `confirmed[general].unknown` |
| Check-ups/cleaning, fillings, root canal, crowns/bridges, implants, orthodontics/aligners, whitening, veneers, emergencies | `data/services.json` → `placeholders` |
| Portraits are Dr. Ghina | `data/assets.json` → flags on both portraits |
| Dr. Ghina's training, degrees, years in practice, memberships | Phase 2 About section |
| Team names and roles | Phase 2 (none will be shown) |

---

## Deferred / not done

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
- **Kids section has no image of children** and none will be created. Uses icons or her
  portrait.
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
- Booking: is WhatsApp the preferred channel? Who answers it?
- Do you want Arabic and/or French versions?
- Domain: do you own one already? Preferred name?
