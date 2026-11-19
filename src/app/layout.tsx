import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsAppButton } from "@/components/layout/FloatingWhatsAppButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { VisualEditProvider } from "@/components/visual-editor/VisualEditProvider";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Explore. Conserve. Empower. | Kenyan Culture, Communities & Conservation`,
    template: `%s | ${site.name}`,
  },
  description:
    "Discover Kenya beyond the ordinary. Explore diverse indigenous communities, Maasai, Samburu, Turkana, Mijikenda and Swahili cultural heritage, Arabuko-Sokoke forest conservation, and meaningful community experiences.",
  keywords: [
    "Kenyan cultural experiences",
    "Indigenous communities in Kenya",
    "Maasai cultural heritage",
    "Samburu heritage",
    "Turkana culture",
    "Mijikenda Kaya forests",
    "Swahili Coast heritage",
    "Community-based tourism in Kenya",
    "Forest conservation in Kenya",
    "Arabuko-Sokoke Forest",
    "Indigenous forests in Kenya",
    "Community conservation initiatives Kenya",
    "Kenyan heritage experiences",
    "Nature and conservation experiences Kenya",
    "KayArabuko",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_KE",
    title: `${site.name} — Explore. Conserve. Empower.`,
    description:
      "From ancient cultural traditions and vibrant communities to remarkable forests and living ecosystems, discover the stories, people and natural heritage that make Kenya extraordinary.",
    url: site.url,
    images: [
      {
        url: site.logoUrl,
        alt: `${site.name} — ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Explore. Conserve. Empower.`,
    description:
      "Discovering Kenya's diverse cultures, indigenous communities, forests and conservation initiatives.",
    images: [site.logoUrl],
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0B4B2E",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:bg-ivory focus:px-4 focus:py-2 focus:text-green"
        >
          Skip to content
        </a>
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <VisualEditProvider>
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <FloatingWhatsAppButton />
        </VisualEditProvider>
      </body>
    </html>
  );
}
