import { Star } from "lucide-react";
import type { ReactNode } from "react";
import { Sparkle } from "@/components/icons";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function Section({
  id,
  tone = "page",
  labelledBy,
  children,
  className = "",
}: {
  id: string;
  tone?: "page" | "sand";
  labelledBy?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`relative py-20 md:py-28 ${tone === "sand" ? "bg-sand" : "bg-page"} ${className}`}
    >
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 inline-flex items-center gap-2 text-sm font-medium tracking-wide text-accent-strong uppercase">
      <Sparkle size={12} className="text-accent" />
      {children}
    </p>
  );
}

/**
 * Visible marker for facts we do not have yet. Every one is listed in REPORT.md.
 * Rendered as `[CONFIRM: ...]` so it is obvious in the demo and easy to grep.
 */
export function Confirm({ children, block = false }: { children: ReactNode; block?: boolean }) {
  const Tag = block ? "p" : "span";
  return (
    <Tag
      className={`${block ? "flex" : "inline-flex"} items-center gap-1.5 rounded-lg border border-dashed border-accent-strong/40 bg-accent-soft/50 px-2.5 py-1 font-sans text-sm text-accent-strong`}
    >
      [CONFIRM: {children}]
    </Tag>
  );
}

/** Contributor credit for a Google Maps photo, as Google requires. */
export function Credit({
  attribution,
  className = "",
}: {
  attribution?: { text: string; uri: string | null };
  className?: string;
}) {
  if (!attribution) return null;
  return (
    <p className={`text-xs text-muted ${className}`}>
      {attribution.uri ? (
        <a
          href={attribution.uri}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-line underline-offset-2 hover:text-accent-strong"
        >
          {attribution.text}
        </a>
      ) : (
        attribution.text
      )}
    </p>
  );
}

export function Stars({ rating, size = 16, label }: { rating: number; size?: number; label?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={label ?? `${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          aria-hidden="true"
          className={i < Math.round(rating) ? "fill-accent text-accent" : "fill-line text-line"}
        />
      ))}
    </span>
  );
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-medium transition-colors duration-200";

export const buttonStyles = {
  primary: `${buttonBase} bg-accent text-ink shadow-soft hover:bg-accent-hover`,
  secondary: `${buttonBase} border border-accent-strong/40 text-accent-strong hover:border-accent-strong hover:bg-accent-soft/60`,
  dark: `${buttonBase} bg-ink text-cream hover:bg-dark`,
};
