import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Privacy Policy",
  description: "How QuickQR handles QR content, uploaded logos, and payments.",
};

export default function PrivacyPage() {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <Card variant="elevated" padding="lg" className="max-w-none">
          <h1 className="text-4xl font-semibold text-[var(--foreground)]">
            Privacy Policy
          </h1>
          <div className="mt-6 space-y-5 text-base leading-7 text-[var(--muted)]">
            <p>
              QuickQR generates static QR content client-side in your browser.
              QR content is not intentionally stored by QuickQR.
            </p>
            <p>
              Uploaded logos remain local in the browser for preview and export.
              They are not uploaded to a QuickQR server.
            </p>
            <p>
              Stripe processes payments for QuickQR Pro. Payment details are
              handled by Stripe, not stored by QuickQR.
            </p>
            <p>
              Hosting providers may collect basic technical logs such as request
              metadata, IP address, browser information, and error diagnostics.
            </p>
            <p>
              The MVP does not include user accounts. Premium access is stored in
              browser storage after a verified Stripe checkout.
            </p>
          </div>
        </Card>
      </Container>
    </section>
  );
}
