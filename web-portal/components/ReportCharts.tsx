'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type ReportChartsProps = {
  monthly: Array<{
    label: string;
    teslimat: number;
    odeme: number;
    bakiyeDegisim: number;
  }>;
};

export default function ReportCharts({ monthly }: ReportChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="h-72 rounded border border-slate-200 bg-white p-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="teslimat" name="Teslimat" fill="#4f46e5" />
            <Bar dataKey="odeme" name="Odeme" fill="#0ea5e9" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="h-72 rounded border border-slate-200 bg-white p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="bakiyeDegisim"
              name="Bakiye Degisimi"
              stroke="#16a34a"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}