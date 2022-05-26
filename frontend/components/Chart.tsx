import { useEffect, useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

import { getSentiments, Sentiments } from '../util/api';
import { dateToTimestamp } from '../util/date';

export interface ChartProps {
  data: { average: string; date: Date }[];
}

export default function Chart({ data }: ChartProps) {
  return (
    <LineChart
      width={600}
      height={300}
      data={data}
      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
    >
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
  );
}

function ExtendedTooltip({ props }: { props: TooltipProps<ValueType, NameType> }) {
  const [sentiments, setSentiments] = useState<Sentiments[]>([]);
  const tooltip = props;
  const payload = tooltip.payload?.[0];
  const date = tooltip?.label as Date | undefined;
  useEffect(() => {
    getSentiments('AAPL').then((sentiments) => setSentiments(sentiments));
  });
  const sentiment = useMemo(() => {
    if (date) {
      const sentiment = sentiments.find(
        (sentiments) =>
          dateToTimestamp(date) - 86400 <= sentiments.timestamp &&
          sentiments.timestamp >= dateToTimestamp(date)
      );
      return sentiment?.sentiment;
    }
  }, [date, sentiments]);
  if (!payload || !date) {
    return null;
  }
  const timestamp = dateToTimestamp(date);
  getSentiments('AAPL');
  return (
    <div>
      {date.toDateString()}
      <br />${payload.value}
      <br />
      {timestamp}
      {sentiment}
    </div>
  );
}
