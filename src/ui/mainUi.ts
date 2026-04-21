import type { Stock } from "../models/stock";

export type UiState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "empty" }
  | { status: "ready"; stocks: Stock[] };

function formatPrice(stock: Stock): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: stock.currency,
  }).format(stock.currentPrice);
}

function renderTableRows(stocks: Stock[]): string {
  return stocks
    .map(
      (stock) => `
        <tr>
          <td class="fw-semibold">${stock.name}</td>
          <td><span class="badge text-bg-light border">${stock.symbol}</span></td>
          <td class="text-end">${formatPrice(stock)}</td>
        </tr>
      `,
    )
    .join("");
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
          Impossible de charger les actions: ${state.message}
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

    return `
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col">Nom</th>
              <th scope="col">Symbole</th>
              <th scope="col" class="text-end">Prix actuel</th>
            </tr>
          </thead>
          <tbody>
            ${renderTableRows(state.stocks)}
          </tbody>
        </table>
      </div>
    `;
  })();

  container.innerHTML = `
    <main class="container py-4 py-md-5">
      <section class="card shadow-sm">
        <div class="card-body p-3 p-md-4">
          <header class="mb-3 mb-md-4">
            <h1 class="h3 mb-1">MyBourse</h1>
            <p class="text-body-secondary mb-0">Liste des actions (nom, symbole, prix actuel)</p>
          </header>
          ${content}
        </div>
      </section>
    </main>
  `;
}