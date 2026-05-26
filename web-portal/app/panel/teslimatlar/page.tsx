'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function TeslimatlarPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const load = () => api.deliveries(from || undefined, to || undefined).then(setRows).catch(() => setRows([]));
  useEffect(() => {
    load();
  }, []);

  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold">Teslimatlar</h1>
      <div className="mb-4 flex flex-wrap gap-2">
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded border px-3 py-2" />
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded border px-3 py-2" />
        <button onClick={load} className="rounded bg-indigo-600 px-3 py-2 text-white">Filtrele</button>
      </div>
      <div className="space-y-3">
        {rows.map((row) => (
          <article key={row.id} className="rounded border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Tarih: {String(row.transactionDate).slice(0, 10)}</p>
            <p className="font-medium">Toplam: {Number(row.subtotalUsd).toFixed(2)} USD</p>
          </article>
        ))}
      </div>
    </section>
  );
}