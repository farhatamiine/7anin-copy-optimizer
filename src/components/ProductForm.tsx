"use client";

import { FormEvent, useMemo, useState } from "react";
import type { OptimizeInput } from "@/lib/prompts";
import type { OptimizedContent } from "@/lib/schema";
import ResultCard from "./ResultCard";

type FormState = {
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

const defaultState: FormState = {
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

export default function ProductForm() {
  const [form, setForm] = useState<FormState>(defaultState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OptimizedContent | null>(null);

  const requestPayload: OptimizeInput = useMemo(
    () => ({
      title: form.title,
      descriptionHtml: toOptional(form.descriptionHtml),
      tags: toList(form.tags),
      seoTitle: toOptional(form.seoTitle),
      seoDescription: toOptional(form.seoDescription),
      language: form.language,
      audience: toOptional(form.audience),
      inspiration: toOptional(form.inspiration),
      culturalRefs: toList(form.culturalRefs),
      illustration: form.illustration,
      materials: toOptional(form.materials),
      colorway: toOptional(form.colorway),
      fit: toOptional(form.fit),
      sizingNotes: toOptional(form.sizingNotes),
      care: toOptional(form.care),
      printMethod: toOptional(form.printMethod),
      origin: toOptional(form.origin),
    }),
    [form],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to generate content");
      }

      const data = (await response.json()) as OptimizedContent;
      setResult(data);
    } catch (err) {
      setResult(null);
      setError((err as Error).message || "Unexpected error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
              Product title
              <input
                required
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
                placeholder="T-shirt Green March"
              />
            </label>
          </div>

          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
            Language
            <select
              value={form.language}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, language: event.target.value as FormState["language"] }))
              }
              className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </label>

          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
            Audience
            <input
              value={form.audience}
              onChange={(event) => setForm((prev) => ({ ...prev, audience: event.target.value }))}
              className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
              placeholder="Jeunes créatifs à Casablanca"
            />
          </label>

          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
            Inspiration
            <input
              value={form.inspiration}
              onChange={(event) => setForm((prev) => ({ ...prev, inspiration: event.target.value }))}
              className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
              placeholder="Moodboard taxi jaune"
            />
          </label>

          <label className="lg:col-span-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
            Current description (HTML allowed)
            <textarea
              value={form.descriptionHtml}
              onChange={(event) => setForm((prev) => ({ ...prev, descriptionHtml: event.target.value }))}
              className="mt-2 h-32 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
              placeholder="<p>Description actuelle...</p>"
            />
          </label>

          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
            Current tags (comma separated)
            <input
              value={form.tags}
              onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
              className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
              placeholder="streetwear, maroc, illustration"
            />
          </label>

          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
            Current SEO title
            <input
              value={form.seoTitle}
              onChange={(event) => setForm((prev) => ({ ...prev, seoTitle: event.target.value }))}
              className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            />
          </label>

          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
            Current SEO description
            <textarea
              value={form.seoDescription}
              onChange={(event) => setForm((prev) => ({ ...prev, seoDescription: event.target.value }))}
              className="mt-2 h-24 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            />
          </label>

          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
            Cultural references (comma separated)
            <input
              value={form.culturalRefs}
              onChange={(event) => setForm((prev) => ({ ...prev, culturalRefs: event.target.value }))}
              className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
              placeholder="Green March, Grand Taxi"
            />
          </label>

          <label className="flex items-center gap-3 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
            <input
              type="checkbox"
              checked={form.illustration}
              onChange={(event) => setForm((prev) => ({ ...prev, illustration: event.target.checked }))}
              className="h-4 w-4 rounded border border-neutral-300 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700"
            />
            Product includes illustration artwork
          </label>

          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
            Materials
            <input
              value={form.materials}
              onChange={(event) => setForm((prev) => ({ ...prev, materials: event.target.value }))}
              className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            />
          </label>

          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
            Colorway
            <input
              value={form.colorway}
              onChange={(event) => setForm((prev) => ({ ...prev, colorway: event.target.value }))}
              className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            />
          </label>

          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
            Fit
            <input
              value={form.fit}
              onChange={(event) => setForm((prev) => ({ ...prev, fit: event.target.value }))}
              className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            />
          </label>

          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
            Sizing notes
            <input
              value={form.sizingNotes}
              onChange={(event) => setForm((prev) => ({ ...prev, sizingNotes: event.target.value }))}
              className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            />
          </label>

          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
            Care instructions
            <input
              value={form.care}
              onChange={(event) => setForm((prev) => ({ ...prev, care: event.target.value }))}
              className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            />
          </label>

          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
            Print method
            <input
              value={form.printMethod}
              onChange={(event) => setForm((prev) => ({ ...prev, printMethod: event.target.value }))}
              className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            />
          </label>

          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
            Origin
            <input
              value={form.origin}
              onChange={(event) => setForm((prev) => ({ ...prev, origin: event.target.value }))}
              className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
            />
          </label>
        </div>

        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-500"
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
      </form>

      {result && <ResultCard data={result} />}
    </div>
  );
}
