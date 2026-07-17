"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  addLogoToPngDataUrl,
  addLogoToSvg,
  defaultQrSettings,
  generateQrDataUrl,
  generateQrSvg,
  isValidHexColor,
  normalizeHexColor,
  qrMargins,
  qrPresets,
  qrSizes,
  QR_MAX_LENGTH,
} from "@/lib/qr/generate-qr";
import { copyPngToClipboard, dataUrlToBlob, downloadBlob, getDownloadFileName } from "@/lib/qr/download";
import { getContentType } from "@/lib/qr/content-type";
import { premiumStorageKey, quickQrPro } from "@/lib/stripe/products";
import { BrandMark } from "@/components/branding/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { classNames } from "@/lib/class-names";

const logoTypes = ["image/png", "image/jpeg", "image/webp"];
const logoMaxSize = 2 * 1024 * 1024;

const errorCorrectionOptions = [
  { value: "L", label: "L - Compact" },
  { value: "M", label: "M - Balanced" },
  { value: "Q", label: "Q - Strong" },
  { value: "H", label: "H - Logo safe" },
];

const customPresetKey = "custom";

function GeneratorSelect({
  id,
  label,
  selectedKey,
  options,
  onSelectionChange,
  disabled = false,
}) {
  const labelId = `${id}-label`;

  return (
    <div className="min-w-0">
      <span id={labelId} className="text-sm font-semibold text-[var(--foreground)]">
        {label}
      </span>
      <select
        id={id}
        aria-labelledby={labelId}
        value={String(selectedKey)}
        onChange={(event) => onSelectionChange(event.target.value)}
        disabled={disabled}
        className={classNames(
          "mt-2 min-h-11 w-full min-w-0 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-base text-[var(--foreground)] outline-none",
          "transition duration-[var(--transition-fast)] hover:border-[color-mix(in_srgb,var(--accent)_45%,var(--border))] hover:bg-[var(--surface-hover)]",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)]",
          "disabled:cursor-not-allowed disabled:opacity-70",
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function PresetChips({ selectedKey, onSelect, premium }) {
  const options = [
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

  return (
    <div className="min-w-0 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3">
      <h3 id={labelId} className="text-sm font-semibold text-[var(--foreground)]">
        Presets
      </h3>
      <div
        aria-labelledby={labelId}
        className="mt-2 flex flex-wrap gap-2"
        role="list"
      >
        {options.map((preset) => {
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
}

function getSettingsKey(content, settings, logoDataUrl) {
  return JSON.stringify({
    content,
    foreground: settings.foreground,
    background: settings.background,
    size: settings.size,
    errorCorrection: settings.errorCorrection,
    margin: settings.margin,
    logoScale: settings.logoScale,
    logo: Boolean(logoDataUrl),
  });
}

function getRenderSettings(settings, logo, sizeOverride) {
  return {
    ...settings,
    size: sizeOverride || settings.size,
    errorCorrection: logo ? "H" : settings.errorCorrection,
  };
}

function getPremiumRequirement(settings, logo, action) {
  if (action === "svg" && logo) {
    return "SVG export with a logo is included in QuickQR Pro.";
  }

  if (action === "png" && !quickQrPro.freePngSizes.includes(settings.size)) {
    return "High-resolution PNG export is included in QuickQR Pro.";
  }

  if ((action === "png" || action === "copy") && logo) {
    return "Logo-enabled exports are included in QuickQR Pro.";
  }

  return "";
}

export function QrGenerator() {
  const [content, setContent] = useState(defaultQrSettings.content);
  const [settings, setSettings] = useState(defaultQrSettings);
  const [logo, setLogo] = useState(null);
  const [qrResult, setQrResult] = useState({ key: "", dataUrl: "", error: false });
  const [message, setMessage] = useState("");
  const [logoError, setLogoError] = useState("");
  const [premium, setPremium] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const trimmedContent = content.trim();
  const isEmpty = trimmedContent.length === 0;
  const hasColorError =
    !isValidHexColor(settings.foreground) || !isValidHexColor(settings.background);
  const previewSize = 512;
  const previewSettings = useMemo(
    () => getRenderSettings(settings, logo, previewSize),
    [logo, previewSize, settings],
  );
  const previewKey = getSettingsKey(content, previewSettings, logo?.dataUrl);
  const isCurrentResult = qrResult.key === previewKey;
  const qrDataUrl = isCurrentResult && !qrResult.error ? qrResult.dataUrl : "";
  const contentType = useMemo(() => getContentType(content), [content]);
  const selectedPresetKey = useMemo(() => {
    const matchingPreset = qrPresets.find(
      (preset) =>
        preset.foreground === settings.foreground &&
        preset.background === settings.background &&
        preset.errorCorrection === settings.errorCorrection &&
        preset.margin === settings.margin,
    );

    return matchingPreset?.name || customPresetKey;
  }, [
    settings.background,
    settings.errorCorrection,
    settings.foreground,
    settings.margin,
  ]);
  const status = isEmpty
    ? "empty"
    : hasColorError || (isCurrentResult && qrResult.error)
      ? "error"
      : qrDataUrl
        ? "ready"
        : "loading";
  const statusText = {
    empty: "Enter content to generate a QR code.",
    error: hasColorError
      ? "Use valid 6-digit hex colors before generating."
      : "We could not generate this QR code. Try shorter or different content.",
    loading: "Generating QR code...",
    ready: "QR code ready to scan.",
  }[status];

  useEffect(() => {
    const token = window.localStorage.getItem(premiumStorageKey);

    if (!token) {
      return undefined;
    }

    let isCurrent = true;

    async function verifyToken() {
      try {
        const response = await fetch("/api/verify-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const result = await response.json();

        if (!isCurrent) {
          return;
        }

        if (result.active) {
          setPremium(true);
        } else {
          window.localStorage.removeItem(premiumStorageKey);
        }
      } catch {
        if (isCurrent) {
          setPremium(false);
        }
      }
    }

    verifyToken();

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (logo?.previewUrl) {
        URL.revokeObjectURL(logo.previewUrl);
      }
    };
  }, [logo?.previewUrl]);

  useEffect(() => {
    let isCurrent = true;

    if (isEmpty || hasColorError) {
      return undefined;
    }

    const timer = window.setTimeout(async () => {
      try {
        const baseDataUrl = await generateQrDataUrl(content, previewSettings);
        const nextDataUrl = logo?.dataUrl
          ? await addLogoToPngDataUrl(baseDataUrl, logo.dataUrl, previewSettings)
          : baseDataUrl;

        if (isCurrent) {
          setQrResult({ key: previewKey, dataUrl: nextDataUrl, error: false });
        }
      } catch {
        if (isCurrent) {
          setQrResult({ key: previewKey, dataUrl: "", error: true });
        }
      }
    }, 180);

    return () => {
      isCurrent = false;
      window.clearTimeout(timer);
    };
  }, [content, hasColorError, isEmpty, logo?.dataUrl, previewKey, previewSettings]);

  function updateSetting(name, value) {
    setSettings((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function updateColor(name, value) {
    updateSetting(name, normalizeHexColor(value));
  }

  function useExample() {
    setContent(defaultQrSettings.content);
    setMessage("Example content restored.");
  }

  function clearContent() {
    setContent("");
    setMessage("Content cleared.");
  }

  function resetDesign() {
    setSettings(defaultQrSettings);
    setLogo(null);
    setLogoError("");
    setMessage("Design reset.");
  }

  function removeLogo() {
    setLogo(null);
    setLogoError("");
    setMessage("Logo removed.");
  }

  function applyPreset(preset) {
    if (preset.premium && !premium) {
      setMessage("Premium preset. Unlock Pro to use this design.");
      return;
    }

    setSettings((current) => ({
      ...current,
      foreground: preset.foreground,
      background: preset.background,
      errorCorrection: preset.errorCorrection,
      margin: preset.margin,
    }));
    setMessage(`${preset.name} preset applied.`);
  }

  function selectPreset(value) {
    if (value === customPresetKey) {
      setMessage("Custom design settings are active.");
      return;
    }

    const preset = qrPresets.find((item) => item.name === value);

    if (preset) {
      applyPreset(preset);
    }
  }

  function handleLogoUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!logoTypes.includes(file.type)) {
      setLogoError("Upload a PNG, JPEG, or WebP logo.");
      return;
    }

    if (file.size > logoMaxSize) {
      setLogoError("Logo must be 2MB or smaller.");
      return;
    }

    const reader = new FileReader();
    const previewUrl = URL.createObjectURL(file);

    reader.onload = () => {
      setLogo({
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: String(reader.result),
        previewUrl,
      });
      setSettings((current) => ({
        ...current,
        errorCorrection: "H",
      }));
      setLogoError("");
      setMessage("Logo added. Error correction is set to H for scan reliability.");
    };
    reader.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      setLogoError("We could not read this logo file.");
    };
    reader.readAsDataURL(file);
  }

  async function createPngDataUrl(outputSize = settings.size) {
    const outputSettings = getRenderSettings(settings, logo, outputSize);
    const baseDataUrl = await generateQrDataUrl(content, outputSettings);

    if (!logo?.dataUrl) {
      return baseDataUrl;
    }

    return addLogoToPngDataUrl(baseDataUrl, logo.dataUrl, outputSettings);
  }

  async function handlePngDownload() {
    const requirement = getPremiumRequirement(settings, logo, "png");

    if (requirement && !premium) {
      setMessage(requirement);
      return;
    }

    if (status !== "ready") {
      setMessage("Enter valid content before downloading.");
      return;
    }

    try {
      const dataUrl = await createPngDataUrl(settings.size);
      const blob = await dataUrlToBlob(dataUrl);

      downloadBlob(blob, getDownloadFileName("png"));
      setMessage("PNG download started.");
    } catch {
      setMessage("We could not create the PNG download.");
    }
  }

  async function handleSvgDownload() {
    const requirement = getPremiumRequirement(settings, logo, "svg");

    if (requirement && !premium) {
      setMessage(requirement);
      return;
    }

    if (status !== "ready") {
      setMessage("Enter valid content before downloading.");
      return;
    }

    try {
      const outputSettings = getRenderSettings(settings, logo, settings.size);
      const baseSvg = await generateQrSvg(content, outputSettings);
      const svg = logo?.dataUrl
        ? addLogoToSvg(baseSvg, logo.dataUrl, outputSettings)
        : baseSvg;
      const blob = new Blob([svg], { type: "image/svg+xml" });

      downloadBlob(blob, getDownloadFileName("svg"));
      setMessage("SVG download started.");
    } catch {
      setMessage("We could not create the SVG download.");
    }
  }

  async function handleCopyImage() {
    const requirement = getPremiumRequirement(settings, logo, "copy");

    if (requirement && !premium) {
      setMessage(requirement);
      return;
    }

    if (
      typeof navigator === "undefined" ||
      !navigator.clipboard ||
      typeof ClipboardItem === "undefined"
    ) {
      setMessage("Image copying is not supported in this browser.");
      return;
    }

    if (status !== "ready") {
      setMessage("Enter valid content before copying.");
      return;
    }

    try {
      await copyPngToClipboard(await createPngDataUrl(Math.min(settings.size, 512)));
      setMessage("QR image copied.");
    } catch {
      setMessage("We could not copy the QR image.");
    }
  }

  async function handleCheckout() {
    setCheckoutLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: quickQrPro.id }),
      });
      const result = await response.json();

      if (!response.ok || !result.url) {
        setMessage(result.error || "Checkout is not available yet.");
        return;
      }

      window.location.href = result.url;
    } catch {
      setMessage("Checkout could not be started.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  const pngRequirement = !premium ? getPremiumRequirement(settings, logo, "png") : "";
  const svgRequirement = !premium ? getPremiumRequirement(settings, logo, "svg") : "";
  const copyRequirement = !premium ? getPremiumRequirement(settings, logo, "copy") : "";
  const selectedExportRequirement = pngRequirement || svgRequirement || copyRequirement;

  return (
    <Card
      id="generator"
      variant="elevated"
      padding="none"
      className="relative h-full w-full overflow-hidden bg-[color-mix(in_srgb,var(--surface-elevated)_92%,black)]"
    >
      <div
        className="absolute inset-x-8 top-8 h-24 rounded-full bg-[var(--shadow-accent)] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">
            <BrandMark className="h-8 w-8" />
            <div>
              <h2 className="text-sm font-semibold text-[var(--foreground)]">
                Static QR generator
              </h2>
              <p className="text-sm leading-5 text-[var(--muted)]">
                Customize and export a scannable static QR code.
              </p>
            </div>
          </div>
          <Badge variant={premium ? "success" : "default"}>
            {premium ? "Pro unlocked" : "Free editor"}
          </Badge>
        </div>

        <div className="grid gap-5 p-4 sm:p-5 xl:p-6 min-[1280px]:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)] min-[1280px]:items-start">
          <div className="min-w-0 space-y-4">
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

            <PresetChips
              selectedKey={selectedPresetKey}
              onSelect={selectPreset}
              premium={premium}
            />

            <section
              aria-labelledby="colors-heading"
              className="min-w-0 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <h3
                id="colors-heading"
                className="text-base font-semibold text-[var(--foreground)]"
              >
                Colors
              </h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="foreground"
                    className="text-sm font-semibold text-[var(--foreground)]"
                  >
                    Foreground
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <input
                      id="foreground"
                      type="color"
                      value={isValidHexColor(settings.foreground) ? settings.foreground : "#07111f"}
                      onChange={(event) => updateColor("foreground", event.target.value)}
                      style={{ backgroundColor: isValidHexColor(settings.foreground) ? settings.foreground : "#07111f" }}
                      className="h-10 w-11 appearance-none rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-elevated)] p-0 [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0"
                    />
                    <input
                      aria-label="Foreground hex color"
                      value={settings.foreground}
                      onChange={(event) => updateColor("foreground", event.target.value)}
                      aria-invalid={!isValidHexColor(settings.foreground)}
                      className="min-h-10 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] aria-invalid:border-rose-300"
                      maxLength={7}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="background"
                    className="text-sm font-semibold text-[var(--foreground)]"
                  >
                    Background
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <input
                      id="background"
                      type="color"
                      value={isValidHexColor(settings.background) ? settings.background : "#ffffff"}
                      onChange={(event) => updateColor("background", event.target.value)}
                      style={{ backgroundColor: isValidHexColor(settings.background) ? settings.background : "#ffffff" }}
                      className="h-10 w-11 appearance-none rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-elevated)] p-0 [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0"
                    />
                    <input
                      aria-label="Background hex color"
                      value={settings.background}
                      onChange={(event) => updateColor("background", event.target.value)}
                      aria-invalid={!isValidHexColor(settings.background)}
                      className="min-h-10 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] aria-invalid:border-rose-300"
                      maxLength={7}
                    />
                  </div>
                </div>
              </div>
              {hasColorError ? (
                <p className="mt-3 text-sm text-rose-200" role="alert">
                  Enter valid 6-digit hex colors, such as #07111f.
                </p>
              ) : null}
            </section>

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

            <section
              aria-labelledby="logo-heading"
              className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 id="logo-heading" className="text-base font-semibold text-[var(--foreground)]">
                    Logo
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                    Add a centered logo with a white backing plate.
                  </p>
                </div>
                <Badge variant="muted">Pro export</Badge>
              </div>
              <label className="mt-4 flex min-h-20 cursor-pointer flex-col items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-4 text-center transition duration-[var(--transition-fast)] hover:bg-[var(--surface-hover)]">
                <span className="text-sm font-semibold text-[var(--foreground)]">
                  Upload logo
                </span>
                <span className="mt-1 text-sm text-[var(--muted)]">
                  PNG, JPEG, or WebP - max 2MB
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleLogoUpload}
                  className="sr-only"
                />
              </label>
              {logo ? (
                <div className="mt-4 rounded-[var(--radius-sm)] border border-[var(--border)] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3 text-sm text-[var(--muted)]">
                      <Image
                        src={logo.previewUrl}
                        width={44}
                        height={44}
                        alt=""
                        unoptimized
                        className="rounded-[var(--radius-sm)] bg-white object-contain"
                      />
                      <span className="truncate">{logo.name}</span>
                    </div>
                    <Button type="button" variant="ghost" onClick={removeLogo}>
                      Remove
                    </Button>
                  </div>
                  <div className="mt-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label
                        htmlFor="logo-scale"
                        className="text-sm font-semibold text-[var(--foreground)]"
                      >
                        Logo size
                      </label>
                      <span className="text-sm text-[var(--muted)]">
                        {settings.logoScale}%
                      </span>
                    </div>
                    <input
                      id="logo-scale"
                      type="range"
                      min="12"
                      max="28"
                      value={settings.logoScale}
                      onChange={(event) =>
                        updateSetting("logoScale", Number(event.target.value))
                      }
                      className="mt-2 w-full accent-[var(--accent)]"
                    />
                  </div>
                </div>
              ) : null}
              {logoError ? (
                <p className="mt-3 text-sm text-rose-200" role="alert">
                  {logoError}
                </p>
              ) : null}
            </section>

            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="secondary" onClick={useExample}>
                Use example
              </Button>
              <Button type="button" variant="ghost" onClick={clearContent}>
                Clear
              </Button>
              <Button type="button" variant="ghost" onClick={resetDesign}>
                Reset design
              </Button>
            </div>

          </div>

          <aside className="order-first space-y-4 min-[1280px]:order-none min-[1280px]:sticky min-[1280px]:top-20">
            <div className="rounded-[var(--radius-lg)] bg-[var(--qr-surface)] p-4 text-center shadow-[0_18px_45px_rgba(0,0,0,0.24)] sm:p-5">
              <div className="mx-auto flex aspect-square w-full max-w-[520px] items-center justify-center rounded-[var(--radius-md)] bg-white">
                {qrDataUrl ? (
                  <Image
                    src={qrDataUrl}
                    width={previewSize}
                    height={previewSize}
                    alt="Generated QR code for the current content"
                    unoptimized
                    className="h-auto w-full"
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
              <Button type="button" onClick={handlePngDownload}>
                Download PNG
              </Button>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button type="button" variant="secondary" onClick={handleSvgDownload}>
                  Download SVG
                </Button>
                <Button type="button" variant="secondary" onClick={handleCopyImage}>
                  Copy image
                </Button>
              </div>
            </div>

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
                    onClick={handleCheckout}
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

            <p
              id="generator-message"
              className="min-h-6 text-sm leading-6 text-[var(--muted)]"
              role="status"
              aria-live="polite"
            >
              {message}
            </p>
          </aside>

          <p className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_70%,transparent)] px-4 py-3 text-sm leading-6 text-[var(--muted)] min-[1280px]:col-span-2">
            QR content and uploaded logos are generated locally in this browser and are not saved by QuickQR.
          </p>
        </div>
      </div>
    </Card>
  );
}
