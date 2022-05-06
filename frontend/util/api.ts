export default async function getBars(stock: string): Promise<StockRecord[]> {
  const request = await fetch(`http://127.0.0.1:5000/bars?stock=${stock}`);
  if (!request.ok) {
    throw new Error(request.statusText);
  }

  const json = await request.json();
  return json;
}

export interface StockRecord {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  trade_count: number;
  vwap: number;
}
