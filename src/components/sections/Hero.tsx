import { Clock, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { Sparkle, WhatsAppIcon } from "@/components/icons";
import { Container, Credit, Stars, buttonStyles } from "@/components/ui";
import { image } from "@/lib/content";
import { site, whatsappLink } from "@/lib/site";

export function Hero() {
  const portrait = image("dr-ghina-portrait-coral");

  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden bg-page">
      {/* Soft warm glow, echoing the peach wall in her portrait. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-[-10%] size-[42rem] rounded-full bg-blush/45 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-[-12rem] size-[34rem] rounded-full bg-accent-soft/70 blur-3xl" />
      </div>

      <Container className="relative grid items-center gap-14 pt-10 pb-20 md:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pb-28">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-1.5 text-sm text-muted">
            <Sparkle size={12} className="text-accent" />
            Dental clinic in Achrafieh, Beirut
          </p>

          <h1
            id="hero-title"
            className="mt-6 text-[2.6rem] leading-[1.08] text-ink sm:text-6xl lg:text-[4.1rem]"
          >
            Gentle dentistry that <em className="text-accent-strong">doesn’t feel scary.</em>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted md:text-xl">
            Dr. Ghina Yassine listens first, explains every step and never rushes you. A calm,
            welcoming clinic for adults, nervous patients and little ones.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappLink("Hello Dr. Ghina, I would like to book an appointment.")}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles.primary}
            >
              <WhatsAppIcon size={20} />
              Book on WhatsApp
            </a>
            <a href={site.phone.href} className={buttonStyles.secondary}>
              <Phone size={18} aria-hidden="true" />
              Call {site.phone.display}
            </a>
          </div>

          <ul className="mt-10 flex flex-col gap-3 text-[0.95rem] text-muted sm:flex-row sm:flex-wrap sm:gap-x-7">
            <li className="flex items-center gap-2">
              <Clock size={17} aria-hidden="true" className="text-accent-strong" />
              Monday to Saturday, 8:00 AM to 8:00 PM
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={17} aria-hidden="true" className="text-accent-strong" />
              Rubik Building, Alfred Naccash Street
            </li>
          </ul>
        </div>

        <div className="mx-auto w-full max-w-[26rem] lg:max-w-none">
          <div className="relative">
            {/* Thin gold arch behind the photo. */}
            <div
              aria-hidden="true"
              className="absolute -inset-3 translate-x-4 translate-y-4 rounded-t-full rounded-b-[2rem] border border-accent/60"
            />
            <div className="relative overflow-hidden rounded-t-full rounded-b-[2rem] bg-sand shadow-lift">
              <Image
                src={portrait.outputs.full.src}
                width={portrait.outputs.full.width}
                height={portrait.outputs.full.height}
                alt={portrait.alt}
                placeholder="blur"
                blurDataURL={portrait.outputs.blurDataURL}
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 1024px) 460px, (min-width: 640px) 416px, 90vw"
                className="aspect-[4/5] w-full object-cover object-[50%_20%]"
              />
            </div>

            <a
              href={site.google.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-line bg-surface px-5 py-3 whitespace-nowrap shadow-soft transition-transform hover:-translate-y-0.5 sm:-left-6 sm:translate-x-0"
            >
              <span className="font-display text-3xl leading-none text-ink">{site.rating}</span>
              <span className="flex flex-col">
                <Stars rating={site.rating} size={14} label={`${site.rating} out of 5 stars on Google`} />
                <span className="mt-1 text-sm text-muted">
                  on Google, {site.reviewCount} reviews
                </span>
              </span>
            </a>
          </div>

          <Credit attribution={portrait.attribution} className="mt-12 text-center sm:text-right" />
        </div>
      </Container>
    </section>
  );
}
