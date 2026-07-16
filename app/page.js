import { siteConfig } from "@/lib/site";

const plannedSteps = ["Generate", "Customize", "Download"];

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <section className="container flex min-h-[calc(100vh-2.5rem)] flex-col justify-between gap-14 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-5 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:min-h-[calc(100vh-4rem)] sm:px-8 sm:py-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="grid size-10 grid-cols-3 gap-1 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-elevated)] p-2"
              aria-hidden="true"
            >
              <span className="rounded-[2px] bg-[var(--accent)]" />
              <span className="rounded-[2px] bg-white/80" />
              <span className="rounded-[2px] bg-[var(--accent-secondary)]" />
              <span className="rounded-[2px] bg-white/80" />
              <span className="rounded-[2px] bg-[var(--accent)]" />
              <span className="rounded-[2px] bg-white/25" />
              <span className="rounded-[2px] bg-[var(--accent-secondary)]" />
              <span className="rounded-[2px] bg-white/25" />
              <span className="rounded-[2px] bg-[var(--accent)]" />
            </div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {siteConfig.name}
            </p>
          </div>

          <p className="rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
            In development
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
          <div className="max-w-3xl">
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              {siteConfig.name} is taking shape.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              A fast, customizable QR code generator is being built here. Static
              QR creation, polished exports, and premium design options are
              coming in future development segments.
            </p>
          </div>

          <aside
            className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-elevated)] p-4"
            aria-labelledby="planned-roadmap"
          >
            <p
              id="planned-roadmap"
              className="text-xs font-semibold uppercase text-[var(--accent)]"
            >
              Planned
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {plannedSteps.map((step) => (
                <li
                  key={step}
                  className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-3 text-sm font-medium text-[var(--foreground)]"
                >
                  <span
                    className="size-2 rounded-full bg-[var(--accent-secondary)]"
                    aria-hidden="true"
                  />
                  {step}
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <footer className="border-t border-[var(--border)] pt-5 text-sm text-[var(--muted)]">
          Built with Next.js and JavaScript.
        </footer>
      </section>
    </main>
  );
}
