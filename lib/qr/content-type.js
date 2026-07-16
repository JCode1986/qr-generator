const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9()[\]\-\s.]{7,}$/;

export function getContentType(value) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "Empty";
  }

  if (/^WIFI:/i.test(trimmedValue)) {
    return "Wi-Fi";
  }

  try {
    const url = new URL(trimmedValue);

    if (url.protocol === "http:" || url.protocol === "https:") {
      return "URL";
    }
  } catch {
    // Plain text is valid QR content, so URL parsing failure is expected.
  }

  if (emailPattern.test(trimmedValue) || /^mailto:/i.test(trimmedValue)) {
    return "Email";
  }

  if (/^tel:/i.test(trimmedValue) || phonePattern.test(trimmedValue)) {
    return "Phone";
  }

  return "Plain text";
}
