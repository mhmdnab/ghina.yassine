import { Accessibility, ArrowUpRight, MapPin, Navigation, Phone } from "lucide-react";
import { OpeningHours } from "@/components/OpeningHours";
import { WhatsAppIcon } from "@/components/icons";
import { Container, Eyebrow, Section, buttonStyles } from "@/components/ui";
import { site, whatsappLink } from "@/lib/site";

export function Visit() {
  return (
    <Section id="visit" labelledBy="visit-title">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>Hours and location</Eyebrow>
          <h2 id="visit-title" className="text-4xl text-ink md:text-5xl">
            Come and see us in Achrafieh
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col gap-8 rounded-card border border-line bg-surface p-6 shadow-soft md:p-8">
            <OpeningHours />

            <address className="not-italic">
              <h3 className="font-sans text-lg font-medium text-ink">Address</h3>
              <p className="mt-3 flex gap-3 text-muted">
                <MapPin size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-accent-strong" />
                <span>
                  <span className="block text-ink">{site.address.building}</span>
                  {site.address.street}
                  <br />
                  {site.address.city}
                </span>
              </p>
              <p className="mt-3 flex gap-3 text-muted">
                <Phone size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-accent-strong" />
                <a href={site.phone.href} className="text-ink hover:text-accent-strong">
                  {site.phone.display}
                </a>
              </p>
              {site.accessibility.length > 0 ? (
                <p className="mt-3 flex gap-3 text-muted">
                  <Accessibility size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-accent-strong" />
                  <span>Wheelchair accessible restroom and seating, according to Google Maps.</span>
                </p>
              ) : null}
            </address>

            <div className="mt-auto flex flex-wrap gap-3 [&>a]:whitespace-nowrap">
              <a
                href={site.google.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles.primary}
              >
                <Navigation size={18} aria-hidden="true" />
                Get directions
              </a>
              <a
                href={whatsappLink("Hello Dr. Ghina, I would like to book an appointment.")}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles.secondary}
              >
                <WhatsAppIcon size={18} />
                Book on WhatsApp
              </a>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="relative min-h-80 flex-1 overflow-hidden rounded-card border border-line bg-sand shadow-soft">
              <iframe
                title="Map showing Dr. Ghina Yassine Clinic in the Rubik Building, Achrafieh, Beirut"
                src={site.google.embedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0"
              />
            </div>
            <a
              href={site.google.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 self-end text-sm text-muted hover:text-accent-strong"
            >
              Open in Google Maps
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}
