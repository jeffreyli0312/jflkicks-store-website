import Image from "next/image";
import { createClient } from "@sanity/client";
import Link from "next/link";
import ScrollFadeIn from "../app/components/scrollFadeIn";

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

export const revalidate = 30;

export default async function Home() {
  const products = await sanity.fetch(`
    *[_type == "product" && hide != true]{
      _id,
      title,
      price,
      images,
      slug
    }
  `);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto w-full max-w-6xl pt-15 pb-20 px-4 sm:px-6 lg:px-8">
        {/* <h1 className="text-3xl font-semibold mb-8 text-black dark:text-zinc-50">
          Products
        </h1> */}

        {/* 2 columns on mobile, 3 columns on larger screens */}
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {products.map((p: any) => {
            const firstImage = p.images?.[0];

            const imgUrl = firstImage
              ? urlFor(firstImage)
                .width(800)
                .height(900)
                .fit("crop")
                .quality(70)
                .auto("format")
                .url()
              : null;

            return (
              <li key={p._id} className="group">
                <ScrollFadeIn>
                  <Link
                    href={`/product/${p.slug.current}`}
                    className="block rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                  >
                    <div className="relative w-full overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-900 aspect-[8/9]">
                      {imgUrl && (
                        <Image
                          src={imgUrl}
                          alt={p.title}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 50vw, 33vw"
                          unoptimized
                        />
                      )}
                    </div>

                    <div className="mt-3 text-black dark:text-zinc-50">
                      <div className="font-medium line-clamp-1">{p.title}</div>
                      {p.price != null && (
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">
                          ${p.price}
                        </div>
                      )}
                    </div>
                  </Link>
                </ScrollFadeIn>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
