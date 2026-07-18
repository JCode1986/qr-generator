import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const ProSummary = memo(function ProSummary({
  premium,
  selectedExportRequirement,
  checkoutLoading,
  onCheckout,
}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--accent)_24%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_84%,var(--accent)_4%)] p-4 text-sm leading-6 text-[var(--muted)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-[var(--foreground)]">
            Free vs Pro
          </h3>
          <p className="mt-1">
            Start free, unlock premium exports when your design needs them.
          </p>
        </div>
        {!premium ? <Badge variant="accent">$9 one-time</Badge> : null}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 min-[1280px]:grid-cols-1 min-[1440px]:grid-cols-2">
        <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-elevated)] p-3">
          <p className="font-semibold text-[var(--foreground)]">Free</p>
          <p className="mt-1">512px PNG and basic SVG exports.</p>
        </div>
        <div className="rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--accent)_28%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface-elevated))] p-3">
          <p className="font-semibold text-[var(--foreground)]">Pro</p>
          <p className="mt-1">Large exports, logo exports, and premium presets.</p>
        </div>
      </div>
      {!premium ? (
        <div className="mt-4 border-t border-[var(--border)] pt-4">
          <p className="mb-3 text-sm text-[var(--muted)]">
            {selectedExportRequirement ||
              "Unlock premium exports on this browser."}
          </p>
          <Button
            type="button"
            onClick={onCheckout}
            disabled={checkoutLoading}
            className="w-full"
          >
            {checkoutLoading ? "Opening checkout..." : "Unlock QuickQR Pro"}
          </Button>
        </div>
      ) : (
        <div className="mt-4">
          <Badge variant="success">Pro unlocked</Badge>
        </div>
      )}
    </div>
  );
});
