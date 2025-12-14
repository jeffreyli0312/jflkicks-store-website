import Image from "next/image";
import { createClient } from "@sanity/client";
import Link from "next/link";


const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: true,
});

const imageUrlBuilder = require("@sanity/image-url");
const builder = imageUrlBuilder(sanity);

function urlFor(source: any) {
  return builder.image(source);
}

export const revalidate = 30; // auto-refresh every 30s

export default async function Home() {
  const products = await sanity.fetch(`
    *[_type == "product"]{
      _id,
      title,
      price,
      description,
      image,
      slug
    }
  `);


  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-3xl py-32 px-16 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold mb-8 text-black dark:text-zinc-50">
          Products
        </h1>

        <ul className="space-y-4">
          {products.map((p: any) => (
            <Link
              key={p._id}
              href={`/product/${p.slug.current}`}
              className="block"
            >
              <li className="flex gap-4 border-b pb-4 text-black dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition rounded-md p-2">
                {p.image && (
                  <Image
                    src={urlFor(p.image).width(200).height(200).url()}
                    alt={p.title}
                    width={200}
                    height={200}
                    className="rounded-md object-cover"
                  />
                )}

                <div className="flex flex-col gap-1">
                  <span className="font-medium">{p.title}</span>

                  {p.price && <span className="text-sm">${p.price}</span>}

                  {p.description && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {p.description}
                    </p>
                  )}
                </div>
              </li>
            </Link>


          ))}
        </ul>
      </main>
    </div>
  );
}
