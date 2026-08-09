"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createCategory,
  createOrder,
  createProduct,
  createSupportTicket,
  getProductBySlug,
  updateOrderStatus,
  updateSiteSettings,
  updateTicketStatus,
} from "@/lib/data-store";
import { createAdminSessionToken, isAdminAuthenticated } from "@/lib/security";
import type { DownloadStatus, OrderStatus, SiteSettings, SupportTicket } from "@/lib/types";

export async function loginAdmin(formData: FormData) {
  const password = String(formData.get("password") || "");
  const validPasswords = [
    process.env.ADMIN_PASSWORD_1,
    process.env.ADMIN_PASSWORD_2,
  ].filter(Boolean);

  if (!validPasswords.includes(password)) {
    redirect("/admin?error=Wrong%20password");
  }

  const store = await cookies();
  store.set("admin_session", createAdminSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/admin?success=Logged%20in");
}

export async function logoutAdmin() {
  const store = await cookies();
  store.delete("admin_session");
  redirect("/admin?success=Logged%20out");
}

export async function createCategoryAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=Please%20login%20again");
  }

  const name = String(formData.get("name") || "");
  const slug = String(formData.get("slug") || "");
  const description = String(formData.get("description") || "");

  if (!name || !description) {
    redirect("/admin?error=Category%20name%20and%20description%20are%20required");
  }

  await createCategory({ name, slug, description });
  redirect("/admin?success=Category%20created");
}

export async function createProductAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=Please%20login%20again");
  }

  const title = String(formData.get("title") || "");
  const slug = String(formData.get("slug") || "");
  const categorySlug = String(formData.get("categorySlug") || "");
  const format = String(formData.get("format") || "");
  const shortDescription = String(formData.get("shortDescription") || "");
  const description = String(formData.get("description") || "");
  const youtubeUrl = String(formData.get("youtubeUrl") || "");
  const downloadUrl = String(formData.get("downloadUrl") || "");
  const downloadPassword = String(formData.get("downloadPassword") || "");
  const videoPassword = String(formData.get("videoPassword") || "");
  const accent = String(formData.get("accent") || "");
  const price = Number(formData.get("price") || 0);

  if (
    !title ||
    !categorySlug ||
    !format ||
    !shortDescription ||
    !description ||
    !youtubeUrl ||
    !downloadUrl ||
    !downloadPassword ||
    !price
  ) {
    redirect("/admin?error=Please%20fill%20all%20required%20product%20fields");
  }

  await createProduct({
    title,
    slug,
    categorySlug,
    format,
    price,
    shortDescription,
    description,
    youtubeUrl,
    downloadUrl,
    downloadPassword,
    videoPassword,
    accent,
  });

  redirect("/admin?success=Product%20published");
}

export async function updateSiteSettingsAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=Please%20login%20again");
  }

  const galleryImages = String(formData.get("galleryImages") || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const updates: Partial<SiteSettings> = {
    brandName: String(formData.get("brandName") || "").trim(),
    sellerName: String(formData.get("sellerName") || "").trim(),
    logoText: String(formData.get("logoText") || "").trim(),
    siteTitle: String(formData.get("siteTitle") || "").trim(),
    heroBadge: String(formData.get("heroBadge") || "").trim(),
    heroHeading: String(formData.get("heroHeading") || "").trim(),
    heroDescription: String(formData.get("heroDescription") || "").trim(),
    catalogueHeading: String(formData.get("catalogueHeading") || "").trim(),
    catalogueDescription: String(formData.get("catalogueDescription") || "").trim(),
    portfolioHeading: String(formData.get("portfolioHeading") || "").trim(),
    portfolioDescription: String(formData.get("portfolioDescription") || "").trim(),
    contactHeading: String(formData.get("contactHeading") || "").trim(),
    contactDescription: String(formData.get("contactDescription") || "").trim(),
    footerNote: String(formData.get("footerNote") || "").trim(),
    supportEmail: String(formData.get("supportEmail") || "").trim(),
    supportPhone: String(formData.get("supportPhone") || "").trim(),
    supportWhatsapp: String(formData.get("supportWhatsapp") || "").trim(),
    supportInstagram: String(formData.get("supportInstagram") || "").trim(),
    paletteKey: String(formData.get("paletteKey") || "").trim(),
    galleryImages,
  };

  await updateSiteSettings(updates);
  redirect("/admin?success=Website%20settings%20updated");
}

export async function createOrderAction(formData: FormData) {
  const customerName = String(formData.get("customerName") || "");
  const customerEmail = String(formData.get("customerEmail") || "");
  const customerPhone = String(formData.get("customerPhone") || "");
  const productSlug = String(formData.get("productSlug") || "");

  const product = await getProductBySlug(productSlug);

  if (!product || !customerName || !customerEmail || !customerPhone) {
    redirect(`/checkout/${productSlug}?error=Please%20complete%20the%20checkout%20form`);
  }

  const order = await createOrder({
    productSlug,
    customerName,
    customerEmail,
    customerPhone,
    amount: product.price,
  });

  redirect(`/order/${order.id}?success=Payment%20successful`);
}

export async function markDownloadSuccessfulAction(formData: FormData) {
  const orderId = String(formData.get("orderId") || "");

  if (!orderId) {
    redirect("/");
  }

  await updateOrderStatus(orderId, { downloadStatus: "success" });
  redirect(`/order/${orderId}?success=Download%20status%20saved`);
}

export async function createSupportTicketAction(formData: FormData) {
  const orderId = String(formData.get("orderId") || "");
  const productSlug = String(formData.get("productSlug") || "");
  const customerName = String(formData.get("customerName") || "");
  const customerEmail = String(formData.get("customerEmail") || "");
  const customerPhone = String(formData.get("customerPhone") || "");
  const issueType = String(formData.get("issueType") || "other") as SupportTicket["issueType"];
  const message = String(formData.get("message") || "");
  const returnPath = String(formData.get("returnPath") || "/");

  if (!customerName || !customerEmail || !customerPhone || !message) {
    redirect(`${returnPath}?error=Please%20fill%20all%20support%20fields`);
  }

  await createSupportTicket({
    orderId,
    productSlug,
    customerName,
    customerEmail,
    customerPhone,
    issueType,
    message,
  });

  if (orderId) {
    await updateOrderStatus(orderId, { downloadStatus: "failed" });
  }

  redirect(`${returnPath}?success=Support%20ticket%20created`);
}

export async function updateOrderStatusAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=Please%20login%20again");
  }

  const orderId = String(formData.get("orderId") || "");
  const status = String(formData.get("status") || "") as OrderStatus;
  const downloadStatus = String(formData.get("downloadStatus") || "") as DownloadStatus;

  if (!orderId) {
    redirect("/admin?error=Order%20not%20found");
  }

  await updateOrderStatus(orderId, {
    status,
    downloadStatus,
  });
  redirect("/admin?success=Order%20updated");
}

export async function updateTicketStatusAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=Please%20login%20again");
  }

  const ticketId = String(formData.get("ticketId") || "");
  const status = String(formData.get("status") || "") as SupportTicket["status"];

  if (!ticketId) {
    redirect("/admin?error=Ticket%20not%20found");
  }

  await updateTicketStatus(ticketId, status);
  redirect("/admin?success=Ticket%20updated");
}
