import "server-only";
import crypto from "crypto";
import { quickQrPro } from "@/lib/stripe/products";

const tokenVersion = "v1";

function getSecret() {
  if (!process.env.PREMIUM_TOKEN_SECRET) {
    throw new Error("Premium token signing is not configured.");
  }

  return process.env.PREMIUM_TOKEN_SECRET;
}

function base64UrlEncode(value) {
  return Buffer.from(value).toString("base64url");
}

function signPayload(payload) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
}

export function createPremiumToken({ sessionId }) {
  const payload = {
    product: quickQrPro.id,
    sessionId,
    issuedAt: Date.now(),
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(`${tokenVersion}.${encodedPayload}`);

  return `${tokenVersion}.${encodedPayload}.${signature}`;
}

export function verifyPremiumToken(token) {
  if (!token || typeof token !== "string") {
    return { active: false };
  }

  const [version, encodedPayload, signature] = token.split(".");

  if (version !== tokenVersion || !encodedPayload || !signature) {
    return { active: false };
  }

  const expectedSignature = signPayload(`${version}.${encodedPayload}`);
  const signatureBuffer = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedSignatureBuffer.length) {
    return { active: false };
  }

  if (!crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer)) {
    return { active: false };
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    );

    return {
      active: payload.product === quickQrPro.id,
      payload,
    };
  } catch {
    return { active: false };
  }
}
