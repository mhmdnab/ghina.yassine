/**
 * Fallback for scripts/fetch-maps.ts when no Places API key is available.
 * Opens the public Google Maps listing in headless Chromium and saves:
 *   data/place.json               listing facts visible on the page
 *   data/reviews.json             every review: original text, rating, author, relative time
 *   data/photo-attributions.json  contributor credit for each photo, keyed by filename
 *   assets-raw/maps/*             listing photos (max 1600px wide) and the owner's profile photo
 *
 * Signed-out browsers get Google's "limited view": the 5 most relevant reviews at best,
 * and sometimes no Reviews tab at all. The script reloads a few times; if reviews never
 * appear it saves everything else.
 *
 * Usage: npm run fetch:maps:browser
 * Needs Chromium for playwright-core 1.56 (`npx playwright install chromium` locally).
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, type APIRequestContext, type Browser, type Page } from "playwright-core";

const PLACE_ID = "ChIJR-aCGxgXHxURGSOXHJd8nsg";
const PLACE_URL = `https://www.google.com/maps/place/?q=place_id:${PLACE_ID}&hl=en`;
const REVIEWS_URL = `https://search.google.com/local/reviews?placeid=${PLACE_ID}`;
const PHOTO_MAX_WIDTH = 1600;
const PAGE_ATTEMPTS = 4;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const MAPS_DIR = path.join(ROOT, "assets-raw", "maps");

type Review = {
  id: string;
  rating: number | null;
  text: string;
  language: string | null;
  translatedText: string | null;
  authorName: string | null;
  authorUri: string | null;
  authorPhotoUri: string | null;
  authorMeta: string | null;
  relativePublishTime: string | null;
  hasOwnerResponse: boolean;
  hasReviewPhotos: boolean;
};

type Photo = {
  imageUrl: string;
  authorName: string | null;
  authorUri: string | null;
  authorPhotoUri: string | null;
  date: string | null;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function writeJson(file: string, value: unknown) {
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

/** lh3 image URLs carry their size after "="; swap it for the size we want. */
function resizeGoogleImage(url: string | null, size: string): string | null {
  if (!url) return null;
  const absolute = url.startsWith("//") ? `https:${url}` : url;
  return `${absolute.split("=")[0]}=${size}`;
}

async function openListing(browser: Browser): Promise<Page> {
  let page: Page | undefined;
  for (let attempt = 1; attempt <= PAGE_ATTEMPTS; attempt++) {
    const context = await browser.newContext({
      locale: "en-US",
      viewport: { width: 1280, height: 900 },
      userAgent: USER_AGENT,
    });
    page = await context.newPage();
    await page.goto(PLACE_URL, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.locator("h1").first().waitFor({ timeout: 30_000 });
    await page.waitForTimeout(5000);
    if (await page.getByRole("tab", { name: /^Reviews/ }).count()) return page;
    console.log(`  attempt ${attempt}: no Reviews tab (limited view)`);
    if (attempt < PAGE_ATTEMPTS) {
      await context.close();
      await sleep(5000);
    }
  }
  return page!;
}

async function readPlaceFacts(page: Page) {
  const labels = await page.evaluate(() =>
    [...document.querySelectorAll("[aria-label]")].map((el) => el.getAttribute("aria-label") ?? ""),
  );
  const find = (pattern: RegExp) => labels.find((label) => pattern.test(label)) ?? null;
  const strip = (label: string | null, prefix: string) =>
    label?.replace(new RegExp(`^${prefix}:\\s*`, "i"), "").trim() ?? null;

  const weekdayDescriptions = labels
    .filter((label) => /^[A-Z][a-z]+day, .*, Copy open hours$/.test(label))
    .map((label) => label.replace(/, Copy open hours$/, "").replace(", ", ": "));
  const ratingBreakdown = Object.fromEntries(
    labels
      .map((label) => label.match(/^(\d) stars?, (\d+) reviews?$/))
      .filter((match): match is RegExpMatchArray => match !== null)
      .map((match) => [match[1], Number(match[2])]),
  );
  const reviewTopics = labels
    .map((label) => label.match(/^(.+), mentioned in (\d+) reviews?$/))
    .filter((match): match is RegExpMatchArray => match !== null)
    .map((match) => ({ topic: match[1], count: Number(match[2]) }));

  const name = (await page.locator("h1").first().innerText()).trim();
  const category = await page
    .locator('button[jsaction*="category"]')
    .first()
    .innerText({ timeout: 2000 })
    .catch(() => null);

  const attributes: string[] = [];
  const aboutTab = page.getByRole("tab", { name: /^About/ });
  if (await aboutTab.count()) {
    await aboutTab.first().click();
    await page.waitForTimeout(1500);
    const items = await page.evaluate(() =>
      [...document.querySelectorAll('div[role="main"] li span[aria-label]')].map(
        (el) => el.getAttribute("aria-label") ?? "",
      ),
    );
    attributes.push(...items.filter(Boolean));
    await page.getByRole("tab", { name: /^Overview/ }).first().click();
    await page.waitForTimeout(1000);
  }

  return {
    source: "Google Maps web listing, read with a headless browser (signed out)",
    fetchedAt: new Date().toISOString(),
    placeId: PLACE_ID,
    displayName: { text: name },
    primaryType: category,
    rating: Number.parseFloat(find(/^\d\.\d stars\s*$/) ?? "") || null,
    userRatingCount: Number.parseInt(find(/^\d+ reviews$/) ?? "", 10) || null,
    ratingBreakdown,
    reviewTopics,
    formattedAddress: strip(find(/^Address:/), "Address"),
    internationalPhoneNumber: strip(find(/^Phone:/), "Phone"),
    plusCode: strip(find(/^Plus code:/), "Plus code"),
    regularOpeningHours: { weekdayDescriptions },
    attributes,
    googleMapsUri: page.url().split("?")[0],
    reviewsUri: REVIEWS_URL,
  };
}

/** Plain DOM clicks: Playwright element handles go stale as the review list re-renders. */
function clickAll(page: Page, selector: string, textPrefix = "") {
  return page.evaluate(
    ([sel, prefix]) => {
      const buttons = [...document.querySelectorAll<HTMLButtonElement>(sel)].filter(
        (b) => !prefix || b.innerText.trim().startsWith(prefix),
      );
      buttons.forEach((b) => b.click());
      return buttons.length;
    },
    [selector, textPrefix] as const,
  );
}

/** Reads the review cards currently shown, with full original (untranslated) text. */
async function readVisibleReviews(page: Page): Promise<Review[]> {
  await clickAll(page, "div[data-review-id] button[aria-label='See more']");
  await page.waitForTimeout(1000);

  // Read what is shown first (may be a Google translation), then switch to the original.
  const readTexts = () =>
    page.evaluate(() =>
      Object.fromEntries(
        [...document.querySelectorAll("div[data-review-id][aria-label]")].map((card) => {
          const body = card.querySelector<HTMLElement>("div[lang]");
          // The first span holds the review text; a "More" button may sit beside it.
          const text = body?.querySelector<HTMLElement>("span")?.innerText ?? body?.innerText ?? "";
          return [card.getAttribute("data-review-id"), { text: text.trim(), lang: body?.getAttribute("lang") ?? null }];
        }),
      ),
    );
  const shown = await readTexts();
  if (await clickAll(page, "div[data-review-id] button", "See original")) {
    await page.waitForTimeout(1500);
    await clickAll(page, "div[data-review-id] button[aria-label='See more']");
    await page.waitForTimeout(1000);
  }
  const original = await readTexts();

  const cards = await page.evaluate(() =>
    [...document.querySelectorAll("div[data-review-id][aria-label]")].map((card) => {
      const authorButton = card.querySelector<HTMLElement>("button[data-href*='/maps/contrib/']");
      return {
        id: card.getAttribute("data-review-id") ?? "",
        authorName: card.getAttribute("aria-label"),
        authorUri: authorButton?.getAttribute("data-href") ?? null,
        authorPhotoUri: card.querySelector("button[data-href] img")?.getAttribute("src") ?? null,
        authorMeta:
          [...card.querySelectorAll<HTMLElement>("button[data-href] div")]
            .map((el) => el.innerText.trim())
            .find((text) => /review|photo|Local Guide/i.test(text)) ?? null,
        ratingLabel: card.querySelector("[role='img'][aria-label*='star']")?.getAttribute("aria-label") ?? null,
        relativePublishTime:
          [...card.querySelectorAll<HTMLElement>("span")]
            .map((el) => el.innerText.trim())
            .find((text) => /\bago$/.test(text)) ?? null,
        hasOwnerResponse: /Response from the owner/i.test(card.textContent ?? ""),
        hasReviewPhotos: card.querySelector("button[data-photo-index]") !== null,
      };
    }),
  );

  return cards.map((card) => {
    const before = shown[card.id];
    const after = original[card.id];
    const wasTranslated = before && after && before.text !== after.text;
    return {
      id: card.id,
      rating: card.ratingLabel ? Number.parseInt(card.ratingLabel, 10) : null,
      text: after?.text ?? "",
      language: after?.lang ?? null,
      translatedText: wasTranslated ? before.text : null,
      authorName: card.authorName,
      authorUri: card.authorUri?.split("?")[0] ?? null,
      authorPhotoUri: resizeGoogleImage(card.authorPhotoUri, "w120-h120-p-rp-mo-br100"),
      authorMeta: card.authorMeta,
      relativePublishTime: card.relativePublishTime,
      hasOwnerResponse: card.hasOwnerResponse,
      hasReviewPhotos: card.hasReviewPhotos,
    };
  });
}

/**
 * Signed-out visitors see the 5 "most relevant" reviews. Sorting, topic filters and
 * loading more sit behind a Google sign-in prompt, which this script does not get around.
 */
async function readReviews(page: Page): Promise<Review[]> {
  const tab = page.getByRole("tab", { name: /^Reviews/ });
  if (!(await tab.count())) return [];
  await tab.first().click();
  await page.waitForTimeout(3000);
  return readVisibleReviews(page);
}

/** Clicks through every tile in the photo viewer's "All" tab and reads its credit line. */
async function readPhotos(page: Page, placeName: string): Promise<{ photos: Photo[]; skipped: string[] }> {
  await page.goto(PLACE_URL, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.locator("h1").first().waitFor({ timeout: 30_000 });
  await page.waitForTimeout(4000);
  // Limited view labels the hero image "See photos"; the full view uses "Photo of <name>".
  await page
    .locator(`button[aria-label="See photos"], button[aria-label="Photo of ${placeName}"]`)
    .first()
    .click();
  await page.waitForTimeout(3000);
  await page.getByRole("tab", { name: "All" }).click().catch(() => {});
  await page.waitForTimeout(2000);

  const photos: Photo[] = [];
  const skipped: string[] = [];
  const seen = new Set<string>();

  for (let index = 0; ; index++) {
    const tile = page.locator(`a[data-photo-index="${index}"]`);
    if ((await tile.count()) === 0) {
      await page.locator("a[data-photo-index]").last().scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(2000);
      if ((await tile.count()) === 0) break;
    }
    await tile.scrollIntoViewIfNeeded();
    await tile.click();
    await page.waitForTimeout(1500);

    const imageUrl = await tile.evaluate((el) => {
      const style = el.querySelector("[style*='background-image']")?.getAttribute("style") ?? "";
      return style.match(/url\("?([^")]+)"?\)/)?.[1] ?? "";
    });
    const credit = await page.evaluate(() => {
      const links = [...document.querySelectorAll<HTMLAnchorElement>("a[href*='/maps/contrib/']")];
      const named = links.find((a) => a.innerText.trim().length > 0);
      const avatar = links.find((a) => a.getAttribute("aria-label"));
      const avatarStyle =
        avatar?.querySelector("[style*='background-image']")?.getAttribute("style") ??
        avatar?.querySelector("img")?.getAttribute("src") ??
        "";
      const date = [...document.querySelectorAll<HTMLElement>("div, span")]
        .map((el) => el.innerText?.trim() ?? "")
        .find((text) => /^(Photo|Video) - [A-Z][a-z]{2} \d{4}$/.test(text));
      return {
        authorName: named?.innerText.trim() ?? null,
        authorUri: named?.href ?? null,
        authorPhotoUri: avatarStyle.match(/url\("?([^")]+)"?\)/)?.[1] ?? (avatarStyle || null),
        date: date ?? null,
      };
    });

    const base = imageUrl.split("=")[0];
    if (!base.includes("googleusercontent.com") || credit.date?.startsWith("Video")) {
      skipped.push(`tile ${index}: ${credit.date ?? "no date"}, ${imageUrl.slice(0, 70)}...`);
      continue;
    }
    if (seen.has(base)) continue;
    seen.add(base);
    photos.push({ imageUrl: base, ...credit });
  }
  return { photos, skipped };
}

async function download(request: APIRequestContext, url: string, file: string) {
  const res = await request.get(url);
  if (!res.ok()) throw new Error(`HTTP ${res.status()}`);
  await writeFile(file, await res.body());
}

async function main() {
  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(MAPS_DIR, { recursive: true });

  // Downloads go through the browser context so they use the same proxy as the page.
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch({ channel: "chromium", proxy });
  try {
    console.log("Opening Google Maps listing...");
    const page = await openListing(browser);
    const request = page.context().request;

    const place = await readPlaceFacts(page);
    await writeJson(path.join(DATA_DIR, "place.json"), place);

    console.log("Reading reviews...");
    const reviews = await readReviews(page);
    if (reviews.length > 0) {
      await writeJson(path.join(DATA_DIR, "reviews.json"), {
        source: "Google Maps web listing, read with a headless browser (signed out)",
        placeId: PLACE_ID,
        googleMapsUri: place.googleMapsUri,
        reviewsUri: REVIEWS_URL,
        rating: place.rating,
        userRatingCount: place.userRatingCount,
        note: "Google shows signed-out visitors the 5 most relevant reviews; the rest need sign-in.",
        fetchedAt: new Date().toISOString(),
        reviews,
      });
    }

    console.log("Reading photos...");
    const { photos, skipped } = await readPhotos(page, place.displayName.text);
    const attributions: Record<string, unknown> = {};
    const failures: string[] = [];
    for (const [index, photo] of photos.entries()) {
      const filename = `maps-${String(index + 1).padStart(2, "0")}.jpg`;
      try {
        await download(request, `${photo.imageUrl}=w${PHOTO_MAX_WIDTH}-k-no`, path.join(MAPS_DIR, filename));
      } catch (error) {
        failures.push(`${filename}: ${error instanceof Error ? error.message : error}`);
        continue;
      }
      attributions[filename] = {
        source: "google-maps-web",
        imageUrl: photo.imageUrl,
        date: photo.date,
        authorAttributions: [
          {
            displayName: photo.authorName,
            uri: photo.authorUri,
            photoUri: resizeGoogleImage(photo.authorPhotoUri, "s120-p-k-no-mo"),
          },
        ],
      };
      console.log(`  saved ${filename} (${photo.authorName ?? "unknown author"}, ${photo.date ?? "no date"})`);
    }

    // The listing owner's Google profile photo is often the clinic logo.
    const owner = photos.find((photo) => photo.authorName && place.displayName.text.toLowerCase().startsWith(photo.authorName.toLowerCase()));
    const ownerPhoto = resizeGoogleImage(owner?.authorPhotoUri ?? null, "s1024-p-k-no-mo");
    if (ownerPhoto) {
      try {
        await download(request, ownerPhoto, path.join(MAPS_DIR, "owner-profile-photo.jpg"));
        attributions["owner-profile-photo.jpg"] = {
          source: "google-maps-web",
          imageUrl: ownerPhoto,
          note: "Google profile photo of the listing owner account",
          authorAttributions: [{ displayName: owner?.authorName, uri: owner?.authorUri, photoUri: null }],
        };
        console.log("  saved owner-profile-photo.jpg");
      } catch (error) {
        failures.push(`owner-profile-photo.jpg: ${error instanceof Error ? error.message : error}`);
      }
    }
    await writeJson(path.join(DATA_DIR, "photo-attributions.json"), attributions);

    const withText = reviews.filter((review) => review.text.length > 0).length;
    console.log("\nSummary");
    console.log(`  Place:    ${place.displayName.text}`);
    console.log(`  Rating:   ${place.rating ?? "?"} from ${place.userRatingCount ?? "?"} reviews`);
    console.log(`  Hours:    ${place.regularOpeningHours.weekdayDescriptions.length} days read`);
    console.log(`  Reviews:  ${reviews.length} saved (${withText} with text)`);
    console.log(`  Photos:   ${Object.keys(attributions).length} saved to assets-raw/maps/`);
    if (skipped.length) console.log(`  Skipped:  ${skipped.length}\n    - ${skipped.join("\n    - ")}`);
    if (failures.length) {
      console.log(`  Failed:   ${failures.length}\n    - ${failures.join("\n    - ")}`);
      process.exitCode = 1;
    }
  } finally {
    await browser.close();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
