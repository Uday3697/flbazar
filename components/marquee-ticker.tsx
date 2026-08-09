"use client";

const items = [
  "🎹 Premium Sample Packs",
  "🥁 Drum Loops & Kits",
  "🎛️ FL Studio FLP Projects",
  "🔊 High Quality Beats",
  "🎵 Royalty Free Loops",
  "💿 Tapori & EDM Sounds",
  "🎚️ Producer Essentials",
  "🛒 Instant Download After Payment",
  "🔐 Encrypted Secure Delivery",
  "🎧 Sample Packs for Every Genre",
];

export default function MarqueeTicker() {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-orange-500/20 bg-black/40 py-3 my-8">
      <div
        className="flex gap-12 whitespace-nowrap"
        style={{
          animation: "marquee 30s linear infinite",
          width: "max-content",
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="text-sm font-semibold text-orange-300 uppercase tracking-widest">
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
