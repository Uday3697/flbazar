export const panelSections = [
  { id: "dashboard", label: "Dashboard" },
  { id: "website", label: "Website details" },
  { id: "gallery", label: "Gallery images" },
  { id: "categories", label: "Categories" },
  { id: "products", label: "Products" },
  { id: "customers", label: "Customers" },
  { id: "orders", label: "Orders" },
  { id: "support", label: "Support tickets" },
] as const;

export type PanelSection = (typeof panelSections)[number]["id"];

export function isPanelSection(value: string): value is PanelSection {
  return panelSections.some((item) => item.id === value);
}

export function panelPath(
  section: PanelSection,
  params?: { success?: string; error?: string },
): string {
  const query = new URLSearchParams();
  query.set("section", section);
  if (params?.success) query.set("success", params.success);
  if (params?.error) query.set("error", params.error);
  return `/panel?${query.toString()}`;
}
