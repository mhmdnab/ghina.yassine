import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { InstagramIcon } from "@/components/icons";
import { Container, Credit, Eyebrow, Section, reveal } from "@/components/ui";
import { image, type ImageAsset } from "@/lib/content";
import { site } from "@/lib/site";

function GalleryPhoto({
  asset,
  caption,
  sizes,
  delay = 0,
  className = "",
  imageClassName = "",
}: {
  asset: ImageAsset;
  caption: string;
  sizes: string;
  delay?: number;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <figure className={`flex flex-col ${className}`} {...reveal(delay)}>
      <div className="relative flex-1 overflow-hidden rounded-image bg-sand shadow-soft">
        <Image
          src={asset.outputs.full.src}
          width={asset.outputs.full.width}
          height={asset.outputs.full.height}
          alt={asset.alt}
          placeholder="blur"
          blurDataURL={asset.outputs.blurDataURL}
          sizes={sizes}
          className={`h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03] ${imageClassName}`}
        />
      </div>
      <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-ink">{caption}</span>
        <Credit attribution={asset.attribution} />
      </figcaption>
    </figure>
  );
}

export function Gallery() {
  return (
    <Section id="clinic" tone="sand" labelledBy="clinic-title">
      <Container>
        <div className="max-w-2xl" {...reveal()}>
          <Eyebrow>The clinic</Eyebrow>
          <h2 id="clinic-title" className="text-4xl text-ink md:text-5xl">
            Inside the clinic
          </h2>
          <p className="mt-5 text-lg text-muted">
            Warm oak, soft light and sunflowers at the front desk. Reviewers call it clean, light
            and comforting.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3 md:grid-rows-[auto_auto]">
          <GalleryPhoto
            asset={image("reception")}
            caption="Reception"
            sizes="(min-width: 768px) 66vw, 100vw"
            className="md:col-span-2"
            imageClassName="aspect-[4/3]"
          />
          <GalleryPhoto
            asset={image("building-exterior")}
            caption="The Rubik Building, Alfred Naccash Street"
            sizes="(min-width: 768px) 33vw, 100vw"
            delay={120}
            className="md:row-span-2"
            imageClassName="aspect-[4/5] md:aspect-auto object-[50%_30%]"
          />
          <GalleryPhoto
            asset={image("reception-desk-logo")}
            caption="Front desk"
            sizes="(min-width: 768px) 33vw, 100vw"
            delay={80}
            imageClassName="aspect-[3/2]"
          />
          <div className="flex" {...reveal(160)}>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-1 flex-col justify-between rounded-image border border-line bg-gradient-to-br from-blush/60 via-surface to-accent-soft/70 p-7 shadow-soft transition-shadow hover:shadow-lift"
            >
              <InstagramIcon size={30} className="text-accent-strong" />
              <span className="mt-10 block">
                <span className="block font-display text-2xl text-ink">More on Instagram</span>
                <span className="mt-1 flex items-center gap-1 text-muted group-hover:text-accent-strong">
                  {site.instagram.handle}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}
