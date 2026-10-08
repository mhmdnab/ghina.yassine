"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons";
import { buttonStyles } from "@/components/ui";
import { NAV } from "@/lib/nav";
import { site, whatsappLink } from "@/lib/site";


export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled || open
          ? "border-b border-line bg-surface/90 shadow-[0_8px_24px_-18px_rgb(46_36_30/0.35)] backdrop-blur-md"
          : "border-b border-transparent bg-page/70 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#top" className="shrink-0" aria-label={`${site.name}, ${site.tagline}: back to top`}>
          <Image
            src="/brand/logo.svg"
            alt=""
            width={3912}
            height={1452}
            unoptimized
            loading="eager"
            className="h-12 w-auto md:h-13"
          />
        </a>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-full px-3 py-2 text-[0.95rem] text-muted transition-colors hover:bg-accent-soft/60 hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram ${site.instagram.handle} (opens in a new tab)`}
            className="hidden size-11 place-items-center rounded-full text-muted transition-colors hover:bg-accent-soft/60 hover:text-ink sm:grid"
          >
            <InstagramIcon size={20} />
          </a>
          {/* Wrapped so `hidden` is not fighting the button's own display class. */}
          <div className="hidden sm:block">
            <a
              href={whatsappLink("Hello Dr. Ghina, I would like to book an appointment.")}
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonStyles.primary} px-5! py-2.5! text-[0.95rem]`}
            >
              <WhatsAppIcon size={18} />
              Book on WhatsApp
            </a>
          </div>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-11 place-items-center rounded-full text-ink hover:bg-accent-soft/60 lg:hidden"
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-menu"
        aria-label="Main"
        hidden={!open}
        className="border-t border-line bg-surface lg:hidden"
      >
        <ul className="mx-auto grid max-w-6xl gap-1 px-5 py-4 sm:px-8">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-3 text-lg text-ink hover:bg-accent-soft/60"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="mt-2 flex flex-wrap gap-3 px-1">
            <a
              href={whatsappLink("Hello Dr. Ghina, I would like to book an appointment.")}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles.primary}
            >
              <WhatsAppIcon size={18} />
              Book on WhatsApp
            </a>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles.secondary}
            >
              <InstagramIcon size={18} />
              Instagram
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
