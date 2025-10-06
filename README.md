# 7anin Copy Optimizer

Generate culturally rooted ecommerce storytelling for the 7anin streetwear brand. This Next.js App Router project pairs OpenAI copywriting with a Shopify update workflow so merch teams can refresh product listings quickly.

## Getting started

1. Install dependencies (Node 20+ recommended):

   ```bash
   npm install
   ```

2. Create a `.env.local` file with your credentials:

   ```bash
   OPENAI_API_KEY=your-openai-key
   OPENAI_MODEL=gpt-4o-mini
   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   SHOPIFY_ADMIN_TOKEN=shpat_...
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

## Features

- **Product prompt form** – Collects all relevant product context, including cultural references and illustration details.
- **Edge OpenAI endpoint** – Calls the Chat Completions API with a strict JSON schema and the 7anin brand system prompt.
- **Content sanitation** – Validates and cleans HTML, tags, and metadata length using a lightweight Zod-compatible schema.
- **Shopify sync** – Push updated descriptions, tags, and SEO fields back to Shopify via the 2024-10 GraphQL API.
- **Tailwind styling** – Modern interface with light/dark-ready neutrals.

## Project structure

```
src/
├─ app/
│  ├─ api/
│  │  ├─ optimize/route.ts         # Edge function calling OpenAI
│  │  └─ shopify/update/route.ts   # Product update GraphQL mutation
│  ├─ globals.css                  # Tailwind layers & typography
│  ├─ layout.tsx                   # App metadata and font wiring
│  └─ page.tsx                     # Main product optimization view
├─ components/
│  ├─ ProductForm.tsx              # Controlled form + fetch to /api/optimize
│  └─ ResultCard.tsx               # Displays generated content & Shopify push
└─ lib/
   ├─ openai.ts                    # Chat completion helper
   ├─ prompts.ts                   # Brand prompt + user prompt builder
   ├─ sanitize.ts                  # HTML/tag sanitization utilities
   └─ schema.ts                    # Optimized content schema & JSON version
```

## Testing checklist

- `npm run lint` – ESLint with Next.js rules.
- `npm run build` – Ensures the app compiles before deployment.

Feel free to customise the UI copy, add analytics, or extend the schema to meet your operations flow.
