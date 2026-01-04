"use client";

import ProductsClient from "../ProductsClient";
import type { Product } from "../lib/products/types";

export default function AccessoriesClient({ products }: { products: Product[] }) {
  return <ProductsClient products={products} />;
}
