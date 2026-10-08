# Dr. Ghina Yassine Dental Clinic: demo site

Static Next.js (App Router) + TypeScript + Tailwind CSS site, deployable to Vercel.
Build progress, asset sources, placeholders and open questions live in [REPORT.md](./REPORT.md).

## Commands

```bash
npm install
npm run dev          # local dev server on http://localhost:3000
npm run build        # production build
npm run lint
npm run fetch:maps   # pull Google Maps listing data and photos (needs an API key)
```

## Google Maps data

1. Copy `.env.example` to `.env.local` and set `GOOGLE_MAPS_API_KEY`
   (Google Cloud project with "Places API (New)" enabled and billing active).
2. Run `npm run fetch:maps`. It writes:
   - `data/place.json`: full Place Details response
   - `data/reviews.json`: reviews (original text, rating, author, photo, relative time)
   - `data/photo-attributions.json`: each photo's author attributions, keyed by filename
   - `assets-raw/maps/maps-NN.jpg`: listing photos at max 1600px wide

`.env.local` is git-ignored. Never commit the key.

## Folders

```
assets-raw/
  instagram/   drop her Instagram images (and optional captions.txt) here
  logo/        drop her logo here
  maps/        filled by npm run fetch:maps
data/          JSON data used by the site
scripts/       data and asset scripts
src/app/       the site
```
