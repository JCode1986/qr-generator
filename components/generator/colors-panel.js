import { memo } from "react";
import { isValidHexColor } from "@/lib/qr/settings";

export const ColorsPanel = memo(function ColorsPanel({
  foreground,
  background,
  updateColor,
  hasColorError,
}) {
  return (
    <section
      aria-labelledby="colors-heading"
      className="min-w-0 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4"
    >
      <h3
        id="colors-heading"
        className="text-base font-semibold text-[var(--foreground)]"
      >
        Colors
      </h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <ColorControl
          id="foreground"
          label="Foreground"
          value={foreground}
          fallback="#07111f"
          onChange={(value) => updateColor("foreground", value)}
        />
        <ColorControl
          id="background"
          label="Background"
          value={background}
          fallback="#ffffff"
          onChange={(value) => updateColor("background", value)}
        />
      </div>
      {hasColorError ? (
        <p className="mt-3 text-sm text-rose-200" role="alert">
          Enter valid 6-digit hex colors, such as #07111f.
        </p>
      ) : null}
    </section>
  );
});

function ColorControl({ id, label, value, fallback, onChange }) {
  const colorValue = isValidHexColor(value) ? value : fallback;

  return (
    <div>
      <label
        htmlFor={id}
        className="text-sm font-semibold text-[var(--foreground)]"
      >
        {label}
      </label>
      <div className="mt-1.5 flex gap-2">
        <input
          id={id}
          type="color"
          value={colorValue}
          onChange={(event) => onChange(event.target.value)}
          style={{ backgroundColor: colorValue }}
          className="h-10 w-11 appearance-none rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-elevated)] p-0 [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0"
        />
        <input
          aria-label={`${label} hex color`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={!isValidHexColor(value)}
          className="min-h-10 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] aria-invalid:border-rose-300"
          maxLength={7}
        />
      </div>
    </div>
  );
}
