/**
 * Absolute base URL for metadata, Open Graph and structured data.
 * Set NEXT_PUBLIC_SITE_URL once she has a domain; until then Vercel's own URLs are used
 * (the stable branch URL on previews, the project URL in production).
 */
const vercelHost =
  process.env.VERCEL_ENV === "production"
    ? process.env.VERCEL_PROJECT_PRODUCTION_URL
    : (process.env.VERCEL_BRANCH_URL ?? process.env.VERCEL_URL);

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? (vercelHost ? `https://${vercelHost}` : "http://localhost:3000");
