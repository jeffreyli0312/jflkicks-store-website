import { createClient } from "@sanity/client";
import ProductCarousel from "./ProductCarousel";

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: true,
});

type Props = {
  params: { slug?: string } | Promise<{ slug?: string }>;
};

export const metadata = {
  title: "Yeezy 500 Blush",
};

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
