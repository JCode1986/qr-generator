export const QR_MAX_LENGTH = 2000;

export const defaultQrSettings = {
  content: "https://example.com",
  foreground: "#07111f",
  background: "#ffffff",
  size: 512,
  errorCorrection: "M",
  margin: 2,
  logoScale: 22,
};

export const defaultQrPreviewDataUrl =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvc3ZnIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDI5IDI5IiBzaGFwZS1yZW5kZXJpbmc9ImNyaXNwRWRnZXMiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0wIDBoMjl2MjlIMHoiLz48cGF0aCBzdHJva2U9IiMwNzExMWYiIGQ9Ik0yIDIuNWg3bTQgMGgzbTIgMGgxbTEgMGg3TTIgMy41aDFtNSAwaDFtMyAwaDFtMiAwaDRtMSAwaDFtNSAwaDFNMiA0LjVoMW0xIDBoM20xIDBoMW0xIDBoMm0xIDBoMW0yIDBoMW0zIDBoMW0xIDBoM20xIDBoMU0yIDUuNWgxbTEgMGgzbTEgMGgxbTEgMGgxbTQgMGgzbTIgMGgxbTEgMGgzbTEgMGgxTTIgNi41aDFtMSAwaDNtMSAwaDFtMSAwaDNtMiAwaDFtMiAwaDFtMSAwaDFtMSAwaDNtMSAwaDFNMiA3LjVoMW01IDBoMW0xIDBoMW0yIDBoMW0yIDBoMm0yIDBoMW01IDBoMU0yIDguNWg3bTEgMGgxbTEgMGgxbTEgMGgxbTEgMGgxbTEgMGgxbTEgMGg3TTEwIDkuNWgxbTUgMGgxbTEgMGgxTTIgMTAuNWgxbTEgMGg1bTUgMGgxbTUgMGg1TTMgMTEuNWgxbTIgMGgybTIgMGgxbTEgMGgybTEgMGgxbTMgMGgxbTEgMGgxbTMgMGgxTTIgMTIuNWg1bTEgMGgxbTEgMGgybTMgMGg0bTIgMGgxbTEgMGgxbTEgMGgyTTIgMTMuNWgybTEgMGgzbTIgMGgxbTEgMGgybTEgMGgxbTEgMGgybTEgMGgybTQgMGgxTTMgMTQuNWgzbTIgMGgxbTQgMGgybTEgMGgybTEgMGgybTEgMGgxbTEgMGgzTTIgMTUuNWg1bTMgMGgxbTEgMGgxbTUgMGgxbTIgMGgxbTEgMGgxbTEgMGgxTTIgMTYuNWgxbTUgMGgybTIgMGgzbTIgMGgxbTIgMGg0bTEgMGgyTTIgMTcuNWgxbTIgMGgxbTMgMGgxbTMgMGgxbTIgMGg3bTMgMGgxTTIgMTguNWgxbTEgMGgxbTIgMGgybTEgMGg0bTQgMGg1bTEgMGgxTTEwIDE5LjVoMm0yIDBoNW0zIDBoMk0yIDIwLjVoN202IDBoMm0xIDBoMW0xIDBoMW0xIDBoMW0xIDBoM00yIDIxLjVoMW01IDBoMW0xIDBoMm0yIDBoMm0yIDBoMW0zIDBoMm0xIDBoMU0yIDIyLjVoMW0xIDBoM20xIDBoMW0xIDBoM20xIDBoMW0xIDBoN20xIDBoMW0xIDBoMU0yIDIzLjVoMW0xIDBoM20xIDBoMW0xIDBoMW02IDBoMW0xIDBoMm0xIDBoNU0yIDI0LjVoMW0xIDBoM20xIDBoMW0xIDBoNW0yIDBoMW01IDBoMm0xIDBoMU0yIDI1LjVoMW01IDBoMW00IDBoMW0yIDBoMW0xIDBoMm0xIDBoM20yIDBoMU0yIDI2LjVoN20xIDBoMm0xIDBoMW01IDBoOCIvPjwvc3ZnPgo=";

export const qrPresets = [
  {
    name: "Classic",
    foreground: "#07111f",
    background: "#ffffff",
    errorCorrection: "M",
    margin: 2,
  },
  {
    name: "Midnight",
    foreground: "#f8fafc",
    background: "#0b1728",
    errorCorrection: "Q",
    margin: 2,
  },
  {
    name: "Ocean",
    foreground: "#075985",
    background: "#ecfeff",
    errorCorrection: "M",
    margin: 2,
  },
  {
    name: "Violet",
    premium: true,
    foreground: "#5b21b6",
    background: "#faf5ff",
    errorCorrection: "Q",
    margin: 2,
  },
  {
    name: "Warm",
    premium: true,
    foreground: "#7c2d12",
    background: "#fff7ed",
    errorCorrection: "M",
    margin: 4,
  },
];

export const qrSizes = [256, 512, 1024, 2048];
export const errorCorrectionLevels = ["L", "M", "Q", "H"];
export const qrMargins = [1, 2, 4];

export function isValidHexColor(value) {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

export function normalizeHexColor(value) {
  const trimmedValue = value.trim();

  if (/^[0-9a-fA-F]{6}$/.test(trimmedValue)) {
    return `#${trimmedValue}`;
  }

  return trimmedValue;
}

export function getQrOptions(settings) {
  return {
    errorCorrectionLevel: settings.errorCorrection,
    margin: settings.margin,
    width: settings.size,
    color: {
      dark: `${settings.foreground}ff`,
      light: `${settings.background}ff`,
    },
  };
}
