// app/products/components/FiltersDesktop.tsx
"use client";

import MultiSelect from "./MultiSelect";
import PriceDropdown from "./PriceDropdown";

export default function FiltersDesktop({
  brandOptions,
  conditionOptions,
  sizeOptions,
  brands,
  setBrands,
  conditions,
  setConditions,
  sizes,
  setSizes,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  sort,
  setSort,
}: {
  brandOptions: (string | number)[];
  conditionOptions: (string | number)[];
  sizeOptions: (string | number)[];
  brands: (string | number)[];
  setBrands: (v: (string | number)[]) => void;
  conditions: (string | number)[];
  setConditions: (v: (string | number)[]) => void;
  sizes: (string | number)[];
  setSizes: (v: (string | number)[]) => void;
  minPrice: string;
  maxPrice: string;
  setMinPrice: (v: string) => void;
  setMaxPrice: (v: string) => void;
  sort: "Newest" | "Oldest" | "PriceLow" | "PriceHigh";
  setSort: (v: "Newest" | "Oldest" | "PriceLow" | "PriceHigh") => void;
}) {
  return (
    <div className="mb-4 hidden md:flex flex-wrap items-center gap-10">
      <MultiSelect
        label="Brand"
        options={brandOptions}
        value={brands}
        onChange={setBrands}
      />
      <MultiSelect
        label="Condition"
        options={conditionOptions}
        value={conditions}
        onChange={setConditions}
      />
      <MultiSelect
        label="Size"
        options={sizeOptions}
        value={sizes}
        onChange={setSizes}
      />

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
        <option value="Newest">Sort: Newest to Oldest</option>
        <option value="Oldest">Sort: Oldest to Newest</option>
        <option value="PriceLow">Sort: Price Low to High</option>
        <option value="PriceHigh">Sort: Price High to Low</option>
      </select>
    </div>
  );
}
