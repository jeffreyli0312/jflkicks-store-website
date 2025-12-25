// app/products/components/MultiSelect.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function MultiSelect({
  label,
  options,
  value,
  onChange,
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
    setDraft((prev) =>
      prev.includes(opt) ? prev.filter((v) => v !== opt) : [...prev, opt]
    );
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
                  <span className="text-sm text-black dark:text-zinc-50">
                    {String(opt)}
                  </span>
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
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
