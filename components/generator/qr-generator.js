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

const logoTypes = ["image/png", "image/jpeg", "image/webp"];
const logoMaxSize = 2 * 1024 * 1024;

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
      padding="lg"
      className="relative ml-auto w-full max-w-[780px] overflow-hidden"
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
                Static QR generator
              </p>
              <p className="text-sm leading-5 text-[var(--muted)]">
                Customize and export a scannable static QR code.
              </p>
            </div>
          </div>
          <Badge variant={premium ? "success" : "default"}>
            {premium ? "Pro unlocked" : "Free editor"}
          </Badge>
        </div>

        <div className="mt-6 space-y-6">
          <section aria-labelledby="content-label">
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
              className="mt-2 min-h-[120px] w-full resize-y rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-base leading-6 text-[var(--foreground)] outline-none transition duration-[var(--transition-fast)] placeholder:text-[color-mix(in_srgb,var(--muted)_70%,transparent)] focus:border-[var(--accent)]"
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm leading-6 text-[var(--muted)]">
              <p id="qr-helper">Static QR codes store this content directly in the image.</p>
              <p id="qr-type">
                Detected type:{" "}
                <span className="font-semibold text-[var(--foreground)]">
                  {contentType}
                </span>
              </p>
            </div>
          </section>

          <div className="grid gap-6 min-[1180px]:grid-cols-[minmax(0,0.56fr)_minmax(300px,0.44fr)] min-[1180px]:items-start">
            <div className="space-y-6">
              <fieldset className="space-y-3">
                <legend className="text-base font-semibold text-[var(--foreground)]">
                  Presets
                </legend>
                <div className="flex flex-wrap gap-2">
                  {qrPresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className="min-h-10 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--foreground)] transition duration-[var(--transition-fast)] hover:bg-[var(--surface-hover)]"
                    >
                      {preset.name}
                      {preset.premium ? " · Pro" : ""}
                    </button>
                  ))}
                </div>
              </fieldset>

              <section aria-labelledby="colors-heading" className="space-y-3">
                <h3 id="colors-heading" className="text-base font-semibold text-[var(--foreground)]">
                  Colors
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="foreground"
                      className="text-sm font-semibold text-[var(--foreground)]"
                    >
                      Foreground
                    </label>
                    <div className="mt-2 flex gap-2">
                      <input
                        id="foreground"
                        type="color"
                        value={isValidHexColor(settings.foreground) ? settings.foreground : "#07111f"}
                        onChange={(event) => updateColor("foreground", event.target.value)}
                        className="h-11 w-12 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)]"
                      />
                      <input
                        aria-label="Foreground hex color"
                        value={settings.foreground}
                        onChange={(event) => updateColor("foreground", event.target.value)}
                        aria-invalid={!isValidHexColor(settings.foreground)}
                        className="min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 text-base text-[var(--foreground)] outline-none focus:border-[var(--accent)] aria-invalid:border-rose-300"
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
                    <div className="mt-2 flex gap-2">
                      <input
                        id="background"
                        type="color"
                        value={isValidHexColor(settings.background) ? settings.background : "#ffffff"}
                        onChange={(event) => updateColor("background", event.target.value)}
                        className="h-11 w-12 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)]"
                      />
                      <input
                        aria-label="Background hex color"
                        value={settings.background}
                        onChange={(event) => updateColor("background", event.target.value)}
                        aria-invalid={!isValidHexColor(settings.background)}
                        className="min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 text-base text-[var(--foreground)] outline-none focus:border-[var(--accent)] aria-invalid:border-rose-300"
                        maxLength={7}
                      />
                    </div>
                  </div>
                </div>
                {hasColorError ? (
                  <p className="text-sm text-rose-200" role="alert">
                    Enter valid 6-digit hex colors, such as #07111f.
                  </p>
                ) : null}
              </section>

              <fieldset className="space-y-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4">
                <legend className="px-1 text-base font-semibold text-[var(--foreground)]">
                  QR settings
                </legend>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="size" className="text-sm font-semibold text-[var(--foreground)]">
                      Size
                    </label>
                    <select
                      id="size"
                      value={settings.size}
                      onChange={(event) => updateSetting("size", Number(event.target.value))}
                      className="mt-2 min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-base text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                    >
                      {qrSizes.map((size) => (
                        <option key={size} value={size}>
                          {size} px {size > 512 ? "· Pro" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="correction" className="text-sm font-semibold text-[var(--foreground)]">
                      Error correction
                    </label>
                    <select
                      id="correction"
                      value={logo ? "H" : settings.errorCorrection}
                      onChange={(event) => updateSetting("errorCorrection", event.target.value)}
                      disabled={Boolean(logo)}
                      className="mt-2 min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-base text-[var(--foreground)] outline-none focus:border-[var(--accent)] disabled:opacity-70"
                    >
                      <option value="L">L · Compact</option>
                      <option value="M">M · Balanced</option>
                      <option value="Q">Q · Strong</option>
                      <option value="H">H · Logo safe</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="margin" className="text-sm font-semibold text-[var(--foreground)]">
                      Margin
                    </label>
                    <select
                      id="margin"
                      value={settings.margin}
                      onChange={(event) => updateSetting("margin", Number(event.target.value))}
                      className="mt-2 min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-base text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                    >
                      {qrMargins.map((margin) => (
                        <option key={margin} value={margin}>
                          {margin} modules
                        </option>
                      ))}
                    </select>
                  </div>
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
                      Add a centered logo with a white backing plate. Logo exports require QuickQR Pro.
                    </p>
                  </div>
                  <Badge variant="muted">Pro</Badge>
                </div>
                <label className="mt-4 flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-5 text-center transition duration-[var(--transition-fast)] hover:bg-[var(--surface-hover)]">
                  <span className="text-sm font-semibold text-[var(--foreground)]">
                    Upload logo
                  </span>
                  <span className="mt-1 text-sm text-[var(--muted)]">
                    PNG, JPEG, or WebP · max 2MB
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
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                      Oversized logos can reduce scan reliability. Error correction is forced to H.
                    </p>
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

              <p className="text-sm leading-6 text-[var(--muted)]">
                QR content and uploaded logos are generated locally in this browser and are not saved by QuickQR.
              </p>
            </div>

            <aside className="order-first space-y-4 min-[1180px]:order-none min-[1180px]:sticky min-[1180px]:top-6">
              <div className="rounded-[var(--radius-lg)] bg-[var(--qr-surface)] p-5 text-center shadow-[0_18px_45px_rgba(0,0,0,0.24)]">
                <div className="mx-auto flex aspect-square w-full max-w-[340px] items-center justify-center rounded-[var(--radius-md)] bg-white">
                  {qrDataUrl ? (
                    <Image
                      src={qrDataUrl}
                      width={previewSize}
                      height={previewSize}
                      alt="Generated QR code for the current content"
                      unoptimized
                      className="h-auto w-full max-w-[340px]"
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
                  className="mt-4 text-base font-semibold text-slate-800"
                  role={status === "error" ? "alert" : undefined}
                  aria-live="polite"
                >
                  {status === "ready" ? "Ready to scan" : statusText}
                </p>
              </div>

              <div className="grid gap-3">
                {pngRequirement ? (
                  <Button
                    type="button"
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                  >
                    {checkoutLoading ? "Opening checkout..." : "Unlock QuickQR Pro"}
                  </Button>
                ) : (
                  <Button type="button" onClick={handlePngDownload}>
                    Download PNG
                  </Button>
                )}

                <div className="grid gap-3 sm:grid-cols-2 min-[1180px]:grid-cols-2">
                  {!svgRequirement ? (
                    <Button type="button" variant="secondary" onClick={handleSvgDownload}>
                      Download SVG
                    </Button>
                  ) : null}
                  {!copyRequirement ? (
                    <Button type="button" variant="secondary" onClick={handleCopyImage}>
                      Copy image
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-6 text-[var(--muted)]">
                <div className="grid gap-4 sm:grid-cols-2 min-[1180px]:grid-cols-2">
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">Free</p>
                    <ul className="mt-2 space-y-1">
                      <li>PNG up to 512px</li>
                      <li>SVG without logo</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">Pro</p>
                    <ul className="mt-2 space-y-1">
                      <li>1024px and 2048px</li>
                      <li>Logo exports</li>
                      <li>Premium presets</li>
                    </ul>
                  </div>
                </div>
                {!premium ? (
                  <div className="mt-4 border-t border-[var(--border)] pt-4">
                    <p className="text-sm text-[var(--muted)]">
                      {selectedExportRequirement ||
                        "Unlock premium exports on this browser."}
                    </p>
                    {!pngRequirement ? (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleCheckout}
                        disabled={checkoutLoading}
                        className="mt-3 w-full"
                      >
                        {checkoutLoading ? "Opening checkout..." : "Unlock QuickQR Pro"}
                      </Button>
                    ) : null}
                    <p className="mt-2 text-xs text-[var(--muted)]">$9 one-time</p>
                  </div>
                ) : null}
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
          </div>
        </div>
      </div>
    </Card>
  );
}
