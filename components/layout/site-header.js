"use client";

import { useEffect, useState } from "react";
import { BrandWordmark } from "@/components/branding/brand-wordmark";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Generator", href: "#generator" },
  { label: "Features", href: "#features" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_96%,transparent)]">
      <Container className="flex min-h-[var(--header-height)] flex-wrap items-center justify-between gap-4 py-3">
        <BrandWordmark />

        <nav className="hidden items-center gap-6 text-sm font-medium text-[color-mix(in_srgb,var(--muted)_88%,white)] lg:flex" aria-label="Main">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-[var(--radius-sm)] no-underline transition duration-[var(--transition-fast)] hover:text-[var(--foreground)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href="#generator" variant="secondary">
            Create QR
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex min-h-11 items-center rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-sm font-semibold text-[var(--foreground)] lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((current) => !current)}
        >
          Menu
        </button>

        {open ? (
          <nav
            id="mobile-menu"
            className="grid w-full gap-2 border-t border-[var(--border)] pt-4 text-sm text-[var(--muted)] lg:hidden"
            aria-label="Mobile"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-[var(--radius-sm)] px-2 py-2 no-underline transition duration-[var(--transition-fast)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
              >
                {item.label}
              </a>
            ))}
            <Button href="#generator" onClick={() => setOpen(false)}>
              Create QR
            </Button>
          </nav>
        ) : null}
      </Container>
    </header>
  );
}
