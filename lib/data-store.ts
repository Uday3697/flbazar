import { randomUUID } from "node:crypto";
import type { Category, Order, SiteSettings, SupportTicket, Product } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { encryptDownloadToken, type DownloadTokenPayload } from "@/lib/security";
import { getDb } from "@/lib/mongodb";

const seededCategories: Category[] = [
  {
    id: "cat-sample-packs",
    name: "Sample Packs",
    slug: "sample-packs",
    description: "Curated vocal chops, drums, textures, and melodic phrases.",
  },
  {
    id: "cat-flp",
    name: "FLP Projects",
    slug: "flp-projects",
    description: "Ready-to-study production sessions with arrangement insights.",
  },
  {
    id: "cat-loops",
    name: "Loops",
    slug: "loops",
    description: "Genre-ready loop kits for cinematic, trap, and Afro inspired tracks.",
  },
  {
    id: "cat-software",
    name: "Software",
    slug: "software",
    description: "Templates, presets, and utility tools for faster production.",
  },
];

const seededProducts: Product[] = [
  {
    id: "prod-neon-drift",
    title: "Neon Drift Sample Pack",
    slug: "neon-drift-sample-pack",
    categorySlug: "sample-packs",
    format: "Sample Pack",
    price: 1499,
    shortDescription: "Airy synth one-shots, bass stabs, and vocal textures for club records.",
    description:
      "Built for melodic house and future bass sessions, Neon Drift includes layered drums, lush atmospheres, and starter MIDI ideas so producers can move from sketch to release faster.",
    youtubeUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    downloadUrl: "https://example.com/downloads/neon-drift.zip",
    downloadPassword: "ND2026",
    videoPassword: "Preview open on YouTube",
    accent: "from-fuchsia-500 via-orange-400 to-amber-300",
    createdAt: "2026-04-26T00:00:00.000Z",
  },
  {
    id: "prod-temple-loop-suite",
    title: "Temple Loop Suite",
    slug: "temple-loop-suite",
    categorySlug: "loops",
    format: "Loops",
    price: 899,
    shortDescription: "Percussive loops with live feeling grooves and cinematic hits.",
    description:
      "Temple Loop Suite focuses on organic percussion, low-end pulse, and transition layers that fit devotional, trailer, and modern Indian fusion productions.",
    youtubeUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    downloadUrl: "https://example.com/downloads/temple-loop-suite.zip",
    downloadPassword: "TEMPLE909",
    videoPassword: "Preview open on YouTube",
    accent: "from-cyan-400 via-sky-500 to-indigo-500",
    createdAt: "2026-04-25T00:00:00.000Z",
  },
  {
    id: "prod-midnight-flp",
    title: "Midnight Drive FLP",
    slug: "midnight-drive-flp",
    categorySlug: "flp-projects",
    format: "FLP",
    price: 2499,
    shortDescription: "A complete arranged project with mix chains and automation lanes.",
    description:
      "This FLP opens the full production process for a polished electronic single, including arrangement markers, sidechain routing, bus processing, and template organization.",
    youtubeUrl: "https://www.youtube.com/watch?v=oUFJJNQGwhk",
    downloadUrl: "https://example.com/downloads/midnight-drive-flp.zip",
    downloadPassword: "DRIVEFLP",
    videoPassword: "Preview open on YouTube",
    accent: "from-lime-300 via-emerald-400 to-teal-500",
    createdAt: "2026-04-24T00:00:00.000Z",
  },
  {
    id: "prod-pulse-toolkit",
    title: "Pulse Producer Toolkit",
    slug: "pulse-producer-toolkit",
    categorySlug: "software",
    format: "Software",
    price: 3299,
    shortDescription: "Preset chains, rack ideas, and utility templates for fast workflows.",
    description:
      "A workflow-first toolkit with session macros, effect chains, and clean routing ideas that help beatmakers build polished projects quicker.",
    youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    downloadUrl: "https://example.com/downloads/pulse-producer-toolkit.zip",
    downloadPassword: "PULSEKIT",
    videoPassword: "Preview open on YouTube",
    accent: "from-rose-400 via-red-500 to-yellow-400",
    createdAt: "2026-04-23T00:00:00.000Z",
  },
];

const seededSiteSettings: SiteSettings = {
  id: "site-settings",
  brandName: "Flbaazar",
  sellerName: "Sudip Mandal",
  logoText: "FL",
  siteTitle: "Flbaazar.shop by Sudip Mandal",
  heroBadge: "Digital marketplace for producers",
  heroHeading: "Sell sample packs, FLPs, loops, and software from one powerful music storefront.",
  heroDescription:
    "Flbaazar.shop is a clean producer website for Sudip Mandal with encrypted delivery, buyer issue tracking, and a visual homepage the admin can edit anytime.",
  catalogueHeading: "Latest products on the homepage",
  catalogueDescription:
    "Every new product created from the admin panel shows here automatically, organized by category and ready for purchase.",
  portfolioHeading: "About seller Sudip Mandal",
  portfolioDescription:
    "Sudip Mandal creates modern production assets with practical arrangement ideas, polished sound design, and workflow tools built for producers.",
  contactHeading: "Need help with payment, refund, or download access?",
  contactDescription:
    "If money was deducted, the file did not download, or access was blocked, the buyer can submit a support ticket with order ID, phone, and issue details.",
  footerNote:
    "Flbaazar.shop is built for fast digital music delivery with admin-managed branding and homepage content.",
  supportEmail: "support@flbaazar.shop",
  supportPhone: "+91 90000 12345",
  supportWhatsapp: "+91 90000 12345",
  supportInstagram: "@sudipmandal.music",
  paletteKey: "sunset-stage",
  galleryImages: [
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
  ],
};

async function seedCollectionIfEmpty<T extends { id: string }>(
  collectionName: string,
  seedData: T[],
): Promise<void> {
  const db = await getDb();
  const collection = db.collection(collectionName);
  const count = await collection.countDocuments();

  if (count === 0 && seedData.length > 0) {
    await collection.insertMany(seedData);
  }
}

function stripMongoId<T>(doc: Record<string, unknown>): T {
  const { _id, ...rest } = doc;
  return rest as T;
}

export async function getCategories() {
  await seedCollectionIfEmpty("categories", seededCategories);
  const db = await getDb();
  const docs = await db.collection("categories").find({}).toArray();
  return docs.map((doc) => stripMongoId<Category>(doc));
}

export async function getProducts() {
  await seedCollectionIfEmpty("products", seededProducts);
  const db = await getDb();
  const docs = await db.collection("products").find({}).sort({ createdAt: -1 }).toArray();
  return docs.map((doc) => stripMongoId<Product>(doc));
}

export async function getOrders(): Promise<Order[]> {
  const db = await getDb();
  const docs = await db.collection("orders").find({}).sort({ createdAt: -1 }).toArray();
  return docs.map(({ _id, ...rest }) => rest as Order);
}

export async function getSiteSettings() {
  const db = await getDb();
  const collection = db.collection("site_settings");
  let doc = await collection.findOne({ id: seededSiteSettings.id });

  if (!doc) {
    await collection.insertOne({ ...seededSiteSettings });
    doc = await collection.findOne({ id: seededSiteSettings.id });
  }

  if (!doc) {
    return seededSiteSettings;
  }

  if (doc.brandName === "BeatVault" || String(doc.siteTitle || "").includes("BeatVault")) {
    const brandingFix = {
      brandName: seededSiteSettings.brandName,
      logoText: seededSiteSettings.logoText,
      siteTitle: seededSiteSettings.siteTitle,
      heroDescription: seededSiteSettings.heroDescription,
      footerNote: seededSiteSettings.footerNote,
      supportEmail: seededSiteSettings.supportEmail,
    };
    await collection.updateOne({ id: seededSiteSettings.id }, { $set: brandingFix });
    doc = await collection.findOne({ id: seededSiteSettings.id });
  }

  if (!doc) {
    return seededSiteSettings;
  }

  return stripMongoId<SiteSettings>(doc);
}

export async function getSupportTickets(): Promise<SupportTicket[]> {
  const db = await getDb();
  const docs = await db.collection("support_tickets").find({}).sort({ createdAt: -1 }).toArray();
  return docs.map(({ _id, ...rest }) => rest as SupportTicket);
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const db = await getDb();
  const doc = await db.collection("orders").findOne({ id });
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return rest as Order;
}

export async function createCategory(input: {
  name: string;
  slug?: string;
  description: string;
}) {
  const categories = await getCategories();
  const baseSlug = slugify(input.slug || input.name);
  let slug = baseSlug;
  let suffix = 2;

  while (categories.some((category) => category.slug === slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const category: Category = {
    id: randomUUID(),
    name: input.name.trim(),
    slug,
    description: input.description.trim(),
  };

  const db = await getDb();
  await db.collection("categories").insertOne({ ...category });
  return category;
}

export async function createProduct(input: {
  title: string;
  slug?: string;
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
}) {
  const products = await getProducts();
  const baseSlug = slugify(input.slug || input.title);
  let slug = baseSlug;
  let suffix = 2;

  while (products.some((product) => product.slug === slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const product: Product = {
    id: randomUUID(),
    title: input.title.trim(),
    slug,
    categorySlug: input.categorySlug,
    format: input.format.trim(),
    price: input.price,
    shortDescription: input.shortDescription.trim(),
    description: input.description.trim(),
    youtubeUrl: input.youtubeUrl.trim(),
    downloadUrl: input.downloadUrl.trim(),
    downloadPassword: input.downloadPassword.trim(),
    videoPassword: input.videoPassword.trim(),
    accent: input.accent.trim() || "from-fuchsia-500 via-orange-400 to-amber-300",
    createdAt: new Date().toISOString(),
  };

  const db = await getDb();
  await db.collection("products").insertOne({ ...product });
  return product;
}

export async function createOrderWithItems(input: {
  items: Array<{ productSlug: string; title: string; price: number }>;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  razorpayOrderId: string;
}): Promise<Order> {
  const order: Order = {
    id: randomUUID(),
    items: input.items,
    customerName: input.customerName.trim(),
    customerEmail: input.customerEmail.trim(),
    customerPhone: input.customerPhone.trim(),
    amount: input.amount,
    paymentReference: `PAY-${randomUUID().slice(0, 8).toUpperCase()}`,
    razorpayOrderId: input.razorpayOrderId,
    status: "paid",
    downloadStatus: "pending",
    createdAt: new Date().toISOString(),
  };

  const db = await getDb();
  await db.collection("orders").insertOne({ ...order });
  return order;
}

export async function getOrderByEmailOrPhone(email: string, phone: string): Promise<Order[]> {
  const db = await getDb();
  const docs = await db.collection("orders").find({
    $or: [
      { customerEmail: { $regex: new RegExp(`^${email}$`, "i") } },
      { customerPhone: phone },
    ],
  }).sort({ createdAt: -1 }).toArray();
  return docs.map(({ _id, ...rest }) => rest as Order);
}

export async function getOrderItemDownloadToken(
  orderId: string,
  productSlug: string,
): Promise<string> {
  const order = await getOrderById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  const item = order.items.find((i) => i.productSlug === productSlug);
  if (!item) {
    throw new Error("Product not found in this order");
  }

  const expiresAt = new Date(order.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days

  const payload: DownloadTokenPayload = {
    orderId,
    productSlug,
    expiresAt,
  };

  return encryptDownloadToken(payload);
}

export async function createOrder(input: {
  productSlug: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
}) {
  // Get product to fetch title
  const product = await getProductBySlug(input.productSlug);
  if (!product) {
    throw new Error("Product not found");
  }

  return createOrderWithItems({
    items: [
      {
        productSlug: input.productSlug,
        title: product.title,
        price: input.amount,
      },
    ],
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    amount: input.amount,
    razorpayOrderId: `OLD-${randomUUID().slice(0, 8).toUpperCase()}`,
  });
}

export async function updateOrderStatus(
  id: string,
  updates: Partial<Pick<Order, "status" | "downloadStatus">>,
): Promise<Order | null> {
  const db = await getDb();
  await db.collection("orders").updateOne({ id }, { $set: updates });
  return getOrderById(id);
}

export async function updateSiteSettings(updates: Partial<SiteSettings>) {
  const current = await getSiteSettings();
  const nextSettings = { ...current, ...updates };
  const db = await getDb();
  await db.collection("site_settings").updateOne(
    { id: nextSettings.id },
    { $set: nextSettings },
    { upsert: true },
  );
  return nextSettings;
}

export async function createSupportTicket(input: {
  orderId: string;
  productSlug: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  issueType: SupportTicket["issueType"];
  message: string;
}): Promise<SupportTicket> {
  const ticket: SupportTicket = {
    id: randomUUID(),
    orderId: input.orderId.trim(),
    productSlug: input.productSlug.trim(),
    customerName: input.customerName.trim(),
    customerEmail: input.customerEmail.trim(),
    customerPhone: input.customerPhone.trim(),
    issueType: input.issueType,
    message: input.message.trim(),
    status: "open",
    createdAt: new Date().toISOString(),
  };

  const db = await getDb();
  await db.collection("support_tickets").insertOne({ ...ticket });
  return ticket;
}

export async function updateTicketStatus(id: string, status: SupportTicket["status"]): Promise<SupportTicket | null> {
  const db = await getDb();
  await db.collection("support_tickets").updateOne({ id }, { $set: { status } });
  const doc = await db.collection("support_tickets").findOne({ id });
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return rest as SupportTicket;
}
