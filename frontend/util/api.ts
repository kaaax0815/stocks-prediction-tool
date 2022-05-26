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

export async function getAverageSentiment(stock: string): Promise<AverageSentiment> {
  const request = await fetch(`${API_URL}/sentiment?symbol=${stock}`);
  if (!request.ok) {
    throw new Error(request.statusText);
  }

  const averageSentiment = await request.json();
  return averageSentiment;
}

export async function getSymbols(): Promise<Symbol[]> {
  const request = await fetch(`${API_URL}/symbols`);
  if (!request.ok) {
    throw new Error(request.statusText);
  }

  const json = await request.json();
  return json;
}

export async function getCompany(stock: string): Promise<Company> {
  const request = await fetch(`${API_URL}/company?symbol=${stock}`);
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

export interface AverageSentiment {
  averageSentiment: number | null;
}

export interface Company {
  country: string;
  currency: string;
  exchange: string;
  finnhubIndustry: string;
  ipo: string;
  logo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
}
