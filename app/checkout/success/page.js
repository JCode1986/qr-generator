import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "QuickQR Pro Coming Soon",
  description: "QuickQR Pro is not currently available for purchase.",
};

export default function CheckoutSuccessPage() {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl">
          <Card variant="elevated" padding="lg">
            <p className="text-sm font-semibold uppercase text-[var(--accent)]">
              Coming soon
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-[var(--foreground)]">
              QuickQR Pro is not available yet.
            </h1>
            <p className="mt-4 text-base leading-7 text-[var(--muted)]">
              Premium exports are shown as a planned product direction for this
              portfolio project.
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
