
import Image from "next/image";
import Link from "next/link"
import Instagram from "@/images/instagram.jpg"

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
                            <li><Link href="/" className="hover:text-white">Sneakers</Link></li>
                            <li><Link href="/clothing" className="hover:text-white">Clothing</Link></li>
                            <li><Link href="/accessories" className="hover:text-white">Accessories</Link></li>
                        </ul>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-white">Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="/" className="hover:text-white">Search</Link></li>
                            <li><Link href="/policies" className="hover:text-white">FAQs</Link></li>
                            <li><Link href="/About us" className="hover:text-white">About</Link></li>
                            <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-white">Contact Us</h3>
                        <p className="mb-6">jeffreyli0312@gmail.com</p>

                        <a
                            href="https://instagram.com/jflkicks"
                            target="_blank"
                            className="inline-flex items-center gap-3 rounded-full bg-zinc-900 px-6 py-3 text-white hover:bg-zinc-800 transition"
                        >
                            <span className="text-lg">
                                <Image
                                    src={Instagram}
                                    alt="Instagram"
                                    width={20}
                                    height={20}
                                />
                            </span>
                            jflkicks
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
