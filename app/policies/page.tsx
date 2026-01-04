// app/policies/page.tsx (or wherever your route lives)

export default function PoliciesPage() {
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
              Policies & FAQs
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
              Clear condition standards, transparent meetups, and straightforward support.
              If anything is unclear, feel free to reach out and we’ll be happy to help.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-90 transition dark:bg-white dark:text-black"
              >
                Shop Sneakers
              </a>
              <a
                href="/about"
                className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-5 py-3 text-sm font-medium text-black hover:bg-zinc-100 transition dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
              >
                About JFLKicks
              </a>
            </div>
          </div>

          {/* QUICK HIGHLIGHTS */}
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Authenticity First",
                desc: "We sell authentic pairs only and ensure clear listing details.",
              },
              {
                title: "Condition Clarity",
                desc: "Photos + honest notes so you know what you’re buying.",
              },
              {
                title: "Meetups & Handoff",
                desc: "Transparent meetup process and quick communication.",
              },
              {
                title: "Questions?",
                desc: "Message anytime before purchase for sizing or inquiries.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="text-base font-semibold text-black dark:text-white">
                  {item.title}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* POLICIES */}
        <section className="mt-14 sm:mt-20">
          <h2 className="text-2xl sm:text-3xl font-semibold text-black dark:text-white">
            Policies
          </h2>

          <div className="mt-8 grid gap-4">
            {[
              {
                title: "Authenticity",
                body: [
                  "All items are guaranteed 100% Authentic.",
                ],
              },
              {
                title: "Condition Standards",
                body: [
                  "Condition is shown through photos.",
                  "Wear may be present on pre-owned pairs. Please message for clarification (creases, outsole wear, discoloration, etc.) before purchasing.",
                ],
              },
              {
                title: "Meetups & Local Handoff",
                body: [
                  "Meetup location and timing are coordinated and confirmed before meeting. For safety and clarity, we keep handoffs simple and transparent.",
                ],
              },
              {
                title: "Shipping",
                body: [
                  "All packages come with a tracking number, and cost is confirmed prior to purchase. Timelines can vary by carrier and location.",
                ],
              },
              {
                title: "Returns & Exchanges",
                body: [
                  "All sales are final unless otherwise stated on the product listing.",
                  "As items are limited and condition-based, we encourage you to ask questions and review photos carefully before purchasing.",
                ],
              },
              {
                title: "Pricing & Holds",
                body: [
                  "Prices reflect condition, market value, and availability.",
                  "Holds are not guaranteed, and may require a deposit or firm pickup time (case-by-case).",
                ],
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="text-lg font-semibold text-black dark:text-white">
                  {item.title}
                </div>
                <div className="mt-3 space-y-2">
                  {item.body.map((line, idx) => (
                    <p
                      key={idx}
                      className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* OPTIONAL NOTE */}
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="text-sm font-semibold text-black dark:text-white">
              Note
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              Policies may be updated occasionally to improve clarity and customer experience.
              Always refer to the current page wording before purchasing.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-14 sm:mt-20">
          <h2 className="text-2xl sm:text-3xl font-semibold text-black dark:text-white">
            FAQs
          </h2>

          <div className="mt-8 grid gap-4">
            {[
              {
                q: "Are your sneakers authentic?",
                a: "All items we sell are 100% authentic and we provide clear photos and listing details. For extra verification or more pictures before buying, message us and we’ll help!",
              },
              {
                q: "How do I know the condition?",
                a: "Condition is shown through photos in the listing. If you’re unsure about a specific detail (creases, outsole wear, box condition), feel free to reach out.",
              },
              {
                q: "Do you offer returns?",
                a: "All sales are final unless otherwise stated on the listing. If there’s an issue like receiving the wrong item or a major undisclosed flaw, contact us promptly so we can make things right.",
              },
              {
                q: "Do you ship?",
                a: "Yes, all packages are shipped with tracking. Cost and expected timeline is confirmed before payment.",
              },
              {
                q: "Where are you located?",
                a: "We are based in Waterloo, and meet around the GTA area. Meetup details are confirmed during inquiry, we’ll always confirm a clear time and location before meeting.",
              },
              {
                q: "Can you hold an item for me?",
                a: "Holds aren’t guaranteed. Holds may request a deposit.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="text-base font-semibold text-black dark:text-white">
                  {item.q}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-14 sm:mt-20">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-2xl sm:text-3xl font-semibold text-black dark:text-white">
              Still have a question?
            </h2>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href="https://instagram.com/jflkicks"
                className="inline-flex items-center justify-center rounded-md bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-90 transition dark:bg-white dark:text-black"
              >
                Contact Us
              </a>
              <a
                href="/about"
                className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-5 py-3 text-sm font-medium text-black hover:bg-zinc-100 transition dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
