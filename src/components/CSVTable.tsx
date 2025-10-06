"use client";

import type { ProductCsvRow } from "./CSVImport";

type Props = {
  rows: ProductCsvRow[];
  onSelect: (row: ProductCsvRow, index: number) => void;
  selectedIndex?: number | null;
};

const formatList = (values?: string[]) => (values && values.length > 0 ? values.join(", ") : "–");

const formatBoolean = (value?: boolean) => {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "–";
};

const columns: {
  key: keyof ProductCsvRow | "language";
  header: string;
  getValue: (row: ProductCsvRow) => string;
}[] = [
  { key: "title", header: "Title", getValue: (row) => row.title ?? "–" },
  { key: "language", header: "Lang", getValue: (row) => (row.language ? row.language.toUpperCase() : "–") },
  { key: "audience", header: "Audience", getValue: (row) => row.audience ?? "–" },
  { key: "tags", header: "Tags", getValue: (row) => formatList(row.tags) },
  { key: "culturalRefs", header: "Cultural refs", getValue: (row) => formatList(row.culturalRefs) },
  { key: "illustration", header: "Illustration", getValue: (row) => formatBoolean(row.illustration) },
  { key: "materials", header: "Materials", getValue: (row) => row.materials ?? "–" },
  { key: "origin", header: "Origin", getValue: (row) => row.origin ?? "–" },
];

export default function CSVTable({ rows, onSelect, selectedIndex = null }: Props) {
  if (!rows.length) {
    return null;
  }

  return (
    <section className="space-y-3 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Imported products</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Select a row to populate the form. Long text is truncated for readability—hover to see the full value.
        </p>
      </div>
      <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
        <div className="max-h-72 overflow-auto">
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
            <thead className="bg-neutral-100 text-left text-xs font-semibold uppercase tracking-wide text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} scope="col" className="px-4 py-2">
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-sm text-neutral-700 dark:divide-neutral-800 dark:text-neutral-200">
              {rows.map((row, index) => {
                const isSelected = selectedIndex === index;
                return (
                  <tr
                    key={`${row.productGid ?? row.title ?? index}-${index}`}
                    tabIndex={0}
                    onClick={() => onSelect(row, index)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelect(row, index);
                      }
                    }}
                    aria-selected={isSelected}
                    className={`cursor-pointer bg-white transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:bg-neutral-900 dark:hover:bg-neutral-800 ${
                      isSelected ? "ring-2 ring-neutral-900 dark:ring-neutral-100" : ""
                    }`}
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="max-w-[200px] px-4 py-2">
                        <span className="block truncate" title={column.getValue(row)}>
                          {column.getValue(row)}
                        </span>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
