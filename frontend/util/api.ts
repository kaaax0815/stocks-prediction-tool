import { dateToTimestamp, subtractYears } from './date';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

export async function getBars(stock: string): Promise<Bar[]> {
  const to = dateToTimestamp(new Date());
  const from = subtractYears(to, 1);
  const request = await fetch(`${API_URL}/bars?symbol=${stock}&from=${from}&to=${to}`);
  if (!request.ok) {
    throw new Error(request.statusText);
  }

  const json = await request.json();
  return json;
}

export async function getSentiment(stock: string): Promise<Sentiment> {
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

export async function getSentiments(stock: string): Promise<Sentiments[]> {
  const request = await fetch(`${API_URL}/sentiments?symbol=${stock}`);
  if (!request.ok) {
    throw new Error(request.statusText);
  }

  const json = await request.json();
  return json;
}

export interface Bar {
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

export interface Sentiment {
  averageSentiment: number | null;
  data: SentimentData[];
}

export interface SentimentData {
  uuid: string;
  title: string;
  description: string;
  url: string;
  published_at: string;
  avg_sentiment: number;
}

export interface Sentiments {
  symbol: string;
  timestamp: number;
  sentiment: number;
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
