import { Link } from "react-router-dom"
import Logo from "../components/Logo"

export default function Beta() {
  const idealBusinesses = [
    "Hair stylists and barbers",
    "Nail and lash technicians",
    "Tattoo artists",
    "Photographers",
    "Personal trainers",
    "Pet groomers",
    "Other appointment-based businesses",
  ]

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/">
            <Logo className="h-12 w-auto" />
          </Link>

          <Link
            to="/login"
            className="text-sm font-semibold text-slate-700 transition hover:text-blue-600 dark:text-slate-300"
          >
            Log in
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-20 text-center sm:py-28">
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            Only 3 beta spots remaining
          </span>

          <h1 className="mt-7 text-4xl font-bold tracking-tight sm:text-6xl">
            Help shape the future of{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Yorly
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            We’re inviting a small group of service-based business owners to
            test Yorly with real clients and help us create a simpler, more
            powerful booking experience.
          </p>

          <a
            href="#apply"
            className="mt-9 inline-flex rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition hover:scale-[1.02]"
          >
            Apply to become a beta tester
          </a>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-slate-50 px-6 py-20 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="font-semibold text-blue-600">Founding beta members</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              What you’ll receive
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Lifetime free access",
                description:
                  "Use Yorly without a monthly subscription as one of our first beta businesses.",
              },
              {
                title: "Direct founder support",
                description:
                  "Get personal help with setup, onboarding, and any questions you have.",
              },
              {
                title: "Help shape Yorly",
                description:
                  "Your feedback will directly influence the tools and features we build next.",
              },
            ].map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl dark:bg-blue-950">
                  ✓
                </div>

                <h3 className="text-xl font-bold">{benefit.title}</h3>

                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Who it is for */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-semibold text-purple-600">Who we’re looking for</p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Business owners who book clients by appointment
            </h2>

            <p className="mt-5 leading-8 text-slate-600 dark:text-slate-300">
              The best beta testers are willing to set up their real services,
              share their Yorly booking link with clients, and provide honest
              feedback about the experience.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7 dark:border-slate-800 dark:bg-slate-900">
            <ul className="grid gap-4 sm:grid-cols-2">
              {idealBusinesses.map((business) => (
                <li key={business} className="flex items-start gap-3">
                  <span className="mt-1 text-blue-500">●</span>
                  <span className="font-medium">{business}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Expectations */}
      <section className="bg-slate-50 px-6 py-20 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              What we ask from beta testers
            </h2>

            <p className="mt-4 text-slate-600 dark:text-slate-300">
              You don’t need to be technical. We only ask that you actively use
              Yorly and share honest feedback.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {[
              "Complete your business profile",
              "Add your real services and availability",
              "Share your booking link with clients",
              "Report anything confusing or broken",
              "Provide feedback about your experience",
              "Allow us to improve the platform during beta",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm dark:bg-slate-950"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                  ✓
                </span>
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application */}
      <section id="apply" className="px-6 py-24">
        <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-blue-600 to-purple-700 px-7 py-14 text-center text-white shadow-xl sm:px-14">
          <p className="font-semibold text-blue-100">
            Three spots are currently available
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Ready to grow with Yorly?
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-blue-50">
            Send us a message with your name, business name, type of service,
            and why you’re interested in joining the beta.
          </p>

          <a
            href="mailto:Breiamj4@gmail.com?subject=Yorly Beta Tester Application"
            className="mt-8 inline-flex rounded-xl bg-white px-8 py-4 font-bold text-blue-700 transition hover:scale-[1.02]"
          >
            Apply for the Yorly beta
          </a>

          <p className="mt-5 text-sm text-blue-100">
            Applications are reviewed personally.
          </p>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-6 py-8 text-center text-sm text-slate-500 dark:border-slate-800">
        © {new Date().getFullYear()} Yorly. Built for business.
      </footer>
    </main>
  )
}