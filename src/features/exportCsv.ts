import type { Period } from "../charts/priceChart";
import type { Stock, StockHistory } from "../models/stock";

const MS_PER_DAY = 86_400_000;
const CSV_SEPARATOR = ";";
const UTF8_BOM = "\uFEFF";

const PERIOD_DAYS: Record<Exclude<Period, "ALL">, number> = {
  "1W": 7,
  "1M": 30,
  "1Y": 365,
};

function filterHistoryByPeriod(history: StockHistory[], period: Period): StockHistory[] {
  const sortedHistory = [...history].sort((a, b) => a.date.localeCompare(b.date));

  if (period === "ALL" || sortedHistory.length === 0) {
    return sortedHistory;
  }

  const lastDate = new Date(sortedHistory.at(-1)?.date ?? "").getTime();
  const cutoffDate = lastDate - PERIOD_DAYS[period] * MS_PER_DAY;

  return sortedHistory.filter((entry) => new Date(entry.date).getTime() >= cutoffDate);
}

function escapeCsvValue(value: string | number): string {
  const stringValue = String(value);
  return `"${stringValue.replaceAll('"', '""')}"`;
}

function formatPeriod(period: Period): string {
  if (period === "1W") return "1 semaine";
  if (period === "1M") return "1 mois";
  if (period === "1Y") return "1 an";
  return "Tout";
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("fr-FR").format(new Date(value));
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatVolume(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value);
}

function buildCsvContent(stocks: Stock[], period: Period): string {
  const header = [
    "Symbole",
    "Nom",
    "Secteur",
    "Devise",
    "Periode",
    "Date",
    "Prix",
    "Volume",
  ];

  const rows = stocks.flatMap((stock) =>
    filterHistoryByPeriod(stock.history, period).map((entry) =>
      [
        stock.symbol,
        stock.name,
        stock.sector,
        stock.currency,
        formatPeriod(period),
        formatDate(entry.date),
        formatPrice(entry.price),
        formatVolume(entry.volume),
      ]
        .map((value) => escapeCsvValue(value))
        .join(CSV_SEPARATOR),
    ),
  );

  return `${UTF8_BOM}${[header.join(CSV_SEPARATOR), ...rows].join("\n")}`;
}

export function downloadCsvFile(stocks: Stock[], period: Period): void {
  const csvContent = buildCsvContent(stocks, period);
  const csvBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const downloadUrl = URL.createObjectURL(csvBlob);
  const downloadLink = document.createElement("a");
  const fileSuffix = stocks.map((stock) => stock.symbol).join("-");

  downloadLink.href = downloadUrl;
  downloadLink.download = `mybourse-${fileSuffix}-${period}.csv`;
  document.body.append(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  URL.revokeObjectURL(downloadUrl);
}
