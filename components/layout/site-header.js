"use client";

import { useEffect, useState } from "react";
import { BrandWordmark } from "@/components/branding/brand-wordmark";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { scrollToHash } from "@/lib/smooth-scroll";

const navItems = [
  { label: "Generator", href: "#generator" },
  { label: "Features", href: "#features" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  function handleNavClick(event, href) {
    if (!event.defaultPrevented) {
      event.preventDefault();
      scrollToHash(href);
    }

    setOpen(false);
  }

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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[color-mix(in_srgb,var(--border)_78%,transparent)] bg-[color-mix(in_srgb,var(--background)_96%,black)] backdrop-blur-xl">
      <Container className="grid min-h-[var(--header-height)] grid-cols-[auto_auto] items-center justify-between gap-4 lg:grid-cols-[auto_1fr_auto]">
        <BrandWordmark />

        <nav className="hidden items-center justify-center gap-1 text-sm font-medium text-[color-mix(in_srgb,var(--muted)_88%,white)] lg:flex" aria-label="Main">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => handleNavClick(event, item.href)}
              className="rounded-[var(--radius-sm)] px-3 py-2 no-underline transition duration-[var(--transition-fast)] hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href="#generator" className="min-h-10 px-4">
            Create QR
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex min-h-10 items-center rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-sm font-semibold text-[var(--foreground)] lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((current) => !current)}
        >
          Menu
        </button>

        {open ? (
          <nav
            id="mobile-menu"
            className="col-span-2 grid w-full gap-2 border-t border-[var(--border)] pt-4 pb-4 text-sm text-[var(--muted)] lg:hidden"
            aria-label="Mobile"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(event) => handleNavClick(event, item.href)}
                className="rounded-[var(--radius-sm)] px-2 py-2 no-underline transition duration-[var(--transition-fast)] hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
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
