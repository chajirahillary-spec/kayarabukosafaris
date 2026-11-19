import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/primitives";
import { ArrowLeft } from "lucide-react";

const pages: Record<string, { title: string; body: string[] }> = {
  "privacy-policy": {
    title: "Privacy Policy",
    body: [
      "KayArabuko respects your privacy. Information submitted through our experience enquiry form — such as your name, email address, phone number and areas of interest — is used solely to respond to your enquiry and help coordinate cultural, community or conservation visits.",
      "We do not sell or share your personal contact information with unrelated third parties.",
    ],
  },
  "responsible-tourism-policy": {
    title: "Responsible Cultural & Nature Engagement",
    body: [
      "At KayArabuko, communities are respected as the custodians and storytellers of their own heritage. Every cultural visit or community encounter is arranged with consent, dignity and fair value for local hosts.",
      "In indigenous forests, coastal ecosystems and community conservancies, visitors are guided by local naturalists and stewards to ensure minimal environmental impact and meaningful support for conservation.",
    ],
  },
  "terms-and-conditions": {
    title: "Terms of Use",
    body: [
      "All cultural visits, community encounters and conservation experiences featured on KayArabuko are arranged on an enquiry basis depending on location, group size, duration and local community schedules.",
    ],
  },
};

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = pages[slug];
  return page
    ? { title: page.title, alternates: { canonical: `/legal/${slug}` } }
    : {};
}

export default async function LegalPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) notFound();

  return (
    <Container className="max-w-3xl py-14 sm:py-20">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-green hover:text-gold"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to KayArabuko</span>
      </Link>
      <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
        EXPLORE. CONSERVE. EMPOWER.
      </p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl text-green">
        {page.title}
      </h1>
      <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-charcoal/85">
        {page.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </Container>
  );
}
