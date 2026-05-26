'use client';

import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function PanelPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.dashboard().then(setData).catch(() => setData(null));
  }, []);

  const cards = [
    { label: 'Guncel Borc', value: data?.guncelBorcUsd ?? 0 },
    { label: 'Toplam Teslimat', value: data?.toplamTeslimatUsd ?? 0 },
    { label: 'Toplam Odeme', value: data?.toplamOdemeUsd ?? 0 },
    { label: 'Son Islem', value: data?.sonIslemTarihi ?? '-' },
  ];

  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold">Musteri Paneli</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-xl font-semibold">
              {typeof card.value === 'number' ? `${card.value.toFixed(2)} USD` : card.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}