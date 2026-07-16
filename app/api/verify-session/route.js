import { NextResponse } from "next/server";
import { createPremiumToken, verifyPremiumToken } from "@/lib/stripe/entitlement";
import { quickQrPro } from "@/lib/stripe/products";
import { getStripe, getStripePriceId } from "@/lib/stripe/stripe-server";

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ active: false, error: "Invalid request." }, { status: 400 });
  }

  if (body?.token) {
    try {
      const entitlement = verifyPremiumToken(body.token);

      return NextResponse.json({ active: entitlement.active });
    } catch {
      return NextResponse.json({ active: false });
    }
  }

  if (!body?.sessionId || typeof body.sessionId !== "string") {
    return NextResponse.json(
      { active: false, error: "Missing session ID." },
      { status: 400 },
    );
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(body.sessionId, {
      expand: ["line_items.data.price"],
    });
    const purchasedPrice = session.line_items?.data?.[0]?.price?.id;
    const isPaid = session.payment_status === "paid";
    const isExpectedProduct = session.metadata?.product === quickQrPro.id;
    const isExpectedPrice = purchasedPrice === getStripePriceId();

    if (!isPaid || !isExpectedProduct || !isExpectedPrice) {
      return NextResponse.json({ active: false }, { status: 403 });
    }

    return NextResponse.json({
      active: true,
      token: createPremiumToken({ sessionId: session.id }),
    });
  } catch {
    return NextResponse.json(
      { active: false, error: "Payment verification failed." },
      { status: 503 },
    );
  }
}
