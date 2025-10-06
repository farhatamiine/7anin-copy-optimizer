"use client";

import { useState } from "react";
import type { OptimizedContent } from "@/lib/schema";

type Props = {
  data: OptimizedContent;
};

const SectionTitle = ({ children }: { children: string }) => (
  <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{children}</h3>
);

export default function ResultCard({ data }: Props) {
  const [productGid, setProductGid] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

  const pushToShopify = async () => {
    if (!productGid) {
      setStatus("error");
      setStatusMessage("Product GID is required");
      return;
    }

    setStatus("loading");
    setStatusMessage("");

    try {
      const response = await fetch("/api/shopify/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productGid,
          descriptionHtml: data.descriptionHtml,
          seoTitle: data.seoTitle,
          seoDescription: data.seoDescription,
          tags: data.tags,
        }),
      });

      const payload = await response.json();
      const userErrors = payload?.userErrors as { message: string }[] | undefined;

      if (!response.ok || (userErrors && userErrors.length > 0)) {
        const errorMessage =
          userErrors && userErrors.length > 0
            ? userErrors.map((err) => err.message).join("; ")
            : payload?.error ?? "Shopify update failed";
        throw new Error(errorMessage);
      }

      setStatus("success");
      setStatusMessage("Product updated successfully");
    } catch (error) {
      setStatus("error");
      setStatusMessage((error as Error).message || "Failed to update product");
    }
  };

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <header className="space-y-2">
        {data.productTitle && (
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            Suggested product title
          </p>
        )}
        {data.productTitle && <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{data.productTitle}</h2>}
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">{data.heading}</h1>
      </header>

      <div className="mt-6 space-y-6 text-sm text-neutral-700 dark:text-neutral-200">
        <div className="prose prose-neutral max-w-none text-neutral-700 dark:prose-invert" dangerouslySetInnerHTML={{ __html: data.descriptionHtml }} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <SectionTitle>SEO title</SectionTitle>
            <p className="rounded-md bg-neutral-100 px-3 py-2 font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
              {data.seoTitle}
            </p>
          </div>
          <div className="space-y-2">
            <SectionTitle>Meta description</SectionTitle>
            <p className="rounded-md bg-neutral-100 px-3 py-2 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
              {data.seoDescription}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <SectionTitle>Tags</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <SectionTitle>Hashtags</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {data.hashtags.map((tag) => (
                <span key={tag} className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                  #{tag.replace(/^#/, "")}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <SectionTitle>Mockup & styling ideas</SectionTitle>
          <ul className="list-disc space-y-1 pl-5">
            {data.mockupSuggestions.map((idea) => (
              <li key={idea}>{idea}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <SectionTitle>Social story angles</SectionTitle>
          <ul className="list-disc space-y-1 pl-5">
            {data.socialIdeas.map((idea) => (
              <li key={idea}>{idea}</li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="mt-6 space-y-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={productGid}
            onChange={(event) => setProductGid(event.target.value)}
            placeholder="gid://shopify/Product/1234567890"
            className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
          />
          <button
            type="button"
            onClick={pushToShopify}
            disabled={status === "loading"}
            className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-400"
          >
            {status === "loading" ? "Pushing..." : "Push to Shopify"}
          </button>
        </div>
        {status !== "idle" && statusMessage && (
          <p
            className={
              status === "success"
                ? "text-sm font-medium text-emerald-600 dark:text-emerald-400"
                : "text-sm font-medium text-red-600 dark:text-red-400"
            }
          >
            {statusMessage}
          </p>
        )}
      </footer>
    </section>
  );
}
