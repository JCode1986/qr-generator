"use client";

import Link from "next/link";
import { classNames } from "@/lib/class-names";
import { scrollToHash } from "@/lib/smooth-scroll";

const variants = {
  primary:
    "border-[color-mix(in_srgb,var(--accent)_70%,white_10%)] bg-[var(--accent)] text-slate-950 hover:bg-cyan-200 active:bg-cyan-300",
  secondary:
    "border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--foreground)] hover:bg-[var(--surface-hover)] active:bg-[var(--surface-active)]",
  ghost:
    "border-transparent bg-transparent text-[var(--muted)] hover:border-[var(--border)] hover:text-[var(--foreground)] active:bg-[var(--surface-elevated)]",
};

export function Button({
  variant = "primary",
  className,
  href,
  disabled = false,
  type = "button",
  children,
  ...props
}) {
  function handleHashClick(event) {
    props.onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    event.preventDefault();
    scrollToHash(href);
  }

  const classes = classNames(
    "inline-flex min-h-11 items-center justify-center rounded-[var(--radius-sm)] border px-4 py-2 text-sm font-semibold no-underline transition duration-[var(--transition-fast)]",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)]",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant] || variants.primary,
    className,
  );

  if (href?.startsWith("#")) {
    return (
      <a href={href} className={classes} {...props} onClick={handleHashClick}>
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
