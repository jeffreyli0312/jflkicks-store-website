import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-950 text-zinc-400">
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Top grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Shop */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Shop</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white">Shop All</Link></li>
              <li><Link href="/" className="hover:text-white">Popular</Link></li>
              <li><Link href="/" className="hover:text-white">Jordans</Link></li>
              <li><Link href="/" className="hover:text-white">Nike</Link></li>
              <li><Link href="/" className="hover:text-white">Yeezy</Link></li>
              <li><Link href="/clothing" className="hover:text-white">Clothing</Link></li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white">Search</Link></li>
              <li><Link href="/" className="hover:text-white">Sizing Chart</Link></li>
              <li><Link href="/" className="hover:text-white">Return Policy</Link></li>
              <li><Link href="/" className="hover:text-white">Shipping Policy</Link></li>
              <li><Link href="/" className="hover:text-white">FAQs</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Contact Us</h3>
            <p className="mb-6">jeffreyli0312@gmail.com</p>

            <a
              href="https://instagram.com"
              target="_blank"
              className="inline-flex items-center gap-3 rounded-full bg-zinc-900 px-6 py-3 text-white hover:bg-zinc-800 transition"
            >
              <span className="text-lg">📷</span>
              Find us @jflkicks
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-6 text-sm md:flex-row">
          <p>© {new Date().getFullYear()} JFLKicks</p>
          <Link href="/terms" className="hover:text-white">
            Terms and Policies
          </Link>
        </div>
      </div>
    </footer>
  )
}
