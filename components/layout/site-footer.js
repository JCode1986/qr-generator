import { BrandWordmark } from "@/components/branding/brand-wordmark";
import { Container } from "@/components/layout/container";

const footerLinks = [
  { label: "Generator", href: "/#generator" },
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <Container className="grid gap-6 py-8 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="space-y-3">
          <BrandWordmark />
          <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">
            QR codes made fast, clean, and customizable. Generate static QR
            codes in the browser without an account.
          </p>
        </div>
        <div className="space-y-4 text-sm text-[var(--muted)] sm:text-right">
          <nav className="flex flex-wrap gap-3 sm:justify-end" aria-label="Footer">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-[var(--radius-sm)] no-underline hover:text-[var(--foreground)]"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <p>Built with Next.js and JavaScript.</p>
          <p>&copy; {year} QuickQR.</p>
        </div>
      </Container>
    </footer>
  );
}
