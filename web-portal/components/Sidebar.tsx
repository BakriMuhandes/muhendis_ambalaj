'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '../lib/auth';

const links = [
  { href: '/panel', label: 'Panel' },
  { href: '/panel/teslimatlar', label: 'Teslimatlar' },
  { href: '/panel/odemeler', label: 'Odemeler' },
  { href: '/panel/raporlar', label: 'Raporlar' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-full border-r border-slate-200 bg-white p-4 md:w-64">
      <h2 className="mb-4 text-lg font-semibold">Musteri Portali</h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block rounded px-3 py-2 text-sm ${
              pathname === link.href ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-slate-100'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <button onClick={logout} className="mt-6 w-full rounded bg-slate-900 px-3 py-2 text-sm text-white">
        Cikis Yap
      </button>
    </aside>
  );
}