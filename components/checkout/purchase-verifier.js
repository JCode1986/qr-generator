"use client";

import { useEffect, useState } from "react";
import { premiumStorageKey } from "@/lib/stripe/products";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function PurchaseVerifier({ sessionId }) {
  const hasSession = Boolean(sessionId);
  const [status, setStatus] = useState(hasSession ? "verifying" : "error");
  const [message, setMessage] = useState(
    hasSession
      ? "Verifying your payment with Stripe."
      : "No checkout session was provided.",
  );

  useEffect(() => {
    if (!sessionId) {
      return undefined;
    }

    let isCurrent = true;

    async function verifyPurchase() {
      try {
        const response = await fetch("/api/verify-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const result = await response.json();

        if (!isCurrent) {
          return;
        }

        if (!response.ok || !result.active || !result.token) {
          setStatus("error");
          setMessage(result.error || "Payment could not be verified.");
          return;
        }

        window.localStorage.setItem(premiumStorageKey, result.token);
        setStatus("success");
        setMessage("QuickQR Pro is unlocked in this browser.");
      } catch {
        if (isCurrent) {
          setStatus("error");
          setMessage("Payment verification failed.");
        }
      }
    }

    verifyPurchase();

    return () => {
      isCurrent = false;
    };
  }, [sessionId]);

  return (
    <Card variant={status === "success" ? "accent" : "elevated"} padding="lg">
      <p className="text-sm font-semibold uppercase text-[var(--accent)]">
        Checkout status
      </p>
      <h1 className="mt-4 text-4xl font-semibold text-[var(--foreground)]">
        {status === "success" ? "Pro unlocked." : "Verifying purchase."}
      </h1>
      <p className="mt-4 text-base leading-7 text-[var(--muted)]" role="status" aria-live="polite">
        {message}
      </p>
      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
        Premium access is stored on this browser. Clearing browser data or
        switching devices may require a new purchase until account-based
        restoration is introduced.
      </p>
      <Button href="/#generator" className="mt-8">
        Return to generator
      </Button>
    </Card>
  );
}
