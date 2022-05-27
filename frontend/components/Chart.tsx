import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import ExtendedTooltip from './ExtendedTooltip';

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
