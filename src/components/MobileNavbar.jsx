import { useState } from "react"
import { Link } from "react-router-dom"
import logo from "../assets/ownly-logo.png"

function MobileNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <div className="md:hidden sticky top-0 z-50 bg-[#111827]/90 backdrop-blur-xl border-b border-[#1E293B] px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => setMenuOpen(true)}
          className="text-3xl text-white"
        >
          ☰
        </button>

        <img
          src={logo}
          alt="Ownly Logo"
          className="h-14 w-auto object-contain"
        />

        <div className="w-12 h-12 rounded-full bg-[#A68A72] flex items-center justify-center text-white font-semibold">
          BJ
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-[999] md:hidden">
          <div
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/50"
          />

          <div className="relative w-72 h-full bg-[#111827] border-r border-[#1E293B] px-6 py-8">
            <button
              onClick={() => setMenuOpen(false)}
              className="text-white text-2xl mb-8"
            >
              ×
            </button>

            <img
              src={logo}
              alt="Ownly Logo"
              className="h-20 w-auto object-contain mb-10"
            />

            <nav className="flex flex-col gap-4 text-sm">
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-2xl text-white bg-white/5 border border-[#334155]">
                Dashboard
              </Link>

              <Link to="/bookings" onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-2xl text-[#94A3B8] hover:text-white hover:bg-white/5">
                Bookings
              </Link>

              <Link to="/clients" onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-2xl text-[#94A3B8] hover:text-white hover:bg-white/5">
                Clients
              </Link>

              <Link to="/payments" onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-2xl text-[#94A3B8] hover:text-white hover:bg-white/5">
                Payments
              </Link>

              <Link to="/settings" onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-2xl text-[#94A3B8] hover:text-white hover:bg-white/5">
                Settings
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export default MobileNavbar