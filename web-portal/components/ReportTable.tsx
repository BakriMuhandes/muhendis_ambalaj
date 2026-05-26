'use client';

type ReportTableProps = {
  rows: Array<{
    date: string;
    type: string;
    description: string;
    debtUsd: number;
    paymentUsd: number;
    balanceUsd: number;
  }>;
};

export default function ReportTable({ rows }: ReportTableProps) {
  return (
    <div className="overflow-auto rounded border border-slate-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-3 py-2 text-left">Tarih</th>
            <th className="px-3 py-2 text-left">Tur</th>
            <th className="px-3 py-2 text-left">Aciklama</th>
            <th className="px-3 py-2 text-right">Borc (USD)</th>
            <th className="px-3 py-2 text-right">Odeme (USD)</th>
            <th className="px-3 py-2 text-right">Bakiye (USD)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={`${row.date}-${idx}`} className="border-t border-slate-200">
              <td className="px-3 py-2">{row.date}</td>
              <td className="px-3 py-2">{row.type}</td>
              <td className="px-3 py-2">{row.description}</td>
              <td className="px-3 py-2 text-right">{row.debtUsd.toFixed(2)}</td>
              <td className="px-3 py-2 text-right">{row.paymentUsd.toFixed(2)}</td>
              <td className="px-3 py-2 text-right font-medium">{row.balanceUsd.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}