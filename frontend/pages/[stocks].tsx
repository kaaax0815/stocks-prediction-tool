import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

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
      average: (x.h + x.l) / 2,
      t: new Date(x.t * 1000).toDateString()
    };
  });

  console.log(timeAveragePrice);

  console.log(data);

  // {data.data![0].close}
  return (
    <div>
      <LineChart
        width={600}
        height={300}
        data={timeAveragePrice}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        <Line type="monotone" dataKey="average" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="t" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </div>
  );
}
