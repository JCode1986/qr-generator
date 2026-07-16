import { Container } from "@/components/layout/container";
import { HeroSection } from "@/components/marketing/hero-section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const plannedWorkflow = [
  {
    title: "Generate",
    description: "Enter a URL or text and create a static QR code.",
  },
  {
    title: "Customize",
    description: "Adjust colors, size, and presentation.",
  },
  {
    title: "Download",
    description: "Export polished PNG and SVG files.",
  },
];

export default function Home() {
  return (
    <>
      <HeroSection />

      <section id="how-it-works" className="pb-10 sm:pb-14 lg:pb-16">
        <Container>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <Badge variant="muted">Planned workflow</Badge>
            <p className="text-sm text-[var(--muted)]">
              These cards describe planned capabilities, not active controls.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {plannedWorkflow.map((item) => (
              <Card key={item.title} variant="elevated">
                <div className="mb-5 flex items-center gap-3">
                  <span
                    className="size-2 rounded-full bg-[var(--accent-secondary)]"
                    aria-hidden="true"
                  />
                  <Badge variant="muted">Planned</Badge>
                </div>
                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="roadmap" className="pb-14 sm:pb-20 lg:pb-24">
        <Container>
          <Card variant="accent" className="max-w-3xl">
            <Badge variant="accent">
              Generator coming in the next build segment
            </Badge>
            <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">
              Development status
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)] sm:text-base">
              The landing-page hero and editor preview are in place. Static QR
              generation, real customization controls, and PNG/SVG exports are
              planned next.
            </p>
          </Card>
        </Container>
      </section>
    </>
  );
}
