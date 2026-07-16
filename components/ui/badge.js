import { classNames } from "@/lib/class-names";

const variants = {
  default:
    "border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--foreground)]",
  accent:
    "border-[color-mix(in_srgb,var(--accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)]",
  success:
    "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  muted: "border-[var(--border)] bg-transparent text-[var(--muted)]",
};

export function Badge({ variant = "default", className, children }) {
  return (
    <span
      className={classNames(
        "inline-flex min-h-7 max-w-full items-center rounded-full border px-3 py-1 text-left text-xs font-medium leading-tight",
        variants[variant] || variants.default,
        className,
      )}
    >
      {children}
    </span>
  );
}
