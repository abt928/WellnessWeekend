import { SquareClient, SquareEnvironment } from "square";

let _client: SquareClient | null = null;

export function getSquareClient(): SquareClient {
  if (!_client) {
    const token = process.env.SQUARE_ACCESS_TOKEN;
    if (!token) {
      throw new Error("SQUARE_ACCESS_TOKEN is not set");
    }
    _client = new SquareClient({
      token,
      environment:
        process.env.SQUARE_ENVIRONMENT === "sandbox"
          ? SquareEnvironment.Sandbox
          : SquareEnvironment.Production,
    });
  }
  return _client;
}

export function getLocationId(): string {
  const id = process.env.SQUARE_LOCATION_ID;
  if (!id) throw new Error("SQUARE_LOCATION_ID is not set");
  return id;
}

export function getAppId(): string {
  const id = process.env.SQUARE_APPLICATION_ID;
  if (!id) throw new Error("SQUARE_APPLICATION_ID is not set");
  return id;
}

// Category IDs from the catalog (mapped from the fetch)
export const STORE_CATEGORIES = {
  tickets: "4PCUSCZPR5PNKDFDSGPOOO2H",
  addons: "UT3SS2XRBSNFSFBQUJWIYV35",
  cacao: "QKIBQ52IGPAJQCZLGNS4DU4Z",
  merch: "RTGMSEE6SAWZJHJKCSEM4KV3",
} as const;

export type StoreCategory = keyof typeof STORE_CATEGORIES;
