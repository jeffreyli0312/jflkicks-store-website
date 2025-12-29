// app/products/components/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollFadeIn from "../../components/scrollFadeIn";
import type { Product } from "../../lib/products/types";

export default function ProductCard({
    product,
    imageUrl,
}: {
    product: Product;
    imageUrl: string | null;
}) {
    return (
        <li className="group">
            <ScrollFadeIn>
                <Link
                    href={`/product/${product.slug.current}`}
                    className="block rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                >
                    <div className="relative w-full overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-900 aspect-[8/9]">
                        {imageUrl && (
                            <Image
                                src={imageUrl}
                                alt={product.title}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 50vw, 33vw"
                                unoptimized
                            />
                        )}
                    </div>

                    <div className="mt-3 text-black dark:text-zinc-50">
                        <div className="font-medium leading-tight break-words">
                            {product.title}
                        </div>

                        {product.price != null && (
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                ${product.price}
                            </div>
                        )}
                    </div>
                </Link>
            </ScrollFadeIn>
        </li>
    );
}
