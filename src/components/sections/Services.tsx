import { Baby, Gem, HeartHandshake, Smile } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { Confirm, Container, Credit, Eyebrow, Section } from "@/components/ui";
import { image } from "@/lib/content";

/**
 * Off until patient consent is confirmed (REPORT.md → Deferred). When true, the
 * dental esthetics card shows her smile close-up from Google Maps.
 */
const SHOW_SMILE_PHOTO = false;

type Service = {
  icon: typeof Smile;
  title: string;
  text: string;
  confirm: ReactNode;
};

// Only services backed by her own branding or her reviews (data/services.json → confirmed).
const SERVICES: Service[] = [
  {
    icon: HeartHandshake,
    title: "Dental care for adults",
    text: "Unhurried visits in a calm room, with every step explained before it happens.",
    confirm: "which treatments, e.g. check-ups, cleaning, fillings",
  },
  {
    icon: Baby,
    title: "Dental care for children",
    text: "Gentle visits for children, toddlers included, at a pace that feels safe for them.",
    confirm: "from what age, and which treatments",
  },
  {
    icon: Smile,
    title: "Dental esthetics",
    text: "Care for the look of your smile, as the clinic’s name promises: Dental and Facial Esthetics.",
    confirm: "which treatments",
  },
  {
    icon: Gem,
    title: "Facial esthetics",
    text: "The second half of the clinic’s focus, alongside dental care.",
    confirm: "which facial treatments",
  },
];

export function Services() {
  const smile = image("smile-closeup");

  return (
    <Section id="services" labelledBy="services-title">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>Services</Eyebrow>
          <h2 id="services-title" className="text-4xl text-ink md:text-5xl">
            How she can help
          </h2>
          <p className="mt-5 text-lg text-muted">
            Care for adults and children, from everyday visits to the look of your smile.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map(({ icon: Icon, title, text, confirm }) => (
            <li
              key={title}
              className="flex flex-col rounded-card border border-line bg-surface p-6 shadow-soft"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent-strong">
                <Icon size={22} aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-2xl text-ink">{title}</h3>
              <p className="mt-2 flex-1 text-muted">{text}</p>
              <div className="mt-5">
                <Confirm>{confirm}</Confirm>
              </div>
              {SHOW_SMILE_PHOTO && title === "Dental esthetics" ? (
                <div className="mt-5">
                  <Image
                    src={smile.outputs.card.src}
                    width={smile.outputs.card.width}
                    height={smile.outputs.card.height}
                    alt={smile.alt}
                    placeholder="blur"
                    blurDataURL={smile.outputs.blurDataURL}
                    sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 90vw"
                    className="rounded-xl"
                  />
                  <Credit attribution={smile.attribution} className="mt-2" />
                </div>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-card border border-dashed border-accent-strong/40 bg-surface/60 p-6 md:p-8">
          <Confirm>services list</Confirm>
          <p className="mt-3 text-muted">
            Still to confirm with Dr. Ghina before listing: check-ups and cleaning, fillings, root
            canal treatment, crowns and bridges, implants, orthodontics or aligners, whitening,
            veneers and emergency appointments.
          </p>
        </div>
      </Container>
    </Section>
  );
}
