import { z } from 'zod';
import type { Product } from './types';
import { slugify } from './utils';

const imageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().default(''),
  type: z.enum(['front', 'back', 'detail', 'lifestyle']).default('front'),
});

export const productFormSchema = z.object({
  slug: z.string().optional(),
  name: z.string().min(2, 'El nombre es obligatorio'),
  edition: z.string().default('001 / 100'),
  total: z.coerce.number().int().positive().default(100),
  available: z.coerce.number().int().nonnegative().default(100),
  price: z.coerce.number().nonnegative('Precio inválido'),
  shortDescriptor: z.string().default(''),
  editorial: z.string().default(''),
  material: z.string().default(''),
  weight: z.string().optional(),
  origin: z.string().default(''),
  tailoring: z.string().default(''),
  care: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default(['UNICA']),
  soldoutSizes: z.array(z.string()).default([]),
  status: z.enum(['available', 'soldout']).default('available'),
  accent: z.enum(['acid', 'magenta', 'cyber']).optional(),
  images: z.array(imageSchema).default([]),
});

export type ProductFormInput = z.input<typeof productFormSchema>;
export type ProductFormValues = z.output<typeof productFormSchema>;

export function formToProduct(values: ProductFormValues): Product {
  const slug = values.slug && values.slug.length > 0 ? values.slug : slugify(values.name);
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
    images:
      values.images.length > 0
        ? values.images
        : [{ src: '/uploads/placeholder.svg', alt: values.name, type: 'front' as const }],
    drop: '01',
    status: values.status,
    ...(values.accent ? { accent: values.accent } : {}),
  };
}
