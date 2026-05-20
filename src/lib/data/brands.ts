import type { Brand, ProductCategory } from '@/lib/types';

// Metadatos de marca. Los nombres se renderizan con la tipografía del sitio,
// nunca con logos vectoriales (marcas registradas → licencia). Ver rebrand §8.
export const BRAND_META: Record<
  Brand,
  { displayName: string; country: string; foundedYear: number; category: ProductCategory }
> = {
  // --- Chándales ---
  VERSACE: { displayName: 'Versace', country: 'Italia', foundedYear: 1978, category: 'CHANDAL' },
  LOUIS_VUITTON: {
    displayName: 'Louis Vuitton',
    country: 'Francia',
    foundedYear: 1854,
    category: 'CHANDAL',
  },
  NIKE: { displayName: 'Nike', country: 'EE.UU.', foundedYear: 1964, category: 'CHANDAL' },
  DIOR: { displayName: 'Dior', country: 'Francia', foundedYear: 1946, category: 'CHANDAL' },
  GUCCI: { displayName: 'Gucci', country: 'Italia', foundedYear: 1921, category: 'CHANDAL' },
  BALENCIAGA: {
    displayName: 'Balenciaga',
    country: 'Francia/España',
    foundedYear: 1919,
    category: 'CHANDAL',
  },
  PRADA: { displayName: 'Prada', country: 'Italia', foundedYear: 1913, category: 'CHANDAL' },
  FENDI: { displayName: 'Fendi', country: 'Italia', foundedYear: 1925, category: 'CHANDAL' },
  OFF_WHITE: {
    displayName: 'Off-White',
    country: 'Italia',
    foundedYear: 2012,
    category: 'CHANDAL',
  },
  MONCLER: {
    displayName: 'Moncler',
    country: 'Italia/Francia',
    foundedYear: 1952,
    category: 'CHANDAL',
  },
  BURBERRY: {
    displayName: 'Burberry',
    country: 'Reino Unido',
    foundedYear: 1856,
    category: 'CHANDAL',
  },

  // --- Relojes ---
  ROLEX: { displayName: 'Rolex', country: 'Suiza', foundedYear: 1905, category: 'RELOJ' },
  AUDEMARS_PIGUET: {
    displayName: 'Audemars Piguet',
    country: 'Suiza',
    foundedYear: 1875,
    category: 'RELOJ',
  },
  PATEK_PHILIPPE: {
    displayName: 'Patek Philippe',
    country: 'Suiza',
    foundedYear: 1839,
    category: 'RELOJ',
  },
  CARTIER: { displayName: 'Cartier', country: 'Francia', foundedYear: 1847, category: 'RELOJ' },
  IWC: { displayName: 'IWC Schaffhausen', country: 'Suiza', foundedYear: 1868, category: 'RELOJ' },
  OMEGA: { displayName: 'Omega', country: 'Suiza', foundedYear: 1848, category: 'RELOJ' },
};

export function brandName(brand: Brand | undefined): string {
  return brand ? BRAND_META[brand].displayName : '';
}

export const CATEGORY_LABEL: Record<ProductCategory, string> = {
  CHANDAL: 'Chándales',
  RELOJ: 'Relojes',
};

export const CONDITION_LABEL: Record<string, string> = {
  NUEVO: 'Nuevo',
  COMO_NUEVO: 'Como nuevo',
  EXCELENTE: 'Excelente',
  BUENO: 'Bueno',
};
