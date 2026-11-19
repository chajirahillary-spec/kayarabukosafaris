import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { storyBySlug, stories, storyCategories } from "@/data/content";
import { site } from "@/data/site";
import { Container } from "@/components/ui/primitives";
import { SiteImage } from "@/components/ui/SiteImage";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/seo";
import { buildEnquiryWhatsAppMessage, whatsappLink } from "@/lib/whatsapp";
import { ArrowLeft, Clock, MessageCircle } from "lucide-react";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = storyBySlug(slug);
  if (!s) return {};
  return {
    title: s.title,
    description: s.excerpt,
    alternates: { canonical: `/stories/${s.slug}` },
    openGraph: {
      title: `${s.title} | ${site.name}`,
      description: s.excerpt,
      type: "article",
      publishedTime: s.publishedAt,
      images: s.image.src ? [{ url: s.image.src, alt: s.image.alt }] : undefined,
    },
    twitter: { card: "summary_large_image", title: s.title, description: s.excerpt },
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const s = storyBySlug(slug);
  if (!s) notFound();

  const cat = storyCategories.find((c) => c.slug === s.categorySlug);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Stories", href: "/#stories" },
    { name: s.title, href: `/stories/${s.slug}` },
  ];

  const waHref = whatsappLink(
    buildEnquiryWhatsAppMessage({
      areaOfInterest: s.relatedTopic || cat?.name || "Cultural & Conservation Discovery",
      preferredLocation: s.title,
    })
  );

  return (
    <Container className="max-w-3xl py-12 sm:py-20">
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd data={articleSchema(s)} />

      {/* Return to One-Page Stories Section */}
      <div className="mb-8 flex items-center justify-between border-b border-charcoal/15 pb-4">
        <Link
          href="/#stories"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-green hover:text-gold transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Stories</span>
        </Link>

        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
          {site.tagline}
        </span>
      </div>

      <article>
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
          <span>{cat?.name || s.categorySlug}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1 text-charcoal/70">
            <Clock className="h-3.5 w-3.5" />
            {s.readMinutes} min read
          </span>
        </div>

        <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.06] text-green">
          {s.title}
        </h1>

        <p className="mt-4 text-xs sm:text-sm text-charcoal/70">
          By {s.author} · <time dateTime={s.publishedAt}>{s.publishedAt}</time>
        </p>

        <div className="mt-8 overflow-hidden rounded-ka border border-charcoal/10">
          <SiteImage
            image={s.image}
            slotKey={`story.${s.slug}`}
            className="aspect-[16/9] w-full"
            sizes="(min-width: 768px) 768px, 100vw"
            tone="forest"
            priority
          />
        </div>

        <p className="mt-8 border-l-2 border-gold pl-5 font-serif text-xl sm:text-2xl italic leading-relaxed text-forest">
          {s.excerpt}
        </p>

        <div className="mt-8 space-y-5 text-base sm:text-lg leading-relaxed text-charcoal/90">
          {s.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>

      {/* Contextual Experience Enquiry Callout */}
      <aside className="mt-14 rounded-ka border border-gold/40 bg-cream/45 p-6 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
          EXPLORE. CONSERVE. EMPOWER.
        </p>
        <h2 className="mt-1.5 font-display text-3xl text-green">
          Connect With This Story in Kenya
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-charcoal/80">
          Interested in a cultural visit, community encounter or conservation experience connected to{" "}
          <strong className="font-semibold text-forest">
            {s.relatedTopic || s.title}
          </strong>
          ? Start a conversation with us.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center rounded-ka bg-green px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ivory hover:bg-forest transition-colors"
          >
            Enquire on Website
          </Link>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-ka border border-green px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-green hover:bg-green hover:text-ivory transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chat With Us on WhatsApp</span>
          </a>
        </div>
      </aside>
    </Container>
  );
}
