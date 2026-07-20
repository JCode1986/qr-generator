import { classNames } from "@/lib/class-names";

const variants = {
  primary:
    "border-[var(--button-primary-border)] bg-[var(--button-primary-background)] text-[var(--button-primary-foreground)] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_14px_30px_rgba(45,212,232,0.18)] hover:bg-[var(--button-primary-hover)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_18px_34px_rgba(45,212,232,0.24)] active:bg-[var(--button-primary-active)]",
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
