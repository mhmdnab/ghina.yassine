import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { About } from "@/components/sections/About";
import { Booking } from "@/components/sections/Booking";
import { Gallery } from "@/components/sections/Gallery";
import { GentleCare } from "@/components/sections/GentleCare";
import { Hero } from "@/components/sections/Hero";
import { Kids } from "@/components/sections/Kids";
import { Reviews } from "@/components/sections/Reviews";
import { Services } from "@/components/sections/Services";
import { Visit } from "@/components/sections/Visit";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-cream"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Services />
        <GentleCare />
        <Kids />
        <Gallery />
        <Reviews />
        <Booking />
        <Visit />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
