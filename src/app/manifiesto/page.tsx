import { ManifestoView } from '@/components/sections/manifesto-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MANIFIESTO',
  description: 'Tres dogmas. Una sola dirección. Esto es PROYECTO 1.',
};

export default function ManifestoPage() {
  return <ManifestoView />;
}
