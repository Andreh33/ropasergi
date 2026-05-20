'use client';
import type { Product } from '@/lib/types';
import dynamic from 'next/dynamic';
import { ViewerFallback } from './viewer-fallback';

const Viewer3D = dynamic(() => import('./viewer-3d').then((m) => m.Viewer3D), {
  ssr: false,
  loading: () => null,
});

export function Viewer3DShell({ product }: { product: Product }) {
  return (
    <>
      {/* Fallback 2D mientras Canvas R3F monta (y para sin-WebGL) */}
      <div className="absolute inset-0 -z-10 md:relative md:inset-auto md:z-0 hidden md:block">
        <ViewerFallback product={product} />
      </div>
      <Viewer3D product={product} />
    </>
  );
}
