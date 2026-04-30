

import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  type ChartType,
} from "chart.js";
import type { Stock, StockHistory } from "../models/stock";

// Enregistrement des composants pour le graph
Chart.register(
  LineController,
  LineElement,
  BarController,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

export type ChartKind = "line" | "bar";
export type Period = "1W" | "1M" | "1Y" | "ALL";

// Convers
const PERIOD_DAYS: Record<Exclude<Period, "ALL">, number> = {
  "1W": 7,
  "1M": 30,
  "1Y": 365,
};

const COLORS = ["#0d6efd", "#dc3545"];

const MS_PER_DAY = 86_400_000;

let chartInstance: Chart | null = null;



function filterByPeriod(history: StockHistory[], period: Period): StockHistory[] {
  const sorted = [...history].sort((a, b) => a.date.localeCompare(b.date));

  if (period === "ALL" || sorted.length === 0) {
    return sorted;
  }

  const lastDate = new Date(sorted[sorted.length - 1].date).getTime();
  const cutoff = lastDate - PERIOD_DAYS[period] * MS_PER_DAY;

  return sorted.filter((h) => new Date(h.date).getTime() >= cutoff);
}


function buildLabels(filteredHistories: StockHistory[][]): string[] {
  const set = new Set<string>();
  filteredHistories.forEach((arr) => arr.forEach((h) => set.add(h.date)));
  return Array.from(set).sort();
}


export function renderChart(
  canvas: HTMLCanvasElement,
  stocks: Stock[],
  period: Period,
  type: ChartKind,
): void {
  const filtered = stocks.map((s) => filterByPeriod(s.history, period));
  const labels = buildLabels(filtered);

  const datasets = stocks.map((stock, i) => {
    const priceByDate = new Map(filtered[i].map((h) => [h.date, h.price]));
    const color = COLORS[i % COLORS.length];

    return {
      label: `${stock.symbol} — ${stock.name}`,
      data: labels.map((date) => priceByDate.get(date) ?? null),
      borderColor: color,
      backgroundColor: color,
      spanGaps: true,
      tension: 0.25,
    };
  });

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(canvas, {
    type: type as ChartType,
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { position: "top" },
        tooltip: { enabled: true },
      },
      scales: {
        x: { title: { display: true, text: "Date" } },
        y: { title: { display: true, text: "Prix" }, beginAtZero: false },
      },
    },
  });
}
