import { memo } from "react";
import { qrMargins, qrSizes } from "@/lib/qr/settings";
import { errorCorrectionOptions } from "@/components/generator/constants";
import { GeneratorSelect } from "@/components/generator/generator-select";

const sizeOptions = qrSizes.map((size) => ({
  value: size,
  label: `${size} px${size > 512 ? " - Pro" : ""}`,
}));

const marginOptions = qrMargins.map((margin) => ({
  value: margin,
  label: `${margin} modules`,
}));

export const SettingsPanel = memo(function SettingsPanel({
  size,
  errorCorrection,
  margin,
  logoActive,
  updateSetting,
}) {
  return (
    <fieldset className="space-y-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4">
      <legend className="px-1 text-base font-semibold text-[var(--foreground)]">
        QR settings
      </legend>
      <div className="grid gap-4 sm:grid-cols-3">
        <GeneratorSelect
          id="size"
          label="Size"
          selectedKey={size}
          onSelectionChange={(value) => updateSetting("size", Number(value))}
          options={sizeOptions}
        />

        <GeneratorSelect
          id="correction"
          label="Error correction"
          selectedKey={logoActive ? "H" : errorCorrection}
          onSelectionChange={(value) => updateSetting("errorCorrection", value)}
          options={errorCorrectionOptions}
          disabled={logoActive}
        />

        <GeneratorSelect
          id="margin"
          label="Margin"
          selectedKey={margin}
          onSelectionChange={(value) => updateSetting("margin", Number(value))}
          options={marginOptions}
        />
      </div>
    </fieldset>
  );
});
