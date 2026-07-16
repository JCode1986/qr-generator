import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Checkout Canceled",
  description: "No QuickQR Pro purchase was completed.",
};

export default function CheckoutCancelPage() {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl">
          <Card variant="elevated" padding="lg">
            <p className="text-sm font-semibold uppercase text-[var(--accent)]">
              Checkout canceled
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-[var(--foreground)]">
              No purchase completed.
            </h1>
            <p className="mt-4 text-base leading-7 text-[var(--muted)]">
              Your checkout session was canceled. You can keep using the free
              static QR generator.
            </p>
            <Button href="/#generator" className="mt-8">
              Return to generator
            </Button>
          </Card>
        </div>
      </Container>
    </section>
  );
}
