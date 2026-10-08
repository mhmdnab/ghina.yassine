import { Baby, Clock3, Ear, MessageCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import { Confirm, Container, Credit, Eyebrow, Section, reveal } from "@/components/ui";
import { image } from "@/lib/content";

// Each point is something her Google reviewers describe (see data/services.json → approach).
const NOTICED = [
  { icon: Ear, text: "She listens and takes her time" },
  { icon: MessageCircle, text: "She explains everything clearly" },
  { icon: Baby, text: "She is gentle with children, toddlers too" },
  { icon: Clock3, text: "She is punctual and never rushed" },
  { icon: Sparkles, text: "A clean, calm and welcoming clinic" },
];

export function About() {
  const portrait = image("dr-ghina-portrait-treatment-room");

  return (
    <Section id="about" tone="sand" labelledBy="about-title">
      <Container className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="relative mx-auto w-full max-w-md lg:max-w-none" {...reveal()}>
          <div
            aria-hidden="true"
            className="absolute -top-6 -left-6 size-40 rounded-full bg-accent-soft md:size-56"
          />
          <div className="relative overflow-hidden rounded-image shadow-lift">
            <Image
              src={portrait.outputs.full.src}
              width={portrait.outputs.full.width}
              height={portrait.outputs.full.height}
              alt={portrait.alt}
              placeholder="blur"
              blurDataURL={portrait.outputs.blurDataURL}
              sizes="(min-width: 1024px) 460px, (min-width: 640px) 448px, 90vw"
              className="aspect-[4/5] w-full object-cover object-top"
            />
          </div>
          <Credit attribution={portrait.attribution} className="mt-3" />
        </div>

        <div {...reveal(120)}>
          <Eyebrow>About</Eyebrow>
          <h2 id="about-title" className="text-4xl text-ink md:text-5xl">
            Meet Dr. Ghina
          </h2>
          <div className="mt-6 space-y-4 text-lg text-muted">
            <p>
              Dr. Ghina Yassine’s clinic for dental and facial esthetics is on the 5th floor of
              the Rubik Building in Achrafieh, Beirut.
            </p>
            <p>
              Ask her patients what stands out and they describe the same things: she takes the
              time to listen, explains what she is doing, keeps to her schedule, and puts people
              of every age at ease.
            </p>
          </div>

          <h3 className="mt-10 font-sans text-sm font-medium tracking-wide text-accent-strong uppercase">
            What her patients notice
          </h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {NOTICED.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-strong">
                  <Icon size={16} aria-hidden="true" />
                </span>
                <span className="text-ink">{text}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted">From her Google reviews.</p>

          <div className="mt-8 space-y-2">
            <Confirm block>education, degrees and years in practice</Confirm>
            <Confirm block>professional memberships</Confirm>
          </div>
        </div>
      </Container>
    </Section>
  );
}
