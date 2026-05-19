import DashboardPreview from "./DashboardPreview"

function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-24 grid lg:grid-cols-2 gap-16 items-center">
      <div>
        <p className="uppercase tracking-[0.3em] text-[#8B6F5A] font-medium mb-6">
          Modern Booking Platform
        </p>

        <h1 className="text-6xl lg:text-7xl font-bold leading-tight text-[#1E1E1E]">
          Own your bookings.
          <br />
          Own your business.
        </h1>

        <p className="mt-8 text-xl text-[#8B6F5A] max-w-xl leading-relaxed">
          A premium booking experience for independent professionals to manage clients,
          accept payments, and showcase their work under their own brand.
        </p>
 <div className="mt-10 flex flex-wrap gap-4">
          <button className="bg-[#8B6F5A] text-white px-8 py-4 rounded-2xl text-lg hover:opacity-90 transition">
            Get Started
          </button>

          <button className="border border-[#8B6F5A] text-[#8B6F5A] px-8 py-4 rounded-2xl text-lg hover:bg-[#8B6F5A] hover:text-white transition">
            View Demo
          </button>
        </div>
      </div>

      <DashboardPreview />
    </section>
  )
}

export default Hero