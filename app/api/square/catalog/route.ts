import { NextResponse } from "next/server";
import { getSquareClient, STORE_CATEGORIES } from "@/lib/square";

export const dynamic = "force-dynamic";
export const revalidate = 300; // 5 min cache

export interface CatalogVariation {
  id: string;
  name: string;
  price: number; // cents
}

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  category: string;
  variations: CatalogVariation[];
}

const allowedCategoryIds = new Set(Object.values(STORE_CATEGORIES));

export async function GET() {
  try {
    const client = getSquareClient();
    const catalog = await client.catalog.list({ types: "ITEM" });

    const items: CatalogItem[] = [];
    for await (const obj of catalog) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const item = obj as any;
      const d = item.itemData;
      if (!d) continue;

      // Only include items from our 4 store categories
      const catId = d.categories?.[0]?.id;
      if (!catId || !allowedCategoryIds.has(catId)) continue;

      // Map category ID to our key
      let category = "other";
      for (const [key, id] of Object.entries(STORE_CATEGORIES)) {
        if (id === catId) { category = key; break; }
      }

      // Skip items with no price (service fee, etc.)
      const variations: CatalogVariation[] = (d.variations || [])
        .filter((v: Record<string, unknown>) => {
          const vd = v.itemVariationData as Record<string, unknown> | undefined;
          const pm = vd?.priceMoney as Record<string, unknown> | undefined;
          return pm && Number(pm.amount) > 0;
        })
        .map((v: Record<string, unknown>) => {
          const vd = v.itemVariationData as Record<string, unknown>;
          const pm = vd.priceMoney as Record<string, unknown>;
          return {
            id: v.id as string,
            name: vd.name as string,
            price: Number(pm.amount),
          };
        });

      if (variations.length === 0) continue;

      items.push({
        id: item.id,
        name: d.name || "",
        description: d.descriptionPlaintext || d.description || "",
        category,
        variations,
      });
    }

    // Sort: tickets first, then add-ons, cacao, merch
    const order = { tickets: 0, addons: 1, cacao: 2, merch: 3, other: 4 };
    items.sort((a, b) => (order[a.category as keyof typeof order] ?? 4) - (order[b.category as keyof typeof order] ?? 4));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Catalog fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch catalog" }, { status: 500 });
  }
}
