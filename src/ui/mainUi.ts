


import type { Stock } from "../models/stock";

export type UiState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "empty" }
  | { status: "ready"; stocks: Stock[] };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatPrice(stock: Stock): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: stock.currency,
  }).format(stock.currentPrice);
}

// Liste deroulant
function buildOptions(stocks: Stock[], defaultIndex: number): string {
  return stocks
    .map(
      (s, i) =>
        `<option value="${escapeHtml(s.symbol)}"${i === defaultIndex ? " selected" : ""}>${escapeHtml(s.name)} (${escapeHtml(s.symbol)})</option>`,
    )
    .join("");
}

function renderControls(stocks: Stock[]): string {
  const options1 = buildOptions(stocks, 0);
  const options2 = buildOptions(stocks, stocks.length > 1 ? 1 : -1);

  return `
    <div class="row g-3 mb-3">
      <div class="col-md-6">
        <label for="stock-1" class="form-label fw-semibold">Action principale</label>
        <select id="stock-1" class="form-select">${options1}</select>
      </div>
      <div class="col-md-6">
        <label for="stock-2" class="form-label fw-semibold">Comparer avec</label>
        <select id="stock-2" class="form-select">
          <option value="">— Aucune —</option>
          ${options2}
        </select>
      </div>
    </div>

    <div class="d-flex flex-wrap gap-2 align-items-center mb-3">
      <div class="btn-group" role="group" aria-label="Periode">
        <button type="button" class="btn btn-outline-primary" data-period="1W">1 sem.</button>
        <button type="button" class="btn btn-outline-primary" data-period="1M">1 mois</button>
        <button type="button" class="btn btn-outline-primary active" data-period="1Y">1 an</button>
        <button type="button" class="btn btn-outline-primary" data-period="ALL">Tout</button>
      </div>

      <div class="d-flex flex-wrap gap-2 ms-md-auto">
        <div class="btn-group" role="group" aria-label="Type de graphique">
          <button type="button" class="btn btn-outline-secondary active" data-type="line">Ligne</button>
          <button type="button" class="btn btn-outline-secondary" data-type="bar">Barres</button>
        </div>
        <button type="button" id="export-csv" class="btn btn-success">
          Exporter CSV
        </button>
      </div>
    </div>

    <div class="chart-surface border rounded p-2" style="position: relative; height: 420px;">
      <canvas id="price-chart"></canvas>
    </div>
  `;
}

function renderTableRows(stocks: Stock[]): string {
  return stocks
    .map(
      (stock) => `
        <tr>
          <td class="fw-semibold">${escapeHtml(stock.name)}</td>
          <td><span class="badge text-bg-light border">${escapeHtml(stock.symbol)}</span></td>
          <td class="text-body-secondary">${escapeHtml(stock.sector)}</td>
          <td class="text-end">${escapeHtml(formatPrice(stock))}</td>
        </tr>
      `,
    )
    .join("");
}

function renderRecapTable(stocks: Stock[]): string {
  return `
    <details class="mt-4">
      <summary class="text-body-secondary">Liste complete des actions (${stocks.length})</summary>
      <div class="table-responsive mt-2">
        <table class="table table-sm table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col">Nom</th>
              <th scope="col">Symbole</th>
              <th scope="col">Secteur</th>
              <th scope="col" class="text-end">Prix actuel</th>
            </tr>
          </thead>
          <tbody>${renderTableRows(stocks)}</tbody>
        </table>
      </div>
    </details>
  `;
}

export function renderMainUi(container: HTMLElement, state: UiState): void {
  const content = (() => {
    if (state.status === "loading") {
      return `
        <div class="d-flex align-items-center gap-3 py-4" role="status" aria-live="polite">
          <div class="spinner-border text-primary" aria-hidden="true"></div>
          <div>Chargement des actions en cours...</div>
        </div>
      `;
    }

    if (state.status === "error") {
      return `
        <div class="alert alert-danger" role="alert">
          Impossible de charger les actions: ${escapeHtml(state.message)}
        </div>
      `;
    }

    if (state.status === "empty") {
      return `
        <div class="alert alert-warning" role="status">
          Aucune action disponible pour le moment.
        </div>
      `;
    }

    return `${renderControls(state.stocks)}${renderRecapTable(state.stocks)}`;
  })();

  container.innerHTML = `
    <main class="container py-4 py-md-5">
      <section class="app-shell card shadow-sm border-0">
        <div class="card-body p-3 p-md-4">
          <header class="d-flex flex-column flex-md-row align-items-md-start justify-content-between gap-3 mb-3 mb-md-4">
            <div>
              <h1 class="h3 mb-1">MyBourse</h1>
              <p class="text-body-secondary mb-0">
                Visualisez et comparez l'evolution des cours boursiers
              </p>
            </div>
            <button
              id="theme-toggle"
              type="button"
              class="btn btn-outline-secondary align-self-start"
              aria-pressed="false"
            >
              Mode sombre
            </button>
          </header>
          ${content}
        </div>
      </section>
    </main>
  `;
}
