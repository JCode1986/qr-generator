import { BrandMark } from "@/components/branding/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const modules = [
  [12, 3],
  [14, 3],
  [18, 3],
  [20, 3],
  [10, 4],
  [16, 4],
  [22, 4],
  [11, 5],
  [13, 5],
  [17, 5],
  [19, 5],
  [23, 5],
  [10, 7],
  [12, 7],
  [15, 7],
  [20, 7],
  [22, 7],
  [3, 10],
  [5, 10],
  [8, 10],
  [11, 10],
  [13, 10],
  [17, 10],
  [21, 10],
  [24, 10],
  [7, 11],
  [10, 11],
  [15, 11],
  [18, 11],
  [23, 11],
  [4, 12],
  [8, 12],
  [12, 12],
  [14, 12],
  [19, 12],
  [21, 12],
  [25, 12],
  [10, 13],
  [16, 13],
  [20, 13],
  [24, 13],
  [3, 14],
  [6, 14],
  [11, 14],
  [13, 14],
  [18, 14],
  [22, 14],
  [25, 14],
  [8, 15],
  [12, 15],
  [17, 15],
  [19, 15],
  [23, 15],
  [4, 16],
  [6, 16],
  [10, 16],
  [15, 16],
  [21, 16],
  [24, 16],
  [3, 18],
  [5, 18],
  [9, 18],
  [12, 18],
  [16, 18],
  [20, 18],
  [22, 18],
  [24, 18],
  [10, 19],
  [14, 19],
  [18, 19],
  [23, 19],
  [11, 20],
  [13, 20],
  [17, 20],
  [21, 20],
  [25, 20],
  [10, 21],
  [12, 21],
  [16, 21],
  [20, 21],
  [24, 21],
  [11, 23],
  [15, 23],
  [18, 23],
  [22, 23],
  [25, 23],
  [10, 24],
  [13, 24],
  [17, 24],
  [21, 24],
  [24, 24],
  [12, 25],
  [16, 25],
  [19, 25],
  [23, 25],
];

const controls = [
  { label: "Foreground", value: "Navy" },
  { label: "Background", value: "White" },
  { label: "Size", value: "1024 px" },
];

const plannedActions = ["PNG", "SVG", "Customize"];

function Finder({ x, y }) {
  return (
    <>
      <rect x={x} y={y} width="7" height="7" rx="1" fill="var(--qr-module)" />
      <rect
        x={x + 1}
        y={y + 1}
        width="5"
        height="5"
        rx="0.75"
        fill="var(--qr-surface)"
      />
      <rect
        x={x + 2}
        y={y + 2}
        width="3"
        height="3"
        rx="0.5"
        fill="var(--qr-module)"
      />
    </>
  );
}

function DecorativeQrPattern() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 29 29"
      aria-hidden="true"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="29" height="29" fill="var(--qr-surface)" />
      <Finder x={1} y={1} />
      <Finder x={21} y={1} />
      <Finder x={1} y={21} />
      {modules.map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="1"
          height="1"
          rx="0.15"
          fill="var(--qr-module)"
        />
      ))}
    </svg>
  );
}

export function QrEditorPreview() {
  return (
    <Card
      id="editor-preview"
      variant="elevated"
      padding="lg"
      className="relative overflow-hidden transition duration-[var(--transition-fast)] hover:-translate-y-1"
    >
      <div
        className="absolute inset-x-8 top-8 h-24 rounded-full bg-[var(--shadow-accent)] blur-3xl"
        aria-hidden="true"
      />
      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-5">
          <div className="flex items-center gap-3">
            <BrandMark className="h-8 w-8" />
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">
                Editor preview
              </p>
              <p className="text-xs text-[var(--muted)]">
                Decorative preview of the upcoming QR generator
              </p>
            </div>
          </div>
          <Badge variant="accent">Coming next</Badge>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_13rem] lg:items-start">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-medium uppercase text-[var(--muted)]">
                Destination
              </p>
              <div className="mt-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)]">
                https://example.com
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {controls.map((control) => (
                <div
                  key={control.label}
                  className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-3"
                >
                  <p className="text-xs text-[var(--muted)]">{control.label}</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                    {control.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2" aria-label="Planned exports">
              {plannedActions.map((action) => (
                <button
                  key={action}
                  type="button"
                  disabled
                  className="min-h-10 rounded-[var(--radius-sm)] border border-[var(--border)] px-3 text-sm font-medium text-[var(--muted)] opacity-70"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-56 rounded-[var(--radius-md)] bg-[var(--qr-surface)] p-3 shadow-[0_18px_45px_rgba(0,0,0,0.24)]">
            <div className="aspect-square w-full overflow-hidden rounded-[var(--radius-sm)]">
              <DecorativeQrPattern />
            </div>
          </div>
        </div>

        <p className="mt-6 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface))] p-4 text-sm leading-6 text-[var(--muted)]">
          This preview is not functional yet. Live QR generation will be added
          in the next segment.
        </p>
      </div>
    </Card>
  );
}
