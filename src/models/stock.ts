export interface StockHistory {
  date: string;
  price: number;
  volume: number;
}

export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  currentPrice: number;
  currency: string;
  history: StockHistory[];
}
