import { dateToTimestamp, subtractYears } from './date';

const API_URL = 'http://127.0.0.1:5000';

export async function getBars(stock: string): Promise<StockRecord[]> {
  const to = dateToTimestamp(new Date());
  const from = subtractYears(to, 1);
  const request = await fetch(`${API_URL}/bars?symbol=${stock}&from=${from}&to=${to}`);
  if (!request.ok) {
    throw new Error(request.statusText);
  }

  const json = await request.json();
  return json;
}

export async function getSymbols(): Promise<Symbol[]> {
  const request = await fetch(`${API_URL}/symbols`);
  if (!request.ok) {
    throw new Error(request.statusText);
  }

  const json = await request.json();
  return json;
}

export interface StockRecord {
  c: number;
  h: number;
  l: number;
  o: number;
  s: string;
  t: number;
  v: number;
}

export interface Symbol {
  currency: string;
  description: string;
  displaySymbol: string;
  figi: string;
  isin: null;
  mic: string;
  shareClassFIGI: string;
  symbol: string;
  symbol2: string;
  type: string;
}
