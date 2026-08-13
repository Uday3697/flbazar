export const paletteOptions = [
  {
    key: "sunset-stage",
    label: "Sunset Stage",
    primaryButton: "bg-orange-500 text-white hover:bg-orange-600",
    secondaryButton: "border border-slate-300 text-slate-700 hover:bg-slate-50",
    badge: "border-orange-200 bg-orange-50 text-orange-700",
    accentText: "text-orange-600",
    shell: "from-orange-100 via-amber-50 to-rose-50",
    card: "bg-white border-slate-200 shadow-sm",
  },
  {
    key: "ocean-beat",
    label: "Ocean Beat",
    primaryButton: "bg-sky-600 text-white hover:bg-sky-700",
    secondaryButton: "border border-slate-300 text-slate-700 hover:bg-slate-50",
    badge: "border-sky-200 bg-sky-50 text-sky-700",
    accentText: "text-sky-600",
    shell: "from-sky-100 via-cyan-50 to-indigo-50",
    card: "bg-white border-slate-200 shadow-sm",
  },
  {
    key: "emerald-night",
    label: "Emerald Night",
    primaryButton: "bg-emerald-600 text-white hover:bg-emerald-700",
    secondaryButton: "border border-slate-300 text-slate-700 hover:bg-slate-50",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    accentText: "text-emerald-600",
    shell: "from-emerald-100 via-lime-50 to-teal-50",
    card: "bg-white border-slate-200 shadow-sm",
  },
  {
    key: "rose-rush",
    label: "Rose Rush",
    primaryButton: "bg-rose-600 text-white hover:bg-rose-700",
    secondaryButton: "border border-slate-300 text-slate-700 hover:bg-slate-50",
    badge: "border-rose-200 bg-rose-50 text-rose-700",
    accentText: "text-rose-600",
    shell: "from-rose-100 via-red-50 to-amber-50",
    card: "bg-white border-slate-200 shadow-sm",
  },
];

export function getPalette(key: string) {
  return paletteOptions.find((palette) => palette.key === key) ?? paletteOptions[0];
}
