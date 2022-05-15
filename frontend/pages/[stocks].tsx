import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

import Chart from '../components/Chart';
import { getBars, StockRecord } from '../util/api';

export default function Stocks() {
  const [data, setData] = useState({ loading: true, data: undefined as StockRecord[] | undefined });

  const router = useRouter();
  const { stocks } = router.query;

  // is being executed when state of stocks is changed
  useEffect(() => {
    if (!stocks) {
      return;
    }
    getBars(stocks as string).then((x) => {
      setData({ loading: false, data: x });
    });
  }, [stocks]); // empty array would mean reloading only at first rendering of page

  if (data.loading) {
    return <p>Loading</p>;
  }

  const timeAveragePrice = data.data!.map((x) => {
    return {
      ...x,
      average: ((x.h + x.l) / 2).toFixed(2),
      date: new Date(x.t * 1000)
    };
  });

  return (
    <div>
      <Chart data={timeAveragePrice} />
    </div>
  );
}
