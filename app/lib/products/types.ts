// app/products/lib/types.ts
export type Product = {
  _id: string;
  title: string;
  price?: number;
  images?: any[];
  slug: { current: string };
  brand?: string;
  condition?: string;
  size?: string | number;
  _createdAt?: string;
};
