import { createClient } from "@sanity/client";
import ProductCarousel from "../../product/[slug]/ProductCarousel";
import type { Metadata } from "next";
import Link from "next/link";

const sanity = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: "2024-01-01",
    useCdn: true,
});

type Props = {
    params: { slug?: string } | Promise<{ slug?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await Promise.resolve(params);

    if (!slug) return { title: "Accessories | JFLKicks" };

    const item = await sanity.fetch(
        `
    *[_type == "accessories" && slug.current == $slug][0]{
      title,
      description
    }
    `,
        { slug }
    );

    if (!item) return { title: "Item Not Found | JFLKicks" };

    return {
        title: item.title,
        description: item.description,
    };
}

export default async function AccessoriesItemPage({ params }: Props) {
    const { slug } = await Promise.resolve(params);
    if (!slug) return <div className="p-8">Missing accessory slug</div>;

    const item = await sanity.fetch(
        `
    *[_type == "accessories" && slug.current == $slug][0]{
      title,
      price,
      size,
      condition,
      description,
      sold,
      images
    }
    `,
        { slug }
    );

    if (!item) return <div className="p-8">Item not found</div>;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black px-4 py-8 sm:px-6 sm:py-12">
            <div className="mx-auto w-full max-w-7xl">
                <div className="rounded-2xl bg-white dark:bg-black border border-zinc-200/70 dark:border-zinc-800 shadow-sm">
                    <div className="p-4 sm:p-6 lg:p-10">
                        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
                            {/* LEFT — Carousel */}
                            <div className="lg:sticky lg:top-24">
                                <div className="mx-auto w-full max-w-2xl">
                                    {Array.isArray(item.images) && item.images.length > 0 && (
                                        <ProductCarousel images={item.images} title={item.title} />
                                    )}
                                </div>
                            </div>

                            {/* RIGHT — Details */}
                            <div className="text-black dark:text-zinc-50">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
                                            {item.title}
                                        </h1>

                                        {typeof item.price === "number" && (
                                            <p className="text-xl sm:text-2xl font-semibold">
                                                ${item.price}
                                            </p>
                                        )}

                                        {item.size && (
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                                                    Size
                                                </span>
                                                <span className="inline-flex items-center justify-center rounded-full border border-zinc-300/80 dark:border-zinc-700 px-4 py-2 text-sm sm:text-base font-semibold">
                                                    {item.size}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {item.description && item.condition && (
                                        <p className="text-zinc-700 dark:text-zinc-300 text-base sm:text-lg leading-relaxed max-w-prose">
                                            {item.condition}, {item.description}
                                        </p>
                                    )}

                                    {item.sold ? (
                                        <div
                                            className="inline-flex w-full items-center justify-center rounded-xl
                      border-2 border-black/40 dark:border-white/40
                      bg-transparent px-6 py-4 text-base sm:text-lg font-semibold
                      text-black/50 dark:text-white/50
                      cursor-not-allowed"
                                        >
                                            Sold
                                        </div>
                                    ) : (
                                        <Link
                                            href="https://instagram.com/jflkicks"
                                            className="inline-flex w-full items-center justify-center rounded-xl
                      border-2 border-black dark:border-white
                      bg-transparent px-6 py-4 text-base sm:text-lg font-semibold
                      text-black dark:text-white
                      transition-colors
                      hover:bg-black hover:text-white
                      dark:hover:bg-white dark:hover:text-black
                      active:scale-[0.98]"
                                        >
                                            Contact Us
                                        </Link>
                                    )}

                                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 p-5">
                                        <div className="space-y-3">
                                            <p className="text-sm sm:text-base font-semibold tracking-wide uppercase">
                                                100% Authentic
                                            </p>
                                            <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                                Have any questions, offers, or need more pictures?
                                            </p>
                                            <p className="text-sm sm:text-base font-medium">
                                                Contact us on{" "}
                                                <a
                                                    href="https://instagram.com/jflkicks"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="underline underline-offset-4 hover:opacity-70 transition-opacity"
                                                >
                                                    Instagram
                                                </a>
                                                .
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* END RIGHT */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
