import { AdminDashboard } from '@/components/admin/admin-dashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ADMIN · PROYECTO 1',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
