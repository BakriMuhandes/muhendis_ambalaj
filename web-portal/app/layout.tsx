import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Musteri Portali',
  description: 'Muhasebe ve faturalama musterileri icin portal',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}