import { classNames } from "@/lib/class-names";

export function BrandMark({ className, title }) {
  const isDecorative = !title;

  return (
    <svg
      className={classNames("h-9 w-9 shrink-0", className)}
      viewBox="0 0 36 36"
      fill="none"
      role={isDecorative ? undefined : "img"}
      aria-hidden={isDecorative ? "true" : undefined}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      <rect width="36" height="36" rx="10" fill="var(--surface-elevated)" />
      <rect
        x="1"
        y="1"
        width="34"
        height="34"
        rx="9"
        stroke="var(--border)"
        strokeWidth="2"
      />
      <rect x="8" y="8" width="7" height="7" rx="2" fill="var(--accent)" />
      <rect
        x="21"
        y="8"
        width="7"
        height="7"
        rx="2"
        fill="var(--accent-secondary)"
      />
      <rect
        x="8"
        y="21"
        width="7"
        height="7"
        rx="2"
        fill="var(--accent-secondary)"
      />
      <path
        d="M21 22.5H28M24.5 19V26M18 13H19.5M13 18H14.5M18 26H19.5"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
