import Image from "next/image";
import type { Review } from "@/lib/content";
import { Stars } from "@/components/ui";

/**
 * A real Google review, shown exactly as written. Never edit `review.text`.
 */
export function ReviewCard({
  review,
  featured = false,
  className = "",
}: {
  review: Review;
  featured?: boolean;
  className?: string;
}) {
  const initials = (review.authorName ?? "?")
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  return (
    <figure
      className={`flex h-full flex-col rounded-card border border-line bg-surface p-6 shadow-soft md:p-8 ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        {review.rating ? <Stars rating={review.rating} label={`Rated ${review.rating} out of 5`} /> : <span />}
        <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent-strong">
          Google review
        </span>
      </div>

      <blockquote
        lang={review.language ?? undefined}
        className={`mt-5 flex-1 whitespace-pre-line text-ink ${featured ? "font-display text-xl leading-relaxed md:text-2xl" : ""}`}
      >
        {review.text}
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
        {review.authorPhotoUri ? (
          <Image
            src={review.authorPhotoUri}
            alt=""
            width={44}
            height={44}
            // Served straight from Google: tiny, and avoids the optimizer refetching third-party avatars.
            unoptimized
            className="size-11 rounded-full bg-sand object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="grid size-11 place-items-center rounded-full bg-accent-soft font-medium text-accent-strong"
          >
            {initials}
          </span>
        )}
        <span className="flex flex-col leading-tight">
          {review.authorUri ? (
            <a
              href={review.authorUri}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink hover:text-accent-strong"
            >
              {review.authorName}
            </a>
          ) : (
            <span className="font-medium text-ink">{review.authorName}</span>
          )}
          {review.relativePublishTime ? (
            <span className="mt-1 text-sm text-muted">{review.relativePublishTime} on Google</span>
          ) : null}
        </span>
      </figcaption>
    </figure>
  );
}
