"use client";

import dynamic from "next/dynamic";
import { BrandMark } from "@/components/branding/brand-mark";

function QrGeneratorSkeleton() {
  return (
    <div
      id="generator"
      className="relative h-full w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-elevated)_92%,black)] p-4 shadow-[var(--shadow-soft)] sm:p-5"
      aria-busy="true"
      aria-label="Static QR generator loading"
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
                Loading editor...
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
            <div className="flex flex-wrap gap-2">
              <div className="h-9 w-24 rounded-full bg-[var(--surface)]" />
              <div className="h-9 w-28 rounded-full bg-[var(--surface)]" />
              <div className="h-9 w-24 rounded-full bg-[var(--surface)]" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-11 rounded-[var(--radius-sm)] bg-[var(--surface)]" />
              <div className="h-11 rounded-[var(--radius-sm)] bg-[var(--surface)]" />
            </div>
            <div className="h-24 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]" />
          </div>
          <div className="order-first rounded-[var(--radius-lg)] bg-[var(--qr-surface)] p-4 min-[1280px]:order-none">
            <div className="mx-auto aspect-square w-full rounded-[var(--radius-md)] bg-white" />
            <div className="mx-auto mt-4 h-5 w-36 rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

const QrGenerator = dynamic(
  () => import("@/components/generator/qr-generator").then((module) => module.QrGenerator),
  {
    ssr: false,
    loading: QrGeneratorSkeleton,
  },
);

export function LazyQrGenerator() {
  return <QrGenerator />;
}
