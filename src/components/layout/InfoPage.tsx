import type { ReactNode } from "react";
import type { ImageRef } from "@/lib/types";
import { Breadcrumbs, Container, SectionHeading } from "@/components/ui/primitives";
import { SiteImage } from "@/components/ui/SiteImage";

export function InfoPage({
  title,
  eyebrow,
  intro,
  path,
  heroImage,
  children,
}: {
  title: string;
  eyebrow?: string;
  intro?: string;
  path: string;
  heroImage?: ImageRef;
  children?: ReactNode;
}) {
  return (
    <>
      {heroImage ? (
        <section className="relative isolate bg-forest text-ivory overflow-hidden">
          <SiteImage
            image={heroImage}
            className="absolute inset-0 -z-10 h-full w-full object-cover"
            sizes="100vw"
            priority
            tone="forest"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest/90 via-forest/75 to-forest/50 -z-10" />
          <Container className="flex min-h-[40vh] sm:min-h-[46vh] flex-col justify-end pb-12 pt-20">
            <div className="text-cream [&_a]:text-cream [&_span]:text-ivory">
              <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: title, href: path }]} />
            </div>
            {eyebrow && (
              <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-light">
                {eyebrow}
              </p>
            )}
            <h1 className="mt-2 text-4xl sm:text-6xl font-display">{title}</h1>
            {intro && <p className="mt-3 max-w-2xl text-base sm:text-lg text-cream/90">{intro}</p>}
          </Container>
        </section>
      ) : (
        <Container className="py-12 sm:py-16">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: title, href: path }]} />
          <div className="mt-6">
            <SectionHeading as="h1" eyebrow={eyebrow} title={title} intro={intro} />
          </div>
        </Container>
      )}
      <Container className="py-10">
        <div className="max-w-3xl space-y-5 leading-relaxed text-charcoal/85">{children}</div>
      </Container>
    </>
  );
}

export function CmsNotice({ children }: { children: ReactNode }) {
  return (
    <p className="border-l-2 border-gold bg-cream/50 p-4 text-sm text-charcoal/85">{children}</p>
  );
}
