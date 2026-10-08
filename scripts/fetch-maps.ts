/**
 * Fetches the clinic's Google Maps listing via the Places API (New) and saves:
 *   data/place.json               full Place Details response
 *   data/reviews.json             reviews (text, rating, author, photo, time)
 *   data/photo-attributions.json  authorAttributions keyed by photo filename
 *   assets-raw/maps/*             every listing photo (max 1600px wide)
 *
 * Usage: npm run fetch:maps   (reads GOOGLE_MAPS_API_KEY from .env.local)
 */
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const PLACE_ID = "ChIJR-aCGxgXHxURGSOXHJd8nsg";
const API_BASE = "https://places.googleapis.com/v1";
const FIELD_MASK = [
  "displayName",
  "formattedAddress",
  "nationalPhoneNumber",
  "internationalPhoneNumber",
  "rating",
  "userRatingCount",
  "regularOpeningHours",
  "reviews",
  "photos",
  "googleMapsUri",
  "websiteUri",
].join(",");
const PHOTO_MAX_WIDTH = 1600;

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const MAPS_DIR = path.join(ROOT, "assets-raw", "maps");

type LocalizedText = { text: string; languageCode?: string };

type AuthorAttribution = {
  displayName?: string;
  uri?: string;
  photoUri?: string;
};

type PlaceReview = {
  name?: string;
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: LocalizedText;
  originalText?: LocalizedText;
  authorAttribution?: AuthorAttribution;
  publishTime?: string;
  googleMapsUri?: string;
};

type PlacePhoto = {
  name: string;
  widthPx?: number;
  heightPx?: number;
  authorAttributions?: AuthorAttribution[];
  googleMapsUri?: string;
};

type PlaceDetails = {
  displayName?: LocalizedText;
  rating?: number;
  userRatingCount?: number;
  reviews?: PlaceReview[];
  photos?: PlacePhoto[];
  googleMapsUri?: string;
};

class ApiError extends Error {}

function loadApiKey(): string | undefined {
  const envFile = path.join(ROOT, ".env.local");
  if (existsSync(envFile)) process.loadEnvFile(envFile);
  return process.env.GOOGLE_MAPS_API_KEY?.trim() || undefined;
}

/** Keeps the key out of anything we print. */
function redact(message: string, apiKey: string): string {
  return message.split(apiKey).join("<API_KEY>");
}

async function describeHttpError(res: Response): Promise<string> {
  const body = await res.text().catch(() => "");
  try {
    const parsed = JSON.parse(body) as {
      error?: { status?: string; message?: string };
    };
    if (parsed.error) {
      return `HTTP ${res.status} ${parsed.error.status ?? ""}: ${parsed.error.message ?? ""}`.trim();
    }
  } catch {
    // Not JSON; fall through to the raw body.
  }
  return `HTTP ${res.status} ${res.statusText}${body ? `: ${body.slice(0, 300)}` : ""}`;
}

async function fetchPlaceDetails(apiKey: string): Promise<PlaceDetails> {
  const res = await fetch(`${API_BASE}/places/${PLACE_ID}?languageCode=en`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELD_MASK,
    },
  });
  if (!res.ok) {
    throw new ApiError(`Place Details failed. ${await describeHttpError(res)}`);
  }
  return (await res.json()) as PlaceDetails;
}

function extensionFor(contentType: string | null): string {
  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("webp")) return "webp";
  return "jpg";
}

async function downloadPhoto(
  photo: PlacePhoto,
  index: number,
  apiKey: string,
): Promise<string> {
  const url = `${API_BASE}/${photo.name}/media?maxWidthPx=${PHOTO_MAX_WIDTH}&key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url);
  if (!res.ok) throw new ApiError(await describeHttpError(res));

  const filename = `maps-${String(index + 1).padStart(2, "0")}.${extensionFor(res.headers.get("content-type"))}`;
  const bytes = Buffer.from(await res.arrayBuffer());
  await writeFile(path.join(MAPS_DIR, filename), bytes);
  return filename;
}

function toReviewRecord(review: PlaceReview) {
  return {
    id: review.name ?? null,
    rating: review.rating ?? null,
    // `originalText` is what the reviewer wrote. `text` may be a Google translation.
    text: review.originalText?.text ?? review.text?.text ?? "",
    language: review.originalText?.languageCode ?? review.text?.languageCode ?? null,
    translatedText:
      review.originalText && review.text && review.text.text !== review.originalText.text
        ? review.text.text
        : null,
    authorName: review.authorAttribution?.displayName ?? null,
    authorUri: review.authorAttribution?.uri ?? null,
    authorPhotoUri: review.authorAttribution?.photoUri ?? null,
    relativePublishTime: review.relativePublishTimeDescription ?? null,
    publishTime: review.publishTime ?? null,
    googleMapsUri: review.googleMapsUri ?? null,
  };
}

async function writeJson(file: string, value: unknown) {
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

async function main() {
  const apiKey = loadApiKey();
  if (!apiKey) {
    console.error(
      "GOOGLE_MAPS_API_KEY is not set.\n" +
        "Add it to .env.local (see .env.example) and run `npm run fetch:maps` again.",
    );
    process.exitCode = 1;
    return;
  }

  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(MAPS_DIR, { recursive: true });

  console.log(`Fetching Place Details for ${PLACE_ID}...`);
  let place: PlaceDetails;
  try {
    place = await fetchPlaceDetails(apiKey);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(redact(message, apiKey));
    console.error(
      "Check that the key is valid, that \"Places API (New)\" is enabled for its project, " +
        "and that billing is active.",
    );
    process.exitCode = 1;
    return;
  }

  await writeJson(path.join(DATA_DIR, "place.json"), place);

  const reviews = (place.reviews ?? []).map(toReviewRecord);
  await writeJson(path.join(DATA_DIR, "reviews.json"), {
    source: "Google Places API (New), Place Details",
    placeId: PLACE_ID,
    googleMapsUri: place.googleMapsUri ?? null,
    rating: place.rating ?? null,
    userRatingCount: place.userRatingCount ?? null,
    fetchedAt: new Date().toISOString(),
    reviews,
  });

  const photos = place.photos ?? [];
  const attributions: Record<string, unknown> = {};
  const failures: string[] = [];
  for (const [index, photo] of photos.entries()) {
    try {
      const filename = await downloadPhoto(photo, index, apiKey);
      attributions[filename] = {
        photoName: photo.name,
        widthPx: photo.widthPx ?? null,
        heightPx: photo.heightPx ?? null,
        googleMapsUri: photo.googleMapsUri ?? null,
        authorAttributions: photo.authorAttributions ?? [],
      };
      console.log(`  saved ${filename}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(`photo ${index + 1}: ${redact(message, apiKey)}`);
    }
  }
  await writeJson(path.join(DATA_DIR, "photo-attributions.json"), attributions);

  console.log("\nSummary");
  console.log(`  Place:    ${place.displayName?.text ?? "(no name returned)"}`);
  console.log(`  Rating:   ${place.rating ?? "?"} from ${place.userRatingCount ?? "?"} reviews`);
  console.log(`  Reviews:  ${reviews.length} saved to data/reviews.json`);
  console.log(`  Photos:   ${Object.keys(attributions).length} of ${photos.length} saved to assets-raw/maps/`);
  if (failures.length > 0) {
    console.log(`  Failed:   ${failures.length}`);
    for (const failure of failures) console.log(`    - ${failure}`);
    process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
