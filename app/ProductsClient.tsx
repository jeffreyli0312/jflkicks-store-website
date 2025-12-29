// app/products/ProductsClient.tsx
"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { SlidersHorizontal } from "lucide-react";

import type { Product } from "../app/lib/products/types";
import { uniqSorted } from "../app/lib/products/filterUtils";

import Chip from "../app/components/products/Chip";
import ProductCard from "../app/components/products/ProductCard";
import FiltersDesktop from "../app/components/products/FiltersDesktop";
import FiltersMobileDrawer from "../app/components/products/FiltersMobileDrawer";

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

export default function ProductsClient({ products }: { products: Product[] }) {
    const brandOptions = useMemo(() => uniqSorted(products.map((p) => p.brand)), [products]);
    const conditionOptions = useMemo(() => uniqSorted(products.map((p) => p.condition)), [products]);
    const sizeOptions = useMemo(() => uniqSorted(products.map((p) => p.size)), [products]);

    // APPLIED
    const [brands, setBrands] = useState<(string | number)[]>([]);
    const [conditions, setConditions] = useState<(string | number)[]>([]);
    const [sizes, setSizes] = useState<(string | number)[]>([]);
    const [minPrice, setMinPrice] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<string>("");

    const [sort, setSort] = useState<"Newest" | "Oldest" | "PriceLow" | "PriceHigh">("Newest");

    const [animationKey, setAnimationKey] = useState(0);
    useEffect(() => {
        setAnimationKey((k) => k + 1);
    }, [brands, conditions, sizes, minPrice, maxPrice, sort]);

    const filteredAndSorted = useMemo(() => {
        const min = minPrice.trim() === "" ? null : Number(minPrice);
        const max = maxPrice.trim() === "" ? null : Number(maxPrice);

        let list = products.filter((p) => {
            if (brands.length && !brands.includes(p.brand ?? "")) return false;
            if (conditions.length && !conditions.includes(p.condition ?? "")) return false;
            if (sizes.length && !sizes.includes(p.size ?? "")) return false;

            const price = p.price ?? null;
            if (min !== null && (price === null || price < min)) return false;
            if (max !== null && (price === null || price > max)) return false;

            return true;
        });

        list = [...list].sort((a, b) => {
            if (sort === "PriceLow") return (a.price ?? Infinity) - (b.price ?? Infinity);
            if (sort === "PriceHigh") return (b.price ?? -Infinity) - (a.price ?? -Infinity);

            const at = a._createdAt ? new Date(a._createdAt).getTime() : 0;
            const bt = b._createdAt ? new Date(b._createdAt).getTime() : 0;

            if (sort === "Oldest") return at - bt;
            return bt - at;
        });

        return list;
    }, [products, brands, conditions, sizes, minPrice, maxPrice, sort]);

    const hasAnyFilters =
        brands.length || conditions.length || sizes.length || minPrice.trim() || maxPrice.trim();

    function clearAll() {
        setBrands([]);
        setConditions([]);
        setSizes([]);
        setMinPrice("");
        setMaxPrice("");
    }

    /** ------------------ MOBILE DRAWER (DRAFT) ------------------ */
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileAnimateIn, setMobileAnimateIn] = useState(false);
    const CLOSE_MS = 220;

    const [mBrands, setMBrands] = useState<(string | number)[]>([]);
    const [mConditions, setMConditions] = useState<(string | number)[]>([]);
    const [mSizes, setMSizes] = useState<(string | number)[]>([]);
    const [mMinPrice, setMMinPrice] = useState("");
    const [mMaxPrice, setMMaxPrice] = useState("");
    const [mSort, setMSort] = useState<"Newest" | "Oldest" | "PriceLow" | "PriceHigh">("Newest");

    // sections (start closed)
    const [secBrand, setSecBrand] = useState(false);
    const [secCond, setSecCond] = useState(false);
    const [secSize, setSecSize] = useState(false);
    const [secPrice, setSecPrice] = useState(false);
    const [secSort, setSecSort] = useState(false);

    function openMobileDrawer() {
        setMobileOpen(true);
        setMobileAnimateIn(false);
    }

    function closeMobileDrawerDiscard() {
        setMobileAnimateIn(false);
        window.setTimeout(() => setMobileOpen(false), CLOSE_MS);
    }

    function mobileApply() {
        // start closing animation first
        setMobileAnimateIn(false);

        window.setTimeout(() => {
            // apply AFTER close animation
            setBrands(mBrands);
            setConditions(mConditions);
            setSizes(mSizes);
            setMinPrice(mMinPrice);
            setMaxPrice(mMaxPrice);
            setSort(mSort);

            setMobileOpen(false);
        }, CLOSE_MS);
    }


    function clearMobileDraft() {
        setMBrands([]);
        setMConditions([]);
        setMSizes([]);
        setMMinPrice("");
        setMMaxPrice("");
        setMSort("Newest");
    }

    // when opening: copy APPLIED -> DRAFT + reset sections

    const wasMobileOpenRef = useRef(false);

    useEffect(() => {
        let t: number | undefined;

        const wasOpen = wasMobileOpenRef.current;

        // only on CLOSED -> OPEN
        if (!wasOpen && mobileOpen) {
            setMBrands(brands);
            setMConditions(conditions);
            setMSizes(sizes);
            setMMinPrice(minPrice);
            setMMaxPrice(maxPrice);
            setMSort(sort);

            setSecBrand(false);
            setSecCond(false);
            setSecSize(false);
            setSecPrice(false);
            setSecSort(false);

            t = window.setTimeout(() => setMobileAnimateIn(true), 10);
        }

        // ✅ IMPORTANT: always update the ref
        wasMobileOpenRef.current = mobileOpen;

        return () => {
            if (t) window.clearTimeout(t);
        };
    }, [mobileOpen, brands, conditions, sizes, minPrice, maxPrice, sort]);


    // lock background scroll when drawer open
    useEffect(() => {
        if (!mobileOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [mobileOpen]);

    const mobileAppliedCount = useMemo(() => {
        let count = 0;
        count += brands.length;
        count += conditions.length;
        count += sizes.length;
        if (minPrice.trim() || maxPrice.trim()) count += 1;
        return count;
    }, [brands, conditions, sizes, minPrice, maxPrice]);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <main className="mx-auto w-full max-w-6xl pt-8 pb-20 px-4 sm:px-6 lg:px-8">
                {/* MOBILE TOP BAR */}
                <div className="mb-6 flex items-center gap-3 md:hidden">
                    <button
                        type="button"
                        onClick={openMobileDrawer}
                        className="inline-flex items-center justify-center rounded-md px-4 py-2
             text-black dark:text-zinc-50
             transition-opacity
             hover:opacity-70"
                    >
                        <span className="inline-flex items-center gap-2">
                            <SlidersHorizontal className="h-4 w-4" />
                            <span className="text-[16px] font-semibold">
                                Filter{mobileAppliedCount ? ` (${mobileAppliedCount})` : ""}
                            </span>
                        </span>
                    </button>
                </div>

                <FiltersDesktop
                    brandOptions={brandOptions}
                    conditionOptions={conditionOptions}
                    sizeOptions={sizeOptions}
                    brands={brands}
                    setBrands={setBrands}
                    conditions={conditions}
                    setConditions={setConditions}
                    sizes={sizes}
                    setSizes={setSizes}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    setMinPrice={setMinPrice}
                    setMaxPrice={setMaxPrice}
                    sort={sort}
                    setSort={setSort}
                />

                {/* Applied filters chips */}
                {hasAnyFilters && (
                    <div className="mb-8 flex flex-wrap items-center gap-3">
                        <span className="text-sm font-semibold tracking-wide text-black dark:text-zinc-50">
                            REFINE BY
                        </span>

                        {brands.map((b) => (
                            <Chip
                                key={`brand-${String(b)}`}
                                text={String(b)}
                                onRemove={() => setBrands(brands.filter((x) => x !== b))}
                            />
                        ))}

                        {conditions.map((c) => (
                            <Chip
                                key={`cond-${String(c)}`}
                                text={String(c)}
                                onRemove={() => setConditions(conditions.filter((x) => x !== c))}
                            />
                        ))}

                        {sizes.map((s) => (
                            <Chip
                                key={`size-${String(s)}`}
                                text={String(s)}
                                onRemove={() => setSizes(sizes.filter((x) => x !== s))}
                            />
                        ))}

                        {(minPrice.trim() || maxPrice.trim()) && (
                            <Chip
                                text={`$${minPrice.trim() || "0"} – $${maxPrice.trim() || "∞"}`}
                                onRemove={() => {
                                    setMinPrice("");
                                    setMaxPrice("");
                                }}
                            />
                        )}

                        <button
                            type="button"
                            onClick={clearAll}
                            className="ml-auto text-sm underline text-black dark:text-zinc-50 hover:opacity-70"
                        >
                            clear all
                        </button>
                    </div>
                )}

                {/* PRODUCT GRID */}
                <ul key={animationKey} className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {filteredAndSorted.map((p) => {
                        const firstImage = p.images?.[0];
                        const imgUrl = firstImage
                            ? urlFor(firstImage).width(800).height(900).fit("crop").quality(70).auto("format").url()
                            : null;

                        return <ProductCard key={p._id} product={p} imageUrl={imgUrl} />;
                    })}
                </ul>
            </main>

            <FiltersMobileDrawer
                mobileOpen={mobileOpen}
                mobileAnimateIn={mobileAnimateIn}
                closeMobileDrawerDiscard={closeMobileDrawerDiscard}
                mobileApply={mobileApply}
                clearMobileDraft={clearMobileDraft}
                CLOSE_MS={CLOSE_MS}
                brandOptions={brandOptions}
                conditionOptions={conditionOptions}
                sizeOptions={sizeOptions}
                mBrands={mBrands}
                setMBrands={setMBrands}
                mConditions={mConditions}
                setMConditions={setMConditions}
                mSizes={mSizes}
                setMSizes={setMSizes}
                mMinPrice={mMinPrice}
                setMMinPrice={setMMinPrice}
                mMaxPrice={mMaxPrice}
                setMMaxPrice={setMMaxPrice}
                mSort={mSort}
                setMSort={setMSort}
                secBrand={secBrand}
                setSecBrand={setSecBrand}
                secCond={secCond}
                setSecCond={setSecCond}
                secSize={secSize}
                setSecSize={setSecSize}
                secPrice={secPrice}
                setSecPrice={setSecPrice}
                secSort={secSort}
                setSecSort={setSecSort}
            />
        </div>
    );
}
