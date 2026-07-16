import "server-only";
import Stripe from "stripe";

let stripeClient;

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe is not configured.");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  return stripeClient;
}

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export function getStripePriceId() {
  if (!process.env.STRIPE_PRICE_ID) {
    throw new Error("Stripe price is not configured.");
  }

  return process.env.STRIPE_PRICE_ID;
}
