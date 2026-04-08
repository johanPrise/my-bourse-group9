import { fetchStocks } from "./api/stockApi";

fetchStocks()
  .then((stocks) => console.log(stocks))
  .catch((err) => console.error("fetch failed:", err));
