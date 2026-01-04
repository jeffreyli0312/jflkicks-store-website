
import Image from "next/image";
import AboutUsCollection from "@/images/About_us_Collection.jpeg"
import AboutUsPhoto from "@/images/About_us_Photo.jpg"
// jflkicks-store-website\images\About_us_Photo.JPG


export default function AboutPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pt-8 pb-14 sm:pt-12 sm:pb-20">
                {/* HERO */}
                <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
                    <div>
                        <p className="text-sm font-medium tracking-wide text-zinc-600 dark:text-zinc-400">
                            JFLKicks
                        </p>
                        <h1 className="mt-2 text-4xl sm:text-5xl font-semibold tracking-tight text-black dark:text-zinc-50">
                            Sneakers you’ll actually want to wear.
                        </h1>
                        <p className="mt-5 text-base sm:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                            JFLKicks is a curated sneaker shop built around authenticity, clean
                            condition standards, and a smooth buying experience. Every pair is
                            carefully selected, photographed, and listed with clear details so
                            you know exactly what you’re getting. We are currently located in Waterloo, Ontario.
                        </p>

                        <div className="mt-7 flex flex-col sm:flex-row gap-3">
                            <a
                                href="/"
                                className="inline-flex items-center justify-center rounded-md bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-90 transition dark:bg-white dark:text-black"
                            >
                                Shop Sneakers
                            </a>
                            <a
                                href="/policies"
                                className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-5 py-3 text-sm font-medium text-black hover:bg-zinc-100 transition dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
                            >
                                View Policies
                            </a>
                        </div>
                    </div>

                    {/* HERO PHOTO */}
                    <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                            <Image
                                src={AboutUsCollection}
                                alt="Sneaker Collection"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                </section>

                {/* TRUST / STATS */}
                <section className="mt-14 sm:mt-20">
                    <div className="grid gap-4 sm:grid-cols-3">
                        {[
                            {
                                title: "Curated Sneakers",
                                desc: "Only pairs we’d wear ourselves — selected for condition and model.",
                            },
                            {
                                title: "Clear Condition",
                                desc: "Clear photos and descriptions so there are no surprises.",
                            },
                            {
                                title: "Fast Communication",
                                desc: "Quick replies for availability, orders, and all other inquiries.",
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                            >
                                <div className="text-lg font-semibold text-black dark:text-white">
                                    {item.title}
                                </div>
                                <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* OUR STORY */}
                <section className="mt-14 sm:mt-20">
                    <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-black dark:text-white">
                                Our story
                            </h2>
                            <p className="mt-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                JFLKicks started as a side project built from genuine interest in
                                authentic sneakers and the joy of finding the right pair for the
                                right price. Over time, it grew into a focused storefront with one
                                goal: Make sneaker buying simple, transparent, and trustworthy.
                            </p>
                            <p className="mt-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                We prioritize product presentation, consistent listing
                                standards, and responsiveness. Whether you’re a collector or
                                just looking for your next pair, the experience should feel
                                smooth and confident.
                            </p>
                        </div>

                        {/* STORY PHOTO PLACEHOLDER */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                            <div className="aspect-[16/10] w-full rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                                    <Image
                                        src={AboutUsPhoto}
                                        alt="Sneaker Collection"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* HOW WE WORK */}
                <section className="mt-14 sm:mt-20">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-black dark:text-white">
                        How we work
                    </h2>

                    <div className="mt-8 grid gap-6 lg:grid-cols-3">
                        {[
                            {
                                step: "01",
                                title: "Source & verify",
                                desc: "We source authentic pairs and ensure condition standards.",
                            },
                            {
                                step: "02",
                                title: "Photograph & list",
                                desc: "Clear photos, key details, and honest condition listings.",
                            },
                            {
                                step: "03",
                                title: "Pack & hand off",
                                desc: "Secure packaging and trasnparent meetups so you’re never guessing.",
                            },
                        ].map((item) => (
                            <div
                                key={item.step}
                                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                            >
                                <div className="text-xs font-semibold tracking-widest text-zinc-500 dark:text-zinc-400">
                                    {item.step}
                                </div>
                                <div className="mt-2 text-lg font-semibold text-black dark:text-white">
                                    {item.title}
                                </div>
                                <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* GALLERY PLACEHOLDERS */}
                {/* <section className="mt-14 sm:mt-20">
                    <div className="flex items-end justify-between gap-6">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-black dark:text-white">
                                A look inside
                            </h2>
                            <p className="mt-2 text-zinc-700 dark:text-zinc-300">
                                Add photos of inventory, packaging, or recent drops.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                            >
                                <div className="aspect-square w-full rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                            Photo Placeholder
                                        </div>
                                        <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                                            Gallery image {idx + 1}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section> */}

                {/* CTA */}
                <section className="mt-14 sm:mt-20">
                    <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <h2 className="text-2xl sm:text-3xl font-semibold text-black dark:text-white">
                            Ready to find your next pair?
                        </h2>
                        <p className="mt-3 text-zinc-700 dark:text-zinc-300">
                            Browse the latest sneakers, or read policies for shipping and returns.
                        </p>

                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <a
                                href="/"
                                className="inline-flex items-center justify-center rounded-md bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-90 transition dark:bg-white dark:text-black"
                            >
                                Shop Sneakers
                            </a>
                            <a
                                href="/policies"
                                className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-5 py-3 text-sm font-medium text-black hover:bg-zinc-100 transition dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
                            >
                                Policies
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
