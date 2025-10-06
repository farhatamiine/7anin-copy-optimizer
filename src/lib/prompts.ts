export const BRAND_SYSTEM_PROMPT = `You are an ecommerce SEO copywriter for '7anin' (culturally inspired streetwear). Voice: conversational, simple FR/EN, benefits > features, no empty adjectives. Only use cultural refs provided (Green March, El Haïk, Grand Taxi). Do not invent materials/sizes/history. Darija allowed in product titles ONLY if the product has a North African illustration; else titles in FR/EN. Description 150–300 words using only <p>, <ul>, <ol>, <li>, <strong>, <em>, <br>. Heading ≤ 60 chars. SEO title 35–60 chars. Meta 150–160 chars. 3–8 tags (lowercase), 3–8 hashtags (lowercase, no spaces; hyphens ok). 2–5 mockup/styling suggestions. 3–5 social ideas tied to the story. Output ONLY valid JSON matching the schema.`;

export type OptimizeInput = {
  title: string;
  descriptionHtml?: string | null;
  tags?: string[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  language?: "fr" | "en";
  audience?: string;
  inspiration?: string;
  culturalRefs?: string[];
  illustration?: boolean;
  materials?: string;
  colorway?: string;
  fit?: string;
  sizingNotes?: string;
  care?: string;
  printMethod?: string;
  origin?: string;
};

const toPlainText = (html?: string | null): string => {
  if (!html) {
    return "";
  }

  return html
    .replace(/<br\s*\/?>(\n)?/gi, "\n")
    .replace(/<\/(p|div|li|ul|ol)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s{2,}/g, " ")
    .trim();
};

const formatValue = (value?: string | null) => {
  if (!value) {
    return "(none)";
  }

  return value.trim() === "" ? "(none)" : value.trim();
};

const formatList = (values?: string[]) => {
  if (!values || values.length === 0) {
    return "(none)";
  }

  const filtered = values
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  return filtered.length ? filtered.join(", ") : "(none)";
};

export const buildUserPrompt = (input: OptimizeInput): string => {
  const language = input.language ?? "fr";
  const description = toPlainText(input.descriptionHtml);

  return [
    `Language: ${language}`,
    `Product title: ${input.title}`,
    `Current description: ${description ? description : "(none)"}`,
    `Current tags: ${formatList(input.tags)}`,
    `Current SEO title: ${formatValue(input.seoTitle)}`,
    `Current SEO description: ${formatValue(input.seoDescription)}`,
    "",
    "Extra context:",
    `Audience: ${formatValue(input.audience)}`,
    `Inspiration: ${formatValue(input.inspiration)}`,
    `Cultural references (only if relevant): ${formatList(input.culturalRefs)}`,
    `Has illustration artwork: ${Boolean(input.illustration)}`,
    `Materials: ${formatValue(input.materials)}`,
    `Colorway: ${formatValue(input.colorway)}`,
    `Fit: ${formatValue(input.fit)}`,
    `Sizing notes: ${formatValue(input.sizingNotes)}`,
    `Care: ${formatValue(input.care)}`,
    `Print method: ${formatValue(input.printMethod)}`,
    `Origin: ${formatValue(input.origin)}`,
  ].join("\n");
};
