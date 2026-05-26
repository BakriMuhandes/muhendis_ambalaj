import type { ReactNode } from 'react';
import Sidebar from '../../components/Sidebar';

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen md:flex">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}