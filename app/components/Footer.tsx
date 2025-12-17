
export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-zinc-500">
        © {new Date().getFullYear()} My Store. All rights reserved.
      </div>
    </footer>
  )
}
