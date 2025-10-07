import { NextResponse } from "next/server";

type ShopifyRequest = {
  productGid: string;
  descriptionHtml: string;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
};

const mutation = `#graphql
mutation UpdateProduct($input: ProductInput!) {
  productUpdate(input: $input) {
    product {
      id
      title
      handle
    }
    userErrors {
      field
      message
    }
  }
}
`;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ShopifyRequest;

    if (!body?.productGid) {
      return NextResponse.json({ error: "productGid is required" }, { status: 400 });
    }

    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const token = process.env.SHOPIFY_ADMIN_TOKEN;

    if (!domain || !token) {
      return NextResponse.json({ error: "Shopify credentials are not configured" }, { status: 500 });
    }

    const response = await fetch(`https://${domain}/admin/api/2024-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: {
            id: body.productGid,
            descriptionHtml: body.descriptionHtml,
            seo: {
              title: body.seoTitle,
              description: body.seoDescription,
            },
            tags: body.tags,
          },
        },
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      return NextResponse.json(payload, { status: response.status });
    }

    const update = payload.data?.productUpdate;
    const userErrors = update?.userErrors ?? [];

    if (Array.isArray(userErrors) && userErrors.length > 0) {
      return NextResponse.json({ userErrors }, { status: 400 });
    }

    return NextResponse.json({ product: update?.product ?? null, userErrors });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
