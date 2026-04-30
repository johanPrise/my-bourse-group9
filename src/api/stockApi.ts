import type { Stock, StockHistory } from "../models/stock";
import { ApiError, InvalidDataError, NetworkError } from "./errors";

const API_URL = "https://keligmartin.github.io/api/stocks.json";

function isStockHistoryEntry(item: unknown): item is StockHistory {
  if (!item || typeof item !== "object") {
    return false;
  }

  const historyEntry = item as Partial<StockHistory>;

  return (
    typeof historyEntry.date === "string" &&
    Number.isFinite(Date.parse(historyEntry.date)) &&
    typeof historyEntry.price === "number" &&
    Number.isFinite(historyEntry.price) &&
    typeof historyEntry.volume === "number" &&
    Number.isFinite(historyEntry.volume)
  );
}

function isStock(item: unknown): item is Stock {
  if (!item || typeof item !== "object") {
    return false;
  }

  const stock = item as Partial<Stock>;

  return (
    typeof stock.symbol === "string" &&
    typeof stock.name === "string" &&
    typeof stock.sector === "string" &&
    typeof stock.currentPrice === "number" &&
    Number.isFinite(stock.currentPrice) &&
    typeof stock.currency === "string" &&
    Array.isArray(stock.history) &&
    stock.history.every((entry) => isStockHistoryEntry(entry))
  );
}

function parseStocksPayload(payload: unknown): Stock[] {
  if (!Array.isArray(payload)) {
    throw new InvalidDataError("Le payload API n'est pas un tableau.");
  }

  const hasInvalidItem = payload.some((item) => !isStock(item));

  if (hasInvalidItem) {
    throw new InvalidDataError("Le payload contient des actions mal formees.");
  }

  return payload;
}

export async function fetchStocks(): Promise<Stock[]> {
  let response: Response;

  try {
    response = await fetch(API_URL);
  } catch {
    throw new NetworkError();
  }

  if (!response.ok) {
    throw new ApiError(response.status);
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new InvalidDataError("Le JSON recu est invalide.");
  }

  return parseStocksPayload(payload);
}
