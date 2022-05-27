import {
  faArrowRight,
  faArrowTrendDown,
  faArrowTrendUp,
  faQuestion,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useState } from 'react';
import { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

import styles from '../styles/ExtendedTooltip.module.css';
import { getSentiments, Sentiments } from '../util/api';
import { timestampToDate } from '../util/date';
import getIconToDisplay from '../util/iconToDisplay';

export default function ExtendedTooltip({ props }: { props: TooltipProps<ValueType, NameType> }) {
  const [sentiments, setSentiments] = useState<Sentiments[]>();
  const tooltip = props;
  const payload = tooltip.payload?.[0];
  const date = tooltip?.label as Date | undefined;

  useEffect(() => {
    getSentiments('AAPL').then((sentiments) => setSentiments(sentiments));
  }, []);
  /**
   * @returns `null` if there is no sentiment
   * @returns `IconDefinition` if there is a sentiment
   * @returns `undefined` if data not loaded
   */
  const sentiment = useMemo(() => {
    if (date) {
      if (!sentiments) {
        return undefined;
      }
      const sentiment = sentiments.find((sentiments) => {
        const sentimentsDate = timestampToDate(sentiments.timestamp).toDateString();
        const labelDate = date.toDateString();
        return sentimentsDate === labelDate;
      });
      return sentiment || null;
    }
  }, [date, sentiments]);

  const iconToDisplay = useMemo(() => {
    if (sentiment !== undefined) {
      return getIconToDisplay(
        sentiment?.sentiment || null,
        faArrowTrendUp,
        faArrowTrendDown,
        faArrowRight,
        faQuestion
      );
    }
    return faSpinner;
  }, [sentiment]);

  if (!payload || !date) {
    return null;
  }
  return (
    <div className={styles.tooltip}>
      {date.toDateString()}
      <br />${payload.value}
      <br />
      <FontAwesomeIcon icon={iconToDisplay} size="1x" />
    </div>
  );
}
