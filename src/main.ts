import "bootstrap/dist/css/bootstrap.min.css";
import { fetchStocks } from "./api/stockApi";
import { renderMainUi } from "./ui/mainUi";
import "./ui/mainUi.css";

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
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Une erreur inconnue est survenue.";

    renderMainUi(app, { status: "error", message });
  }
}

void App();
