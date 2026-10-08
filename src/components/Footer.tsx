import Image from "next/image";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons";
import { Container } from "@/components/ui";
import { NAV } from "@/lib/nav";
import { formatTime, site, whatsappLink } from "@/lib/site";

export function Footer() {
  const weekday = site.hours.find((day) => day.open);

  return (
    <footer className="bg-dark text-dark-muted">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_0.8fr]">
        <div>
          <Image
            src="/brand/logo-light.svg"
            alt={`${site.name}, ${site.tagline}`}
            width={3912}
            height={1452}
            unoptimized
            className="h-16 w-auto"
          />
          <p className="mt-5 max-w-xs">Gentle dental care for adults and children in Achrafieh, Beirut.</p>
          <div className="mt-6 flex gap-3">
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram ${site.instagram.handle} (opens in a new tab)`}
              className="grid size-11 place-items-center rounded-full border border-cream/15 text-cream transition-colors hover:border-accent hover:text-accent"
            >
              <InstagramIcon size={20} />
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp (opens in a new tab)"
              className="grid size-11 place-items-center rounded-full border border-cream/15 text-cream transition-colors hover:border-accent hover:text-accent"
            >
              <WhatsAppIcon size={19} />
            </a>
          </div>
        </div>

        <div>
          <h2 className="font-sans text-sm font-medium tracking-wide text-accent uppercase">Contact</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <a href={site.phone.href} className="text-cream hover:text-accent">
                {site.phone.display}
              </a>
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                {site.instagram.handle}
              </a>
            </li>
          </ul>
          <address className="mt-5 not-italic">
            {site.address.building}
            <br />
            {site.address.street}
            <br />
            {site.address.city}
          </address>
        </div>

        <div>
          <h2 className="font-sans text-sm font-medium tracking-wide text-accent uppercase">Hours</h2>
          <p className="mt-4">
            <span className="text-cream">Monday to Saturday</span>
            <br />
            {weekday?.open && weekday.close
              ? `${formatTime(weekday.open)} to ${formatTime(weekday.close)}`
              : null}
          </p>
          <p className="mt-3">
            <span className="text-cream">Sunday</span>
            <br />
            Closed
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-sans text-sm font-medium tracking-wide text-accent uppercase">Explore</h2>
          <ul className="mt-4 space-y-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-accent">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <div className="border-t border-cream/10">
        <Container className="flex flex-col gap-2 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            {site.clinicName}. Reviews and photos from Google Maps, credited where shown.
          </p>
          <p>
            Demo by <span className="text-cream">Nexlor</span>
          </p>
        </Container>
      </div>
    </footer>
  );
}
