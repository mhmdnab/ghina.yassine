# REPORT: Dr. Ghina Yassine Dental Clinic demo site

Last updated: 2026-10-08, end of Phase 0.

Status: **Phase 0 done. Waiting for the Google Maps API key and Instagram assets before Phase 1.**

---

## Completed

### Phase 0: Setup and asset intake

- Scaffolded Next.js 16.4 (App Router) + TypeScript + Tailwind CSS 4 + ESLint with
  `create-next-app`. The default starter page is still in place; it gets replaced in Phase 2.
  `npm run build` passes.
- Created the folder structure:
  - `assets-raw/instagram/` (drop zone, with a README explaining the optional `captions.txt`)
  - `assets-raw/logo/` (drop zone, with a README)
  - `assets-raw/maps/` (filled by the fetch script)
  - `data/`, `scripts/`
- Wrote `scripts/fetch-maps.ts` (run with `npm run fetch:maps`, via `tsx`):
  - Reads `GOOGLE_MAPS_API_KEY` from `.env.local`.
  - Calls Place Details (New) for `ChIJR-aCGxgXHxURGSOXHJd8nsg` with the requested field mask
    (plus `languageCode=en`) and saves the full response to `data/place.json`.
  - Saves reviews to `data/reviews.json`: original review text (plus Google's translation
    separately if the original is not English, so we never show edited text), rating,
    author name, author profile URL, author photo URL, relative publish time, exact
    publish time.
  - Downloads every photo at `maxWidthPx=1600` into `assets-raw/maps/maps-NN.jpg` and saves
    each photo's `authorAttributions` to `data/photo-attributions.json`, keyed by filename.
  - Clean errors: missing key, invalid key, API not enabled, per-photo failures (the run
    continues and lists them). The key is redacted from every message it prints.
  - Prints a summary: place name, rating, review count, photo count, failures.
- Verified the script three ways: (1) without a key it stops with a clear message;
  (2) with a fake key it reached the real Google endpoint and reported
  `HTTP 400 INVALID_ARGUMENT: API key not valid`, which also confirms the API is reachable
  from this environment; (3) against a mocked API it wrote all three JSON files and a photo,
  and reported a failed photo with the key redacted.
- `.gitignore` ignores `.env*` and `.env.local` explicitly; `.env.example` is committed with
  an empty `GOOGLE_MAPS_API_KEY=`.
- **`npm run fetch:maps` was NOT run against her real listing: no API key has been added yet.**

### Phase 0 intake results

| Source | Status |
| --- | --- |
| Google Maps (`data/place.json`, `data/reviews.json`, `assets-raw/maps/`) | Not fetched (no API key). 0 photos, 0 reviews. |
| `assets-raw/instagram/` | Empty (only the README) |
| `assets-raw/logo/` | Empty (only the README) |
| `assets-raw/instagram/captions.txt` | Not provided |

Facts available right now (from the brief, i.e. her Google Maps listing): name, type,
address, coordinates, phone and WhatsApp link, hours, rating (4.9 / 54 reviews), Place ID,
Instagram URL.

---

## Assets used

None yet. No images are on the site so far.

---

## Placeholders

No `[CONFIRM]` markers in the code yet (the site is not built). Items already known to need
placeholders once Phase 2 starts:

- Services list (until `captions.txt` or her posts confirm them)
- Anything about Dr. Ghina's training, degrees, years in practice, memberships
- Team member names and roles
- Logo (placeholder wordmark if `assets-raw/logo/` stays empty)

---

## Deferred / not done

- **Google Maps fetch not run**: waiting for `GOOGLE_MAPS_API_KEY` in `.env.local`. Without
  it there are no real reviews and no Maps photos, and the Reviews and Gallery sections
  cannot be built from real content.
- **API limit, reviews**: Place Details (New) returns at most **5 reviews** (Google's "most
  relevant" set), not all 54. The site will show those 5 plus a link to all reviews on
  Google. If more are wanted, the option is copying additional reviews verbatim from her
  listing into a manual file, which needs your sign off since we cannot verify them via API.
- **API limit, photos**: Place Details returns at most **10 photos**.
- **Google Maps Platform terms**: Google's terms restrict storing Places content (reviews,
  photos) long term. Downloading them is fine for a demo, but for a real launch we should
  either refresh them on a schedule / at build time, or replace Maps photos with her own
  photos and use reviews with her permission. Flagged for the launch decision.
- **npm audit**: 5 "high" advisories, all inside the ESLint toolchain
  (`eslint-config-next` → `fast-glob` → `micromatch`). Dev only, not shipped to the browser.
  Left as is; the only fix offered is a forced breaking downgrade.
- Not in scope for this demo (logged so they are not forgotten): Arabic and French versions,
  a real booking backend, before/after consent, Vercel deployment (Phase 3), Lighthouse pass
  (Phase 3).

---

## Questions for the client

- Which services do you offer? (general, pediatric, cleaning, whitening, fillings, root canal,
  crowns, implants, orthodontics or aligners, emergency visits: which ones, and anything else?)
- Do you want prices on the site, or "contact us for pricing"?
- What should the "About" section say: where you trained, degrees, years in practice,
  memberships?
- Team: who works with you, and do they want to be named or pictured?
- Photos: may we use your Instagram photos and the Google Maps photos on the site? Any you
  would rather we did not use?
- Before/after photos: do you have written patient consent to publish them on a website?
- Do you have a logo file (SVG or high resolution PNG)?
- Booking: is WhatsApp the preferred channel? Who answers it?
- Do you want Arabic and/or French versions?
- Domain: do you own one already? Preferred name?
