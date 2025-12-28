
import { createClient } from "@sanity/client";
import ProductCarousel from "./ProductCarousel";
import type { Metadata } from "next";

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: true,
});

type Props = {
  params: { slug?: string } | Promise<{ slug?: string }>;
};

// Calls function before rendering page since generateMetadata is a hook
export async function generateMetadata( 
  { params }: Props
): Promise<Metadata> {

  const { slug } = await Promise.resolve(params);

  if (!slug) {
    return { title: "Sneakers | JLFKicks" };
  }

  // Query Sanity CMS, get first product title & description with matching slug
  const product = await sanity.fetch(
    `
    *[_type == "product" && slug.current == $slug][0]{
      title,
      description
    }
    `,
    { slug } // pass value of slug into the query, reference using $slug
  );

  if (!product) {
    return { title: "Product Not Found | JLFKicks" };
  }

  return { // Inject strings below into the page head (tab title)
    title: product.title,
    description: product.description,
  };
}


export default async function ProductPage({ params }: Props) {
  const { slug } = await Promise.resolve(params);

  if (!slug) return <div className="p-8">Missing product slug</div>;

  const product = await sanity.fetch(
    `
    *[_type == "product" && slug.current == $slug][0]{
      title,
      price,
      description,
      images
    }
    `,
    { slug }
  );

  if (!product) return <div className="p-8">Product not found</div>;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-black rounded-lg">
        {Array.isArray(product.images) && product.images.length > 0 && (
          <ProductCarousel images={product.images} title={product.title} />
        )}

        <h1 className="mt-6 text-3xl font-semibold text-black dark:text-zinc-50">
          {product.title}
        </h1>

        {typeof product.price === "number" && (
          <p className="mt-2 text-xl text-black dark:text-zinc-50">
            ${product.price}
          </p>
        )}

        {product.description && (
          <p className="mt-4 text-zinc-700 dark:text-zinc-300">
            {product.description}
          </p>
        )}
      </div>
    </div>
  );
}
