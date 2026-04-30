

import "bootstrap/dist/css/bootstrap.min.css";
import { getErrorMessage } from "./api/errors";
import { fetchStocks } from "./api/stockApi";
import {
  renderChart,
  type ChartKind,
  type Period,
} from "./charts/priceChart";
import type { Stock } from "./models/stock";
import { renderMainUi } from "./ui/mainUi";

async function App(): Promise<void> {
  const app = document.getElementById("app");

  if (!app) {
    throw new Error("Le conteneur #app est introuvable.");
  }

  renderMainUi(app, { status: "loading" });

  try {
    const stocks = await fetchStocks();

    if (stocks.length === 0) {
      renderMainUi(app, { status: "empty" });
      return;
    }

    renderMainUi(app, { status: "ready", stocks });
    setupInteractions(stocks);
  } catch (error) {
    renderMainUi(app, { status: "error", message: getErrorMessage(error) });
  }
}



function setupInteractions(stocks: Stock[]): void {
  const select1 = document.getElementById("stock-1") as HTMLSelectElement | null;
  const select2 = document.getElementById("stock-2") as HTMLSelectElement | null;
  const canvas = document.getElementById("price-chart") as HTMLCanvasElement | null;

  if (!select1 || !select2 || !canvas) {
    return;
  }

  const periodBtns = document.querySelectorAll<HTMLButtonElement>("[data-period]");
  const typeBtns = document.querySelectorAll<HTMLButtonElement>("[data-type]");

  let period: Period = "1Y";
  let type: ChartKind = "line";

  const update = (): void => {
    const s1 = stocks.find((s) => s.symbol === select1.value);
    const s2sym = select2.value;
    const s2 = s2sym ? stocks.find((s) => s.symbol === s2sym) : undefined;

    const selected: Stock[] = [];
    if (s1) selected.push(s1);
    if (s2 && s2.symbol !== s1?.symbol) selected.push(s2);

    if (selected.length === 0) {
      return;
    }

    renderChart(canvas, selected, period, type);
  };

  // Changement daction
  select1.addEventListener("change", update);
  select2.addEventListener("change", update);

  // Boutons periode 
  periodBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.period;
      if (!value) return;
      period = value as Period;
      periodBtns.forEach((b) => b.classList.toggle("active", b === btn));
      update();
    });
  });

  // line / bar
  typeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.type;
      if (!value) return;
      type = value as ChartKind;
      typeBtns.forEach((b) => b.classList.toggle("active", b === btn));
      update();
    });
  });

  // Premier resultat
  update();
}

void App();
