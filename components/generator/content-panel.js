import { QR_MAX_LENGTH } from "@/lib/qr/generate-qr";

export function ContentPanel({ content, setContent, contentType }) {
  return (
    <section
      aria-labelledby="content-label"
      className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_88%,black)] p-4"
    >
      <div className="flex flex-wrap items-end justify-between gap-2">
        <label
          id="content-label"
          htmlFor="qr-content"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Destination or text
        </label>
        <p className="text-sm text-[var(--muted)]">
          {content.length} / {QR_MAX_LENGTH}
        </p>
      </div>
      <textarea
        id="qr-content"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        maxLength={QR_MAX_LENGTH}
        rows={4}
        placeholder="Enter a URL, message, email address, phone number, Wi-Fi string, or other text"
        aria-describedby="qr-helper qr-type qr-status generator-message"
        className="mt-2 h-32 w-full resize-none rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition duration-[var(--transition-fast)] placeholder:text-[color-mix(in_srgb,var(--muted)_70%,transparent)] focus:border-[var(--accent)]"
      />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm leading-6 text-[var(--muted)]">
        <p id="qr-helper">Generated locally in this browser.</p>
        <p id="qr-type">
          Type:{" "}
          <span className="font-semibold text-[var(--foreground)]">
            {contentType}
          </span>
        </p>
      </div>
    </section>
  );
}
