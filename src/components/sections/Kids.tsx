import { Baby, Heart, MessageCircleHeart } from "lucide-react";
import { ReviewCard } from "@/components/ReviewCard";
import { Sparkle } from "@/components/icons";
import { Confirm, Container, Eyebrow, Section, reveal } from "@/components/ui";
import { reviewBy } from "@/lib/content";

const POINTS = [
  {
    icon: Baby,
    title: "Toddlers welcome",
    text: "Little ones are seen too, at a pace that suits them.",
  },
  {
    icon: Heart,
    title: "Gentle from the first minute",
    text: "Children are made to feel comfortable before anything else happens.",
  },
  {
    icon: MessageCircleHeart,
    title: "Tell her ahead of time",
    text: "Send a WhatsApp message before the visit to share anything that worries your child.",
  },
];

export function Kids() {
  const review = reviewBy("Maryam Ab");

  return (
    <Section id="kids" labelledBy="kids-title" className="overflow-hidden">
      <Sparkle
        size={180}
        className="pointer-events-none absolute -top-10 right-[-3rem] text-accent/15 md:right-8"
      />
      <Container className="relative grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <div className="order-2 lg:order-1" {...reveal(120)}>
          <ReviewCard review={review} featured />
        </div>

        <div className="order-1 lg:order-2" {...reveal()}>
          <Eyebrow>For kids</Eyebrow>
          <h2 id="kids-title" className="text-4xl text-ink md:text-5xl">
            Gentle visits for little ones
          </h2>
          <p className="mt-5 text-lg text-muted">
            Dr. Ghina sees children too, toddlers included. She goes gently and keeps things calm,
            so a trip to the dentist can be a good memory instead of a scary one.
          </p>

          <ul className="mt-8 space-y-5">
            {POINTS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-surface text-accent-strong shadow-soft">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-sans text-lg font-medium text-ink">{title}</h3>
                  <p className="mt-0.5 text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Confirm block>from what age she sees children, and what a first visit includes</Confirm>
          </div>
        </div>
      </Container>
    </Section>
  );
}
