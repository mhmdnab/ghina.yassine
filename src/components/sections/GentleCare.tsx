import { Ear, Hand, MessageCircle, Music, Timer } from "lucide-react";
import { ReviewCard } from "@/components/ReviewCard";
import { Container, Eyebrow, Section, reveal } from "@/components/ui";
import { reviewBy } from "@/lib/content";
import { site } from "@/lib/site";

// Built from what her reviewers describe (data/services.json → approach). No promises beyond that.
const STEPS = [
  {
    icon: Ear,
    title: "She listens first",
    text: "Tell her what worries you. She takes the time to understand before anything starts.",
  },
  {
    icon: MessageCircle,
    title: "Every step explained",
    text: "You know what is happening and why, before it happens.",
  },
  {
    icon: Hand,
    title: "Pauses when you need them",
    text: "She knows when to stop and give you a moment.",
  },
  {
    icon: Timer,
    title: "On time, never rushed",
    text: "She is punctual, and nobody hurries you through your visit.",
  },
  {
    icon: Music,
    title: "A calm room",
    text: "Soft music in the background, a clean and bright clinic, and a warm welcome.",
  },
];

const CALM_TOPICS = ["comforting atmosphere", "gentle care", "clear explanations", "cleanliness"];

export function GentleCare() {
  const review = reviewBy("sawsan h");
  const topics = site.reviewTopics.filter((topic) => CALM_TOPICS.includes(topic.topic));

  return (
    <Section id="gentle-care" tone="sand" labelledBy="gentle-title">
      <Container className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div>
          <div {...reveal()}>
            <Eyebrow>Nervous about the dentist?</Eyebrow>
            <h2 id="gentle-title" className="text-4xl text-ink md:text-5xl">
              You set the pace.
            </h2>
            <p className="mt-5 max-w-xl text-lg text-muted">
              Many of her reviews come from people who used to dread the dentist. This is what
              they describe, and what you can expect.
            </p>
          </div>

          <ol className="mt-10 space-y-6">
            {STEPS.map(({ icon: Icon, title, text }, index) => (
              <li key={title} className="flex gap-5" {...reveal(index * 90)}>
                <span className="relative grid size-12 shrink-0 place-items-center rounded-full border border-accent/50 bg-surface text-accent-strong">
                  <Icon size={20} aria-hidden="true" />
                  <span className="sr-only">Step {index + 1}</span>
                </span>
                <div>
                  <h3 className="font-sans text-lg font-medium text-ink">{title}</h3>
                  <p className="mt-1 text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col justify-center gap-6" {...reveal(150)}>
          <ReviewCard review={review} featured />
          <div className="rounded-card border border-line bg-surface/70 p-6">
            <p className="text-sm text-muted">Topics Google picks out of her reviews</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {topics.map((topic) => (
                <li
                  key={topic.topic}
                  className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-ink"
                >
                  {topic.topic}
                  <span className="ml-1.5 text-muted">{topic.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
