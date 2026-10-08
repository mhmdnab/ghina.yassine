import { WhatsAppIcon } from "@/components/icons";
import { whatsappLink } from "@/lib/site";

/** Mobile only: a thumb-reachable booking button. Desktop has the one in the header. */
export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappLink("Hello Dr. Ghina, I would like to book an appointment.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Book on WhatsApp (opens in a new tab)"
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex items-center gap-2 rounded-full bg-accent px-5 py-3.5 font-medium text-ink shadow-lift transition-colors hover:bg-accent-hover md:hidden"
    >
      <WhatsAppIcon size={22} />
      Book
    </a>
  );
}
