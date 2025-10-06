"use client";

import { useId, useRef, useState } from "react";
import Papa from "papaparse";

export type ProductCsvRow = {
  productGid?: string;
  title?: string;
  descriptionHtml?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
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

type Props = {
  onRows: (rows: ProductCsvRow[]) => void;
};

type RawCsvRow = Record<string, string | null | undefined>;

const HEADERS = [
  "productGid",
  "title",
  "descriptionHtml",
  "tags",
  "seoTitle",
  "seoDescription",
  "language",
  "audience",
  "inspiration",
  "culturalRefs",
  "illustration",
  "materials",
  "colorway",
  "fit",
  "sizingNotes",
  "care",
  "printMethod",
  "origin",
] as const;

const templateRows: string[][] = [
  [...HEADERS],
  [
    "gid://shopify/Product/1234567890",
    "Casablanca Green March Tee",
    "<p>Soft organic cotton tee celebrating the 1975 Green March with hand-drawn illustration.</p>",
    "streetwear,green march,casablanca",
    "Green March tee for bold storytellers",
    "Celebrate Morocco's unity with a conversational tone highlighting benefits for everyday wear.",
    "fr",
    "Jeunes créatifs passionnés par l'histoire locale",
    "Design inspiré des taxis et de la Marche Verte",
    "Green March",
    "true",
    "100% coton biologique",
    "Vert palmier et sable",
    "Coupe unisexe relax",
    "Prendre une taille au-dessus pour un fit loose",
    "Laver à froid, sécher à l'air libre",
    "Sérigraphie à l'eau",
    "Fabriqué au Portugal",
  ],
];

const escapeCell = (cell: string) => `"${cell.replace(/"/g, '""')}"`;

const TEMPLATE_CONTENT = templateRows
  .map((row) => row.map((cell) => escapeCell(cell)).join(","))
  .join("\n");

const templateHref = `data:text/csv;charset=utf-8,${encodeURIComponent(TEMPLATE_CONTENT)}`;

const normalizeBoolean = (value?: string | null): boolean | undefined => {
  if (value == null) {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();

  if (["true", "1", "yes", "y"].includes(normalized)) {
    return true;
  }

  if (["false", "0", "no", "n"].includes(normalized)) {
    return false;
  }

  return undefined;
};

const parseList = (value?: string | null): string[] | undefined => {
  if (!value) {
    return undefined;
  }

  const entries = value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  return entries.length > 0 ? entries : undefined;
};

const toProductRow = (raw: RawCsvRow): ProductCsvRow => ({
  productGid: raw.productgid?.trim() || undefined,
  title: raw.title?.trim() || undefined,
  descriptionHtml: raw.descriptionhtml ?? undefined,
  tags: parseList(raw.tags),
  seoTitle: raw.seotitle?.trim() || undefined,
  seoDescription: raw.seodescription?.trim() || undefined,
  language: raw.language?.trim().toLowerCase() === "en" ? "en" : raw.language?.trim().toLowerCase() === "fr" ? "fr" : undefined,
  audience: raw.audience?.trim() || undefined,
  inspiration: raw.inspiration?.trim() || undefined,
  culturalRefs: parseList(raw.culturalrefs),
  illustration: normalizeBoolean(raw.illustration),
  materials: raw.materials?.trim() || undefined,
  colorway: raw.colorway?.trim() || undefined,
  fit: raw.fit?.trim() || undefined,
  sizingNotes: raw.sizingnotes?.trim() || undefined,
  care: raw.care?.trim() || undefined,
  printMethod: raw.printmethod?.trim() || undefined,
  origin: raw.origin?.trim() || undefined,
});

export default function CSVImport({ onRows }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importCount, setImportCount] = useState<number | null>(null);
  const inputId = useId();

  const handleFileChange = () => {
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      return;
    }

    setError(null);

    Papa.parse<RawCsvRow>(file, {
      header: true,
      skipEmptyLines: "greedy",
      transformHeader: (header) => header.trim().toLowerCase(),
      complete: (result) => {
        const parsedRows = (result.data ?? []).map((row) => toProductRow(row));
        const validRows = parsedRows.filter((row) => Object.values(row).some((value) => value !== undefined));

        setImportCount(validRows.length);
        onRows(validRows);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        if (result.errors && result.errors.length > 0) {
          setError(result.errors[0]?.message || "Some rows contained parsing issues");
        }
      },
      error: (err) => {
        setError(err.message || "Failed to parse CSV file");
        setImportCount(null);
      },
    });
  };

  const triggerFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="space-y-3 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Import product CSV</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Upload a CSV file to load product context instantly. Additional columns will be ignored automatically.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={triggerFileDialog}
            className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Import CSV
          </button>
          <a
            href={templateHref}
            download="7anin-product-template.csv"
            className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Download template
          </a>
        </div>
      </div>

      <input
        id={inputId}
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={handleFileChange}
        className="hidden"
      />

      {importCount !== null && (
        <p className="text-sm text-neutral-600 dark:text-neutral-300">Loaded {importCount} row{importCount === 1 ? "" : "s"}.</p>
      )}

      {error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
    </section>
  );
}
