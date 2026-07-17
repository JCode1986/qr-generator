import { Container } from "@/components/layout/container";
import { quickQrPro } from "@/lib/stripe/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const freeFeatures = [
  "Unlimited static QR generation",
  "URLs and plain text",
  "Foreground and background colors",
  "256px and 512px PNG",
  "Basic SVG without logo",
  "No account required",
];

const proFeatures = [
  "1024px and 2048px PNG",
  "Logo upload and export",
  "Premium presets",
  "High-resolution export",
  "Full SVG export with logo",
  "One-time purchase",
];

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="quickqr-defer-section scroll-mt-[calc(var(--header-height)+1rem)] py-14 sm:py-20"
    >
      <Container>
        <div className="min-w-0 w-full">
          <Badge variant="accent">Pricing</Badge>
          <h2 className="mt-4 max-w-full break-words text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
            Start free. Unlock premium exports when needed.
          </h2>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Card variant="elevated" padding="lg" className="min-w-0">
            <Badge variant="muted">Free</Badge>
            <p className="mt-5 max-w-full break-words text-4xl font-semibold text-[var(--foreground)]">
              $0
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-6 text-[var(--muted)]">
              {freeFeatures.map((feature) => (
                <li key={feature} className="max-w-full break-words">
                  {feature}
                </li>
              ))}
            </ul>
            <Button href="#generator" className="mt-8 w-full">
              Create a QR
            </Button>
          </Card>

          <Card variant="accent" padding="lg" className="min-w-0">
            <Badge variant="success">{quickQrPro.name}</Badge>
            <p className="mt-5 max-w-full break-words text-4xl font-semibold text-[var(--foreground)]">
              {quickQrPro.priceLabel}
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-6 text-[var(--muted)]">
              {proFeatures.map((feature) => (
                <li key={feature} className="max-w-full break-words">
                  {feature}
                </li>
              ))}
            </ul>
            <Button href="#generator" variant="secondary" className="mt-8 w-full">
              Unlock Pro
            </Button>
          </Card>
        </div>
        <p className="mt-5 w-full break-words text-sm leading-6 text-[var(--muted)]">
          Unlock premium exports on this browser after purchase. Without
          accounts or a database, entitlement restoration across devices or
          cleared browser storage is limited.
        </p>
      </Container>
    </section>
  );
}
