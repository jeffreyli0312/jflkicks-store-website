// app/products/ProductsClient.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { SlidersHorizontal } from "lucide-react";

import type { Product } from "../app/lib/products/types";
import { uniqSorted } from "../app/lib/products/filterUtils";

import Chip from "../app/components/products/Chip";
import ProductCard from "../app/components/products/ProductCard";
import FiltersDesktop from "../app/components/products/FiltersDesktop";
import FiltersMobileDrawer from "../app/components/products/FiltersMobileDrawer";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
    const statusOptions = useMemo(() => ["Available", "Sold"], []);
    const [statuses, setStatuses] = useState<(string | number)[]>(["Available"]);

    useEffect(() => {
        if (statuses.length === 0) setStatuses(["Available"]);
    }, [statuses]);


    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const searchTerm = (searchParams.get("q") ?? "").trim();

    // ✅ Determine which types this page should show by default
    const pageTypes = useMemo(() => {
        if (pathname === "/") return ["product"];
        if (pathname.startsWith("/clothing")) return ["clothing"];
        if (pathname.startsWith("/accessories")) return ["accessories"];

        // fallback (safe)
        return ["product"];
    }, [pathname]);

    // ✅ If searching, allow ALL types. Otherwise, only show this page’s type(s).
    const scopedProducts = useMemo(() => {
        if (searchTerm) return products;
        return products.filter((p) => pageTypes.includes(p._type));
    }, [products, pageTypes, searchTerm]);

    // ✅ Type filter for search results only (All by default)
const typeOptions = useMemo(
  () => [
    { label: "All", value: "all" as const },
    { label: "Sneakers", value: "product" as const },
    { label: "Clothing", value: "clothing" as const },
    { label: "Accessories", value: "accessories" as const },
  ],
  []
);

const [typeFilter, setTypeFilter] = useState<"all" | "product" | "clothing" | "accessories">("all");

// Optional: when user clears/changes search, reset to All
useEffect(() => {
  if (!searchTerm) setTypeFilter("all");
}, [searchTerm]);



    function clearSearchParam() {
        const next = new URLSearchParams(searchParams.toString());
        next.delete("q");
        const qs = next.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname);
    }

    const brandOptions = useMemo(
        () => uniqSorted(scopedProducts.map((p) => p.brand)),
        [scopedProducts]
    );

    const conditionOptions = useMemo(
        () => uniqSorted(scopedProducts.map((p) => p.condition)),
        [scopedProducts]
    );

    const sizeOptions = useMemo(
        () => uniqSorted(scopedProducts.map((p) => String(p.size))),
        [scopedProducts]
    );


    // ------------------ APPLIED FILTERS ------------------
    const [brands, setBrands] = useState<(string | number)[]>([]);
    const [conditions, setConditions] = useState<(string | number)[]>([]);
    const [sizes, setSizes] = useState<(string | number)[]>([]);
    const [minPrice, setMinPrice] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<string>("");

    const [sort, setSort] = useState<
        "Newest" | "Oldest" | "PriceLow" | "PriceHigh"
    >("Newest");

    // Re-trigger list animation when applied filters change or when new search
    const [animationKey, setAnimationKey] = useState(0);
    useEffect(() => {
        setAnimationKey((k) => k + 1);
    }, [brands, conditions, sizes, statuses, minPrice, maxPrice, sort, searchTerm, typeFilter]);


    function normalize(s: string) {
        return s
            .toLowerCase()
            .replace(/['"]/g, "")
            .replace(/[^a-z0-9]+/g, " ")
            .trim();
    }

    function tokenize(q: string) {
        return normalize(q).split(" ").filter(Boolean);
    }

    // very small, safe fuzzy matcher (edit distance <= 1 for short words, <=2 for longer)
    function editDistance(a: string, b: string) {
        const m = a.length;
        const n = b.length;
        const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,      // delete
                    dp[i][j - 1] + 1,      // insert
                    dp[i - 1][j - 1] + cost // replace
                );
            }
        }
        return dp[m][n];
    }

    function fuzzyIncludesToken(hayTokens: string[], token: string) {
        // exact match first
        if (hayTokens.includes(token)) return true;

        // avoid expensive fuzzy for tiny tokens
        if (token.length <= 2) return false;

        // threshold
        const maxDist = token.length <= 4 ? 1 : 2;

        for (const ht of hayTokens) {
            if (Math.abs(ht.length - token.length) > maxDist) continue;
            if (editDistance(ht, token) <= maxDist) return true;
        }
        return false;
    }

    function scoreProduct(p: Product, tokens: string[]) {
        const title = normalize(p.title ?? "");
        const brand = normalize(String(p.brand ?? ""));
        const condition = normalize(String(p.condition ?? ""));
        const size = normalize(String(p.size ?? ""));
        const combined = normalize([p.title, p.brand, p.condition, p.size].filter(Boolean).join(" "));

        const combinedTokens = combined.split(" ").filter(Boolean);

        let score = 0;

        // AND requirement: every token must match somewhere (exact or fuzzy)
        for (const t of tokens) {
            const ok =
                combined.includes(t) || fuzzyIncludesToken(combinedTokens, t);

            if (!ok) return { ok: false, score: 0 };
        }

        // scoring (relevance)
        for (const t of tokens) {
            // stronger signals
            if (title.includes(t)) score += 50;
            if (brand.includes(t)) score += 35;

            // bonuses
            if (title.startsWith(t)) score += 10;
            if (brand.startsWith(t)) score += 6;

            // weaker fields
            if (condition.includes(t)) score += 8;
            if (size.includes(t)) score += 6;

            // fuzzy bonus (only if not exact)
            if (!combined.includes(t) && fuzzyIncludesToken(combinedTokens, t)) score += 4;
        }

        return { ok: true, score };
    }


    const filteredAndSorted = useMemo(() => {
        const min = minPrice.trim() === "" ? null : Number(minPrice);
        const max = maxPrice.trim() === "" ? null : Number(maxPrice);

        const tokens = tokenize(searchTerm);

        // Filter first
        let list = scopedProducts.filter((p) => {

            // ✅ Type filter (only when searching)
if (tokens.length && typeFilter !== "all") {
  if (p._type !== typeFilter) return false;
}


            // Status filter (default: Available)
            if (statuses.length) {
                const isSold = !!p.sold;
                const isAvailable = !isSold;

                const wantAvailable = statuses.includes("Available");
                const wantSold = statuses.includes("Sold");

                if (!wantAvailable && isAvailable) return false;
                if (!wantSold && isSold) return false;
            }

            if (brands.length && !brands.includes(p.brand ?? "")) return false;
            if (conditions.length && !conditions.includes(p.condition ?? "")) return false;
            if (sizes.length && !sizes.includes(String(p.size ?? ""))) return false;

            const price = p.price ?? null;
            if (min !== null && (price === null || price < min)) return false;
            if (max !== null && (price === null || price > max)) return false;

            // search requirement
            if (tokens.length) {
                const res = scoreProduct(p, tokens);
                if (!res.ok) return false;
            }

            return true;
        });

        if (tokens.length) {
            list = [...list]
                .map((p) => ({ p, s: scoreProduct(p, tokens).score }))
                .sort((a, b) => {
                    // primary: relevance
                    if (b.s !== a.s) return b.s - a.s;

                    // tie-breaker: selected sort
                    if (sort === "PriceLow") return (a.p.price ?? Infinity) - (b.p.price ?? Infinity);
                    if (sort === "PriceHigh") return (b.p.price ?? -Infinity) - (a.p.price ?? -Infinity);

                    const at = a.p._createdAt ? new Date(a.p._createdAt).getTime() : 0;
                    const bt = b.p._createdAt ? new Date(b.p._createdAt).getTime() : 0;

                    if (sort === "Oldest") return at - bt;
                    return bt - at;
                })
                .map((x) => x.p);

            return list; // ✅ important: don't sort again below
        }

        // no search term -> normal sorting
        list = [...list].sort((a, b) => {
            if (sort === "PriceLow") return (a.price ?? Infinity) - (b.price ?? Infinity);
            if (sort === "PriceHigh") return (b.price ?? -Infinity) - (a.price ?? -Infinity);

            const at = a._createdAt ? new Date(a._createdAt).getTime() : 0;
            const bt = b._createdAt ? new Date(b._createdAt).getTime() : 0;

            if (sort === "Oldest") return at - bt;
            return bt - at;
        });

        return list;

    }, [scopedProducts, brands, conditions, sizes, statuses, minPrice, maxPrice, sort, searchTerm, typeFilter]);

    const hasAnyFilters =
        !(statuses.length === 1 && statuses[0] === "Available") ||
        brands.length ||
        conditions.length ||
        sizes.length ||
        minPrice.trim() ||
        maxPrice.trim();


    function clearAll() {
        setStatuses(["Available"]);
        setBrands([]);
        setConditions([]);
        setSizes([]);
        setMinPrice("");
        setMaxPrice("");
        setTypeFilter("all");
    }

    // ------------------ MOBILE DRAWER (DRAFT) ------------------
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileAnimateIn, setMobileAnimateIn] = useState(false);
    const CLOSE_MS = 220;

    // Draft values (user edits these in drawer)
    const [mBrands, setMBrands] = useState<(string | number)[]>([]);
    const [mConditions, setMConditions] = useState<(string | number)[]>([]);
    const [mSizes, setMSizes] = useState<(string | number)[]>([]);
    const [mMinPrice, setMMinPrice] = useState("");
    const [mMaxPrice, setMMaxPrice] = useState("");
    const [mSort, setMSort] = useState<
        "Newest" | "Oldest" | "PriceLow" | "PriceHigh"
    >("Newest");

    // Drawer sections (start closed)
    const [secBrand, setSecBrand] = useState(false);
    const [secCond, setSecCond] = useState(false);
    const [secSize, setSecSize] = useState(false);
    const [secPrice, setSecPrice] = useState(false);
    const [secSort, setSecSort] = useState(false);

    const [mStatuses, setMStatuses] = useState<(string | number)[]>(["Available"]);
    const [secStatus, setSecStatus] = useState(false);

    useEffect(() => {
        if (mStatuses.length === 0) setMStatuses(["Available"]);
    }, [mStatuses]);


    function openMobileDrawer() {
        setMobileOpen(true);
        setMobileAnimateIn(false);
    }

    function closeMobileDrawerDiscard() {
        setMobileAnimateIn(false);
        window.setTimeout(() => setMobileOpen(false), CLOSE_MS);
    }

    function mobileApply() {
        // close first (smooth)
        setMobileAnimateIn(false);

        // apply after close finishes
        window.setTimeout(() => {
            setBrands(mBrands);
            setConditions(mConditions);
            setSizes(mSizes);
            setMinPrice(mMinPrice);
            setMaxPrice(mMaxPrice);
            setSort(mSort);

            setMobileOpen(false);

            setStatuses(mStatuses);

        }, CLOSE_MS);
    }

    function clearMobileDraft() {
        setMBrands([]);
        setMConditions([]);
        setMSizes([]);
        setMMinPrice("");
        setMMaxPrice("");
        setMSort("Newest");
        setMStatuses(["Available"]);
    }

    // Copy APPLIED -> DRAFT only on CLOSED -> OPEN
    const wasMobileOpenRef = useRef(false);

    useEffect(() => {
        let t: number | undefined;

        const wasOpen = wasMobileOpenRef.current;

        if (!wasOpen && mobileOpen) {
            // snapshot applied state into draft
            setMBrands(brands);
            setMConditions(conditions);
            setMSizes(sizes);
            setMMinPrice(minPrice);
            setMMaxPrice(maxPrice);
            setMSort(sort);

            setMStatuses(statuses);
            setSecStatus(false);


            // reset sections
            setSecBrand(false);
            setSecCond(false);
            setSecSize(false);
            setSecPrice(false);
            setSecSort(false);

            // animate in
            t = window.setTimeout(() => setMobileAnimateIn(true), 10);
        }

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
        if (!(statuses.length === 1 && statuses[0] === "Available")) count += 1;

        count += brands.length;
        count += conditions.length;
        count += sizes.length;
        if (minPrice.trim() || maxPrice.trim()) count += 1;
        return count;
    }, [brands, conditions, sizes, statuses, minPrice, maxPrice]);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <main className="mx-auto w-full max-w-6xl pt-8 pb-20 px-4 sm:px-6 lg:px-8">
                {/* MOBILE TOP BAR */}
                <div className="mb-6 flex items-center gap-3 md:hidden">
                    <button
                        type="button"
                        onClick={openMobileDrawer}
                        className="inline-flex items-center justify-center rounded-md px-4 py-2
              text-black dark:text-zinc-50 transition-opacity hover:opacity-70"
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
                    statusOptions={statusOptions}
                    statuses={statuses}
                    setStatuses={setStatuses}
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
                                onRemove={() =>
                                    setConditions(conditions.filter((x) => x !== c))
                                }
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

                        {!(statuses.length === 1 && statuses[0] === "Available") &&
                            statuses.map((s) => (
                                <Chip
                                    key={`status-${String(s)}`}
                                    text={`Status: ${String(s)}`}
                                    onRemove={() => {
                                        const next = statuses.filter((x) => x !== s);
                                        setStatuses(next.length ? next : ["Available"]);
                                    }}
                                />
                            ))}


                        <button
                            type="button"
                            onClick={clearAll}
                            className="ml-auto text-sm underline text-black dark:text-zinc-50 hover:opacity-70"
                        >
                            clear all
                        </button>
                    </div>
                )}

                {searchTerm && (
                    <div className="mb-4 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="font-semibold">Search results for </span>
                                <span className="font-semibold">“{searchTerm}”</span>
                            </div>

                            <button
                                type="button"
                                onClick={clearSearchParam}
                                className="text-sm underline text-zinc-700 hover:text-black dark:text-zinc-200 dark:hover:text-white"
                            >
                                Remove
                            </button>
                        </div>

                        {/* ✅ Type filter pills (only during search) */}
<div className="mt-3 flex flex-wrap gap-2">
  {typeOptions.map((opt) => {
    const active = typeFilter === opt.value;
    return (
      <button
        key={opt.value}
        type="button"
        onClick={() => setTypeFilter(opt.value)}
        className={[
          "rounded-full px-3 py-1 text-sm border transition",
          active
            ? "border-black bg-black text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-black"
            : "border-zinc-300 bg-white text-black hover:opacity-70 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50",
        ].join(" ")}
      >
        {opt.label}
      </button>
    );
  })}
</div>


                        {filteredAndSorted.length === 0 && (
                            <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                                No products matched your search. Try a different keyword or remove the search.
                            </div>
                        )}
                    </div>
                )}

                {/* No search, but the filters are applied and there are no results */}
                {!searchTerm && filteredAndSorted.length === 0 &&
                    <div className="mb-4 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="font-semibold">No products were found.</span>
                            </div>
                        </div>
                        <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                            Please adjust or remove your filters to see available items.
                        </div>
                    </div>
                }


                {/* PRODUCT GRID */}
                <ul key={animationKey} className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {filteredAndSorted.map((p) => {
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
                statusOptions={statusOptions}
                mStatuses={mStatuses}
                setMStatuses={setMStatuses}
                secStatus={secStatus}
                setSecStatus={setSecStatus}
            />
        </div>
    );
}
