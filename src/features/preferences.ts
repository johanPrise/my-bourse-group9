import type { ChartKind, Period } from "../charts/priceChart";

export type UserPreferences = {
  stock1: string;
  stock2: string;
  period: Period;
  chartType: ChartKind;
};

const PREFERENCES_STORAGE_KEY = "mybourse-preferences";

const DEFAULT_PREFERENCES: UserPreferences = {
  stock1: "",
  stock2: "",
  period: "1Y",
  chartType: "line",
};

function isPeriod(value: string): value is Period {
  return value === "1W" || value === "1M" || value === "1Y" || value === "ALL";
}

function isChartKind(value: string): value is ChartKind {
  return value === "line" || value === "bar";
}

export function readStoredPreferences(): UserPreferences {
  const rawPreferences = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);

  if (!rawPreferences) {
    return DEFAULT_PREFERENCES;
  }

  try {
    const parsed = JSON.parse(rawPreferences) as Partial<UserPreferences>;

    return {
      stock1: typeof parsed.stock1 === "string" ? parsed.stock1 : DEFAULT_PREFERENCES.stock1,
      stock2: typeof parsed.stock2 === "string" ? parsed.stock2 : DEFAULT_PREFERENCES.stock2,
      period: typeof parsed.period === "string" && isPeriod(parsed.period)
        ? parsed.period
        : DEFAULT_PREFERENCES.period,
      chartType: typeof parsed.chartType === "string" && isChartKind(parsed.chartType)
        ? parsed.chartType
        : DEFAULT_PREFERENCES.chartType,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function storePreferences(preferences: UserPreferences): void {
  window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
}
