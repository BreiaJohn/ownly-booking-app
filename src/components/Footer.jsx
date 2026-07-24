import Logo from "./Logo"

function Footer() {
  return (
    <footer className="border-t border-[#334155] bg-[#020617]">
      <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">

        <div className="flex items-center gap-3">
  <Logo className="h-10 w-auto" />

  <div>
    <h2 className="text-white font-semibold">
      Yorly
    </h2>

    <p className="text-xs text-[#94A3B8]">
      Own your bookings. Own your business.
    </p>
  </div>
</div>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-3 py-1 rounded-full">
            Booking Platform
          </span>

          <span className="text-xs bg-green-500/10 text-green-300 border border-green-500/20 px-3 py-1 rounded-full">
            Live
          </span>
        </div>

        <p className="text-sm text-[#94A3B8]">
          © 2026 Yorly. All rights reserved.
        </p>

      </div>
    </footer>
  )
}

export default Footer
