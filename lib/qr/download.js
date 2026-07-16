export function getDownloadFileName(extension) {
  const date = new Date().toISOString().slice(0, 10);

  return `quickqr-${date}.${extension}`;
}

export function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function dataUrlToBlob(dataUrl) {
  const response = await fetch(dataUrl);

  return response.blob();
}

export async function copyPngToClipboard(dataUrl) {
  if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
    throw new Error("Clipboard image copying is not supported in this browser.");
  }

  const blob = await dataUrlToBlob(dataUrl);
  await navigator.clipboard.write([
    new ClipboardItem({
      [blob.type]: blob,
    }),
  ]);
}
