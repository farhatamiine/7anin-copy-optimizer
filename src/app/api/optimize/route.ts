import { NextResponse } from "next/server";
import { BRAND_SYSTEM_PROMPT, buildUserPrompt, type OptimizeInput } from "@/lib/prompts";
import { chatJson } from "@/lib/openai";
import { OptimizedContentJsonSchema, OptimizedContentSchema } from "@/lib/schema";
import { clamp, dedupeLower, sanitizeHtml } from "@/lib/sanitize";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OptimizeInput;

    if (!body?.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const prompt = buildUserPrompt(body);

    const completion = await chatJson<Record<string, unknown>>({
      system: BRAND_SYSTEM_PROMPT,
      user: prompt,
      schema: OptimizedContentJsonSchema,
    });

    const sanitized = {
      ...completion,
      descriptionHtml: sanitizeHtml(String(completion.descriptionHtml ?? "")),
      seoTitle: clamp(String(completion.seoTitle ?? ""), 60),
      seoDescription: clamp(String(completion.seoDescription ?? ""), 160),
      tags: dedupeLower(Array.isArray(completion.tags) ? completion.tags : []),
      hashtags: dedupeLower(Array.isArray(completion.hashtags) ? completion.hashtags : []),
      mockupSuggestions: Array.isArray(completion.mockupSuggestions)
        ? completion.mockupSuggestions
            .map((item) => String(item).trim())
            .filter((item) => item.length > 0)
            .slice(0, 5)
        : [],
      socialIdeas: Array.isArray(completion.socialIdeas)
        ? completion.socialIdeas
            .map((item) => String(item).trim())
            .filter((item) => item.length > 0)
            .slice(0, 5)
        : [],
      productTitle:
        typeof completion.productTitle === "string" && completion.productTitle.trim().length > 0
          ? clamp(completion.productTitle.trim(), 120)
          : undefined,
    };

    const parsed = OptimizedContentSchema.parse(sanitized);

    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.toLowerCase().includes("openai") ? 502 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
