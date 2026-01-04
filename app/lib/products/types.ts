// app/products/lib/types.ts
export type Product = {
  _id: string;
  _type: "product" | "clothing" | "accessories";
  title: string;
  price?: number;
  images?: any[];
  slug: { current: string };
  brand?: string;
  condition?: string;
  size?: string | number;
  sold?: boolean;
  _createdAt?: string;
};
