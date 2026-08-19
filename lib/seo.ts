import type { Metadata } from "next";
import type { Category, Product, SiteSettings } from "@/lib/types";

export const SEO_KEYWORDS = [
  "loops",
  "sample packs",
  "FLP projects",
  "EDM samples",
  "music production",
  "FL Studio",
  "VST presets",
  "beats",
  "midi packs",
  "producer sounds",
  "flbaazar",
  "buy samples online",
  "trap loops",
  "bollywood samples",
];

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function buildRootMetadata(settings: SiteSettings): Metadata {
  const siteUrl = getSiteUrl();
  const description = settings.heroDescription;
  const title = settings.siteTitle;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${settings.brandName}`,
    },
    description,
    keywords: [...SEO_KEYWORDS, settings.brandName, settings.sellerName],
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: siteUrl,
      siteName: settings.brandName,
      title,
      description,
      images: [
        {
          url: "/hero-banner.png",
          width: 1920,
          height: 480,
          alt: `${settings.brandName} — loops, sample packs, FLP projects, EDM samples`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/hero-banner.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function buildHomeMetadata(settings: SiteSettings): Metadata {
  const siteUrl = getSiteUrl();
  const title = `${settings.brandName} | Loops, Sample Packs, FLP Projects & EDM Samples`;
  const description = `Shop premium loops, sample packs, FLP projects, EDM samples and VST presets by ${settings.sellerName}. Secure payment, instant encrypted download for music producers and beatmakers in India.`;

  return {
    title,
    description,
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
    },
    twitter: {
      title,
      description,
    },
  };
}

export function buildHomeJsonLd(
  settings: SiteSettings,
  products: Product[],
  categories: Category[],
) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: settings.brandName,
        description: settings.heroDescription,
        inLanguage: "en-IN",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: settings.sellerName,
        url: siteUrl,
        brand: settings.brandName,
        email: settings.supportEmail,
        telephone: settings.supportPhone,
      },
      {
        "@type": "Store",
        "@id": `${siteUrl}/#store`,
        name: settings.brandName,
        url: siteUrl,
        description: settings.heroDescription,
        priceRange: "₹₹",
        currenciesAccepted: "INR",
        paymentAccepted: "Credit Card, Debit Card, UPI, Net Banking",
        areaServed: "IN",
      },
      {
        "@type": "ItemList",
        "@id": `${siteUrl}/#catalogue`,
        name: "Music production catalogue",
        numberOfItems: products.length,
        itemListElement: products.slice(0, 20).map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${siteUrl}/products/${product.slug}`,
          name: product.title,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "What can I buy on Flbaazar?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Loops, sample packs, FLP projects, EDM samples, VST presets and producer tools with instant download after payment.",
            },
          },
          {
            "@type": "Question",
            name: "Are downloads instant after payment?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. After successful Razorpay payment you receive encrypted download links on the order page and in your account profile.",
            },
          },
          {
            "@type": "Question",
            name: "Who sells on this store?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `${settings.sellerName} publishes production-ready loops, samples and FL Studio project files on ${settings.brandName}.`,
            },
          },
        ],
      },
      ...categories.map((category) => ({
        "@type": "CollectionPage",
        name: category.name,
        description: category.description,
        url: `${siteUrl}/?category=${category.slug}`,
      })),
    ],
  };
}
