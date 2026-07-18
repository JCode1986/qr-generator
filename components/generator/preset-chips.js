import { memo } from "react";
import { qrPresets } from "@/lib/qr/settings";
import { classNames } from "@/lib/class-names";
import { customPresetKey } from "@/components/generator/constants";

const presetOptions = [
  ...qrPresets.map((preset) => ({
    ...preset,
    value: preset.name,
    label: preset.name,
  })),
  {
    value: customPresetKey,
    label: "Custom",
    foreground: "#35d5f4",
    background: "#111f33",
  },
];

const labelId = "preset-label";

export const PresetChips = memo(function PresetChips({ selectedKey, onSelect, premium }) {
  return (
    <div className="min-w-0 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3">
      <h3 id={labelId} className="text-sm font-semibold text-[var(--foreground)]">
        Presets
      </h3>
      <div
        aria-labelledby={labelId}
        className="mt-2 flex flex-wrap gap-2"
        role="group"
      >
        {presetOptions.map((preset) => {
          const selected = String(preset.value) === String(selectedKey);

          return (
            <button
              key={preset.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(String(preset.value))}
              className={classNames(
                "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-3 text-sm font-semibold outline-none",
                "transition duration-[var(--transition-fast)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)]",
                selected
                  ? "border-[color-mix(in_srgb,var(--accent)_72%,white_8%)] bg-[color-mix(in_srgb,var(--accent)_18%,var(--surface-elevated))] text-[var(--accent)]"
                  : "border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--foreground)] hover:border-[color-mix(in_srgb,var(--accent)_45%,var(--border))] hover:bg-[var(--surface-hover)]",
              )}
            >
              <span
                className="grid size-4 shrink-0 grid-cols-2 overflow-hidden rounded-full border border-white/20"
                aria-hidden="true"
              >
                <span style={{ backgroundColor: preset.foreground }} />
                <span style={{ backgroundColor: preset.background }} />
                <span style={{ backgroundColor: preset.background }} />
                <span style={{ backgroundColor: preset.foreground }} />
              </span>
              <span>{preset.label}</span>
              {preset.premium && !premium ? (
                <span className="rounded-full bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] px-1.5 py-0.5 text-[0.62rem] uppercase text-[var(--accent)]">
                  Pro
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
});
