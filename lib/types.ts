export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  categorySlug: string;
  format: string;
  price: number;
  shortDescription: string;
  description: string;
  youtubeUrl: string;
  downloadUrl: string;
  downloadPassword: string;
  videoPassword: string;
  accent: string;
  createdAt: string;
};

export type OrderStatus = "paid" | "failed" | "refunded";
export type DownloadStatus = "pending" | "success" | "failed";

export type OrderItem = {
  productSlug: string;
  title: string;
  price: number;
};

export type Order = {
  id: string;
  items: OrderItem[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  paymentReference: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  status: OrderStatus;
  downloadStatus: DownloadStatus;
  createdAt: string;
};

export type SupportTicket = {
  id: string;
  orderId: string;
  productSlug: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  issueType: "payment" | "download" | "refund" | "access" | "other";
  message: string;
  status: "open" | "resolved";
  createdAt: string;
};

export type SiteSettings = {
  id: string;
  brandName: string;
  sellerName: string;
  logoText: string;
  siteTitle: string;
  heroBadge: string;
  heroHeading: string;
  heroDescription: string;
  catalogueHeading: string;
  catalogueDescription: string;
  portfolioHeading: string;
  portfolioDescription: string;
  contactHeading: string;
  contactDescription: string;
  footerNote: string;
  supportEmail: string;
  supportPhone: string;
  supportWhatsapp: string;
  supportInstagram: string;
  paletteKey: string;
  galleryImages: string[];
};
