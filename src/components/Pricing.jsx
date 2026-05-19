function Pricing() {
  return (
    <section
      id="pricing"
      className="max-w-7xl mx-auto px-8 py-24"
    >
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-[#1E1E1E]">
          Simple Pricing
        </h2>

        <p className="mt-4 text-[#8B6F5A] text-lg">
          One-time setup. Optional ongoing support.
        </p>
      </div>
 <div className="max-w-xl mx-auto bg-white rounded-[40px] p-12 border border-[#E7E1D9] shadow-sm text-center">
        <p className="uppercase tracking-[0.3em] text-[#8B6F5A] mb-6">
          Starter Platform
        </p>

        <h3 className="text-6xl font-bold text-[#1E1E1E]">
          $499
        </h3>

        <p className="mt-4 text-[#8B6F5A]">
          One-time setup fee
        </p>

        <ul className="mt-10 space-y-4 text-left text-[#1E1E1E]">
          <li>✔ Booking platform setup</li>
          <li>✔ Mobile responsive design</li>
 <li>✔ Client booking management</li>
          <li>✔ Payment integration</li>
          <li>✔ Portfolio showcase</li>
        </ul>

        <button className="mt-10 w-full bg-[#8B6F5A] text-white py-4 rounded-2xl text-lg hover:opacity-90 transition">
          Get Started
        </button>
      </div>
    </section>
  )
}

export default Pricing