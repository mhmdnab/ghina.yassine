/**
 * Converts the images listed in data/assets.json to optimized WebP in public/images/:
 *   {id}.webp        max 1920px wide (never upscaled)
 *   {id}-card.webp   max 720px wide, for cards and thumbnails
 * and writes back into data/assets.json, per image:
 *   attribution      contributor credit from data/photo-attributions.json (Maps photos)
 *   outputs          paths, pixel sizes and a tiny blur placeholder for next/image
 *
 * Originals in assets-raw/ are only read, never modified.
 *
 * Usage: npm run process:images
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const MANIFEST = path.join("data", "assets.json");
const ATTRIBUTIONS = path.join("data", "photo-attributions.json");
const OUT_DIR = path.join("public", "images");
const FULL_MAX_WIDTH = 1920;
const CARD_MAX_WIDTH = 720;
const QUALITY = 78;

type Crop = { left: number; top: number; width: number; height: number };

type ImageEntry = {
  id: string;
  source: "maps" | "instagram" | "stock";
  sourceFile: string;
  crop: Crop | null;
  attribution?: unknown;
  outputs?: unknown;
  [key: string]: unknown;
};

type Manifest = { images: ImageEntry[]; [key: string]: unknown };

type AttributionRecord = {
  authorAttributions?: { displayName?: string | null; uri?: string | null }[];
};

async function render(entry: ImageEntry, maxWidth: number, file: string) {
  let pipeline = sharp(entry.sourceFile).rotate();
  if (entry.crop) pipeline = pipeline.extract(entry.crop);
  const info = await pipeline
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(file);
  return { src: `/${path.relative("public", file).split(path.sep).join("/")}`, width: info.width, height: info.height };
}

async function blurDataUrl(entry: ImageEntry) {
  let pipeline = sharp(entry.sourceFile).rotate();
  if (entry.crop) pipeline = pipeline.extract(entry.crop);
  const tiny = await pipeline.resize({ width: 12 }).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${tiny.toString("base64")}`;
}

async function main() {
  const manifest = JSON.parse(await readFile(MANIFEST, "utf8")) as Manifest;
  const attributions = JSON.parse(await readFile(ATTRIBUTIONS, "utf8")) as Record<string, AttributionRecord>;
  await mkdir(OUT_DIR, { recursive: true });

  let totalBytes = 0;
  for (const entry of manifest.images) {
    const full = await render(entry, FULL_MAX_WIDTH, path.join(OUT_DIR, `${entry.id}.webp`));
    const card = await render(entry, CARD_MAX_WIDTH, path.join(OUT_DIR, `${entry.id}-card.webp`));
    entry.outputs = { full, card, blurDataURL: await blurDataUrl(entry) };

    if (entry.source === "maps") {
      const author = attributions[path.basename(entry.sourceFile)]?.authorAttributions?.[0];
      if (!author?.displayName) throw new Error(`No Google Maps attribution for ${entry.sourceFile}`);
      entry.attribution = {
        required: true,
        text: `Photo: ${author.displayName}, Google Maps`,
        displayName: author.displayName,
        uri: author.uri ?? null,
      };
    }

    const sizes = await Promise.all(
      [full.src, card.src].map(async (src) => (await readFile(path.join("public", src))).length),
    );
    totalBytes += sizes[0] + sizes[1];
    console.log(
      `  ${entry.id.padEnd(34)} ${full.width}x${full.height} (${Math.round(sizes[0] / 1024)} KB)` +
        `  card ${card.width}x${card.height} (${Math.round(sizes[1] / 1024)} KB)`,
    );
  }

  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`\n${manifest.images.length} images, ${Math.round(totalBytes / 1024)} KB total in ${OUT_DIR}/`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
