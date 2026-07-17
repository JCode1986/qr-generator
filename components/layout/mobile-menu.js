"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function MobileMenu({ navItems }) {
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

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
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
              onClick={closeMenu}
              className="rounded-[var(--radius-sm)] px-2 py-2 no-underline transition duration-[var(--transition-fast)] hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              {item.label}
            </a>
          ))}
          <Button href="/#generator" onClick={closeMenu}>
            Create QR
          </Button>
        </nav>
      ) : null}
    </>
  );
}
