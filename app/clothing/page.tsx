
import { createClient } from "@sanity/client";
import ClothingClient from "./ClothingClient";
import { Suspense } from "react";

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: true,
});

export const revalidate = 30;

export default async function ClothingPage() {
  const clothing = await sanity.fetch(`
    *[_type == "clothing" && hide != true] | order(_createdAt desc){
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

  return (
    <Suspense fallback={null}>
      <ClothingClient products={clothing} />
    </Suspense>
  );
}
