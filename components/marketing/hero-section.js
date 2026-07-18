import { Container } from "@/components/layout/container";
import { QrGenerator } from "@/components/generator/qr-generator";
import { TrustPoints } from "@/components/marketing/trust-points";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="py-7 sm:py-9 lg:py-11">
      <Container>
        <div className="grid gap-7 min-[1180px]:grid-cols-[minmax(320px,0.72fr)_minmax(760px,1.65fr)] min-[1180px]:items-start xl:gap-9">
          <div className="max-w-xl pt-2 min-[1180px]:pt-7">
            <Badge variant="accent">Fast static QR creation</Badge>
            <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.03] text-[var(--foreground)] sm:text-5xl xl:text-[3.4rem]">
              Create a QR code in seconds.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Generate polished static QR codes for links, text, menus, events,
              contact details, and more. Customize the design and download
              instantly.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href="#generator">Create your QR</Button>
              <Button href="#features" variant="secondary">
                Explore features
              </Button>
            </div>

            <div className="mt-7">
              <TrustPoints />
            </div>
          </div>

          <div className="relative min-w-0 self-stretch">
            <div
              className="absolute inset-4 rounded-full bg-[var(--shadow-accent)] blur-3xl"
              aria-hidden="true"
            />
            <div className="relative h-full w-full">
              <QrGenerator />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
