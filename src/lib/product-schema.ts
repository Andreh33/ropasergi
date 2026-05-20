import { z } from 'zod';
import type { Product } from './types';
import { slugify } from './utils';

const imageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().default(''),
  type: z.enum(['front', 'back', 'detail', 'lifestyle', 'papers']).default('front'),
});

const colorSchema = z.object({
  name: z.string().min(1),
  hex: z.string().min(1),
});

const BRAND_VALUES = [
  'VERSACE',
  'LOUIS_VUITTON',
  'NIKE',
  'DIOR',
  'GUCCI',
  'BALENCIAGA',
  'PRADA',
  'FENDI',
  'OFF_WHITE',
  'MONCLER',
  'BURBERRY',
  'ROLEX',
  'AUDEMARS_PIGUET',
  'PATEK_PHILIPPE',
  'CARTIER',
  'IWC',
  'OMEGA',
] as const;

const yearField = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? undefined : v),
  z.coerce.number().int().min(1900).max(2100).optional(),
);

export const productFormSchema = z.object({
  slug: z.string().optional(),
  name: z.string().min(2, 'El nombre es obligatorio'),
  brand: z.enum(BRAND_VALUES).optional(),
  category: z.enum(['CHANDAL', 'RELOJ']).default('CHANDAL'),
  reference: z.string().default(''),
  year: yearField,
  condition: z.enum(['NUEVO', 'COMO_NUEVO', 'EXCELENTE', 'BUENO']).default('EXCELENTE'),
  edition: z.string().default('PIEZA ÚNICA'),
  total: z.coerce.number().int().positive().default(1),
  available: z.coerce.number().int().nonnegative().default(1),
  price: z.coerce.number().nonnegative('Precio inválido'),
  shortDescriptor: z.string().default(''),
  editorial: z.string().default(''),
  material: z.string().default(''),
  weight: z.string().optional(),
  origin: z.string().default(''),
  tailoring: z.string().default(''),
  // relojes
  movement: z.string().optional(),
  caseSize: z.string().optional(),
  waterResistance: z.string().optional(),
  hasPapers: z.coerce.boolean().default(false),
  authDocuments: z.array(z.string()).default([]),
  serialNumber: z.string().optional(),
  care: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default(['UNICA']),
  soldoutSizes: z.array(z.string()).default([]),
  colors: z.array(colorSchema).default([]),
  status: z.enum(['available', 'soldout']).default('available'),
  accent: z.enum(['acid', 'magenta', 'cyber']).optional(),
  images: z.array(imageSchema).default([]),
  verified: z.coerce.boolean().default(true),
});

export type ProductFormInput = z.input<typeof productFormSchema>;
export type ProductFormValues = z.output<typeof productFormSchema>;

export function formToProduct(values: ProductFormValues): Product {
  const slug = values.slug && values.slug.length > 0 ? values.slug : slugify(values.name);
  const docs = values.authDocuments.filter((d) => d.trim().length > 0);
  const hasAuth = docs.length > 0 || (values.serialNumber?.trim().length ?? 0) > 0;
  return {
    slug,
    name: values.name,
    edition: values.edition,
    numbered: { total: values.total, available: values.available },
    price: { amount: values.price, currency: 'EUR' },
    shortDescriptor: values.shortDescriptor,
    editorial: values.editorial,
    technical: {
      material: values.material,
      ...(values.weight ? { weight: values.weight } : {}),
      origin: values.origin,
      tailoring: values.tailoring,
    },
    care: values.care.filter((c) => c.trim().length > 0),
    sizes: values.sizes,
    ...(values.soldoutSizes.length ? { soldoutSizes: values.soldoutSizes } : {}),
    ...(values.colors.length ? { colors: values.colors } : {}),
    category: values.category,
    ...(values.brand ? { brand: values.brand } : {}),
    ...(values.reference ? { reference: values.reference } : {}),
    ...(values.year ? { year: values.year } : {}),
    condition: values.condition,
    ...(values.movement ? { movement: values.movement } : {}),
    ...(values.caseSize ? { caseSize: values.caseSize } : {}),
    ...(values.waterResistance ? { waterResistance: values.waterResistance } : {}),
    hasPapers: values.hasPapers,
    ...(hasAuth
      ? {
          authentication: {
            documents: docs,
            ...(values.serialNumber ? { serialNumber: values.serialNumber } : {}),
          },
        }
      : {}),
    images:
      values.images.length > 0
        ? values.images
        : [{ src: '/uploads/placeholder.svg', alt: values.name, type: 'front' as const }],
    drop: '01',
    status: values.status,
    ...(values.accent ? { accent: values.accent } : {}),
    meta: { verified: values.verified },
  };
}
