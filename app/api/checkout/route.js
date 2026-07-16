import { NextResponse } from "next/server";
import { quickQrPro } from "@/lib/stripe/products";
import { getAppUrl, getStripe, getStripePriceId } from "@/lib/stripe/stripe-server";

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid checkout request." }, { status: 400 });
  }

  if (body?.product !== quickQrPro.id) {
    return NextResponse.json({ error: "Invalid product." }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const appUrl = getAppUrl();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: getStripePriceId(),
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancel`,
      metadata: {
        product: quickQrPro.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Checkout is not configured yet." },
      { status: 503 },
    );
  }
}
