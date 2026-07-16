import { BrandWordmark } from "@/components/branding/brand-wordmark";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)]">
      <Container className="flex min-h-[var(--header-height)] flex-wrap items-center justify-between gap-3 py-4">
        <BrandWordmark />
        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)] sm:gap-5">
          <Badge variant="accent">In development</Badge>
          <nav className="flex items-center gap-4" aria-label="Landing page">
            <a
              href="#how-it-works"
              className="rounded-[var(--radius-sm)] no-underline transition duration-[var(--transition-fast)] hover:text-[var(--foreground)]"
            >
              How it works
            </a>
            <a
              href="#roadmap"
              className="rounded-[var(--radius-sm)] no-underline transition duration-[var(--transition-fast)] hover:text-[var(--foreground)]"
            >
              Roadmap
            </a>
          </nav>
        </div>
      </Container>
    </header>
  );
}
