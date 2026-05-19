function Features() {
  const features = [
    {
      title: "Booking Management",
      description: "Manage appointments, cancellations, and availability in one place.",
    },
    {
      title: "Secure Payments",
      description: "Accept deposits and payments directly through your platform.",
    },
    {
      title: "Portfolio Showcase",
      description: "Display your work beautifully and attract more clients.",
    },
  ]

  return (
    <section
      id="features"
      className="max-w-7xl mx-auto px-8 py-24"
    >
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-[#1E1E1E]">
   Everything you need
        </h2>

        <p className="mt-4 text-[#8B6F5A] text-lg">
          Built for modern independent businesses.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-3xl shadow-sm border border-[#E7E1D9]"
     >
   <div className="w-14 h-14 rounded-2xl bg-[#F7F4EF] mb-6"></div>

            <h3 className="text-2xl font-semibold text-[#1E1E1E] mb-4">
              {feature.title}
            </h3>

            <p className="text-[#8B6F5A] leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}


export default Features