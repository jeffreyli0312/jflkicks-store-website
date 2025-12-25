// app/products/components/PriceDropdown.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function PriceDropdown({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
}: {
  minPrice: string;
  maxPrice: string;
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
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
