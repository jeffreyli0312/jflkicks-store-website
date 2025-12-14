import Image from "next/image";
import { createClient } from "@sanity/client";

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: true,
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const imageUrlBuilder = require("@sanity/image-url");
const builder = imageUrlBuilder(sanity);

function urlFor(source: any) {
  return builder.image(source);
}

type Props = {
  params: { slug?: string } | Promise<{ slug?: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await Promise.resolve(params);

  if (!slug) {
    return <div className="p-8">Missing product slug</div>;
  }

  const product = await sanity.fetch(
    `
    *[_type == "product" && slug.current == $slug][0]{
      title,
      price,
      description,
      image
    }
    `,
    { slug }
  );

  if (!product) return <div className="p-8">Product not found</div>;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-black rounded-lg">
        {product.image && (
          <Image
            src={urlFor(product.image).width(600).height(600).url()}
            alt={product.title}
            width={600}
            height={600}
            className="rounded-md object-cover"
          />
        )}

        <h1 className="mt-6 text-3xl font-semibold text-black dark:text-zinc-50">
          {product.title}
        </h1>

        {typeof product.price === "number" && (
          <p className="mt-2 text-xl">${product.price}</p>
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
