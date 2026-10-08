import assets from "@data/assets.json";
import reviewsData from "@data/reviews.json";

export type ImageAsset = {
  id: string;
  alt: string;
  attribution?: { text: string; displayName: string; uri: string | null };
  outputs: {
    full: { src: string; width: number; height: number };
    card: { src: string; width: number; height: number };
    blurDataURL: string;
  };
};

export type Review = {
  id: string;
  rating: number | null;
  text: string;
  language: string | null;
  authorName: string | null;
  authorUri: string | null;
  authorPhotoUri: string | null;
  relativePublishTime: string | null;
};

const images = assets.images as unknown as ImageAsset[];

export function image(id: string): ImageAsset {
  const found = images.find((entry) => entry.id === id);
  if (!found) throw new Error(`Unknown image id "${id}" (see data/assets.json)`);
  return found;
}

const reviews = reviewsData.reviews as Review[];

/** Looks a review up by its author's name, exactly as Google shows it. */
export function reviewBy(authorName: string): Review {
  const found = reviews.find((review) => review.authorName === authorName);
  if (!found) throw new Error(`No review by "${authorName}" in data/reviews.json`);
  return found;
}

export const reviewsFetchedAt = reviewsData.fetchedAt;
