import "server-only";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

type ChatJsonOptions = {
  system: string;
  user: string;
  schema: Record<string, unknown>;
};

export async function chatJson<T>({ system, user, schema }: ChatJsonOptions): Promise<T> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY environment variable");
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: {
        type: "json_object",
        schema,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${errorBody}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI response missing content");
  }

  try {
    return JSON.parse(content) as T;
  } catch (error) {
    throw new Error(`Failed to parse OpenAI JSON response: ${(error as Error).message}`);
  }
}
