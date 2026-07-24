import { useEffect, useState } from "react"

function Testimonials() {
  const reviews = [
    {
      quote:
        "Yorly completely changed how I manage my appointments and clients.",
      name: "Jasmine Carter",
      role: "Beauty Professional",
    },
    {
      quote:
        "It finally feels like I have my own professional booking platform.",
      name: "Alyssa Williams",
      role: "Creative Entrepreneur",
    },
    {
      quote:
        "My clients can book easily, and I look more professional online.",
      name: "Monique Davis",
      role: "Independent Stylist",
    },
  ]

  const [activeReview, setActiveReview] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReview((current) =>
        current === reviews.length - 1 ? 0 : current + 1
      )
    }, 3500)

    return () => clearInterval(interval)
  }, [reviews.length])

  const review = reviews[activeReview]

  return (
    <section id="testimonials" className="bg-[#020617] py-14 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 px-6 py-8 text-center">
          <div className="absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -right-20 top-0 h-52 w-52 rounded-full bg-green-500/20 blur-3xl" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              ☆ Client Testimonials
            </span>

            <div className="mt-6 text-xl text-yellow-400">
              ★★★★★
            </div>

            <p className="mx-auto mt-6 max-w-2xl text-2xl md:text-3xl font-semibold leading-relaxed text-white transition-all duration-500">
              “{review.quote}”
            </p>

            <div className="mx-auto mt-6 h-px max-w-xs bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

            <div className="mt-6">
              <p className="font-semibold text-white">
                {review.name}
              </p>

              <p className="mt-1 text-sm text-[#94A3B8]">
                {review.role}
              </p>
            </div>

            <div className="mt-4 flex justify-center gap-3">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveReview(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
  activeReview === index
    ? "w-10 bg-blue-500/10 border border-blue-500/30"
    : "w-3 bg-[#1E293B] border border-[#334155]"
}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials