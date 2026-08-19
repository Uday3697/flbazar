"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth";
import {
  createCategory,
  createOrder,
  createProduct,
  createSupportTicket,
  createUser,
  deleteCategoryById,
  deleteProductById,
  getProductBySlug,
  resetUserPasswordByLogin,
  updateOrderStatus,
  updateSiteSettings,
  updateTicketStatus,
  updateUserPassword,
} from "@/lib/data-store";
import { createAdminSessionToken, hashPassword, isAdminAuthenticated } from "@/lib/security";
import type { DownloadStatus, OrderStatus, SiteSettings, SupportTicket } from "@/lib/types";
import { panelPath, type PanelSection } from "@/lib/panel-nav";

function panelRedirect(
  section: PanelSection,
  params?: { success?: string; error?: string },
) {
  redirect(panelPath(section, params));
}

export async function loginAdmin(formData: FormData) {
  const password = String(formData.get("password") || "");
  const validPasswords = [
    process.env.ADMIN_PASSWORD_1,
    process.env.ADMIN_PASSWORD_2,
  ].filter(Boolean);

  if (!validPasswords.includes(password)) {
    redirect("/panel?error=Wrong%20password");
  }

  const store = await cookies();
  store.set("admin_session", createAdminSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/panel?success=Logged%20in&section=dashboard");
}

export async function logoutAdmin() {
  const store = await cookies();
  store.delete("admin_session");
  redirect("/panel?success=Logged%20out");
}

function collectDownloadUrls(formData: FormData) {
  const urls: string[] = [];
  for (let index = 1; index <= 5; index += 1) {
    const url = String(formData.get(`downloadUrl${index}`) || "").trim();
    if (url) urls.push(url);
  }
  const legacy = String(formData.get("downloadUrl") || "").trim();
  if (urls.length === 0 && legacy) urls.push(legacy);
  return urls;
}

export async function logoutUserAction() {
  await signOut({ redirectTo: "/" });
}

export async function createCategoryAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    panelRedirect("categories", { error: "Please login again" });
  }

  const name = String(formData.get("name") || "");
  const slug = String(formData.get("slug") || "");
  const description = String(formData.get("description") || "");

  if (!name || !description) {
    panelRedirect("categories", { error: "Category name and description are required" });
  }

  await createCategory({ name, slug, description });
  panelRedirect("categories", { success: "Category created" });
}

export async function createProductAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    panelRedirect("products", { error: "Please login again" });
  }

  const title = String(formData.get("title") || "");
  const slug = String(formData.get("slug") || "");
  const categorySlug = String(formData.get("categorySlug") || "");
  const format = String(formData.get("format") || "");
  const shortDescription = String(formData.get("shortDescription") || "");
  const description = String(formData.get("description") || "");
  const youtubeUrl = String(formData.get("youtubeUrl") || "");
  const downloadUrls = collectDownloadUrls(formData);
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
    !downloadPassword ||
    !price ||
    downloadUrls.length === 0
  ) {
    panelRedirect("products", { error: "Please fill all required product fields" });
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
    downloadUrl: downloadUrls[0],
    downloadUrls,
    downloadPassword,
    videoPassword,
    accent,
  });

  panelRedirect("products", { success: "Product published" });
}

export async function deleteProductAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    panelRedirect("products", { error: "Please login again" });
  }

  const productId = String(formData.get("productId") || "");
  if (!productId) {
    panelRedirect("products", { error: "Product not found" });
  }

  const deleted = await deleteProductById(productId);
  if (!deleted) {
    panelRedirect("products", { error: "Could not delete product" });
  }

  panelRedirect("products", { success: "Product deleted" });
}

export async function deleteCategoryAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    panelRedirect("categories", { error: "Please login again" });
  }

  const categoryId = String(formData.get("categoryId") || "");
  if (!categoryId) {
    panelRedirect("categories", { error: "Category not found" });
  }

  const result = await deleteCategoryById(categoryId);
  if (!result.ok) {
    panelRedirect("categories", { error: result.error || "Could not delete category" });
  }

  panelRedirect("categories", { success: "Category deleted" });
}

export async function updateWebsiteDetailsAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    panelRedirect("website", { error: "Please login again" });
  }

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
  };

  await updateSiteSettings(updates);
  panelRedirect("website", { success: "Website details updated" });
}

export async function updateGalleryAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    panelRedirect("gallery", { error: "Please login again" });
  }

  const galleryImages = String(formData.get("galleryImages") || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  await updateSiteSettings({ galleryImages });
  panelRedirect("gallery", { success: "Gallery images updated" });
}

export async function updateSiteSettingsAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    panelRedirect("website", { error: "Please login again" });
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
  panelRedirect("website", { success: "Website settings updated" });
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
    panelRedirect("orders", { error: "Please login again" });
  }

  const orderId = String(formData.get("orderId") || "");
  const status = String(formData.get("status") || "") as OrderStatus;
  const downloadStatus = String(formData.get("downloadStatus") || "") as DownloadStatus;

  if (!orderId) {
    panelRedirect("orders", { error: "Order not found" });
  }

  await updateOrderStatus(orderId, {
    status,
    downloadStatus,
  });
  panelRedirect("orders", { success: "Order updated" });
}

export async function updateTicketStatusAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    panelRedirect("support", { error: "Please login again" });
  }

  const ticketId = String(formData.get("ticketId") || "");
  const status = String(formData.get("status") || "") as SupportTicket["status"];

  if (!ticketId) {
    panelRedirect("support", { error: "Ticket not found" });
  }

  await updateTicketStatus(ticketId, status);
  panelRedirect("support", { success: "Ticket updated" });
}

export async function createCustomerAccountAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    panelRedirect("customers", { error: "Please login again" });
  }

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const password = String(formData.get("password") || "");

  if (!name || !password || password.length < 6) {
    panelRedirect("customers", { error: "Name and password (min 6 chars) are required" });
  }

  if (!email && !phone) {
    panelRedirect("customers", { error: "Email or mobile number is required" });
  }

  try {
    await createUser({
      name,
      email: email || undefined,
      phone: phone || undefined,
      passwordHash: hashPassword(password),
    });
    panelRedirect("customers", { success: "Customer account created" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create account";
    panelRedirect("customers", { error: message });
  }
}

export async function adminResetCustomerPasswordAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    panelRedirect("customers", { error: "Please login again" });
  }

  const userId = String(formData.get("userId") || "");
  const password = String(formData.get("password") || "");

  if (!userId || !password || password.length < 6) {
    panelRedirect("customers", { error: "Valid customer and password (min 6 chars) required" });
  }

  const updated = await updateUserPassword(userId, hashPassword(password));
  if (!updated) {
    panelRedirect("customers", { error: "Customer not found" });
  }

  panelRedirect("customers", { success: "Password updated for customer" });
}

export async function forgotPasswordAction(formData: FormData) {
  const login = String(formData.get("login") || "").trim();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!login || !password || password.length < 6) {
    redirect("/forgot-password?error=Enter+email/mobile+and+password+(min+6+chars)");
  }

  if (password !== confirmPassword) {
    redirect("/forgot-password?error=Passwords+do+not+match");
  }

  const result = await resetUserPasswordByLogin(login, hashPassword(password));
  if (!result.ok) {
    redirect(`/forgot-password?error=${encodeURIComponent(result.error || "Reset failed")}`);
  }

  redirect("/login?success=Password+reset.+You+can+login+now");
}
