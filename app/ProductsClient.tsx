// app/ProductsClient.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import ScrollFadeIn from "../app/components/scrollFadeIn";
import { createClient } from "@sanity/client";
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react";


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

type Product = {
    _id: string;
    title: string;
    price?: number;
    images?: any[];
    slug: { current: string };
    brand?: string;
    condition?: string;
    size?: string | number;
    _createdAt?: string;
};

function uniqSorted(vals: (string | number | undefined)[]) {
    return Array.from(new Set(vals.filter(Boolean) as (string | number)[])).sort((a, b) =>
        String(a).localeCompare(String(b), undefined, { numeric: true })
    );
}

function Chip({ text, onRemove }: { text: string; onRemove: () => void }) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 dark:bg-zinc-900 px-4 py-2 text-sm text-black dark:text-zinc-50">
            {text}
            <button
                type="button"
                onClick={onRemove}
                className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                aria-label={`Remove ${text}`}
            >
                <X className="h-5 w-5" />
            </button>
        </span>
    );
}

/**
 * Desktop MultiSelect
 * - Minimal trigger: LABEL ▾ / ▴
 * - Click outside closes WITHOUT applying (draft is discarded)
 * - Filters only apply when user clicks Done
 */
function MultiSelect({
    label,
    options,
    value, // applied value
    onChange, // sets applied value
}: {
    label: string;
    options: (string | number)[];
    value: (string | number)[];
    onChange: (next: (string | number)[]) => void;
}) {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState<(string | number)[]>(value);
    const wrapRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (open) setDraft(value);
    }, [open, value]);

    useEffect(() => {
        function onDocMouseDown(e: MouseEvent) {
            if (!wrapRef.current) return;
            if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", onDocMouseDown);
        return () => document.removeEventListener("mousedown", onDocMouseDown);
    }, []);

    function toggleOption(opt: string | number) {
        setDraft((prev) => (prev.includes(opt) ? prev.filter((v) => v !== opt) : [...prev, opt]));
    }

    function clearDraft() {
        setDraft([]);
    }

    function apply() {
        onChange(draft);
        setOpen(false);
    }

    const isApplied = value.length > 0;

    return (
        <div ref={wrapRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((s) => !s)}
                className="flex items-center gap-2 text-sm tracking-wide text-black dark:text-zinc-50 hover:opacity-70"
            >
                <span className={isApplied ? "font-semibold" : ""}>{label}</span>
                {open ? (
                    <ChevronUp className="h-4 w-4 opacity-70" />
                ) : (
                    <ChevronDown className="h-4 w-4 opacity-70" />
                )}
            </button>

            {open && (
                <div className="absolute z-30 mt-3 w-64 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-100 dark:border-zinc-900">
                        <div className="text-xs tracking-wide text-zinc-500">{label}</div>
                        <button
                            type="button"
                            onClick={clearDraft}
                            className="text-xs text-zinc-600 dark:text-zinc-300 hover:underline"
                        >
                            Clear
                        </button>
                    </div>

                    <div className="max-h-60 overflow-auto p-2">
                        {options.map((opt) => {
                            const checked = draft.includes(opt);
                            return (
                                <label
                                    key={String(opt)}
                                    className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => toggleOption(opt)}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-sm text-black dark:text-zinc-50">{String(opt)}</span>
                                </label>
                            );
                        })}
                    </div>

                    <div className="p-2 border-t border-zinc-100 dark:border-zinc-900">
                        <button
                            type="button"
                            onClick={apply}
                            className="w-full rounded-md bg-zinc-900 text-white dark:bg-zinc-50 dark:text-black py-2 text-sm"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * Desktop PriceDropdown
 * - Minimal trigger: PRICE ▾ / ▴
 * - Draft min/max inputs
 * - Applies only on Done
 * - Click outside closes WITHOUT applying
 */
function PriceDropdown({
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
}: {
    minPrice: string; // applied
    maxPrice: string; // applied
    setMinPrice: (v: string) => void;
    setMaxPrice: (v: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const [draftMin, setDraftMin] = useState(minPrice);
    const [draftMax, setDraftMax] = useState(maxPrice);
    const wrapRef = useRef<HTMLDivElement | null>(null);

    const isApplied = Boolean(minPrice.trim() || maxPrice.trim());

    useEffect(() => {
        if (open) {
            setDraftMin(minPrice);
            setDraftMax(maxPrice);
        }
    }, [open, minPrice, maxPrice]);

    useEffect(() => {
        function onDocMouseDown(e: MouseEvent) {
            if (!wrapRef.current) return;
            if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", onDocMouseDown);
        return () => document.removeEventListener("mousedown", onDocMouseDown);
    }, []);

    function clearDraft() {
        setDraftMin("");
        setDraftMax("");
    }

    function apply() {
        setMinPrice(draftMin);
        setMaxPrice(draftMax);
        setOpen(false);
    }

    return (
        <div ref={wrapRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((s) => !s)}
                className="flex items-center gap-2 text-sm tracking-wide text-black dark:text-zinc-50 hover:opacity-70"
            >
                <span className={isApplied ? "font-semibold" : ""}>Price</span>
                {open ? (
                    <ChevronUp className="h-4 w-4 opacity-70" />
                ) : (
                    <ChevronDown className="h-4 w-4 opacity-70" />
                )}
            </button>

            {open && (
                <div className="absolute z-30 mt-3 w-72 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-100 dark:border-zinc-900">
                        <div className="text-xs tracking-wide text-zinc-500">Price</div>
                        <button
                            type="button"
                            onClick={clearDraft}
                            className="text-xs text-zinc-600 dark:text-zinc-300 hover:underline"
                        >
                            Clear
                        </button>
                    </div>

                    <div className="p-3">
                        <div className="flex items-center gap-2">
                            <input
                                inputMode="numeric"
                                placeholder="Min"
                                value={draftMin}
                                onChange={(e) => setDraftMin(e.target.value)}
                                className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-black dark:text-zinc-50 outline-none placeholder:text-zinc-400"
                            />
                            <span className="text-zinc-400">–</span>
                            <input
                                inputMode="numeric"
                                placeholder="Max"
                                value={draftMax}
                                onChange={(e) => setDraftMax(e.target.value)}
                                className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-black dark:text-zinc-50 outline-none placeholder:text-zinc-400"
                            />
                        </div>
                    </div>

                    <div className="p-2 border-t border-zinc-100 dark:border-zinc-900">
                        <button
                            type="button"
                            onClick={apply}
                            className="w-full rounded-md bg-zinc-900 text-white dark:bg-zinc-50 dark:text-black py-2 text-sm"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/** Mobile helpers */
function MobileSection({
    title,
    open,
    onToggle,
    children,
}: {
    title: string;
    open: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="border-b border-zinc-200 dark:border-zinc-800">
            <button
                type="button"
                onClick={onToggle}
                className="w-full flex items-center justify-between py-4 text-left"
            >
                <span className="text-sm font-semibold text-black dark:text-zinc-50">{title}</span>
                {open ? (
                    <ChevronUp className="h-4 w-4 text-zinc-500" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-zinc-500" />
                )}
            </button>
            {open && <div className="pb-4">{children}</div>}
        </div>
    );
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

    // Sort is immediate on desktop; on mobile we draft it and apply on Apply
    const [sort, setSort] = useState<"Newest" | "PriceLow" | "PriceHigh">("Newest");

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

    /** ------------------ MOBILE DRAWER STATE (DRAFT) ------------------ */
    const [mobileOpen, setMobileOpen] = useState(false);

    const [mBrands, setMBrands] = useState<(string | number)[]>([]);
    const [mConditions, setMConditions] = useState<(string | number)[]>([]);
    const [mSizes, setMSizes] = useState<(string | number)[]>([]);
    const [mMinPrice, setMMinPrice] = useState("");
    const [mMaxPrice, setMMaxPrice] = useState("");
    const [mSort, setMSort] = useState<"Newest" | "PriceLow" | "PriceHigh">("Newest");

    // sections
    const [secBrand, setSecBrand] = useState(true);
    const [secCond, setSecCond] = useState(false);
    const [secSize, setSecSize] = useState(false);
    const [secPrice, setSecPrice] = useState(false);
    const [secSort, setSecSort] = useState(false);

    // when opening mobile drawer: copy APPLIED -> DRAFT
    useEffect(() => {
        if (!mobileOpen) return;
        setMBrands(brands);
        setMConditions(conditions);
        setMSizes(sizes);
        setMMinPrice(minPrice);
        setMMaxPrice(maxPrice);
        setMSort(sort);
    }, [mobileOpen, brands, conditions, sizes, minPrice, maxPrice, sort]);

    function mobileDiscardClose() {
        setMobileOpen(false); // drafts are discarded because we re-copy on open
    }

    function mobileApply() {
        setBrands(mBrands);
        setConditions(mConditions);
        setSizes(mSizes);
        setMinPrice(mMinPrice);
        setMaxPrice(mMaxPrice);
        setSort(mSort);
        setMobileOpen(false);
    }

    function toggleDraft(list: (string | number)[], setList: (v: (string | number)[]) => void, opt: string | number) {
        setList(list.includes(opt) ? list.filter((x) => x !== opt) : [...list, opt]);
    }

    const mobileAppliedCount = useMemo(() => {
        let count = 0;
        count += brands.length;
        count += conditions.length;
        count += sizes.length;
        if (minPrice.trim() || maxPrice.trim()) count += 1;
        return count;
    }, [brands, conditions, sizes, minPrice, maxPrice]);

    /** lock background scroll when drawer open */
    useEffect(() => {
        if (!mobileOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [mobileOpen]);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <main className="mx-auto w-full max-w-6xl pt-10 pb-20 px-4 sm:px-6 lg:px-8">
                {/* MOBILE TOP BAR */}
                <div className="mb-6 flex items-center gap-3 md:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileOpen(true)}
                        className="inline-flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2 text-sm text-black dark:text-zinc-50"
                    >
                        <span className="inline-flex items-center gap-2">
                            <SlidersHorizontal className="h-4 w-4" />
                            Filter{mobileAppliedCount ? ` (${mobileAppliedCount})` : ""}
                        </span>
                    </button>

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as any)}
                        className="ml-auto rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-black dark:text-zinc-50"
                    >
                        <option value="Newest">Sort: Newest</option>
                        <option value="PriceLow">Sort: Price Low → High</option>
                        <option value="PriceHigh">Sort: Price High → Low</option>
                    </select>
                </div>

                {/* DESKTOP FILTER ROW */}
                <div className="mb-6 hidden md:flex flex-wrap items-center gap-10">
                    <MultiSelect label="Brand" options={brandOptions} value={brands} onChange={setBrands} />
                    <MultiSelect label="Condition" options={conditionOptions} value={conditions} onChange={setConditions} />
                    <MultiSelect label="Size" options={sizeOptions} value={sizes} onChange={setSizes} />

                    <PriceDropdown
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        setMinPrice={setMinPrice}
                        setMaxPrice={setMaxPrice}
                    />

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as any)}
                        className="ml-auto rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-black dark:text-zinc-50"
                    >
                        <option value="Newest">Sort: Newest</option>
                        <option value="PriceLow">Sort: Price Low → High</option>
                        <option value="PriceHigh">Sort: Price High → Low</option>
                    </select>
                </div>

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
                                                <div className="text-sm text-zinc-600 dark:text-zinc-400">${p.price}</div>
                                            )}
                                        </div>
                                    </Link>
                                </ScrollFadeIn>
                            </li>
                        );
                    })}
                </ul>
            </main>

            {/* ------------------ MOBILE FILTER DRAWER (BOTTOM SHEET) ------------------ */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* backdrop */}
                    <button
                        type="button"
                        aria-label="Close filters"
                        onClick={mobileDiscardClose}
                        className="absolute inset-0 bg-black/40"
                    />

                    {/* sheet */}
                    <div className="absolute inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-2xl">
                        <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-200 dark:border-zinc-800">
                            <div className="text-sm font-semibold text-black dark:text-zinc-50">Filters</div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMBrands([]);
                                        setMConditions([]);
                                        setMSizes([]);
                                        setMMinPrice("");
                                        setMMaxPrice("");
                                        setMSort("Newest");
                                    }}
                                    className="text-sm underline text-zinc-700 dark:text-zinc-200"
                                >
                                    Clear
                                </button>
                                <button
                                    type="button"
                                    onClick={mobileDiscardClose}
                                    className="text-xl leading-none text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                                    aria-label="Close"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-auto px-4">
                            <MobileSection title="Brand" open={secBrand} onToggle={() => setSecBrand((s) => !s)}>
                                <div className="max-h-56 overflow-auto pr-1">
                                    {brandOptions.map((opt) => {
                                        const checked = mBrands.includes(opt);
                                        return (
                                            <label key={String(opt)} className="flex items-center gap-3 py-2">
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() => toggleDraft(mBrands, setMBrands, opt)}
                                                    className="h-4 w-4"
                                                />
                                                <span className="text-sm text-black dark:text-zinc-50">{String(opt)}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </MobileSection>

                            <MobileSection
                                title="Condition"
                                open={secCond}
                                onToggle={() => setSecCond((s) => !s)}
                            >
                                <div className="max-h-56 overflow-auto pr-1">
                                    {conditionOptions.map((opt) => {
                                        const checked = mConditions.includes(opt);
                                        return (
                                            <label key={String(opt)} className="flex items-center gap-3 py-2">
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() => toggleDraft(mConditions, setMConditions, opt)}
                                                    className="h-4 w-4"
                                                />
                                                <span className="text-sm text-black dark:text-zinc-50">{String(opt)}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </MobileSection>

                            <MobileSection title="Size" open={secSize} onToggle={() => setSecSize((s) => !s)}>
                                <div className="max-h-56 overflow-auto pr-1">
                                    {sizeOptions.map((opt) => {
                                        const checked = mSizes.includes(opt);
                                        return (
                                            <label key={String(opt)} className="flex items-center gap-3 py-2">
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() => toggleDraft(mSizes, setMSizes, opt)}
                                                    className="h-4 w-4"
                                                />
                                                <span className="text-sm text-black dark:text-zinc-50">{String(opt)}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </MobileSection>

                            <MobileSection title="Price" open={secPrice} onToggle={() => setSecPrice((s) => !s)}>
                                <div className="flex items-center gap-2">
                                    <input
                                        inputMode="numeric"
                                        placeholder="Min"
                                        value={mMinPrice}
                                        onChange={(e) => setMMinPrice(e.target.value)}
                                        className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-black dark:text-zinc-50 outline-none placeholder:text-zinc-400"
                                    />
                                    <span className="text-zinc-400">–</span>
                                    <input
                                        inputMode="numeric"
                                        placeholder="Max"
                                        value={mMaxPrice}
                                        onChange={(e) => setMMaxPrice(e.target.value)}
                                        className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-black dark:text-zinc-50 outline-none placeholder:text-zinc-400"
                                    />
                                </div>
                            </MobileSection>

                            <MobileSection title="Sort" open={secSort} onToggle={() => setSecSort((s) => !s)}>
                                <div className="flex flex-col gap-2">
                                    {[
                                        { key: "Newest", label: "Newest" },
                                        { key: "PriceLow", label: "Price Low → High" },
                                        { key: "PriceHigh", label: "Price High → Low" },
                                    ].map((o) => (
                                        <label key={o.key} className="flex items-center gap-3 py-2">
                                            <input
                                                type="radio"
                                                name="mobileSort"
                                                checked={mSort === (o.key as any)}
                                                onChange={() => setMSort(o.key as any)}
                                                className="h-4 w-4"
                                            />
                                            <span className="text-sm text-black dark:text-zinc-50">{o.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </MobileSection>
                        </div>

                        {/* bottom actions */}
                        <div className="px-4 py-4 border-t border-zinc-200 dark:border-zinc-800 flex gap-3">
                            <button
                                type="button"
                                onClick={mobileDiscardClose}
                                className="w-1/2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-3 text-sm text-black dark:text-zinc-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={mobileApply}
                                className="w-1/2 rounded-md bg-zinc-900 text-white dark:bg-zinc-50 dark:text-black py-3 text-sm"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
