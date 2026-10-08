import { ArrowUpRight } from "lucide-react";
import { ReviewCard } from "@/components/ReviewCard";
import { Container, Eyebrow, Section, Stars, buttonStyles, reveal } from "@/components/ui";
import { reviewBy } from "@/lib/content";
import { site } from "@/lib/site";

// The other two reviews Google shows signed-out visitors appear in the Gentle care and Kids sections.
const FEATURED = "Karen Ghafary";
const MORE = ["ghida kassab", "Alia Al hajj"];

export function Reviews() {
  return (
    <Section id="reviews" labelledBy="reviews-title">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end" {...reveal()}>
          <div className="max-w-2xl">
            <Eyebrow>Reviews</Eyebrow>
            <h2 id="reviews-title" className="text-4xl text-ink md:text-5xl">
              What patients say
            </h2>
            <p className="mt-5 text-lg text-muted">
              Real Google reviews, shown exactly as their authors wrote them.
            </p>
          </div>

          <div className="flex items-center gap-5 rounded-card border border-line bg-surface p-5 shadow-soft">
            <span className="font-display text-5xl leading-none text-ink">{site.rating}</span>
            <div>
              <Stars rating={site.rating} size={18} label={`${site.rating} out of 5 stars on Google`} />
              <p className="mt-1 text-sm text-muted">
                {site.reviewCount} Google reviews, {site.fiveStarCount} of them five stars
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 lg:row-span-2" {...reveal()}>
            <ReviewCard review={reviewBy(FEATURED)} featured />
          </div>
          {MORE.map((name, index) => (
            <div key={name} {...reveal(120 + index * 100)}>
              <ReviewCard review={reviewBy(name)} />
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={site.google.reviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonStyles.secondary}
          >
            Read all {site.reviewCount} reviews on Google
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <p className="text-sm text-muted">Review text, names and photos from Google Maps.</p>
        </div>
      </Container>
    </Section>
  );
}
