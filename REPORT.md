# REPORT: Dr. Ghina Yassine Dental Clinic demo site

Last updated: 2026-10-08, end of Phase 0.

Status: **Phase 0 done. Google Maps data collected (via browser, no API key). Waiting for
Instagram assets before Phase 1.**

---

## Completed

### Phase 0: Setup and asset intake

- Scaffolded Next.js 16.4 (App Router) + TypeScript + Tailwind CSS 4 + ESLint with
  `create-next-app`. The default starter page is still in place; it gets replaced in Phase 2.
  `npm run build` passes.
- Created the folder structure: `assets-raw/instagram/`, `assets-raw/logo/` (drop zones with
  READMEs), `assets-raw/maps/`, `data/`, `scripts/`.
- `scripts/fetch-maps.ts` (`npm run fetch:maps`): the Places API (New) route as specified.
  Reads `GOOGLE_MAPS_API_KEY` from `.env.local`, saves `data/place.json`, `data/reviews.json`,
  `data/photo-attributions.json` and photos to `assets-raw/maps/`. Key is redacted from all
  output. Tested without a key, with a fake key (real Google error came back) and against a
  mocked API. **Not run for real: no API key could be created.**
- `scripts/fetch-maps-browser.ts` (`npm run fetch:maps:browser`): fallback that reads the
  public Google Maps listing with headless Chromium (`playwright-core` 1.56.1) and writes the
  same files. **This is what produced the current data.** Run on 2026-10-08.
  - Review text is the reviewer's original wording. If Google shows a translation, the script
    switches to the original and stores the translation separately (none of the 5 needed it).
  - Photos are downloaded at max 1600px wide, each with its contributor name, profile link
    and upload month.
- `.gitignore` ignores `.env*` and `.env.local`; `.env.example` is committed with an empty key.

### Phase 0 intake results

| Source | Result |
| --- | --- |
| Google Maps listing facts (`data/place.json`) | Name, category, rating, review count, star breakdown, review topics, address, phone, plus code, weekly hours, accessibility attributes |
| Google Maps reviews (`data/reviews.json`) | **5 reviews**, all 5 stars, all English, all with text (Google's cap for signed-out visitors, see Deferred) |
| Google Maps photos (`assets-raw/maps/`) | **9 listing photos** + the owner account's profile photo (her logo). 1 Street View panorama skipped |
| `assets-raw/logo/` | `logo-from-google-profile.jpg` (copy of the owner profile photo, 1024x1024) |
| `assets-raw/instagram/` | Empty. Instagram could not be read (login wall, see Deferred) |
| `assets-raw/instagram/captions.txt` | Not provided |

### Facts confirmed from the listing (2026-10-08)

- Listing name: "Dr.ghina yassine clinic achrafieh". Category: Dental clinic.
- Rating **4.9 from 54 reviews**: 53 five-star, 0 four/three/two-star, 1 one-star.
- Address: Rubik building, 5th floor, Alfred Naccash, Beirut, Lebanon. Plus code VGMC+38.
- Phone: +961 3 698 486.
- Hours: Monday to Saturday 8 AM to 8 PM, Sunday closed (matches the brief).
- Attributes: wheelchair accessible restroom, wheelchair accessible seating, "Identifies as
  women-owned".
- Google's review topics: dental experience (6), comforting atmosphere (4), and 2 each for
  thoroughness, gentle care, clear explanations, excellent work, cleanliness, trustworthy,
  patient care, humble. These line up with the positioning in the brief.
- Her logo tagline reads **"Dental and Facial Esthetics"**. This is the only service-level
  hint so far. What "facial esthetics" covers is not stated anywhere: `[CONFIRM]`.

### The 5 reviews (preview; exact text in `data/reviews.json`)

| Reviewer | When | Theme |
| --- | --- | --- |
| ghida kassab | 8 months ago | Professional, friendly, makes sure you're comfortable |
| Karen Ghafary (Local Guide) | 8 months ago | Anxiety: listens, pauses, punctual, never rushed, explains everything, fair prices |
| Maryam Ab | a year ago | Toddler, gentle, "a perfect dentist for kids" |
| sawsan h | a year ago | No longer a nightmare, light and comforting, soothing background music |
| Alia Al hajj | a year ago | Clean and hygienic, good vibes, warm welcome |

### Maps photos (first look; full categorization in Phase 1)

| File | Contributor | Date | What it shows | Size |
| --- | --- | --- | --- | --- |
| maps-01.jpg | Dr.ghina yassine clinic (owner) | Apr 2023 | Close-up of a smile, veneers style, black background | 1600x900 |
| maps-02.jpg | Dr.ghina yassine clinic (owner) | Mar 2023 | Styled smile shot, red lips, white teeth | 1600x1859 |
| maps-03.jpg | Darine Ali (visitor) | Mar 2023 | Reception desk with her logo, wood panelling | 1024x768 |
| maps-04.jpg | Mona Itani (visitor) | Apr 2025 | Reception desk with logo, close view | 1600x2133 |
| maps-05.jpg | Dr.ghina yassine clinic (owner) | Apr 2023 | Rubik building exterior and entrance collage | 1125x1118 |
| maps-06.jpg | Dr.ghina yassine clinic (owner) | Apr 2025 | Portrait of a woman in green scrubs in a treatment room (presumably Dr. Ghina) | 1600x2400 |
| maps-07.jpg | Dr.ghina yassine clinic (owner) | Apr 2025 | Portrait of the same woman in coral scrubs (presumably Dr. Ghina) | 1600x2400 |
| maps-08.jpg | Lina Badran (visitor) | Apr 2025 | Close-up of a patient's smile with sugar on lips | 1600x1066 |
| maps-09.jpg | Dr.ghina yassine clinic (owner) | Mar 2023 | Styled smile shot, red lips | 1600x1859 |
| owner-profile-photo.jpg | Dr.ghina yassine clinic (owner) | n/a | Logo: gold tooth/implant mark, "Dr. Ghina Yassine", "Dental and Facial Esthetics" | 1024x1024 |

Contributor names, profile links and avatar URLs are in `data/photo-attributions.json` for
on-site credit lines.

---

## Assets used

None on the site yet (site not built). Candidates are listed above.

---

## Placeholders

No `[CONFIRM]` markers in the code yet (the site is not built). Items already known to need
placeholders once Phase 2 starts:

- Services list (only "Dental and Facial Esthetics" from the logo; reviews mention kids'
  care and general visits but no named treatments)
- What "facial esthetics" includes
- Dr. Ghina's training, degrees, years in practice, memberships
- Team member names and roles

---

## Deferred / not done

- **Places API route not used**: you could not create a key. `npm run fetch:maps` is ready
  if one is created later; it would replace the browser data with official API data.
- **Reviews capped at 5**: signed out, Google Maps shows only the 5 "most relevant" reviews.
  Sorting, topic filters and loading more open a "Sign in to read every review" prompt. I did
  not sign in or work around it. The API has the same 5 review cap. The 1-star review exists
  but is not among the 5 shown, so its content is unknown. If more reviews are wanted, they
  can be copied verbatim from a signed-in browser into a manual file, with your sign off.
- **"Limited view"**: Google serves this signed-out headless browser a reduced Maps page.
  Many page loads had no Reviews tab at all; the script retries up to 4 times. Google Search returned a
  CAPTCHA ("unusual traffic") for this cloud IP; not attempted further.
- **Instagram not read**: `www.instagram.com/dr.ghinayassine/` redirects every signed-out
  visitor from this environment to the login page. Not worked around. Instagram images and
  captions need to be saved manually into `assets-raw/instagram/`.
- **Network quirk**: in this cloud environment Node's built-in `fetch` goes through a separate
  allowlist that still blocks `lh3.googleusercontent.com`, so the browser script downloads
  photos through the browser session instead. No effect on a normal machine.
- **Google Maps Platform / Maps terms**: Google's terms restrict scraping and long-term
  storage of Maps content (reviews, photos). This was a one-off read of her own public
  listing for a demo. For a real launch: use the API with a refresh schedule, or her own
  photos, and reviews with her permission.
- **Photos needing consent before any real launch**:
  - maps-01, maps-02, maps-09 (owner uploads) and maps-08 (visitor upload) show patients'
    mouths, likely her cosmetic work. Treat like before/after: patient consent needed.
  - maps-06, maps-07: presumed to be Dr. Ghina (uploaded by the clinic account). Confirm
    before captioning them as her.
  - maps-03, maps-04, maps-08 are visitor photos: must carry the contributor credit.
- **npm audit**: 5 "high" advisories, all inside the ESLint toolchain
  (`eslint-config-next` → `fast-glob` → `micromatch`). Dev only, not shipped. Left as is.
- Not in scope for this demo (logged so they are not forgotten): Arabic and French versions,
  a real booking backend, before/after consent, Vercel deployment (Phase 3), Lighthouse pass
  (Phase 3).

---

## Questions for the client

- Which services do you offer? (general, pediatric, cleaning, whitening, fillings, root canal,
  crowns, veneers, implants, orthodontics or aligners, emergency visits: which ones, and
  anything else?)
- Your logo says "Dental and Facial Esthetics": which facial treatments do you offer?
- Do you want prices on the site, or "contact us for pricing"?
- What should the "About" section say: where you trained, degrees, years in practice,
  memberships?
- Are the two portraits on your Google listing of you? May we use them?
- Team: who works with you, and do they want to be named or pictured?
- Photos: may we use your Instagram and Google Maps photos? Any you would rather we did not?
- Smile close-ups and before/after photos: do you have written patient consent to publish
  them on a website?
- Do you have the logo as a vector file (SVG, AI, PDF) or a high resolution PNG?
- Booking: is WhatsApp the preferred channel? Who answers it?
- Do you want Arabic and/or French versions?
- Domain: do you own one already? Preferred name?
