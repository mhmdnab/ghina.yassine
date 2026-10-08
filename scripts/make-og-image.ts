/**
 * Renders the social share card (1200x630) with headless Chromium so it uses the site's
 * real fonts, logo and colours, and writes:
 *   src/app/opengraph-image.jpg (+ .alt.txt)
 *   src/app/twitter-image.jpg   (+ .alt.txt)
 * Next.js picks these files up and emits the og:image / twitter:image tags.
 *
 * Usage: npm run make:og   (needs network for Google Fonts)
 */
import { copyFile, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright-core";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "src", "app");
const ALT =
  "Dr. Ghina Yassine, Dental and Facial Esthetics: gentle dentistry that doesn't feel scary. Dental clinic in Achrafieh, Beirut, rated 4.9 on Google.";

async function main() {
  const place = JSON.parse(await readFile(path.join(ROOT, "data", "place.json"), "utf8"));
  const assets = JSON.parse(await readFile(path.join(ROOT, "data", "assets.json"), "utf8"));
  const portrait = assets.images.find((image: { id: string }) => image.id === "dr-ghina-portrait-coral");
  const file = (relative: string) => pathToFileURL(path.join(ROOT, relative)).href;

  const html = `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Fraunces:ital,opsz,wght@0,9..144,450;1,9..144,450&display=block" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #fbf7f1; font-family: "DM Sans", sans-serif; color: #2a221d; position: relative; }
  .glow1 { position: absolute; width: 760px; height: 760px; right: -180px; top: -260px; border-radius: 50%; background: rgba(242, 205, 197, 0.55); filter: blur(80px); }
  .glow2 { position: absolute; width: 560px; height: 560px; left: -220px; bottom: -300px; border-radius: 50%; background: rgba(241, 228, 200, 0.85); filter: blur(80px); }
  .left { position: absolute; left: 72px; top: 64px; width: 640px; }
  .logo { height: 92px; }
  h1 { font-family: "Fraunces", serif; font-weight: 450; font-size: 66px; line-height: 1.06; letter-spacing: -0.01em; margin-top: 40px; }
  h1 em { color: #76522a; }
  .sub { font-size: 26px; color: #6b5e54; margin-top: 22px; }
  .chip { display: inline-flex; align-items: center; gap: 14px; margin-top: 34px; padding: 12px 22px; border-radius: 999px; background: #fffdf9; border: 1px solid #e6dacb; font-size: 22px; color: #6b5e54; }
  .chip b { font-family: "Fraunces", serif; font-weight: 450; font-size: 32px; color: #2a221d; }
  .stars { color: #c9a15a; letter-spacing: 2px; font-size: 22px; }
  .photo { position: absolute; right: 70px; top: 56px; width: 360px; height: 500px; }
  .arch-line { position: absolute; inset: -10px; transform: translate(14px, 14px); border: 1.5px solid rgba(201, 161, 90, 0.7); border-radius: 999px 999px 28px 28px; }
  .arch { position: absolute; inset: 0; overflow: hidden; border-radius: 999px 999px 28px 28px; box-shadow: 0 24px 48px -20px rgba(46, 36, 30, 0.35); }
  .arch img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 20%; }
  .credit { position: absolute; right: 70px; bottom: 18px; font-size: 13px; color: #6b5e54; }
</style></head>
<body>
  <div class="glow1"></div><div class="glow2"></div>
  <div class="left">
    <img class="logo" src="${file("public/brand/logo.svg")}" alt="">
    <h1>Gentle dentistry that <em>doesn’t feel scary.</em></h1>
    <p class="sub">Dental clinic in Achrafieh, Beirut</p>
    <div class="chip"><b>${place.rating}</b><span class="stars">★★★★★</span><span>on Google, ${place.userRatingCount} reviews</span></div>
  </div>
  <div class="photo"><div class="arch-line"></div><div class="arch"><img src="${file(`public${portrait.outputs.full.src}`)}" alt=""></div></div>
  <p class="credit">${portrait.attribution.text}</p>
</body></html>`;

  const htmlPath = path.join(await mkdtemp(path.join(os.tmpdir(), "og-")), "og-card.html");
  await writeFile(htmlPath, html);

  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch({ channel: "chromium", proxy });
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const target = path.join(OUT, "opengraph-image.jpg");
    await page.screenshot({ path: target, type: "jpeg", quality: 88 });
    await copyFile(target, path.join(OUT, "twitter-image.jpg"));
    await writeFile(path.join(OUT, "opengraph-image.alt.txt"), ALT);
    await writeFile(path.join(OUT, "twitter-image.alt.txt"), ALT);
    console.log("Wrote src/app/opengraph-image.jpg and twitter-image.jpg (1200x630).");
  } finally {
    await browser.close();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
