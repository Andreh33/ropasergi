export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'UNICA' | string;

export type ProductColor = { name: string; hex: string };

export type ProductImage = {
  src: string;
  alt: string;
  type: 'front' | 'back' | 'detail' | 'lifestyle' | 'papers';
};

// Boutique multimarca: dos categorías cerradas.
export type ProductCategory = 'CHANDAL' | 'RELOJ';

// Marcas curadas (chándales + relojes). Ver BRAND_META en lib/data/brands.ts.
export type Brand =
  | 'VERSACE'
  | 'LOUIS_VUITTON'
  | 'NIKE'
  | 'DIOR'
  | 'GUCCI'
  | 'BALENCIAGA'
  | 'PRADA'
  | 'FENDI'
  | 'OFF_WHITE'
  | 'MONCLER'
  | 'BURBERRY'
  | 'ROLEX'
  | 'AUDEMARS_PIGUET'
  | 'PATEK_PHILIPPE'
  | 'CARTIER'
  | 'IWC'
  | 'OMEGA';

export type Condition = 'NUEVO' | 'COMO_NUEVO' | 'EXCELENTE' | 'BUENO';

export type Product = {
  slug: string;
  name: string;
  edition: string;
  numbered: { total: number; available: number };
  price: { amount: number; currency: 'EUR' };
  shortDescriptor: string;
  editorial: string;
  technical: {
    material: string;
    weight?: string;
    origin: string;
    tailoring: string;
  };
  care: string[];
  sizes: Size[];
  soldoutSizes?: Size[];
  colors?: ProductColor[];
  category?: ProductCategory;
  images: ProductImage[];
  drop: '01';
  status: 'available' | 'soldout';
  accent?: 'acid' | 'magenta' | 'cyber';

  // --- Rebrand v2: boutique multimarca (campos opcionales, retrocompatibles) ---
  brand?: Brand;
  reference?: string; // "126334" o "A89518"
  year?: number; // año conocido (opcional)
  condition?: Condition;
  movement?: string; // relojes: "Cal. 3235 automático"
  caseSize?: string; // relojes: "41 mm"
  waterResistance?: string; // relojes: "100 m"
  hasPapers?: boolean;
  authentication?: { documents: string[]; serialNumber?: string };
  meta?: { verified: boolean }; // false = datos seed pendientes de verificar
};

export type CartItem = {
  slug: string;
  size: Size;
  qty: number;
  addedAt: number;
  // Snapshot del producto al añadir: el carrito no depende del catálogo (estático
  // ni dinámico) para mostrar/calcular, así funciona con productos del admin.
  name: string;
  price: number;
  image?: string;
};

export type SoundKey = 'intro' | 'tick' | 'tap' | 'swipe' | 'add' | 'error' | 'unlock' | 'ambient';
