import {
  faArrowRight,
  faArrowTrendDown,
  faArrowTrendUp,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Chart from '../components/Chart';
import {
  AverageSentiment,
  Company,
  getAverageSentiment,
  getBars,
  getCompany,
  StockRecord
} from '../util/api';

export default function Stocks() {
  const [data, setData] = useState({ loading: true, data: undefined as StockRecord[] | undefined });
  const [averageSentiment, setAverageSentiment] = useState({
    loading: true,
    data: undefined as AverageSentiment | undefined
  });
  const [company, setCompany] = useState({
    loading: true,
    data: undefined as Company | undefined
  });

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
    getAverageSentiment(stocks as string).then((averageSentiment) => {
      setAverageSentiment({ loading: false, data: averageSentiment });
    });
    getCompany(stocks as string).then((company) => {
      setCompany({ loading: false, data: company });
    });
  }, [stocks]); // empty array would mean reloading only at first rendering of page

  if (data.loading || averageSentiment.loading || company.loading) {
    return <p>Loading</p>;
  }

  const timeAveragePrice = data.data!.map((x) => {
    return {
      ...x,
      average: ((x.h + x.l) / 2).toFixed(2),
      date: new Date(x.t * 1000)
    };
  });

  let iconToDisplay: IconDefinition;
  if (averageSentiment.data!.averageSentiment < -0.1) {
    iconToDisplay = faArrowTrendDown;
  } else if (
    averageSentiment.data!.averageSentiment > -0.1 &&
    averageSentiment.data!.averageSentiment < 0.1
  ) {
    iconToDisplay = faArrowRight;
  } else {
    iconToDisplay = faArrowTrendUp;
  }

  // <p>{averageSentiment.data!.averageSentiment}</p>

  return (
    <>
      <div
        className="header"
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Image src={company.data!.logo} alt="" width="50px" height="50px" />
        <h1>{company.data!.name}</h1>
      </div>
      <div
        style={{
          height: 'fit-content',
          verticalAlign: 'middle',
          display: 'flex',
          flexDirection: 'row',
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div style={{ padding: '20px', float: 'left' }}>
          <Chart data={timeAveragePrice} />
        </div>
        <div style={{ padding: '20px', float: 'left', height: 'inherit', verticalAlign: 'middle' }}>
          <FontAwesomeIcon icon={iconToDisplay} size="6x" />
        </div>
      </div>
    </>
  );
}
