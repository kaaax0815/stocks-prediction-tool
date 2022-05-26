import {
  faArrowRight,
  faArrowTrendDown,
  faArrowTrendUp,
  faQuestion
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import Chart from '../components/Chart';
import {
  AverageSentiment,
  Company,
  getAverageSentiment,
  getBars,
  getCompany,
  StockRecord
} from '../util/api';
import { StateType } from '../util/stateType';

export default function Stocks() {
  const [data, setData] = useState<StateType<StockRecord[]>>({ loading: true, data: undefined });

  const [averageSentiment, setAverageSentiment] = useState<StateType<AverageSentiment>>({
    loading: true,
    data: undefined
  });

  const [company, setCompany] = useState<StateType<Company>>({
    loading: true,
    data: undefined
  });

  const router = useRouter();
  const { stock } = router.query as { stock: string };

  useEffect(() => {
    if (!stock) {
      return;
    }
    getBars(stock).then((x) => {
      setData({ loading: false, data: x });
    });
    getAverageSentiment(stock).then((averageSentiment) => {
      setAverageSentiment({ loading: false, data: averageSentiment });
    });
    getCompany(stock).then((company) => {
      setCompany({ loading: false, data: company });
    });
  }, [stock]);

  const iconToDisplay = useMemo(() => {
    if (averageSentiment.loading === true) {
      return faQuestion;
    }
    if (averageSentiment.data.averageSentiment === null) {
      return faQuestion;
    } else if (averageSentiment.data.averageSentiment < -0.1) {
      return faArrowTrendDown;
    } else if (
      averageSentiment.data.averageSentiment > -0.1 &&
      averageSentiment.data.averageSentiment < 0.1
    ) {
      return faArrowRight;
    } else {
      return faArrowTrendUp;
    }
  }, [averageSentiment.data, averageSentiment.loading]);

  const timeAveragePrice = useMemo(() => {
    if (data.loading === true) {
      return null;
    }
    return data.data.map((x) => {
      return {
        ...x,
        average: ((x.h + x.l) / 2).toFixed(2),
        date: new Date(x.t * 1000)
      };
    });
  }, [data.data, data.loading]);

  if (data.loading || averageSentiment.loading || company.loading || !timeAveragePrice) {
    return <p>Loading</p>;
  }

  return (
    <>
      <div
        className="header"
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Image src={company.data.logo} alt="" width="50px" height="50px" />
        <h1>{company.data.name}</h1>
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
