/**
 * Builds clean logo files from her Google profile logo (a 1024px JPEG on white):
 *   public/brand/logo.svg            traced vector: gold mark + dark wordmark
 *   public/brand/logo-light.svg      same, wordmark in cream for dark backgrounds
 *   public/brand/logo-mark.svg       gold tooth mark only (favicon, small uses)
 *   public/brand/logo-{w}.png        transparent PNGs rendered from the SVG
 *   public/brand/logo-mark-{w}.png
 *   src/app/icon.png, src/app/apple-icon.png
 *
 * The gold and the ink are separated by colour and traced separately with potrace.
 * The gold gradient stops are sampled from the original.
 *
 * Usage: npm run process:logo
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import potrace from "potrace";
import sharp from "sharp";

const SOURCE = path.join("assets-raw", "logo", "logo-from-google-profile.jpg");
const OUT_DIR = path.join("public", "brand");
const APP_DIR = path.join("src", "app");
const SCALE = 4; // trace an upscaled copy for smoother curves
const PAD = 8;

// Sampled from the source logo (5th, 50th and 95th percentile of gold pixels, mean ink).
export const LOGO_COLORS = {
  goldLight: "#E6C87F",
  goldMid: "#D5AE61",
  goldDark: "#AF7E3B",
  ink: "#1A1817",
  cream: "#F7F1E8",
};

const trace = promisify(potrace.trace) as (
  file: Buffer,
  options: Record<string, unknown>,
) => Promise<string>;

type Masks = {
  gold: Buffer;
  ink: Buffer;
  width: number;
  height: number;
  /** Maps a source-image pixel coordinate to the traced SVG's coordinate space. */
  toSvg: (x: number, y: number) => [number, number];
};

// The four-point sparkle overlaps the tooth in the same gold, so tracing merges the two.
// It is redrawn as a vector on top. Measured in source pixels; waist sets how pinched it is.
const SPARKLE = { cx: 65, cy: 388, rx: 30, ry: 33, waist: 0.15, fill: "#C69C55" };

/** Splits the logo into two black-on-white masks: gold pixels and dark ink pixels. */
async function buildMasks(): Promise<Masks> {
  const { data: trimmed, info: trimInfo } = await sharp(SOURCE)
    .trim({ threshold: 30 })
    .extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: "#ffffff" })
    .toBuffer({ resolveWithObject: true });
  const offsetX = -(trimInfo.trimOffsetLeft ?? 0) - PAD;
  const offsetY = -(trimInfo.trimOffsetTop ?? 0) - PAD;
  const { data, info } = await sharp(trimmed)
    .resize({ width: (await sharp(trimmed).metadata()).width! * SCALE, kernel: "lanczos3" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const gold = Buffer.alloc(info.width * info.height, 255);
  const ink = Buffer.alloc(info.width * info.height, 255);
  for (let i = 0; i < info.width * info.height; i++) {
    const r = data[i * 3];
    const g = data[i * 3 + 1];
    const b = data[i * 3 + 2];
    // Gold is warm (r - b is about 105 to 116 across its gradient); ink and white are neutral.
    // Cutting both at roughly 50% coverage keeps edges where the original's edges are.
    const warmth = r - b;
    const darkness = 255 - Math.max(r, g, b);
    if (warmth > 52 && darkness < 150) gold[i] = 0;
    else if (darkness > 110 && warmth < 52) ink[i] = 0;
  }
  const toPng = (mask: Buffer) =>
    sharp(mask, { raw: { width: info.width, height: info.height, channels: 1 } }).png().toBuffer();
  return {
    gold: await toPng(gold),
    ink: await toPng(ink),
    width: info.width,
    height: info.height,
    toSvg: (x, y) => [(x - offsetX) * SCALE, (y - offsetY) * SCALE],
  };
}

function sparklePath(masks: Masks): string {
  const { cx, cy, rx, ry, waist } = SPARKLE;
  const pt = (x: number, y: number) => masks.toSvg(x, y).map((v) => v.toFixed(1)).join(" ");
  const kx = rx * waist;
  const ky = ry * waist;
  return [
    `M${pt(cx, cy - ry)}`,
    `Q${pt(cx + kx, cy - ky)} ${pt(cx + rx, cy)}`,
    `Q${pt(cx + kx, cy + ky)} ${pt(cx, cy + ry)}`,
    `Q${pt(cx - kx, cy + ky)} ${pt(cx - rx, cy)}`,
    `Q${pt(cx - kx, cy - ky)} ${pt(cx, cy - ry)}Z`,
  ].join(" ");
}

function pathData(svg: string): string {
  const match = svg.match(/<path[^>]*\sd="([^"]+)"/);
  if (!match) throw new Error("potrace returned no path");
  return match[1];
}

function svgDocument(
  width: number,
  height: number,
  layers: { d: string; fill: string }[],
  title: string,
): string {
  const gradient = `<linearGradient id="gold" x1="0" y1="0" x2="1" y2="0.35">
      <stop offset="0" stop-color="${LOGO_COLORS.goldLight}"/>
      <stop offset="0.5" stop-color="${LOGO_COLORS.goldMid}"/>
      <stop offset="1" stop-color="${LOGO_COLORS.goldDark}"/>
    </linearGradient>`;
  const paths = layers
    .map((layer) => `  <path fill="${layer.fill}" fill-rule="evenodd" d="${layer.d}"/>`)
    .join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}">
  <title>${title}</title>
  <defs>
    ${gradient}
  </defs>
${paths}
</svg>
`;
}

async function markBounds(goldMask: Buffer) {
  // The mark is the gold shape; find its bounding box to crop a square icon around it.
  const trimmed = await sharp(goldMask).trim({ threshold: 10 }).toBuffer({ resolveWithObject: true });
  return {
    left: -(trimmed.info.trimOffsetLeft ?? 0),
    top: -(trimmed.info.trimOffsetTop ?? 0),
    width: trimmed.info.width,
    height: trimmed.info.height,
  };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const masks = await buildMasks();
  const options = { turdSize: 40, optTolerance: 0.4, alphaMax: 1, threshold: 128 };
  // Lower alphaMax keeps the sparkle's points sharp instead of rounding them off.
  const goldD = pathData(await trace(masks.gold, { ...options, alphaMax: 0.55, optTolerance: 0.2 }));
  // A larger turdSize drops JPEG specks at the gold tips; the smallest real ink shape is the "." in "Dr.".
  const inkD = pathData(await trace(masks.ink, { ...options, turdSize: 160 }));

  const name = "Dr. Ghina Yassine, Dental and Facial Esthetics";
  const sparkle = { d: sparklePath(masks), fill: SPARKLE.fill };
  const logo = svgDocument(masks.width, masks.height, [
    { d: goldD, fill: "url(#gold)" },
    sparkle,
    { d: inkD, fill: LOGO_COLORS.ink },
  ], name);
  const logoLight = svgDocument(masks.width, masks.height, [
    { d: goldD, fill: "url(#gold)" },
    sparkle,
    { d: inkD, fill: LOGO_COLORS.cream },
  ], name);

  // Square mark: crop the viewBox around the gold shape.
  const box = await markBounds(masks.gold);
  const side = Math.max(box.width, box.height) * 1.12;
  const cx = box.left + box.width / 2;
  const cy = box.top + box.height / 2;
  const markGoldOnly = svgDocument(masks.width, masks.height, [{ d: goldD, fill: "url(#gold)" }, sparkle], "Dr. Ghina Yassine")
    .replace(
      `viewBox="0 0 ${masks.width} ${masks.height}"`,
      `viewBox="${(cx - side / 2).toFixed(1)} ${(cy - side / 2).toFixed(1)} ${side.toFixed(1)} ${side.toFixed(1)}"`,
    );

  await writeFile(path.join(OUT_DIR, "logo.svg"), logo);
  await writeFile(path.join(OUT_DIR, "logo-light.svg"), logoLight);
  await writeFile(path.join(OUT_DIR, "logo-mark.svg"), markGoldOnly);

  for (const width of [1200, 600, 300]) {
    await sharp(Buffer.from(logo))
      .resize({ width })
      .png()
      .toFile(path.join(OUT_DIR, `logo-${width}.png`));
  }
  for (const width of [512, 192]) {
    await sharp(Buffer.from(markGoldOnly))
      .resize({ width, height: width, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(OUT_DIR, `logo-mark-${width}.png`));
  }

  // App icons: the gold mark on a cream tile (reads better in browser tabs than bare gold).
  const tile = async (size: number, file: string) => {
    const inner = Math.round(size * 0.78);
    const mark = await sharp(Buffer.from(markGoldOnly))
      .resize({ width: inner, height: inner, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    await sharp({ create: { width: size, height: size, channels: 4, background: LOGO_COLORS.cream } })
      .composite([{ input: mark, gravity: "center" }])
      .png()
      .toFile(file);
  };
  await tile(512, path.join(APP_DIR, "icon.png"));
  await tile(180, path.join(APP_DIR, "apple-icon.png"));

  console.log(`Traced ${masks.width}x${masks.height} (x${SCALE}) logo.`);
  console.log(`  gold path: ${goldD.length} chars, ink path: ${inkD.length} chars`);
  console.log(`  mark box: ${JSON.stringify(box)}`);
  console.log(`Wrote ${OUT_DIR}/logo.svg, logo-light.svg, logo-mark.svg, PNGs, and app icons.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
