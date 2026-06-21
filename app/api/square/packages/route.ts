import { NextResponse } from "next/server";
import { getSquareClient } from "@/lib/square";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export interface PackageVariation {
  id: string;
  name: string;
  price: number; // cents
}

export interface Package {
  id: string;
  name: string;
  description: string;
  variations: PackageVariation[];
}

export async function GET() {
  try {
    const client = getSquareClient();

    // Discover the "packages" category ID dynamically
    let packagesCategoryId: string | null = null;
    const categories = await client.catalog.list({ types: "CATEGORY" });
    for await (const obj of categories) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cat = obj as any;
      if (cat.categoryData?.name?.toLowerCase() === "packages") {
        packagesCategoryId = cat.id;
        break;
      }
    }

    if (!packagesCategoryId) {
      return NextResponse.json({ packages: [] });
    }

    // Fetch all items and filter by packages category
    const packages: Package[] = [];
    const items = await client.catalog.list({ types: "ITEM" });
    for await (const obj of items) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const item = obj as any;
      const d = item.itemData;
      if (!d) continue;

      const catId = d.categories?.[0]?.id;
      if (catId !== packagesCategoryId) continue;

      const variations: PackageVariation[] = (d.variations || [])
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

      packages.push({
        id: item.id,
        name: d.name || "",
        description: d.descriptionPlaintext || d.description || "",
        variations,
      });
    }

    return NextResponse.json({ packages });
  } catch (error) {
    console.error("Packages fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}
