import { BrandWordmark } from "@/components/branding/brand-wordmark";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)]">
      <Container className="flex min-h-[var(--header-height)] flex-wrap items-center justify-between gap-3 py-4">
        <BrandWordmark />
        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
          <Badge variant="accent">In development</Badge>
          <p>Static QR tools coming soon</p>
        </div>
      </Container>
    </header>
  );
}
