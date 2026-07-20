import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Terms of Use",
  description: "Terms for using QuickQR static QR generation.",
};

export default function TermsPage() {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <Card variant="elevated" padding="lg" className="max-w-none">
          <h1 className="text-4xl font-semibold text-[var(--foreground)]">
            Terms of Use
          </h1>
          <div className="mt-6 space-y-5 text-base leading-7 text-[var(--muted)]">
            <p>
              QuickQR provides browser-based tools for generating static QR
              codes. You are responsible for the content encoded in your QR
              codes and how you use exported assets.
            </p>
            <p>
              Static QR destinations cannot be changed after export. QuickQR does
              not guarantee that third-party destinations remain available, safe,
              or accurate.
            </p>
            <p>
              Do not use QuickQR for illegal, abusive, deceptive, or harmful
              content.
            </p>
            <p>
              QuickQR Pro and premium exports are planned features for this
              portfolio project and are not currently available for purchase.
            </p>
            <p>
              The service is provided without warranties beyond those required by
              applicable law.
            </p>
          </div>
        </Card>
      </Container>
    </section>
  );
}
