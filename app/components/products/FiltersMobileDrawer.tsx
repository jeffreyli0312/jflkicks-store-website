// app/products/components/FiltersMobileDrawer.tsx
"use client";

import { X } from "lucide-react";
import MobileSection from "./MobileSection";

export default function FiltersMobileDrawer({
    mobileOpen,
    mobileAnimateIn,
    closeMobileDrawerDiscard,
    mobileApply,
    clearMobileDraft,
    CLOSE_MS, // not used here but kept if you want it later
    brandOptions,
    conditionOptions,
    sizeOptions,
    mBrands,
    setMBrands,
    mConditions,
    setMConditions,
    mSizes,
    setMSizes,
    mMinPrice,
    setMMinPrice,
    mMaxPrice,
    setMMaxPrice,
    mSort,
    setMSort,
    secBrand,
    setSecBrand,
    secCond,
    setSecCond,
    secSize,
    setSecSize,
    secPrice,
    setSecPrice,
    secSort,
    setSecSort,
}: any) {
    if (!mobileOpen) return null;

    function toggleDraft(
        list: (string | number)[],
        setList: (v: (string | number)[]) => void,
        opt: string | number
    ) {
        setList(list.includes(opt) ? list.filter((x) => x !== opt) : [...list, opt]);
    }

    return (
        <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <button
                type="button"
                aria-label="Close filters"
                onClick={closeMobileDrawerDiscard}
                className={[
                    "absolute inset-0 bg-black/40 transition-opacity duration-200 motion-reduce:transition-none",
                    mobileAnimateIn ? "opacity-100" : "opacity-0",
                ].join(" ")}
            />

            {/* Sheet */}
            <div
                className={[
                    "absolute inset-x-0 bottom-0 h-[85vh] rounded-t-2xl bg-white dark:bg-zinc-950",
                    "border-t border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col",
                    "transform transition-transform duration-200 ease-out will-change-transform motion-reduce:transition-none",
                    mobileAnimateIn ? "translate-y-0" : "translate-y-full",
                ].join(" ")}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="text-sm font-semibold text-black dark:text-zinc-50">
                        Filters
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={clearMobileDraft}
                            className="text-sm underline text-zinc-700 dark:text-zinc-200 transition-colors duration-150 hover:text-black dark:hover:text-white"
                        >
                            Clear
                        </button>

                        <button
                            type="button"
                            onClick={closeMobileDrawerDiscard}
                            className="rounded-md p-1 text-zinc-500 transition-colors duration-150 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Scroll area */}
                <div className="flex-1 min-h-0 overflow-y-auto px-4">
                    <MobileSection
                        title="Brand"
                        open={secBrand}
                        onToggle={() => setSecBrand((s: boolean) => !s)}
                    >
                        <div className="max-h-64 overflow-y-auto pr-1">
                            {brandOptions.map((opt: any) => {
                                const checked = mBrands.includes(opt);
                                return (
                                    <label
                                        key={String(opt)}
                                        className="flex items-center gap-3 py-2 rounded-md transition-colors duration-150 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggleDraft(mBrands, setMBrands, opt)}
                                            className="h-4 w-4"
                                        />
                                        <span className="text-sm text-black dark:text-zinc-50">
                                            {String(opt)}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </MobileSection>

                    <MobileSection
                        title="Condition"
                        open={secCond}
                        onToggle={() => setSecCond((s: boolean) => !s)}
                    >
                        <div className="max-h-64 overflow-y-auto pr-1">
                            {conditionOptions.map((opt: any) => {
                                const checked = mConditions.includes(opt);
                                return (
                                    <label
                                        key={String(opt)}
                                        className="flex items-center gap-3 py-2 rounded-md transition-colors duration-150 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggleDraft(mConditions, setMConditions, opt)}
                                            className="h-4 w-4"
                                        />
                                        <span className="text-sm text-black dark:text-zinc-50">
                                            {String(opt)}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </MobileSection>

                    <MobileSection
                        title="Size"
                        open={secSize}
                        onToggle={() => setSecSize((s: boolean) => !s)}
                    >
                        <div className="max-h-64 overflow-y-auto pr-1">
                            {sizeOptions.map((opt: any) => {
                                const checked = mSizes.includes(opt);
                                return (
                                    <label
                                        key={String(opt)}
                                        className="flex items-center gap-3 py-2 rounded-md transition-colors duration-150 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggleDraft(mSizes, setMSizes, opt)}
                                            className="h-4 w-4"
                                        />
                                        <span className="text-sm text-black dark:text-zinc-50">
                                            {String(opt)}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </MobileSection>

                    <MobileSection
                        title="Price"
                        open={secPrice}
                        onToggle={() => setSecPrice((s: boolean) => !s)}
                    >
                        <div className="flex items-center gap-2">
                            <input
                                inputMode="numeric"
                                placeholder="Min"
                                value={mMinPrice}
                                onChange={(e: any) => setMMinPrice(e.target.value)}
                                className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-black dark:text-zinc-50 outline-none placeholder:text-zinc-400 transition-colors duration-150 focus:border-black dark:focus:border-white"
                            />
                            <span className="text-zinc-400">–</span>
                            <input
                                inputMode="numeric"
                                placeholder="Max"
                                value={mMaxPrice}
                                onChange={(e: any) => setMMaxPrice(e.target.value)}
                                className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-black dark:text-zinc-50 outline-none placeholder:text-zinc-400 transition-colors duration-150 focus:border-black dark:focus:border-white"
                            />
                        </div>
                    </MobileSection>

                    <MobileSection
                        title="Sort"
                        open={secSort}
                        onToggle={() => setSecSort((s: boolean) => !s)}
                    >
                        <div className="flex flex-col gap-2">
                            {[
                                { key: "Newest", label: "Newest" },
                                { key: "Oldest", label: "Oldest" },
                                { key: "PriceLow", label: "Price Low → High" },
                                { key: "PriceHigh", label: "Price High → Low" },
                            ].map((o) => (
                                <label
                                    key={o.key}
                                    className="flex items-center gap-3 py-2 rounded-md transition-colors duration-150 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name="mobileSort"
                                        checked={mSort === o.key}
                                        onChange={() => setMSort(o.key)}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-sm text-black dark:text-zinc-50">
                                        {o.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </MobileSection>

                    <div className="h-4" />
                </div>

                {/* Footer */}
                <div className="px-4 py-4 border-t border-zinc-200 dark:border-zinc-800 flex gap-3">
                    <button
                        type="button"
                        onClick={closeMobileDrawerDiscard}
                        className="w-1/2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-3 text-sm text-black dark:text-zinc-50 transition-all duration-150 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={mobileApply}
                        className="w-1/2 rounded-md bg-zinc-900 text-white dark:bg-zinc-50 dark:text-black py-3 text-sm transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
}
