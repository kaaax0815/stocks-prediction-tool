import {
  faArrowRight,
  faArrowTrendDown,
  faArrowTrendUp,
  faQuestion,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Divider } from '@mui/material';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';

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
  const { sentiment, company, iconToDisplay, iconsToDisplay, graphData } = props;

  const dateGraphData = graphData.map((bar) => ({
    date: timestampToDate(bar.t),
    ...bar
  }));

  return (
    <Container>
      <header className={styles.header}>
        <a className={styles.companyWebsite} href={company.weburl}>
          <div style={{ marginRight: '15px' }}>
            <Image src={company.logo} alt="" width="50px" height="50px" />
          </div>
          <h1>{company.name}</h1>
        </a>
      </header>
      <main className={styles.main}>
        <div className={styles.chart}>
          <Chart data={dateGraphData} />
        </div>
        <div className={styles.trend}>
          <FontAwesomeIcon icon={iconToDisplay} size="6x" />
        </div>
      </main>
      <div className={styles.news}>
        <h2>News</h2>
        {sentiment.data.map((article, aIndex) => (
          <a key={article.uuid} href={article.url} target="_blank" rel="noreferrer">
            <article className={styles.newsArticle}>
              <header>
                <h3>{article.title}</h3>
                <FontAwesomeIcon icon={iconsToDisplay[aIndex]} size="2x" />
              </header>
              <p>{article.description || '...'}</p>
            </article>
            <Divider />
          </a>
        ))}
      </div>
    </Container>
  );
}

export interface StockParams {
  sentiment: Sentiment;
  company: Company;
  iconToDisplay: IconDefinition;
  iconsToDisplay: IconDefinition[];
  graphData: (Bar & { average: number })[];
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

  const iconToDisplay = getIconToDisplay(
    sentiment.averageSentiment,
    faArrowTrendUp,
    faArrowTrendDown,
    faArrowRight,
    faQuestion
  );

  const iconsToDisplay = sentiment.data.map((sentiment) =>
    getIconToDisplay(
      sentiment.avg_sentiment,
      faArrowTrendUp,
      faArrowTrendDown,
      faArrowRight,
      faQuestion
    )
  );

  const graphData = bars.map((x) => ({
    ...x,
    average: Math.round(((x.h + x.l) / 2) * 1e2) / 1e2
  }));

  return {
    props: {
      sentiment,
      company,
      iconToDisplay,
      iconsToDisplay,
      graphData
    }
  };
};
