import { BrandWordmark } from "@/components/branding/brand-wordmark";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <Container className="grid gap-6 py-8 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="space-y-3">
          <BrandWordmark />
          <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">
            QuickQR is being developed as a fast, customizable QR code generator
            for the browser.
          </p>
        </div>
        <div className="space-y-3 text-sm text-[var(--muted)] sm:text-right">
          <Badge variant="muted">Early development</Badge>
          <p>Built with Next.js and JavaScript.</p>
          <p>&copy; {year} QuickQR.</p>
        </div>
      </Container>
    </footer>
  );
}
