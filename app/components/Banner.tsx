"use client";

import Image from "next/image";
import SearchIcon from "@/images/search_icon.jpg";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export default function Banner() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();

  // drawer
  const [open, setOpen] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const CLOSE_MS = 220;

  const inputRef = useRef<HTMLInputElement | null>(null);

  // draft text (doesn't filter yet)
  const [draft, setDraft] = useState("");

  // keep input synced with current URL ?q= when opening
  useEffect(() => {
    if (!open) return;
    const q = params.get("q") ?? "";
    setDraft(q);
  }, [open, params]);

  function openSearch() {
    setOpen(true);
    setAnimateIn(false);
  }

  function closeSearch() {
    setAnimateIn(false);
    window.setTimeout(() => setOpen(false), CLOSE_MS);
  }

  // animate + focus
  useEffect(() => {
    if (!open) return;
    const t1 = window.setTimeout(() => setAnimateIn(true), 10);
    const t2 = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [open]);

  function applySearch() {
    const q = draft.trim();

    // build next query params (preserve existing params if you want)
    const next = new URLSearchParams(params.toString());
    if (q) next.set("q", q);
    else next.delete("q");

    // IMPORTANT: push to the page that contains ProductsClient
    // If ProductsClient is on "/", use "/"
    // If it’s on "/products", use "/products"
    router.push(`/?${next.toString()}`);
    closeSearch();
  }

  return (
    <header className="w-full bg-black border-b border-zinc-800">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="relative flex items-center justify-center">
          <Link href="/" className="flex justify-center">
            <Image src="/icon.png" alt="My Store" width={200} height={200} priority />
          </Link>

          {/* Search icon (always) */}
          <button
            type="button"
            onClick={openSearch}
            className="absolute right-0 inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-zinc-900 transition"
            aria-label="Open search"
          >
            <Image src={SearchIcon} alt="Search" width={20} height={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-2 flex justify-center gap-6 sm:gap-10 md:gap-16 text-lg sm:text-xl md:text-2xl font-semibold text-zinc-300">
          <Link
            href="/"
            className={`pb-3 transition ${pathname === "/"
              ? "text-white border-b-2 border-white"
              : "border-b-2 border-transparent hover:text-white"
              }`}
          >
            Sneakers
          </Link>

          <Link
            href="/clothing"
            className={`pb-3 transition ${pathname === "/clothing" || pathname.startsWith("/clothing/")
              ? "text-white border-b-2 border-white"
              : "border-b-2 border-transparent hover:text-white"
              }`}
          >
            Clothing
          </Link>

          <Link
            href="/accessories"
            className={`pb-3 transition ${pathname === "/accessories" || pathname.startsWith("/accessories/")
              ? "text-white border-b-2 border-white"
              : "border-b-2 border-transparent hover:text-white"
              }`}
          >
            Accessories
          </Link>
        </nav>


      </div>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close search"
            onClick={closeSearch}
            className={[
              "absolute inset-0 bg-black/60 transition-opacity duration-200",
              animateIn ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />

          <div
            className={[
              "absolute right-0 top-0 h-full w-[85%] max-w-sm bg-black shadow-xl",
              "border-l border-zinc-800 flex flex-col",
              "transform transition-transform duration-200 ease-out",
              animateIn ? "translate-x-0" : "translate-x-full",
            ].join(" ")}
          >
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <div className="text-white font-medium text-lg">Search</div>
              <button
                type="button"
                onClick={closeSearch}
                className="rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 transition"
              >
                Close
              </button>
            </div>

            <div className="p-5 space-y-3">
              <input
                ref={inputRef}
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-md border border-zinc-700 bg-black px-4 py-2 text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter") applySearch();
                  if (e.key === "Escape") closeSearch();
                }}
              />

              <button
                type="button"
                onClick={applySearch}
                className="w-full rounded-md bg-white text-black py-2 text-sm hover:opacity-90 transition"
              >
                Search
              </button>

              {!!(params.get("q") ?? "").trim() && (
                <button
                  type="button"
                  onClick={() => {
                    setDraft("");
                    const next = new URLSearchParams(params.toString());
                    next.delete("q");
                    router.push(`/?${next.toString()}`);
                    closeSearch();
                  }}
                  className="w-full rounded-md border border-zinc-700 text-white py-2 text-sm hover:bg-zinc-900 transition"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
