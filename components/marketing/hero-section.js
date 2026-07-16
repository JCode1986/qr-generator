import { Container } from "@/components/layout/container";
import { QrGenerator } from "@/components/generator/qr-generator";
import { TrustPoints } from "@/components/marketing/trust-points";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="py-10 sm:py-14 lg:py-18">
      <Container>
        <div className="grid gap-10 min-[1200px]:grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)] min-[1200px]:items-start xl:gap-12">
          <div className="max-w-xl pt-2 min-[1200px]:pt-8">
            <Badge variant="accent">Fast static QR creation</Badge>
            <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.04] text-[var(--foreground)] sm:text-5xl xl:text-6xl">
              Create a QR code in seconds.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Generate polished static QR codes for links, text, menus, events,
              contact details, and more. Customize the design and download
              instantly.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="#generator">Create your QR</Button>
              <Button href="#features" variant="secondary">
                Explore features
              </Button>
            </div>

            <div className="mt-8">
              <TrustPoints />
            </div>
          </div>

          <div className="relative min-w-0">
            <div
              className="absolute inset-4 rounded-full bg-[var(--shadow-accent)] blur-3xl"
              aria-hidden="true"
            />
            <div className="relative">
              <QrGenerator />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
