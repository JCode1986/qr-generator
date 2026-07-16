import { Container } from "@/components/layout/container";
import { QrEditorPreview } from "@/components/marketing/qr-editor-preview";
import { TrustPoints } from "@/components/marketing/trust-points";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="py-14 sm:py-20 lg:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.48fr)_minmax(0,0.52fr)] lg:items-center">
          <div className="max-w-2xl">
            <Badge variant="accent">Fast static QR creation</Badge>
            <h1 className="mt-6 max-w-xl text-5xl font-semibold leading-[1.02] text-[var(--foreground)] sm:text-6xl lg:text-7xl">
              Create a QR code in seconds.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Generate clean, customizable static QR codes for links, text,
              menus, events, and more. No account required for the basic
              experience.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--muted)]">
              Dynamic QR codes and scan analytics may be introduced in a future
              version.
            </p>
            <div className="mt-5">
              <Badge variant="muted">
                Generator coming in the next build segment
              </Badge>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="#editor-preview">See how it will work</Button>
              <Button href="#roadmap" variant="secondary">
                View development status
              </Button>
            </div>

            <div className="mt-8">
              <TrustPoints />
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute inset-4 rounded-full bg-[var(--shadow-accent)] blur-3xl"
              aria-hidden="true"
            />
            <div className="relative">
              <QrEditorPreview />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
