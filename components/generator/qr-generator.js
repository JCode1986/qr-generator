"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  defaultQrSettings,
  defaultQrPreviewDataUrl,
  isValidHexColor,
  normalizeHexColor,
  qrPresets,
} from "@/lib/qr/settings";
import { copyPngToClipboard, dataUrlToBlob, downloadBlob, getDownloadFileName } from "@/lib/qr/download";
import { getContentType } from "@/lib/qr/content-type";
import { premiumStorageKey, quickQrPro } from "@/lib/stripe/products";
import { BrandMark } from "@/components/branding/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { logoMaxSize, logoTypes, customPresetKey } from "@/components/generator/constants";
import { ContentPanel } from "@/components/generator/content-panel";
import { PresetChips } from "@/components/generator/preset-chips";
import { ColorsPanel } from "@/components/generator/colors-panel";
import { SettingsPanel } from "@/components/generator/settings-panel";
import { LogoPanel } from "@/components/generator/logo-panel";
import { PreviewPanel } from "@/components/generator/preview-panel";
import { UtilityActions } from "@/components/generator/utility-actions";

const generatorMinHeight =
  "min-h-[1320px] sm:min-h-[1180px] min-[1280px]:min-h-[940px]";

let qrGenerationPromise;

function loadQrGeneration() {
  if (!qrGenerationPromise) {
    qrGenerationPromise = import("@/lib/qr/generate-qr");
  }

  return qrGenerationPromise;
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
  const [qrResult, setQrResult] = useState(() => {
    const initialPreviewSettings = getRenderSettings(defaultQrSettings, null, 512);

    return {
      key: getSettingsKey(defaultQrSettings.content, initialPreviewSettings, null),
      dataUrl: defaultQrPreviewDataUrl,
      error: false,
      staticPreview: true,
    };
  });
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
    [logo, settings, previewSize],
  );
  const previewKey = useMemo(
    () => getSettingsKey(content, previewSettings, logo?.dataUrl),
    [content, logo?.dataUrl, previewSettings],
  );
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

    if (isEmpty || hasColorError || (qrDataUrl && !qrResult.staticPreview)) {
      return undefined;
    }

    const timer = window.setTimeout(async () => {
      try {
        const { addLogoToPngDataUrl, generateQrDataUrl } = await loadQrGeneration();
        const baseDataUrl = await generateQrDataUrl(content, previewSettings);
        const nextDataUrl = logo?.dataUrl
          ? await addLogoToPngDataUrl(baseDataUrl, logo.dataUrl, previewSettings)
          : baseDataUrl;

        if (isCurrent) {
          setQrResult({
            key: previewKey,
            dataUrl: nextDataUrl,
            error: false,
            staticPreview: false,
          });
        }
      } catch {
        if (isCurrent) {
          setQrResult({
            key: previewKey,
            dataUrl: "",
            error: true,
            staticPreview: false,
          });
        }
      }
    }, 180);

    return () => {
      isCurrent = false;
      window.clearTimeout(timer);
    };
  }, [
    content,
    hasColorError,
    isEmpty,
    logo?.dataUrl,
    previewKey,
    previewSettings,
    qrDataUrl,
    qrResult.staticPreview,
  ]);

  const handleContentChange = useCallback((value) => {
    setContent(value);
  }, []);

  const updateSetting = useCallback((name, value) => {
    setSettings((current) => ({
      ...current,
      [name]: value,
    }));
  }, []);

  const updateColor = useCallback((name, value) => {
    updateSetting(name, normalizeHexColor(value));
  }, [updateSetting]);

  const useExample = useCallback(() => {
    setContent(defaultQrSettings.content);
    setMessage("Example content restored.");
  }, []);

  const clearContent = useCallback(() => {
    setContent("");
    setMessage("Content cleared.");
  }, []);

  const resetDesign = useCallback(() => {
    setSettings(defaultQrSettings);
    setLogo(null);
    setLogoError("");
    setMessage("Design reset.");
  }, []);

  const removeLogo = useCallback(() => {
    setLogo(null);
    setLogoError("");
    setMessage("Logo removed.");
  }, []);

  const applyPreset = useCallback((preset) => {
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
  }, [premium]);

  const selectPreset = useCallback((value) => {
    if (value === customPresetKey) {
      setMessage("Custom design settings are active.");
      return;
    }

    const preset = qrPresets.find((item) => item.name === value);

    if (preset) {
      applyPreset(preset);
    }
  }, [applyPreset]);

  const handleLogoUpload = useCallback((event) => {
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
  }, []);

  const updateLogoScale = useCallback((value) => {
    updateSetting("logoScale", value);
  }, [updateSetting]);

  const createPngDataUrl = useCallback(async (outputSize = settings.size) => {
    const { addLogoToPngDataUrl, generateQrDataUrl } = await loadQrGeneration();
    const outputSettings = getRenderSettings(settings, logo, outputSize);
    const baseDataUrl = await generateQrDataUrl(content, outputSettings);

    if (!logo?.dataUrl) {
      return baseDataUrl;
    }

    return addLogoToPngDataUrl(baseDataUrl, logo.dataUrl, outputSettings);
  }, [content, logo, settings]);

  const handlePngDownload = useCallback(async () => {
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
  }, [createPngDataUrl, logo, premium, settings, status]);

  const handleSvgDownload = useCallback(async () => {
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
      const { addLogoToSvg, generateQrSvg } = await loadQrGeneration();
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
  }, [content, logo, premium, settings, status]);

  const handleCopyImage = useCallback(async () => {
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
  }, [createPngDataUrl, logo, premium, settings, status]);

  const handleCheckout = useCallback(async () => {
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
  }, []);

  const pngRequirement = !premium ? getPremiumRequirement(settings, logo, "png") : "";
  const svgRequirement = !premium ? getPremiumRequirement(settings, logo, "svg") : "";
  const copyRequirement = !premium ? getPremiumRequirement(settings, logo, "copy") : "";
  const selectedExportRequirement = pngRequirement || svgRequirement || copyRequirement;

  return (
    <Card
      id="generator"
      variant="elevated"
      padding="none"
      className={`relative h-full w-full overflow-hidden bg-[color-mix(in_srgb,var(--surface-elevated)_92%,black)] ${generatorMinHeight}`}
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
            <ContentPanel
              content={content}
              onContentChange={handleContentChange}
              contentType={contentType}
            />
            <PresetChips
              selectedKey={selectedPresetKey}
              onSelect={selectPreset}
              premium={premium}
            />
            <ColorsPanel
              foreground={settings.foreground}
              background={settings.background}
              updateColor={updateColor}
              hasColorError={hasColorError}
            />
            <SettingsPanel
              size={settings.size}
              errorCorrection={settings.errorCorrection}
              margin={settings.margin}
              logoActive={Boolean(logo)}
              updateSetting={updateSetting}
            />
            <LogoPanel
              logo={logo}
              logoError={logoError}
              logoScale={settings.logoScale}
              onLogoUpload={handleLogoUpload}
              onLogoRemove={removeLogo}
              updateLogoScale={updateLogoScale}
            />
            <UtilityActions
              onUseExample={useExample}
              onClear={clearContent}
              onResetDesign={resetDesign}
            />
          </div>

          <PreviewPanel
            qrDataUrl={qrDataUrl}
            previewSize={previewSize}
            isEmpty={isEmpty}
            status={status}
            statusText={statusText}
            message={message}
            premium={premium}
            selectedExportRequirement={selectedExportRequirement}
            checkoutLoading={checkoutLoading}
            onPngDownload={handlePngDownload}
            onSvgDownload={handleSvgDownload}
            onCopyImage={handleCopyImage}
            onCheckout={handleCheckout}
          />

          <p className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_70%,transparent)] px-4 py-3 text-sm leading-6 text-[var(--muted)] min-[1280px]:col-span-2">
            QR content and uploaded logos are generated locally in this browser and are not saved by QuickQR.
          </p>
        </div>
      </div>
    </Card>
  );
}
