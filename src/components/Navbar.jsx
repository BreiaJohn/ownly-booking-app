import { useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../assets/ownly-logo.png"

function Navbar() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-[#0F172A] border-b border-[#1E293B] px-6 md:px-16 relative z-50">
      <div className="relative flex items-center justify-center md:justify-between h-28">
        <div
          onClick={() => navigate("/")}
          className="flex items-center justify-center cursor-pointer"
        >
          <img
            src={logo}
            alt="Ownly"
            className="h-24 md:h-32 w-auto"
          />
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-[#94A3B8]">
          <a href="#features" className="hover:text-white transition">
            Features
          </a>

          <a href="#pricing" className="hover:text-white transition">
            Pricing
          </a>

          <a href="#testimonials" className="hover:text-white transition">
            Reviews
          </a>

          <button
            onClick={() => navigate("/login")}
            className="border border-blue-500/30 bg-blue-500/10 text-blue-300 px-4 py-2 rounded-full text-sm transition-all duration-300 hover:bg-blue-500/20 hover:border-blue-400/50 hover:text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]"
          >
            Login
          </button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden absolute right-0 text-white text-3xl"
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-6 pb-6 text-[#94A3B8] text-sm text-center">
          <a href="#features" onClick={() => setMenuOpen(false)}>
            Features
          </a>

          <a href="#pricing" onClick={() => setMenuOpen(false)}>
            Pricing
          </a>

          <a href="#testimonials" onClick={() => setMenuOpen(false)}>
            Reviews
          </a>

          <button
            onClick={() => {
              navigate("/login")
              setMenuOpen(false)
            }}
            className="border border-blue-500/30 bg-blue-500/10 text-blue-300 py-3 rounded-full text-sm transition-all duration-300 hover:bg-blue-500/20 hover:text-white"
          >
            Login
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar