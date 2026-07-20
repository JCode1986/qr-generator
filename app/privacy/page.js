import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Privacy Policy",
  description: "How QuickQR handles QR content and uploaded logos.",
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
              Hosting providers may collect basic technical logs such as request
              metadata, IP address, browser information, and error diagnostics.
            </p>
            <p>
              QuickQR Pro is listed as a planned feature for this portfolio
              project and is not currently available for purchase.
            </p>
          </div>
        </Card>
      </Container>
    </section>
  );
}
