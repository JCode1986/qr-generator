"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/branding/brand-mark";

const generatorMinHeight =
  "min-h-[1320px] sm:min-h-[1180px] min-[1280px]:min-h-[940px]";
const pendingHashKey = "quickqr-pending-scroll-hash";

function QrGeneratorSkeleton({ onLoad }) {
  return (
    <div
      id="generator"
      className={`relative h-full w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-elevated)_92%,black)] p-4 shadow-[var(--shadow-soft)] sm:p-5 ${generatorMinHeight}`}
      aria-label="Static QR generator preview"
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
              <h2 className="text-sm font-semibold text-[var(--foreground)]">
                Static QR generator
              </h2>
              <p className="text-sm leading-5 text-[var(--muted)]">
                Open the editor to customize and export.
              </p>
            </div>
          </div>
          <span className="inline-flex min-h-7 items-center rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
            Free editor
          </span>
        </div>

        <div className="mt-5 grid gap-5 min-[1280px]:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)]">
          <div className="space-y-4">
            <div className="h-32 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)]" />
            <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3">
              <div className="h-5 w-20 rounded-full bg-[var(--surface-elevated)]" />
              <div className="mt-3 flex flex-wrap gap-2">
                <div className="h-10 w-24 rounded-full bg-[var(--surface-elevated)]" />
                <div className="h-10 w-28 rounded-full bg-[var(--surface-elevated)]" />
                <div className="h-10 w-24 rounded-full bg-[var(--surface-elevated)]" />
                <div className="h-10 w-24 rounded-full bg-[var(--surface-elevated)]" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-24 rounded-[var(--radius-sm)] bg-[var(--surface)]" />
              <div className="h-24 rounded-[var(--radius-sm)] bg-[var(--surface)]" />
            </div>
            <div className="h-28 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]" />
            <div className="h-40 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]" />
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="h-11 rounded-[var(--radius-sm)] bg-[var(--surface)]" />
              <div className="h-11 rounded-[var(--radius-sm)] bg-[var(--surface)]" />
              <div className="h-11 rounded-[var(--radius-sm)] bg-[var(--surface)]" />
            </div>
          </div>
          <div className="order-first space-y-4 rounded-[var(--radius-lg)] bg-[var(--qr-surface)] p-4 min-[1280px]:order-none">
            <div className="mx-auto aspect-square w-full rounded-[var(--radius-md)] bg-white" />
            <div className="mx-auto mt-4 h-5 w-36 rounded-full bg-slate-200" />
            <button
              type="button"
              onClick={onLoad}
              className="mx-auto mt-4 inline-flex min-h-11 items-center justify-center rounded-[var(--radius-sm)] border border-slate-950 bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition duration-[var(--transition-fast)] hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-slate-950"
            >
              Open editor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LazyQrGenerator() {
  const rootRef = useRef(null);
  const loadingRef = useRef(false);
  const mountedRef = useRef(false);
  const [GeneratorComponent, setGeneratorComponent] = useState(null);

  const loadGenerator = useCallback(() => {
    if (loadingRef.current || GeneratorComponent) {
      return;
    }

    loadingRef.current = true;

    import("@/components/generator/qr-generator")
      .then((module) => {
        if (mountedRef.current) {
          setGeneratorComponent(() => module.QrGenerator);
        }
      })
      .catch(() => {
        loadingRef.current = false;
      });
  }, [GeneratorComponent]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (GeneratorComponent) {
      return undefined;
    }

    if (
      window.location.hash === "#generator" ||
      window.sessionStorage.getItem(pendingHashKey) === "#generator"
    ) {
      loadGenerator();
    }
  }, [GeneratorComponent, loadGenerator]);

  useEffect(() => {
    if (GeneratorComponent) {
      return undefined;
    }

    function handleGeneratorIntent(event) {
      const anchor = event.target?.closest?.('a[href$="#generator"], a[href="#generator"]');

      if (anchor) {
        loadGenerator();
      }
    }

    document.addEventListener("pointerover", handleGeneratorIntent, { passive: true });
    document.addEventListener("focusin", handleGeneratorIntent);
    document.addEventListener("click", handleGeneratorIntent, true);

    return () => {
      document.removeEventListener("pointerover", handleGeneratorIntent);
      document.removeEventListener("focusin", handleGeneratorIntent);
      document.removeEventListener("click", handleGeneratorIntent, true);
    };
  }, [GeneratorComponent, loadGenerator]);

  if (GeneratorComponent) {
    return <GeneratorComponent />;
  }

  return (
    <div
      ref={rootRef}
      className="h-full w-full"
      onClick={loadGenerator}
      onPointerEnter={loadGenerator}
    >
      <QrGeneratorSkeleton onLoad={loadGenerator} />
    </div>
  );
}
