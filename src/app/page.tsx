"use client";

import { useMemo, useRef, useState } from "react";
import CSVImport, { ProductCsvRow } from "@/components/CSVImport";
import CSVTable from "@/components/CSVTable";
import ProductForm, { ProductFormValue, emptyProductForm } from "@/components/ProductForm";
import ResultCard from "@/components/ResultCard";
import type { OptimizeInput } from "@/lib/prompts";
import type { OptimizedContent } from "@/lib/schema";

const toFormValue = (row: ProductCsvRow): ProductFormValue => ({
  title: row.title ?? "",
  descriptionHtml: row.descriptionHtml ?? "",
  tags: row.tags?.join(", ") ?? "",
  seoTitle: row.seoTitle ?? "",
  seoDescription: row.seoDescription ?? "",
  language: row.language ?? "fr",
  audience: row.audience ?? "",
  inspiration: row.inspiration ?? "",
  culturalRefs: row.culturalRefs?.join(", ") ?? "",
  illustration: row.illustration ?? false,
  materials: row.materials ?? "",
  colorway: row.colorway ?? "",
  fit: row.fit ?? "",
  sizingNotes: row.sizingNotes ?? "",
  care: row.care ?? "",
  printMethod: row.printMethod ?? "",
  origin: row.origin ?? "",
});

export default function Home() {
  const [form, setForm] = useState<ProductFormValue>(emptyProductForm);
  const [rows, setRows] = useState<ProductCsvRow[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [result, setResult] = useState<OptimizedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  const handleOptimize = async (payload: OptimizeInput) => {
    setError(null);

    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to generate content");
      }

      const data = (await response.json()) as OptimizedContent;
      setResult(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to generate content");
      setResult(null);
      setError(error.message);
      throw error;
    }
  };

  const handleRows = (incoming: ProductCsvRow[]) => {
    setRows(incoming);
    setSelectedIndex(null);
  };

  const loadRowIntoForm = (row: ProductCsvRow, index: number) => {
    setSelectedIndex(index);
    setForm(toFormValue(row));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectionMeta = useMemo(() => {
    if (selectedIndex === null || !rows[selectedIndex]) {
      return null;
    }

    const row = rows[selectedIndex];
    return {
      title: row.title ?? "Imported product",
      productGid: row.productGid ?? undefined,
    };
  }, [rows, selectedIndex]);

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-12 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">7anin copy optimizer</p>
          <h1 className="text-3xl font-bold sm:text-4xl">Craft product storytelling that resonates.</h1>
          <p className="max-w-2xl text-base text-neutral-600 dark:text-neutral-300">
            Feed in your current product data and let our OpenAI-powered workflow craft culturally rooted copy you can ship to Shopify in one click.
          </p>
        </header>

        <CSVImport onRows={handleRows} />
        <CSVTable rows={rows} onSelect={loadRowIntoForm} selectedIndex={selectedIndex} />

        <div ref={formRef} className="space-y-4">
          <ProductForm value={form} onChange={setForm} onOptimize={handleOptimize} />
          {error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
          {selectionMeta && (
            <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-100 px-4 py-3 text-sm text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-200">
              Loaded <span className="font-semibold">{selectionMeta.title}</span>
              {selectionMeta.productGid && (
                <>
                  {" "}• Shopify GID: <span className="font-mono text-xs">{selectionMeta.productGid}</span>
                </>
              )}
            </div>
          )}
        </div>

        {result && <ResultCard data={result} />}
      </div>
    </main>
  );
}
