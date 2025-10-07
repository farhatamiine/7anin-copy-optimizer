"use client";

import { FormEvent, useState } from "react";
import type { OptimizeInput } from "@/lib/prompts";

export type ProductFormValue = {
  title: string;
  descriptionHtml: string;
  tags: string;
  seoTitle: string;
  seoDescription: string;
  language: "fr" | "en";
  audience: string;
  inspiration: string;
  culturalRefs: string;
  illustration: boolean;
  materials: string;
  colorway: string;
  fit: string;
  sizingNotes: string;
  care: string;
  printMethod: string;
  origin: string;
};

export const emptyProductForm: ProductFormValue = {
  title: "",
  descriptionHtml: "",
  tags: "",
  seoTitle: "",
  seoDescription: "",
  language: "fr",
  audience: "",
  inspiration: "",
  culturalRefs: "",
  illustration: false,
  materials: "",
  colorway: "",
  fit: "",
  sizingNotes: "",
  care: "",
  printMethod: "",
  origin: "",
};

type Props = {
  value: ProductFormValue;
  onChange: (value: ProductFormValue) => void;
  onOptimize: (payload: OptimizeInput) => Promise<void>;
};

const toList = (value: string): string[] | undefined => {
  const parsed = value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  return parsed.length ? parsed : undefined;
};

const toOptional = (value: string): string | undefined => {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

const toPayload = (value: ProductFormValue): OptimizeInput => ({
  title: value.title,
  descriptionHtml: toOptional(value.descriptionHtml),
  tags: toList(value.tags),
  seoTitle: toOptional(value.seoTitle),
  seoDescription: toOptional(value.seoDescription),
  language: value.language,
  audience: toOptional(value.audience),
  inspiration: toOptional(value.inspiration),
  culturalRefs: toList(value.culturalRefs),
  illustration: value.illustration,
  materials: toOptional(value.materials),
  colorway: toOptional(value.colorway),
  fit: toOptional(value.fit),
  sizingNotes: toOptional(value.sizingNotes),
  care: toOptional(value.care),
  printMethod: toOptional(value.printMethod),
  origin: toOptional(value.origin),
});

export default function ProductForm({ value, onChange, onOptimize }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof ProductFormValue>(key: K, nextValue: ProductFormValue[K]) => {
    onChange({ ...value, [key]: nextValue });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onOptimize(toPayload(value));
    } catch (err) {
      setError((err as Error).message || "Failed to generate content");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
            Product title
            <input
              required
              value={value.title}
              onChange={(event) => updateField("title", event.target.value)}
              className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
              placeholder="Casablanca Green March Tee"
            />
          </label>
        </div>

        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          Language
          <select
            value={value.language}
            onChange={(event) => updateField("language", event.target.value as ProductFormValue["language"])}
            className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </label>

        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          Audience
          <input
            value={value.audience}
            onChange={(event) => updateField("audience", event.target.value)}
            className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            placeholder="Jeunes créatifs à Casablanca"
          />
        </label>

        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          Inspiration
          <input
            value={value.inspiration}
            onChange={(event) => updateField("inspiration", event.target.value)}
            className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            placeholder="Moodboard taxi jaune"
          />
        </label>

        <label className="lg:col-span-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          Current description (HTML allowed)
          <textarea
            value={value.descriptionHtml}
            onChange={(event) => updateField("descriptionHtml", event.target.value)}
            className="mt-2 h-32 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            placeholder="<p>Description actuelle...</p>"
          />
        </label>

        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          Current tags (comma separated)
          <input
            value={value.tags}
            onChange={(event) => updateField("tags", event.target.value)}
            className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            placeholder="streetwear, maroc, illustration"
          />
        </label>

        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          Current SEO title
          <input
            value={value.seoTitle}
            onChange={(event) => updateField("seoTitle", event.target.value)}
            className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
          />
        </label>

        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          Current SEO description
          <textarea
            value={value.seoDescription}
            onChange={(event) => updateField("seoDescription", event.target.value)}
            className="mt-2 h-24 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
          />
        </label>

        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          Cultural references (comma separated)
          <input
            value={value.culturalRefs}
            onChange={(event) => updateField("culturalRefs", event.target.value)}
            className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            placeholder="Green March, Grand Taxi"
          />
        </label>

        <div className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          <span>Illustration artwork included?</span>
          <div className="mt-2 flex items-center gap-3 rounded-md border border-neutral-300 bg-white px-3 py-2 shadow-sm focus-within:border-neutral-900 focus-within:ring-2 focus-within:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950">
            <input
              id="illustration-toggle"
              type="checkbox"
              checked={value.illustration}
              onChange={(event) => updateField("illustration", event.target.checked)}
              className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100"
            />
            <label htmlFor="illustration-toggle" className="text-sm text-neutral-700 dark:text-neutral-200">
              Yes, the product features an illustration
            </label>
          </div>
        </div>

        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          Materials
          <input
            value={value.materials}
            onChange={(event) => updateField("materials", event.target.value)}
            className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            placeholder="100% coton bio"
          />
        </label>

        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          Colorway
          <input
            value={value.colorway}
            onChange={(event) => updateField("colorway", event.target.value)}
            className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            placeholder="Vert palmier, sable"
          />
        </label>

        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          Fit
          <input
            value={value.fit}
            onChange={(event) => updateField("fit", event.target.value)}
            className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            placeholder="Coupe unisexe relax"
          />
        </label>

        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          Sizing notes
          <input
            value={value.sizingNotes}
            onChange={(event) => updateField("sizingNotes", event.target.value)}
            className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            placeholder="Prendre une taille au-dessus pour un fit loose"
          />
        </label>

        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          Care instructions
          <input
            value={value.care}
            onChange={(event) => updateField("care", event.target.value)}
            className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            placeholder="Laver à froid, sécher à l'air libre"
          />
        </label>

        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          Print method
          <input
            value={value.printMethod}
            onChange={(event) => updateField("printMethod", event.target.value)}
            className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            placeholder="Sérigraphie à l'eau"
          />
        </label>

        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          Origin
          <input
            value={value.origin}
            onChange={(event) => updateField("origin", event.target.value)}
            className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            placeholder="Fabriqué au Portugal"
          />
        </label>
      </div>

      {error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Adjust any field before requesting fresh SEO copy optimised for the 7anin story.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-500 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          {isSubmitting ? "Generating..." : "Generate"}
        </button>
      </div>
    </form>
  );
}
