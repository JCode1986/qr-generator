import { Container } from "@/components/layout/container";
import { FaqSection } from "@/components/marketing/faq-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { FinalCta } from "@/components/marketing/final-cta";
import { HeroSection } from "@/components/marketing/hero-section";
import { PricingSection } from "@/components/marketing/pricing-section";
import { UseCasesSection } from "@/components/marketing/use-cases-section";
import { Badge } from "@/components/ui/badge";

const workflow = [
  {
    title: "Generate",
    description: "Enter a URL, plain text, email, phone number, or Wi-Fi string.",
  },
  {
    title: "Customize",
    description: "Adjust colors, size, error correction, margin, and optional logo.",
  },
  {
    title: "Download",
    description: "Export PNG or SVG files, with high-resolution Pro options.",
  },
];

export default function Home() {
  return (
    <>
      <HeroSection />

      <section
        id="how-it-works"
        className="scroll-mt-[calc(var(--header-height)+1rem)] pb-10 sm:pb-12"
      >
        <Container>
          <div className="grid gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_78%,transparent)] p-3 shadow-[var(--shadow-soft)] md:grid-cols-[0.85fr_1fr_1fr_1fr] md:items-center">
            <div className="min-w-0">
              <Badge variant="muted">Workflow</Badge>
              <p className="mt-2 text-sm leading-5 text-[var(--muted)]">
                Static QR creation in one browser session.
              </p>
            </div>
            {workflow.map((item) => (
              <div key={item.title} className="min-w-0 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-elevated)] p-3 md:border-l">
                <p className="max-w-full break-words text-sm font-semibold text-[var(--foreground)]">
                  {item.title}
                </p>
                <p className="mt-1 max-w-full break-words text-sm leading-5 text-[var(--muted)]">
                  {item.description}
                </p>
              </div>
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
