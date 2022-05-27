import { useEffect, useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

import styles from '../styles/Chart.module.css';
import { getSentiments, Sentiments } from '../util/api';
import { timestampToDate } from '../util/date';

export interface ChartProps {
  data: { average: number; date: Date }[];
}

export default function Chart({ data }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="average" stroke="#8884d8" name="Price" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis
          dataKey="date"
          tickFormatter={(v: Date) => v.toLocaleDateString('de-DE', { month: 'long' })}
        />
        <YAxis tickFormatter={(v: number) => `$${v}`} />
        {/*<Tooltip formatter={(v: number) => `$${v}`} labelFormatter={(v: Date) => v.toDateString()} />*/}
        <Tooltip content={(props) => <ExtendedTooltip props={props} />} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function ExtendedTooltip({ props }: { props: TooltipProps<ValueType, NameType> }) {
  const [sentiments, setSentiments] = useState<Sentiments[]>();
  const tooltip = props;
  const payload = tooltip.payload?.[0];
  const date = tooltip?.label as Date | undefined;
  useEffect(() => {
    getSentiments('AAPL').then((sentiments) => setSentiments(sentiments));
  }, []);
  const sentiment = useMemo(() => {
    if (date) {
      if (!sentiments) {
        // null if loading
        return null;
      }
      const sentiment = sentiments.find((sentiments) => {
        const sentimentsDate = timestampToDate(sentiments.timestamp).toDateString();
        const labelDate = date.toDateString();
        return sentimentsDate === labelDate;
      });
      return sentiment;
    }
  }, [date, sentiments]);
  if (!payload || !date) {
    return null;
  }
  return (
    <div className={styles.tooltip}>
      {date.toDateString()}
      <br />${payload.value}
      <br />
      {sentiment === null ? 'Loading...' : sentiment?.sentiment || 'No prediction'}
    </div>
  );
}

// TODO: styling, backend (number -> "(up, down)/(normal, slightly), neutral, question")
