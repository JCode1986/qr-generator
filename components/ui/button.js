import { classNames } from "@/lib/class-names";

const variants = {
  primary:
    "border-[color-mix(in_srgb,var(--accent)_70%,white_10%)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-cyan-200 active:bg-cyan-300",
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
  const classes = classNames(
    "inline-flex min-h-11 items-center justify-center rounded-[var(--radius-sm)] border px-4 py-2 text-sm font-semibold no-underline transition duration-[var(--transition-fast)]",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)]",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant] || variants.primary,
    className,
  );

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} type={type} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
