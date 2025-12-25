// app/products/components/Chip.tsx
"use client";

import { X } from "lucide-react";

export default function Chip({
  text,
  onRemove,
}: {
  text: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 dark:bg-zinc-900 px-4 py-2 text-sm text-black dark:text-zinc-50">
      {text}
      <button
        type="button"
        onClick={onRemove}
        className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        aria-label={`Remove ${text}`}
      >
        <X className="h-4 w-4" />
      </button>
    </span>
  );
}
