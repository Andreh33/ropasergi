export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'UNICA' | string;

export type ProductColor = { name: string; hex: string };

export type ProductImage = {
  src: string;
  alt: string;
  type: 'front' | 'back' | 'detail' | 'lifestyle';
};

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
  category?: string;
  images: ProductImage[];
  drop: '01';
  status: 'available' | 'soldout';
  accent?: 'acid' | 'magenta' | 'cyber';
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
