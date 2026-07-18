import { getQrOptions } from "@/lib/qr/settings";

let qrCodeModulePromise;

async function getQRCode() {
  if (!qrCodeModulePromise) {
    qrCodeModulePromise = import("qrcode").then((module) => module.default || module);
  }

  return qrCodeModulePromise;
}

export async function generateQrDataUrl(content, settings) {
  const QRCode = await getQRCode();

  return QRCode.toDataURL(content, getQrOptions(settings));
}

export async function generateQrSvg(content, settings) {
  const QRCode = await getQRCode();

  return QRCode.toString(content, {
    ...getQrOptions(settings),
    type: "svg",
  });
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load image."));
    image.src = source;
  });
}

export async function addLogoToPngDataUrl(qrDataUrl, logoDataUrl, settings) {
  const [qrImage, logoImage] = await Promise.all([
    loadImage(qrDataUrl),
    loadImage(logoDataUrl),
  ]);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const size = settings.size;
  const logoSize = Math.round(size * (settings.logoScale / 100));
  const plateSize = Math.round(logoSize * 1.22);
  const plateX = Math.round((size - plateSize) / 2);
  const logoX = Math.round((size - logoSize) / 2);

  canvas.width = size;
  canvas.height = size;
  context.drawImage(qrImage, 0, 0, size, size);
  context.fillStyle = "#ffffff";
  context.fillRect(plateX, plateX, plateSize, plateSize);
  context.drawImage(logoImage, logoX, logoX, logoSize, logoSize);

  return canvas.toDataURL("image/png");
}

export function addLogoToSvg(svg, logoDataUrl, settings) {
  const size = settings.size;
  const logoSize = Math.round(size * (settings.logoScale / 100));
  const plateSize = Math.round(logoSize * 1.22);
  const plateX = Math.round((size - plateSize) / 2);
  const logoX = Math.round((size - logoSize) / 2);
  const logoMarkup = `
  <rect x="${plateX}" y="${plateX}" width="${plateSize}" height="${plateSize}" rx="${Math.round(plateSize * 0.12)}" fill="#ffffff" />
  <image href="${logoDataUrl}" x="${logoX}" y="${logoX}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid meet" />`;

  return svg.replace("</svg>", `${logoMarkup}\n</svg>`);
}
