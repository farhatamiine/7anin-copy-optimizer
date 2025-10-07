import { z } from "zod";

export const OptimizedContentSchema = z.object({
  heading: z.string().min(3).max(60),
  descriptionHtml: z.string().min(50),
  seoTitle: z.string().min(10).max(60),
  seoDescription: z.string().min(110).max(160),
  tags: z.array(z.string().min(1)).min(3).max(8),
  hashtags: z.array(z.string().min(1)).min(3).max(8),
  mockupSuggestions: z.array(z.string().min(1)).min(2).max(5),
  socialIdeas: z.array(z.string().min(1)).min(3).max(5),
  productTitle: z.string().min(1).max(120).optional(),
});

export type OptimizedContent = ReturnType<typeof OptimizedContentSchema.parse>;

export const OptimizedContentJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heading: { type: "string", minLength: 3, maxLength: 60 },
    descriptionHtml: {
      type: "string",
      minLength: 50,
      description: "HTML limited to <p>, <ul>, <ol>, <li>, <strong>, <em>, <br> tags",
    },
    seoTitle: { type: "string", minLength: 10, maxLength: 60 },
    seoDescription: { type: "string", minLength: 110, maxLength: 160 },
    tags: {
      type: "array",
      minItems: 3,
      maxItems: 8,
      items: { type: "string", minLength: 1 },
    },
    hashtags: {
      type: "array",
      minItems: 3,
      maxItems: 8,
      items: { type: "string", minLength: 1 },
    },
    mockupSuggestions: {
      type: "array",
      minItems: 2,
      maxItems: 5,
      items: { type: "string", minLength: 1 },
    },
    socialIdeas: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: { type: "string", minLength: 1 },
    },
    productTitle: { type: "string", minLength: 1, maxLength: 120 },
  },
  required: [
    "heading",
    "descriptionHtml",
    "seoTitle",
    "seoDescription",
    "tags",
    "hashtags",
    "mockupSuggestions",
    "socialIdeas",
  ],
} as const;
