import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function FinalCta() {
  return (
    <section className="quickqr-defer-section scroll-mt-[calc(var(--header-height)+1rem)] py-14 sm:py-20">
      <Container>
        <Card variant="accent" padding="lg" className="min-w-0 text-center">
          <h2 className="max-w-full break-words text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
            Create your QR code now.
          </h2>
          <p className="mx-auto mt-4 w-full break-words text-base leading-7 text-[var(--muted)]">
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
