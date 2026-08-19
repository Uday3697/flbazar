import { createCipheriv, createDecipheriv, createHmac, randomBytes, scryptSync } from "node:crypto";
import { cookies } from "next/headers";

export type DownloadTokenPayload = {
  orderId: string;
  productSlug: string;
  expiresAt: number;
  partIndex?: number;
};

function base64UrlEncode(value: Buffer) {
  return value.toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url");
}

function getSiteSecret() {
  return process.env.SITE_SECRET || "change-this-secret-before-production";
}

function getEncryptionKey() {
  return scryptSync(getSiteSecret(), "download-token-salt", 32);
}

export function createAdminSessionToken() {
  return createHmac("sha256", getSiteSecret()).update("admin-session").digest("hex");
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  return store.get("admin_session")?.value === createAdminSessionToken();
}

export function encryptDownloadToken(payload: DownloadTokenPayload) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(payload), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [iv, tag, encrypted].map(base64UrlEncode).join(".");
}

export function decryptDownloadToken(token: string) {
  const [ivPart, tagPart, payloadPart] = token.split(".");

  if (!ivPart || !tagPart || !payloadPart) {
    throw new Error("Invalid token");
  }

  const decipher = createDecipheriv("aes-256-gcm", getEncryptionKey(), base64UrlDecode(ivPart));
  decipher.setAuthTag(base64UrlDecode(tagPart));
  const decrypted = Buffer.concat([
    decipher.update(base64UrlDecode(payloadPart)),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString("utf8")) as DownloadTokenPayload;
}

export function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [saltHex, hashHex] = storedHash.split(":");
  if (!saltHex || !hashHex) return false;
  const hash = scryptSync(password, Buffer.from(saltHex, "hex"), 64);
  return hash.toString("hex") === hashHex;
}
