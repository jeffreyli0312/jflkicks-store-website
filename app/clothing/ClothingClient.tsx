"use client";

import ProductsClient from "../ProductsClient";
import type { Product } from "../lib/products/types";

export default function ClothingClient({ products }: { products: Product[] }) {
  return <ProductsClient products={products} />;
}