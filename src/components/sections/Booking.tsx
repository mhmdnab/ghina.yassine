import { Phone } from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import { Container, Eyebrow, Section } from "@/components/ui";
import { site } from "@/lib/site";

const STEPS = [
  "Fill in a few details below.",
  "WhatsApp opens with your message written for you.",
  "Read it, and press send when you are ready.",
];

export function Booking() {
  return (
    <Section id="book" tone="sand" labelledBy="book-title">
      <Container>
        <div className="grid overflow-hidden rounded-[2rem] border border-line bg-surface shadow-lift lg:grid-cols-[0.85fr_1.15fr]">
          <div className="relative bg-gradient-to-br from-accent-soft via-sand to-blush/50 p-8 md:p-12">
            <Eyebrow>Book a visit</Eyebrow>
            <h2 id="book-title" className="text-4xl text-ink md:text-5xl">
              Book your visit on WhatsApp
            </h2>
            <p className="mt-5 text-lg text-muted">
              A few details and your message is ready. Nothing is sent until you press send
              yourself.
            </p>
            <ol className="mt-8 space-y-4">
              {STEPS.map((step, index) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface font-display text-accent-strong shadow-soft">
                    {index + 1}
                  </span>
                  <span className="pt-0.5 text-ink">{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-10 border-t border-ink/10 pt-6 text-muted">
              Prefer to talk?{" "}
              <a
                href={site.phone.href}
                className="inline-flex items-center gap-1.5 font-medium text-accent-strong underline decoration-accent/60 underline-offset-4 hover:decoration-accent-strong"
              >
                <Phone size={16} aria-hidden="true" />
                Call {site.phone.display}
              </a>
            </p>
          </div>

          <div className="p-8 md:p-12">
            <BookingForm />
          </div>
        </div>
      </Container>
    </Section>
  );
}
