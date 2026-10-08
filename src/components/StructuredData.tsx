import { SITE_URL } from "@/lib/site-url";
import { site, to24h } from "@/lib/site";

/**
 * Dentist (LocalBusiness) JSON-LD from the known facts only.
 * No aggregateRating: Google does not allow businesses to mark up reviews about themselves
 * for star rich results, so the 4.9 rating stays in the visible page only.
 */
export function StructuredData() {
  const openDays = site.hours.filter((day) => day.open && day.close);
  const groups = new Map<string, string[]>();
  for (const day of openDays) {
    const key = `${to24h(day.open!)}-${to24h(day.close!)}`;
    groups.set(key, [...(groups.get(key) ?? []), day.day]);
  }

  const data = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": `${SITE_URL}/#clinic`,
    name: site.clinicName,
    alternateName: `${site.name}, ${site.tagline}`,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo-1200.png`,
    image: [`${SITE_URL}/images/reception.webp`, `${SITE_URL}/images/dr-ghina-portrait-coral.webp`],
    telephone: "+9613698486",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address.building}, ${site.address.street}`,
      addressLocality: "Beirut",
      addressCountry: "LB",
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: site.google.mapsUrl,
    openingHoursSpecification: [...groups].map(([hours, days]) => {
      const [opens, closes] = hours.split("-");
      return { "@type": "OpeningHoursSpecification", dayOfWeek: days, opens, closes };
    }),
    sameAs: [site.instagram.url, site.google.mapsUrl],
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here: all values are our own constants and data files.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
