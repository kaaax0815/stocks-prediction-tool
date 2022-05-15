export async function getBars(stock: string): Promise<StockRecord[]> {
  const to = Math.round(new Date().getTime() / 1000);
  const secondsInAYear = 60 * 60 * 24 * 30 * 12;
  const from = to - secondsInAYear;
  const request = await fetch(`http://127.0.0.1:5000/bars?symbol=${stock}&from=${from}&to=${to}`);
  if (!request.ok) {
    throw new Error(request.statusText);
  }

  const json = await request.json();
  return json;
}

export async function getSymbols(): Promise<Symbol[]> {
  const request = await fetch(`http://127.0.0.1:5000/symbols`);
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
