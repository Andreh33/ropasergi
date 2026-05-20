import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PROYECTO 1 · Streetwear',
    short_name: 'PROYECTO 1',
    description: 'Ocho prendas. Una cápsula. Una sola vez. Desde Sevilla.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050507',
    theme_color: '#050507',
    orientation: 'portrait',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
