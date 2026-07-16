import { Container } from "@/components/layout/container";
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
    <section className="py-14 sm:py-20 lg:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div className="max-w-3xl">
            <Badge variant="accent">Project foundation</Badge>
            <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              QuickQR is taking shape.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              A fast, customizable QR code generator is being built here. Static
              QR creation, polished exports, and premium design options will
              arrive through focused development segments.
            </p>
          </div>

          <Card variant="accent" className="self-stretch">
            <Badge variant="muted">Current segment</Badge>
            <p className="mt-4 text-lg font-semibold text-[var(--foreground)]">
              Reusable design system and application shell.
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Shared brand, layout, and UI primitives are being prepared before
              product functionality begins.
            </p>
          </Card>
        </div>

        <div className="mt-12">
          <div className="mb-4 flex flex-wrap items-center gap-3">
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
        </div>
      </Container>
    </section>
  );
}
