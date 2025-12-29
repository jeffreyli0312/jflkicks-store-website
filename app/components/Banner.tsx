
// This file is a client side file
"use client";

import Image from "next/image";
import Search from "@/images/search_icon.jpg"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export default function Banner() {
  const pathname = usePathname();

  // mobile slide-out
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // desktop expand search
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);

  const mobileInputRef = useRef<HTMLInputElement | null>(null);
  const desktopInputRef = useRef<HTMLInputElement | null>(null);

  const isSneakers = useMemo(() => {
    if (!pathname) return true;      // 👈 default on first load
    return pathname === "/";
  }, [pathname]);

  const isAccessories = useMemo(
    () => pathname === "/accessories" || pathname.startsWith("/accessories/"),
    [pathname]
  );
  const isClothing = useMemo(
    () => pathname === "/clothing" || pathname.startsWith("/clothing/"),
    [pathname]
  );

  useEffect(() => {
    if (mobileSearchOpen) {
      const t = setTimeout(() => mobileInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [mobileSearchOpen]);

  useEffect(() => {
    if (desktopSearchOpen) {
      const t = setTimeout(() => desktopInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [desktopSearchOpen]);

  return (
    <header className="w-full bg-black border-b border-zinc-800">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Top row */}
        <div className="relative flex items-center justify-center">
          {/* Center logo */}
          <Link href="/" className="flex justify-center">
            <Image src="/icon.png" alt="My Store" width={200} height={200} priority />
          </Link>

          {/* Desktop minimal icon -> expands */}
          {/* Desktop minimal icon -> expands */}
          <div className="absolute right-0 hidden md:flex items-center">
            <div
              className={`flex items-center transition-all duration-300 overflow-hidden ${desktopSearchOpen
                ? "w-72 px-3 bg-black border border-zinc-700 rounded-full"
                : "w-10"
                }`}
            >
              <button
                type="button"
                onClick={() => setDesktopSearchOpen((v) => !v)}
                className={`h-10 w-10 flex items-center justify-center transition ${desktopSearchOpen
                  ? "hover:bg-zinc-900 rounded-full"
                  : "hover:bg-zinc-900 rounded-full"
                  }`}
                aria-label={desktopSearchOpen ? "Close search" : "Open search"}
              >
                <Image src={Search} alt="Search" width={20} height={20} />
              </button>

              <input
                ref={desktopInputRef}
                type="text"
                placeholder="Search"
                className={`ml-2 bg-black text-white text-sm placeholder-zinc-400 outline-none transition-all duration-200 ${desktopSearchOpen
                  ? "w-full opacity-100"
                  : "w-0 opacity-0"
                  }`}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setDesktopSearchOpen(false);
                }}
              />
            </div>
          </div>


          {/* Mobile search button (opens slide-out) */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(true)}
            className="absolute right-0 md:hidden rounded-md border border-zinc-700 px-4 py-2 text-sm text-white hover:bg-zinc-900 transition"
            aria-label="Open search"
          >
            Search
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-2 flex justify-center gap-6 sm:gap-10 md:gap-16 text-lg sm:text-xl md:text-2xl font-semibold text-zinc-300">


          <Link
            href="/"
            className={`pb-3 transition ${isSneakers
              ? "text-white border-b-2 border-white"
              : "border-b-2 border-transparent hover:text-white"
              }`}
          >
            Sneakers
          </Link>

          <Link
            href="/clothing"
            className={`pb-3 transition ${isClothing
              ? "text-white border-b-2 border-white"
              : "border-b-2 border-transparent hover:text-white"
              }`}
          >
            Clothing
          </Link>

          <Link
            href="/accessories"
            className={`pb-3 transition ${isAccessories
              ? "text-white border-b-2 border-white"
              : "border-b-2 border-transparent hover:text-white"
              }`}
          >
            Accessories
          </Link>
        </nav>
      </div>

      {/* Mobile slide-out search */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${mobileSearchOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMobileSearchOpen(false)}
          className={`absolute inset-0 bg-black/60 transition-opacity ${mobileSearchOpen ? "opacity-100" : "opacity-0"
            }`}
        />

        {/* Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-black shadow-xl transition-transform ${mobileSearchOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <div className="text-white font-medium text-lg">Search</div>
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 transition"
            >
              Close
            </button>
          </div>

          <div className="p-5">
            <input
              ref={mobileInputRef}
              type="text"
              placeholder="Search products…"
              className="w-full rounded-md border border-zinc-700 bg-black px-4 py-2 text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-white"
              onKeyDown={(e) => {
                if (e.key === "Escape") setMobileSearchOpen(false);
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
