import { getSiteSettings } from "@/lib/data-store";
import { getPalette } from "@/lib/theme";

export async function Footer() {
  const settings = await getSiteSettings();
  const palette = getPalette(settings.paletteKey);

  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div>
          <p className={`${palette.accentText} font-semibold`}>{settings.siteTitle}</p>
          <p>{settings.footerNote}</p>
        </div>
        <div className="text-left lg:text-right">
          <p>{settings.supportEmail}</p>
          <p>{settings.supportPhone}</p>
          <p>{settings.supportInstagram}</p>
        </div>
      </div>
    </footer>
  );
}
