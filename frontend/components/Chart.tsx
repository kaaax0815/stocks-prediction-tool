import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

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
      <Tooltip formatter={(v: number) => `$${v}`} labelFormatter={(v: Date) => v.toDateString()} />
    </LineChart>
  );
}
