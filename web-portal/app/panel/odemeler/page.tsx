'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function OdemelerPage() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    api.payments().then(setRows).catch(() => setRows([]));
  }, []);

  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold">Odemeler</h1>
      <div className="space-y-3">
        {rows.map((row) => (
          <article key={row.id} className="rounded border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Tarih: {String(row.paymentDate).slice(0, 10)}</p>
            <p className="font-medium">Tutar: {Number(row.amountUsd).toFixed(2)} USD</p>
            <p className="text-sm">Yontem: {row.paymentMethod}</p>
          </article>
        ))}
      </div>
    </section>
  );
}