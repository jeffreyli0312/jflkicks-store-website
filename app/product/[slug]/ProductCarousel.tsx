"use client";

import Image from "next/image";
import React from "react";
import { createClient } from "@sanity/client";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const imageUrlBuilder = require("@sanity/image-url");

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(sanity);

function urlFor(source: any) {
  return builder.image(source);
}

type Props = {
  images: any[];
  title: string;
};

export default function ProductCarousel({ images, title }: Props) {
  const [index, setIndex] = React.useState(0);

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  const current = images[index];

  // 2x request for sharper quality on retina screens
  const imgUrl = urlFor(current)
    .width(1200)
    .height(1200)
    .fit("crop")
    .quality(90)
    .auto("format")
    .url();

  return (
    <div className="w-full">
      <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
        <Image
          src={imgUrl}
          alt={`${title} - image ${index + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
          unoptimized
          priority
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 text-white hover:bg-black/75"
              aria-label="Previous image"
              type="button"
            >
              ‹
            </button>

            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 text-white hover:bg-black/75"
              aria-label="Next image"
              type="button"
            >
              ›
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-zinc-600 dark:text-zinc-300">
            {index + 1} / {images.length}
          </div>

          <div className="flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2.5 w-2.5 rounded-full ${
                  i === index
                    ? "bg-zinc-900 dark:bg-zinc-50"
                    : "bg-zinc-300 dark:bg-zinc-700"
                }`}
                aria-label={`Go to image ${i + 1}`}
                type="button"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
