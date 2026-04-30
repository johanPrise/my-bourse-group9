

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/theme.css";
import { getErrorMessage } from "./api/errors";
import { fetchStocks } from "./api/stockApi";
import {
  renderChart,
  type ChartKind,
  type Period,
} from "./charts/priceChart";
import { downloadCsvFile } from "./features/exportCsv";
import {
  readStoredPreferences,
  storePreferences,
} from "./features/preferences";
import { applyTheme, readStoredTheme, setupThemeToggle } from "./features/theme";
import type { Stock } from "./models/stock";
import { renderMainUi } from "./ui/mainUi";

function renderAppUi(container: HTMLElement, state: Parameters<typeof renderMainUi>[1]): void {
  renderMainUi(container, state);
  setupThemeToggle();
}

async function App(): Promise<void> {
  const app = document.getElementById("app");

  if (!app) {
    throw new Error("Le conteneur #app est introuvable.");
  }

  applyTheme(readStoredTheme());
  renderAppUi(app, { status: "loading" });

  try {
    const stocks = await fetchStocks();

    if (stocks.length === 0) {
      renderAppUi(app, { status: "empty" });
      return;
    }

    renderAppUi(app, { status: "ready", stocks });
    setupInteractions(stocks);
  } catch (error) {
    renderAppUi(app, { status: "error", message: getErrorMessage(error) });
  }
}



function setupInteractions(stocks: Stock[]): void {
  const select1 = document.getElementById("stock-1") as HTMLSelectElement | null;
  const select2 = document.getElementById("stock-2") as HTMLSelectElement | null;
  const canvas = document.getElementById("price-chart") as HTMLCanvasElement | null;
  const exportCsvButton = document.getElementById("export-csv") as HTMLButtonElement | null;

  if (!select1 || !select2 || !canvas || !exportCsvButton) {
    return;
  }

  const periodBtns = document.querySelectorAll<HTMLButtonElement>("[data-period]");
  const typeBtns = document.querySelectorAll<HTMLButtonElement>("[data-type]");
  const preferences = readStoredPreferences();

  const hasStock = (symbol: string): boolean => stocks.some((stock) => stock.symbol === symbol);

  select1.value = hasStock(preferences.stock1) ? preferences.stock1 : stocks[0].symbol;
  select2.value = hasStock(preferences.stock2) ? preferences.stock2 : "";

  let period: Period = preferences.period;
  let type: ChartKind = preferences.chartType;

  periodBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.period === period);
  });

  typeBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.type === type);
  });

  const savePreferences = (): void => {
    storePreferences({
      stock1: select1.value,
      stock2: select2.value,
      period,
      chartType: type,
    });
  };

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

    savePreferences();
    renderChart(canvas, selected, period, type);
  };

  exportCsvButton.addEventListener("click", () => {
    const s1 = stocks.find((stock) => stock.symbol === select1.value);
    const s2 = stocks.find((stock) => stock.symbol === select2.value);
    const selectedStocks: Stock[] = [];

    if (s1) {
      selectedStocks.push(s1);
    }

    if (s2 && s2.symbol !== s1?.symbol) {
      selectedStocks.push(s2);
    }

    if (selectedStocks.length === 0) {
      return;
    }

    downloadCsvFile(selectedStocks, period);
  });

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
