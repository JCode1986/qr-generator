import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const features = [
  {
    title: "Instant generation",
    description: "Type a URL or message and the QR preview updates in your browser.",
  },
  {
    title: "Color customization",
    description: "Choose foreground and background colors with hex precision.",
  },
  {
    title: "High-resolution exports",
    description: "Download standard PNG and SVG files, with larger Pro exports available.",
  },
  {
    title: "Logo support",
    description: "Preview centered logos with a white backing plate and export with Pro.",
  },
  {
    title: "Browser-based privacy",
    description: "QR content and uploaded logos are generated locally and are not saved by QuickQR.",
  },
  {
    title: "Mobile-friendly editor",
    description: "Use the generator from desktop, tablet, or phone-sized screens.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-14 sm:py-20">
      <Container>
        <div className="max-w-2xl">
          <Badge variant="accent">Features</Badge>
          <h2 className="mt-4 text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
            Everything needed for static QR codes.
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--muted)]">
            QuickQR focuses on fast, standards-compliant static QR generation
            without accounts or a database.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} variant="elevated">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
