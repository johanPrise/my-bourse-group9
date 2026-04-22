import type { Stock } from "../models/stock";

const API_URL = "https://keligmartin.github.io/api/stocks.json";

export async function fetchStocks(): Promise<Stock[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const stocks = (await response.json()) as Stock[];

  return stocks;
}
