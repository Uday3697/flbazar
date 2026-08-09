"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Category = { id: string; name: string; slug: string };

export default function CategoryFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const active = params.get("category") ?? "all";

  const select = (slug: string) => {
    const url = slug === "all" ? "/#catalogue" : `/?category=${slug}#catalogue`;
    router.push(url);
  };

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <button
        onClick={() => select("all")}
        className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
          active === "all"
            ? "bg-orange-500 text-white"
            : "border border-white/15 text-slate-300 hover:border-orange-400 hover:text-white"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => select(cat.slug)}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            active === cat.slug
              ? "bg-orange-500 text-white"
              : "border border-white/15 text-slate-300 hover:border-orange-400 hover:text-white"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
