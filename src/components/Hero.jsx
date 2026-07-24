import DashboardPreview from "./DashboardPreview"

function Hero() {
  return (
    <section className="w-full bg-[#0F172A] text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="uppercase tracking-[0.3em] text-[#94A3B8] font-medium mb-6 text-sm">
            Modern Booking Platform
          </p>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-3xl">
  Book with ease.
  <br />
  Grow with Yorly.
</h1>

          <p className="mt-8 text-lg text-[#94A3B8] max-w-xl leading-relaxed">
            A premium booking experience for independent professionals to manage clients,
            accept payments, and showcase their work under their own brand.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button className="border border-blue-500/30 bg-blue-500/10 text-blue-300 px-8 py-4 rounded-2xl hover:bg-blue-500/20 transition">
              Get Started
            </button>

            <button className="border border-[#334155] text-white px-8 py-4 rounded-2xl text-lg hover:border-[#94A3B8]transition">
              View Demo
            </button>
          </div>
        </div>

        <div className="w-full">
          <DashboardPreview />
        </div>
      </div>
    </section>
  )
}

export default Hero