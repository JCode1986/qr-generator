import { qrMargins, qrSizes } from "@/lib/qr/generate-qr";
import { errorCorrectionOptions } from "@/components/generator/constants";
import { GeneratorSelect } from "@/components/generator/generator-select";

export function SettingsPanel({ settings, logo, updateSetting }) {
  return (
    <fieldset className="space-y-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4">
      <legend className="px-1 text-base font-semibold text-[var(--foreground)]">
        QR settings
      </legend>
      <div className="grid gap-4 sm:grid-cols-3">
        <GeneratorSelect
          id="size"
          label="Size"
          selectedKey={settings.size}
          onSelectionChange={(value) => updateSetting("size", Number(value))}
          options={qrSizes.map((size) => ({
            value: size,
            label: `${size} px${size > 512 ? " - Pro" : ""}`,
          }))}
        />

        <GeneratorSelect
          id="correction"
          label="Error correction"
          selectedKey={logo ? "H" : settings.errorCorrection}
          onSelectionChange={(value) => updateSetting("errorCorrection", value)}
          options={errorCorrectionOptions}
          disabled={Boolean(logo)}
        />

        <GeneratorSelect
          id="margin"
          label="Margin"
          selectedKey={settings.margin}
          onSelectionChange={(value) => updateSetting("margin", Number(value))}
          options={qrMargins.map((margin) => ({
            value: margin,
            label: `${margin} modules`,
          }))}
        />
      </div>
    </fieldset>
  );
}
