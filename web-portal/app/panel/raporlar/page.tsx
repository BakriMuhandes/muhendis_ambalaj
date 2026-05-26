'use client';

import { useState } from 'react';
import ReportCharts from '../../../components/ReportCharts';
import ReportTable from '../../../components/ReportTable';
import { api } from '../../../lib/api';

export default function RaporlarPage() {
  const [type, setType] = useState<'monthly' | 'yearly' | 'custom'>('monthly');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [month, setMonth] = useState(String(new Date().getMonth() + 1));
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [report, setReport] = useState<any>(null);

  const createReport = async () => {
    if (type === 'monthly') setReport(await api.reportMonthly(Number(year), Number(month)));
    else if (type === 'yearly') setReport(await api.reportYearly(Number(year)));
    else setReport(await api.reportCustom(from, to));
  };

  const download = async () => {
    const blob = (await api.reportXlsx({ type, year, month, from, to })) as Blob;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rapor.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Raporlar</h1>
      <div className="flex flex-wrap gap-2 rounded border border-slate-200 bg-white p-4">
        <select value={type} onChange={(e) => setType(e.target.value as any)} className="rounded border px-3 py-2">
          <option value="monthly">Aylik</option>
          <option value="yearly">Yillik</option>
          <option value="custom">Ozel Aralik</option>
        </select>
        <input value={year} onChange={(e) => setYear(e.target.value)} className="rounded border px-3 py-2" placeholder="Yil" />
        {type === 'monthly' ? <input value={month} onChange={(e) => setMonth(e.target.value)} className="rounded border px-3 py-2" placeholder="Ay" /> : null}
        {type === 'custom' ? (
          <>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded border px-3 py-2" />
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded border px-3 py-2" />
          </>
        ) : null}
        <button onClick={createReport} className="rounded bg-indigo-600 px-3 py-2 text-white">Rapor Olustur</button>
        <button onClick={download} className="rounded bg-emerald-600 px-3 py-2 text-white">Excel Indir</button>
        <button onClick={() => window.print()} className="rounded bg-slate-800 px-3 py-2 text-white">Yazdir</button>
      </div>

      {report ? (
        <>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded border bg-white p-4">Toplam Borc: {Number(report.totals.totalDebtUsd).toFixed(2)} USD</div>
            <div className="rounded border bg-white p-4">Toplam Odeme: {Number(report.totals.totalPaymentUsd).toFixed(2)} USD</div>
            <div className="rounded border bg-white p-4">Guncel Bakiye: {Number(report.totals.balanceUsd).toFixed(2)} USD</div>
          </div>
          <ReportCharts monthly={report.charts?.monthly || []} />
          <ReportTable rows={report.ledger || []} />
        </>
      ) : null}
    </section>
  );
}