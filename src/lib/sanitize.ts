const ALLOWED_TAGS = new Set(["p", "ul", "ol", "li", "strong", "em", "br"]);

export function sanitizeHtml(input: string): string {
  if (!input) {
    return "";
  }

  let sanitized = input
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");

  sanitized = sanitized.replace(/<([^>]+)>/gi, (match, tagContent) => {
    const raw = String(tagContent).trim();
    const isClosing = raw.startsWith("/");
    const tagName = (isClosing ? raw.slice(1) : raw).split(/\s+/)[0]?.toLowerCase();

    if (!tagName || !ALLOWED_TAGS.has(tagName)) {
      return "";
    }

    if (tagName === "br") {
      return "<br>";
    }

    return isClosing ? `</${tagName}>` : `<${tagName}>`;
  });

  sanitized = sanitized
    .replace(/&nbsp;/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s{2,}/g, " ")
    .trim();

  return sanitized;
}

export function dedupeLower(values: string[], max = 8): string[] {
  if (!Array.isArray(values)) {
    return [];
  }

  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    if (result.length >= max) {
      break;
    }

    const normalized = String(value ?? "").trim().toLowerCase();
    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    result.push(normalized);
  }

  return result;
}

export function clamp(value: string, max: number): string {
  if (!value) {
    return "";
  }

  if (value.length <= max) {
    return value;
  }

  return value.slice(0, max).trimEnd();
}
