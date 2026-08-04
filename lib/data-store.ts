import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Category, Order, SiteSettings, SupportTicket, Product } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { encryptDownloadToken, type DownloadTokenPayload } from "@/lib/security";

const DATA_DIR = path.join(process.cwd(), "data");
const CATEGORY_FILE = path.join(DATA_DIR, "categories.json");
const PRODUCT_FILE = path.join(DATA_DIR, "products.json");
const ORDER_FILE = path.join(DATA_DIR, "orders.json");
const SETTINGS_FILE = path.join(DATA_DIR, "site-settings.json");
const TICKET_FILE = path.join(DATA_DIR, "support-tickets.json");

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
  brandName: "BeatVault",
  sellerName: "Sudip Mandal",
  logoText: "BV",
  siteTitle: "BeatVault by Sudip Mandal",
  heroBadge: "Digital marketplace for producers",
  heroHeading: "Sell sample packs, FLPs, loops, and software from one powerful music storefront.",
  heroDescription:
    "BeatVault is a clean producer website for Sudip Mandal with encrypted delivery, buyer issue tracking, and a visual homepage the admin can edit anytime.",
  catalogueHeading: "Latest products on the homepage",
  catalogueDescription:
    "Every new product created from the admin panel shows here automatically, organized by category and ready for purchase.",
  portfolioHeading: "About seller Sudip Mandal",
  portfolioDescription:
    "Sudip Mandal creates modern production assets with practical arrangement ideas, polished sound design, and workflow tools built for producers.",
  contactHeading: "Need help with payment, refund, or download access?",
  contactDescription:
    "If money was deducted, the file did not download, or access was blocked, the buyer can submit a support ticket with order ID, phone, and issue details.",
  footerNote: "BeatVault is built for fast digital music delivery with admin-managed branding and homepage content.",
  supportEmail: "support@beatvault.example",
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

async function ensureDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function ensureFile<T>(filePath: string, fallback: T) {
  await ensureDir();

  try {
    await readFile(filePath, "utf8");
  } catch {
    await writeFile(filePath, JSON.stringify(fallback, null, 2));
  }
}

async function readCollection<T>(filePath: string, fallback: T): Promise<T> {
  await ensureFile(filePath, fallback);
  const content = await readFile(filePath, "utf8");
  return JSON.parse(content) as T;
}

async function writeCollection<T>(filePath: string, data: T) {
  await ensureDir();
  await writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function getCategories() {
  return readCollection(CATEGORY_FILE, seededCategories);
}

export async function getProducts() {
  return readCollection(PRODUCT_FILE, seededProducts);
}

export async function getOrders() {
  return readCollection(ORDER_FILE, [] as Order[]);
}

export async function getSiteSettings() {
  return readCollection(SETTINGS_FILE, seededSiteSettings);
}

export async function getSupportTickets() {
  return readCollection(TICKET_FILE, [] as SupportTicket[]);
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getOrderById(id: string) {
  const orders = await getOrders();
  return orders.find((order) => order.id === id) ?? null;
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

  const nextCategories = [category, ...categories];
  await writeCollection(CATEGORY_FILE, nextCategories);
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

  const nextProducts = [product, ...products];
  await writeCollection(PRODUCT_FILE, nextProducts);
  return product;
}

export async function createOrderWithItems(input: {
  items: Array<{ productSlug: string; title: string; price: number }>;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  razorpayOrderId: string;
}) {
  const orders = await getOrders();

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

  const nextOrders = [order, ...orders];
  await writeCollection(ORDER_FILE, nextOrders);
  return order;
}

export async function getOrderByEmailOrPhone(email: string, phone: string) {
  const orders = await getOrders();
  return orders.filter(
    (order) =>
      order.customerEmail.toLowerCase() === email.toLowerCase() ||
      order.customerPhone === phone,
  );
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
) {
  const orders = await getOrders();
  const nextOrders = orders.map((order) => (order.id === id ? { ...order, ...updates } : order));
  await writeCollection(ORDER_FILE, nextOrders);
  return nextOrders.find((order) => order.id === id) ?? null;
}

export async function updateSiteSettings(updates: Partial<SiteSettings>) {
  const current = await getSiteSettings();
  const nextSettings = { ...current, ...updates };
  await writeCollection(SETTINGS_FILE, nextSettings);
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
}) {
  const tickets = await getSupportTickets();
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

  const nextTickets = [ticket, ...tickets];
  await writeCollection(TICKET_FILE, nextTickets);
  return ticket;
}

export async function updateTicketStatus(id: string, status: SupportTicket["status"]) {
  const tickets = await getSupportTickets();
  const nextTickets = tickets.map((ticket) => (ticket.id === id ? { ...ticket, status } : ticket));
  await writeCollection(TICKET_FILE, nextTickets);
  return nextTickets.find((ticket) => ticket.id === id) ?? null;
}
