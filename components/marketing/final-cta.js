import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function FinalCta() {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <Card variant="accent" padding="lg" className="text-center">
          <h2 className="text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
            Create your QR code now.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
            No account required. Customize it, scan it, and download it in minutes.
          </p>
          <Button href="#generator" className="mt-8">
            Open the generator
          </Button>
        </Card>
      </Container>
    </section>
  );
}
