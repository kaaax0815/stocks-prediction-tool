import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import getBars, { StockRecord } from '../util/api';

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

  return <div>{data.data![0].close}</div>;
}
