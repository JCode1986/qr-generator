import { classNames } from "@/lib/class-names";

const variants = {
  default: "border-[var(--border)] bg-[var(--surface)]",
  elevated: "border-[var(--border)] bg-[var(--surface-elevated)] shadow-[var(--shadow-soft)]",
  accent:
    "border-[color-mix(in_srgb,var(--accent-secondary)_35%,transparent)] bg-[color-mix(in_srgb,var(--accent-secondary)_10%,var(--surface))]",
};

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

export function Card({
  as: Component = "div",
  variant = "default",
  padding = "md",
  className,
  children,
  ...props
}) {
  return (
    <Component
      {...props}
      className={classNames(
        "rounded-[var(--radius-md)] border",
        variants[variant] || variants.default,
        paddingClasses[padding] || paddingClasses.md,
        className,
      )}
    >
      {children}
    </Component>
  );
}
