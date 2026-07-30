import { Link } from "react-router-dom"
import Logo from "../components/Logo"

import dashboardScreenshot from "../assets/screenshots/dashboard.png"
import bookingScreenshot from "../assets/screenshots/booking-page.png"
import mobileScreenshot from "../assets/screenshots/mobile-booking.png"

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
   <main className="min-h-screen bg-[#020817] text-white">
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
         href="mailto:hello@yorly.co?subject=Yorly%20Beta%20Tester%20Application"
            className="mt-9 inline-flex rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition hover:scale-[1.02]"
          >
            Apply to become a beta tester
          </a>
        </div>
      </section>
{/* Product preview */}
<section className="relative overflow-hidden px-6 pb-24 pt-16">
  <div className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

  <div className="relative mx-auto max-w-7xl">
    <div className="mx-auto max-w-3xl text-center">
      <span className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-400">
        🚀 Now accepting our first 5 founding businesses
      </span>

      <h2 className="mt-7 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
        Everything you need to manage{" "}
        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          your bookings
        </span>
      </h2>

      <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
        Give your clients an easy way to book while keeping your appointments,
        services, clients, and payments organized.
      </p>
    </div>

    <div className="mt-14 space-y-6">
      {/* Dashboard */}
      <article
  className="
    overflow-hidden
    rounded-[2rem]
    border
    border-slate-700/70
    bg-[#0d172b]
    shadow-2xl
    shadow-black/20
    transition-all
    duration-300
    hover:-translate-y-1
    hover:border-blue-500/40
    hover:shadow-[0_20px_60px_rgba(59,130,246,.15)]
  "
>
        <div className="p-5">
          <div className="overflow-hidden rounded-[1.4rem] bg-[#050b18]">
            <img
              src={dashboardScreenshot}
              alt="Yorly business dashboard"
              className="block h-auto w-full"
            />
          </div>
        </div>

        <div className="grid gap-5 px-7 pb-9 pt-4 md:grid-cols-[auto_1fr] md:items-start md:px-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-700 text-xl">
            ▣
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-purple-400">
              Run your business
            </p>

            <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              Manage everything from one dashboard
            </h3>

            <p className="mt-3 max-w-3xl leading-7 text-slate-400">
              Keep track of appointments, clients, payments, services, and
              availability without jumping between multiple tools.
            </p>
          </div>
        </div>
      </article>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        {/* Desktop booking */}
        <article
  className="
    overflow-hidden
    rounded-[2rem]
    border
    border-slate-700/70
    bg-[#0d172b]
    shadow-2xl
    shadow-black/20
    transition-all
    duration-300
    hover:-translate-y-1
    hover:border-blue-500/40
    hover:shadow-[0_20px_60px_rgba(59,130,246,.15)]
  "
>
          <div className="p-5">
            <div className="overflow-hidden rounded-[1.4rem] bg-[#050b18]">
              <img
                src={bookingScreenshot}
                alt="Yorly desktop booking page"
                className="block h-auto w-full"
              />
            </div>
          </div>

          <div className="px-7 pb-9 pt-4 sm:px-9">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-700 text-xl">
              ◫
            </div>

            <p className="text-sm font-bold uppercase tracking-wider text-purple-400">
              Share one link
            </p>

            <h3 className="mt-2 text-2xl font-bold text-white">
              Let clients book in seconds
            </h3>

            <p className="mt-3 max-w-xl leading-7 text-slate-400">
              Clients can choose a service, select an available time, and submit
              their booking without the back-and-forth.
            </p>
          </div>
        </article>

        {/* Mobile booking */}
       <article
  className="
    overflow-hidden
    rounded-[2rem]
    border
    border-slate-700/70
    bg-[#0d172b]
    shadow-2xl
    shadow-black/20
    transition-all
    duration-300
    hover:-translate-y-1
    hover:border-blue-500/40
    hover:shadow-[0_20px_60px_rgba(59,130,246,.15)]
  "
>
          <div className="p-5">
            <div className="flex justify-center overflow-hidden rounded-[1.4rem] bg-[#050b18] px-6 pt-6">
              <img
                src={mobileScreenshot}
                alt="Yorly mobile booking experience"
                className="block max-h-[620px] w-auto max-w-full"
              />
            </div>
          </div>

          <div className="px-7 pb-9 pt-4">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-xl">
              ▯
            </div>

            <p className="text-sm font-bold uppercase tracking-wider text-blue-400">
              Mobile ready
            </p>

            <h3 className="mt-2 text-2xl font-bold text-white">
              Built for clients on the go
            </h3>

            <p className="mt-3 leading-7 text-slate-400">
              Yorly gives clients a smooth booking experience from their phone,
              tablet, or computer.
            </p>
          </div>
        </article>
      </div>
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
  href="mailto:hello@yorly.co?subject=Yorly%20Beta%20Tester%20Application"
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