import {
  faArrowRight,
  faArrowTrendDown,
  faArrowTrendUp,
  faQuestion
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useMemo } from 'react';

const Chart = dynamic(() => import('../components/Chart'), { ssr: false });
import styles from '../styles/Stock.module.css';
import {
  Bar,
  Company,
  getBars,
  getCompany,
  getSentiment,
  getSymbols,
  Sentiment
} from '../util/api';
import { timestampToDate } from '../util/date';
import getIconToDisplay from '../util/iconToDisplay';

export default function Stocks(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { bars, sentiment, company } = props;

  const iconToDisplay = useMemo(
    () =>
      getIconToDisplay(
        sentiment.averageSentiment,
        faArrowTrendUp,
        faArrowTrendDown,
        faArrowRight,
        faQuestion
      ),
    [sentiment.averageSentiment]
  );

  const timeAveragePrice = useMemo(() => {
    return bars.map((x) => {
      return {
        ...x,
        average: Math.round(((x.h + x.l) / 2) * 1e2) / 1e2,
        date: timestampToDate(x.t)
      };
    });
  }, [bars]);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Image src={company.logo} alt="" width="50px" height="50px" />
        <h1>{company.name}</h1>
      </div>
      <div className={styles.body}>
        <div className={styles.chart}>
          <Chart data={timeAveragePrice} />
        </div>
        <div className={styles.trend}>
          <FontAwesomeIcon icon={iconToDisplay} size="6x" />
        </div>
      </div>
    </main>
  );
}

export interface StockParams {
  bars: Bar[];
  sentiment: Sentiment;
  company: Company;
}

export const getServerSideProps: GetServerSideProps<StockParams> = async (context) => {
  // 5 min cache
  context.res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=300');
  const symbol = context.params!.stock as string;
  const symbols = await getSymbols();
  if (symbols.findIndex((x) => x.symbol === symbol) === -1) {
    return { notFound: true };
  }
  const bars = await getBars(symbol);
  const sentiment = await getSentiment(symbol);
  const company = await getCompany(symbol);
  return {
    props: {
      bars,
      sentiment,
      company
    }
  };
};
