import { Container } from "@/components/layout/container";
import { FaqSection } from "@/components/marketing/faq-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { FinalCta } from "@/components/marketing/final-cta";
import { HeroSection } from "@/components/marketing/hero-section";
import { PricingSection } from "@/components/marketing/pricing-section";
import { UseCasesSection } from "@/components/marketing/use-cases-section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const workflow = [
  {
    title: "Generate",
    status: "Available",
    statusVariant: "success",
    description: "Enter a URL, plain text, email, phone number, or Wi-Fi string.",
  },
  {
    title: "Customize",
    status: "Available",
    statusVariant: "success",
    description: "Adjust colors, size, error correction, margin, and optional logo.",
  },
  {
    title: "Download",
    status: "Available",
    statusVariant: "success",
    description: "Export PNG or SVG files, with high-resolution Pro options.",
  },
];

export default function Home() {
  return (
    <>
      <HeroSection />

      <section
        id="how-it-works"
        className="scroll-mt-[calc(var(--header-height)+1rem)] pb-10 sm:pb-14 lg:pb-16"
      >
        <Container>
          <div className="mb-5 flex min-w-0 flex-wrap items-center gap-3">
            <Badge variant="muted">How it works</Badge>
            <p className="min-w-0 max-w-full break-words text-sm text-[var(--muted)]">
              Generate, customize, and export a static QR code in one browser session.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {workflow.map((item) => (
              <Card key={item.title} variant="elevated" className="min-w-0">
                <div className="mb-5 flex items-center gap-3">
                  <span
                    className="size-2 rounded-full bg-[var(--accent-secondary)]"
                    aria-hidden="true"
                  />
                  <Badge variant={item.statusVariant}>{item.status}</Badge>
                </div>
                <h2 className="max-w-full break-words text-xl font-semibold text-[var(--foreground)]">
                  {item.title}
                </h2>
                <p className="mt-3 max-w-full break-words text-sm leading-6 text-[var(--muted)]">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <FeaturesSection />
      <UseCasesSection />
      <PricingSection />
      <FaqSection />
      <FinalCta />
    </>
  );
}
