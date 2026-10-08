import place from "@data/place.json";

const PLACE_ID = "ChIJR-aCGxgXHxURGSOXHJd8nsg";
const GEO = { lat: 33.8826778, lng: 35.5207595 };
const WHATSAPP_NUMBER = "9613698486";

export type DayHours = {
  day: string;
  /** 0 = Sunday, as returned by Date.prototype.getDay(). */
  index: number;
  open: string | null;
  close: string | null;
};

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** Parses Google's "Monday: 8 AM to 8 PM" / "Sunday: Closed" lines into a Monday-first week. */
function parseHours(lines: string[]): DayHours[] {
  const byDay = new Map(
    lines.map((line) => {
      // Google separates "8" and "AM" with a narrow no-break space; normalise to a plain space.
      const [day, value] = line.replace(/[\u00a0\u202f]/g, " ").split(/:\s(.+)/);
      return [day, value] as const;
    }),
  );
  return DAY_ORDER.map((day) => {
    const value = byDay.get(day) ?? "Closed";
    const match = value.match(/^(.+?) to (.+)$/);
    return {
      day,
      index: (DAY_ORDER.indexOf(day) + 1) % 7,
      open: match ? match[1] : null,
      close: match ? match[2] : null,
    };
  });
}

export const site = {
  name: "Dr. Ghina Yassine",
  clinicName: "Dr. Ghina Yassine Clinic",
  tagline: "Dental and Facial Esthetics",
  phone: { display: "+961 3 698 486", href: "tel:+9613698486" },
  whatsapp: { number: WHATSAPP_NUMBER, url: `https://wa.me/${WHATSAPP_NUMBER}` },
  instagram: { handle: "@dr.ghinayassine", url: "https://www.instagram.com/dr.ghinayassine/" },
  address: {
    building: "Rubik Building, 5th floor",
    street: "Alfred Naccash Street, Achrafieh",
    city: "Beirut, Lebanon",
    plusCode: "VGMC+38 Beirut",
  },
  geo: GEO,
  placeId: PLACE_ID,
  google: {
    mapsUrl: `https://www.google.com/maps/place/?q=place_id:${PLACE_ID}`,
    reviewsUrl: place.reviewsUri,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${GEO.lat},${GEO.lng}&destination_place_id=${PLACE_ID}`,
    embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent("Dr.ghina yassine clinic achrafieh")}&ll=${GEO.lat},${GEO.lng}&z=17&output=embed`,
  },
  rating: place.rating,
  reviewCount: place.userRatingCount,
  fiveStarCount: place.ratingBreakdown["5"],
  reviewTopics: place.reviewTopics,
  accessibility: place.attributes,
  hours: parseHours(place.regularOpeningHours.weekdayDescriptions),
} as const;

export function whatsappLink(message?: string): string {
  return message ? `${site.whatsapp.url}?text=${encodeURIComponent(message)}` : site.whatsapp.url;
}

/** "8 AM" -> "8:00 AM", for a calmer, more readable hours table. */
export function formatTime(value: string): string {
  return value.replace(/^(\d{1,2}) (AM|PM)$/, "$1:00 $2");
}
