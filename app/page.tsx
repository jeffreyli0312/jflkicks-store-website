
import { createClient } from "@sanity/client";
import ProductsClient from "./ProductsClient";
import { Suspense } from "react";


const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: true,
});

export const revalidate = 30;

export default async function Home() {
  const products = await sanity.fetch(`
    *[
      _type in ["product", "clothing", "accessories"]
      && hide != true
    ] | order(_createdAt desc){
      _id,
      title,
      price,
      images,
      slug,
      brand,
      condition,
      size,
      sold,
      _type,
      _createdAt
    }
`);

  // Current file is a server side file
  return (
    <Suspense fallback={null}>
      <ProductsClient products={products} />
    </Suspense>
  );
}
