import { BrandMark } from "@/components/branding/brand-mark";
import { siteConfig } from "@/lib/site";
import { classNames } from "@/lib/class-names";

export function BrandWordmark({ className, href = "/", showMark = true }) {
  const content = (
    <>
      {showMark ? <BrandMark /> : null}
      <span className="text-base font-semibold tracking-normal text-[var(--foreground)]">
        Quick<span className="text-[var(--accent)]">QR</span>
      </span>
    </>
  );

  const sharedClasses = classNames(
    "inline-flex items-center gap-3 rounded-[var(--radius-sm)] no-underline",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]",
    className,
  );

  if (href) {
    return (
      <a href={href} className={sharedClasses} aria-label={`${siteConfig.name} home`}>
        {content}
      </a>
    );
  }

  return <div className={sharedClasses}>{content}</div>;
}
