import { memo } from "react";
import { Button } from "@/components/ui/button";
import { ProSummary } from "@/components/generator/pro-summary";

export const PreviewPanel = memo(function PreviewPanel({
  qrDataUrl,
  previewSize,
  isEmpty,
  status,
  statusText,
  message,
  premium,
  selectedExportRequirement,
  onPngDownload,
  onSvgDownload,
  onCopyImage,
}) {
  return (
    <aside className="order-first space-y-4 min-[1280px]:order-none min-[1280px]:sticky min-[1280px]:top-20">
      <div className="rounded-[var(--radius-lg)] bg-[var(--qr-surface)] p-4 text-center shadow-[0_18px_45px_rgba(0,0,0,0.24)] sm:p-5">
        <div className="mx-auto flex aspect-square w-full max-w-[520px] items-center justify-center rounded-[var(--radius-md)] bg-white">
          {qrDataUrl ? (
            // Generated data URLs should render directly; Next Image can interfere with QR previews.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrDataUrl}
              width={previewSize}
              height={previewSize}
              alt="Generated QR code for the current content"
              className="aspect-square h-auto w-full rounded-[var(--radius-sm)] object-contain"
              style={{ aspectRatio: "1 / 1" }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-[var(--radius-sm)] border border-dashed border-slate-300 p-6 text-base leading-6 text-slate-600">
              {isEmpty
                ? "Enter content to generate a QR code."
                : "QR code preview will appear here."}
            </div>
          )}
        </div>
        <p
          id="qr-status"
          className="mt-4 min-h-6 truncate whitespace-nowrap text-sm font-semibold leading-6 text-slate-800"
          role={status === "error" ? "alert" : undefined}
          aria-live="polite"
        >
          {status === "ready" ? "Ready to scan" : statusText}
        </p>
      </div>

      <div className="grid gap-3">
        <Button type="button" onClick={onPngDownload}>
          Download PNG
        </Button>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button type="button" variant="secondary" onClick={onSvgDownload}>
            Download SVG
          </Button>
          <Button type="button" variant="secondary" onClick={onCopyImage}>
            Copy image
          </Button>
        </div>
      </div>

      <ProSummary
        premium={premium}
        selectedExportRequirement={selectedExportRequirement}
      />

      <p
        id="generator-message"
        className="min-h-6 text-sm leading-6 text-[var(--muted)]"
        role="status"
        aria-live="polite"
      >
        {message}
      </p>
    </aside>
  );
});
