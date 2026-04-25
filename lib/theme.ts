export const paletteOptions = [
  {
    key: "sunset-stage",
    label: "Sunset Stage",
    primaryButton: "bg-white text-slate-950",
    secondaryButton: "border border-white/15 text-white hover:bg-white/5",
    badge: "border-orange-300/20 bg-orange-300/10 text-orange-100",
    accentText: "text-orange-200",
    shell: "from-orange-500/20 via-fuchsia-500/10 to-cyan-400/10",
    card: "bg-white/5 border-white/10",
  },
  {
    key: "ocean-beat",
    label: "Ocean Beat",
    primaryButton: "bg-cyan-300 text-slate-950",
    secondaryButton: "border border-cyan-300/25 text-cyan-100 hover:bg-cyan-300/10",
    badge: "border-cyan-300/20 bg-cyan-300/10 text-cyan-100",
    accentText: "text-cyan-200",
    shell: "from-cyan-500/20 via-sky-500/10 to-indigo-400/10",
    card: "bg-cyan-400/5 border-cyan-300/10",
  },
  {
    key: "emerald-night",
    label: "Emerald Night",
    primaryButton: "bg-emerald-300 text-slate-950",
    secondaryButton: "border border-emerald-300/25 text-emerald-100 hover:bg-emerald-300/10",
    badge: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
    accentText: "text-emerald-200",
    shell: "from-emerald-500/20 via-lime-400/10 to-teal-500/10",
    card: "bg-emerald-400/5 border-emerald-300/10",
  },
  {
    key: "rose-rush",
    label: "Rose Rush",
    primaryButton: "bg-rose-300 text-slate-950",
    secondaryButton: "border border-rose-300/25 text-rose-100 hover:bg-rose-300/10",
    badge: "border-rose-300/20 bg-rose-300/10 text-rose-100",
    accentText: "text-rose-200",
    shell: "from-rose-500/20 via-red-500/10 to-amber-400/10",
    card: "bg-rose-400/5 border-rose-300/10",
  },
];

export function getPalette(key: string) {
  return paletteOptions.find((palette) => palette.key === key) ?? paletteOptions[0];
}
