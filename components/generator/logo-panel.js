import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function LogoPanel({
  logo,
  logoError,
  logoScale,
  onLogoUpload,
  onLogoRemove,
  updateLogoScale,
}) {
  return (
    <section
      aria-labelledby="logo-heading"
      className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id="logo-heading" className="text-base font-semibold text-[var(--foreground)]">
            Logo
          </h3>
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
            Add a centered logo with a white backing plate.
          </p>
        </div>
        <Badge variant="muted">Pro export</Badge>
      </div>
      <label className="mt-4 flex min-h-20 cursor-pointer flex-col items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-4 text-center transition duration-[var(--transition-fast)] hover:bg-[var(--surface-hover)]">
        <span className="text-sm font-semibold text-[var(--foreground)]">
          Upload logo
        </span>
        <span className="mt-1 text-sm text-[var(--muted)]">
          PNG, JPEG, or WebP - max 2MB
        </span>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={onLogoUpload}
          className="sr-only"
        />
      </label>
      {logo ? (
        <div className="mt-4 rounded-[var(--radius-sm)] border border-[var(--border)] p-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3 text-sm text-[var(--muted)]">
              {/* Browser object URLs should render directly instead of passing through Next Image. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.previewUrl}
                width={44}
                height={44}
                alt=""
                className="h-11 w-11 rounded-[var(--radius-sm)] bg-white object-contain"
              />
              <span className="truncate">{logo.name}</span>
            </div>
            <Button type="button" variant="ghost" onClick={onLogoRemove}>
              Remove
            </Button>
          </div>
          <div className="mt-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="logo-scale"
                className="text-sm font-semibold text-[var(--foreground)]"
              >
                Logo size
              </label>
              <span className="text-sm text-[var(--muted)]">
                {logoScale}%
              </span>
            </div>
            <input
              id="logo-scale"
              type="range"
              min="12"
              max="28"
              value={logoScale}
              onChange={(event) => updateLogoScale(Number(event.target.value))}
              className="mt-2 w-full accent-[var(--accent)]"
            />
          </div>
        </div>
      ) : null}
      {logoError ? (
        <p className="mt-3 text-sm text-rose-200" role="alert">
          {logoError}
        </p>
      ) : null}
    </section>
  );
}
