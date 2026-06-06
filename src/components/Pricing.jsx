function Pricing() {
  return (
    <section id="pricing" className="bg-[#020617] py-16">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <span className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-4 py-2 rounded-full">
            Simple Pricing
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold text-white">
            Start with one clean setup
          </h2>

          <p className="mt-4 text-[#94A3B8] text-lg">
            A polished booking platform without monthly platform fees.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[36px] p-8 md:p-10 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <p className="text-[#94A3B8] mb-3">
                Starter Platform
              </p>

              <div className="flex items-end gap-3">
                <h3 className="text-6xl font-bold text-white">
                  $499
                </h3>

                <span className="text-[#94A3B8] mb-2">
                  one-time
                </span>
              </div>
            </div>

            <button className="bg-[#94A3B8] text-white px-8 py-4 rounded-2xl text-lg hover:opacity-90 transition">
              Get Started
            </button>
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-4 text-white">
            {[
              "Booking platform setup",
              "Mobile responsive design",
              "Client booking management",
              "Payment integration",
              "Portfolio showcase",
              "Optional support available",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 bg-[#0F172A] border border-[#334155] rounded-2xl px-4 py-3"
              >
                <span className="text-green-300">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing