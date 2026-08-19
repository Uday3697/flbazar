import Link from "next/link";
import type { Category, SiteSettings } from "@/lib/types";
import { siteCardClass } from "@/lib/site-styles";

type Props = {
  settings: SiteSettings;
  categories: Category[];
  accentTextClass: string;
};

const seoTopics = [
  {
    title: "Loops & beat kits",
    text: "Royalty-ready drum loops, melodic loops and groove packs for trap, EDM, Bollywood and cinematic productions.",
    href: "/?category=loops",
  },
  {
    title: "Sample packs & EDM samples",
    text: "One-shots, vocal chops, FX and layered EDM samples designed for fast arrangement in FL Studio and other DAWs.",
    href: "/?category=sample-packs",
  },
  {
    title: "FLP projects",
    text: "Full FL Studio project files with arrangement, mix chains and sound design you can study and adapt.",
    href: "/?category=flp-projects",
  },
  {
    title: "VST, presets & software",
    text: "Producer templates, preset chains and workflow utilities to speed up mixing and sound design.",
    href: "/?category=software",
  },
];

export function HomeSeoSection({ settings, categories, accentTextClass }: Props) {
  return (
    <section
      id="producer-resources"
      className="mx-auto w-full max-w-7xl px-6 pb-20 lg:px-10"
      aria-labelledby="seo-heading"
    >
      <div className={`${siteCardClass} p-8 lg:p-10`}>
        <p className={`text-xs uppercase tracking-[0.35em] ${accentTextClass}`}>For producers</p>
        <h2 id="seo-heading" className="mt-3 text-3xl font-black uppercase text-slate-900 md:text-4xl">
          Buy loops, sample packs, FLP projects &amp; EDM samples online
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          {settings.brandName} by {settings.sellerName} is a digital music store for beatmakers, producers and
          artists in India. Discover paid loops, sample packs, FL Studio FLP projects, EDM samples, MIDI ideas and
          VST presets — with secure checkout and encrypted delivery after payment.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {seoTopics.map((topic) => (
            <article
              key={topic.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <h3 className="text-lg font-bold text-slate-900">{topic.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{topic.text}</p>
              <Link href={topic.href} className="mt-3 text-sm font-semibold text-orange-600 underline">
                Browse {topic.title.toLowerCase()}
              </Link>
            </article>
          ))}
        </div>

        <nav className="mt-8 flex flex-wrap gap-2" aria-label="Product categories">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/?category=${category.slug}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
