import ProductForm from "@/components/ProductForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-12 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
            7anin copy optimizer
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">Craft product storytelling that resonates.</h1>
          <p className="max-w-2xl text-base text-neutral-600 dark:text-neutral-300">
            Feed in your current product data and let our OpenAI-powered workflow craft culturally rooted copy you can ship to Shopify in one click.
          </p>
        </header>
        <ProductForm />
      </div>
    </main>
  );
}
