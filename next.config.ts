import type { NextConfig } from 'next';

const config: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'three', '@react-three/drei'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      // Vercel Blob (fotos subidas desde /admin)
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
  // Permitir que el visor 3D y shaders se importen
  transpilePackages: ['three'],
};

export default config;
