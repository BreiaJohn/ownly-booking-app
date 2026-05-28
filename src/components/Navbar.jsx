import { useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../assets/ownly-logo.png"

function Navbar() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-[#0F172A] border-b border-[#1E293B] px-6 md:px-16 relative z-50">
      
      <div className="flex items-center justify-between h-24">
        
        <img
          src={logo}
          alt="Ownly Logo"
          className="h-14 w-auto object-contain cursor-pointer"
          onClick={() => navigate("/")}
        />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-12 text-sm text-[#94A3B8]">
          <a href="#features" className="hover:text-white transition">
            Features
          </a>

          <a href="#pricing" className="hover:text-white transition">
            Pricing
          </a>

          <a href="#testimonials" className="hover:text-white transition">
            Reviews
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-3xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-6 pb-6 text-[#94A3B8] text-sm">
          
          <a
            href="#features"
            className="hover:text-white transition"
            onClick={() => setMenuOpen(false)}
          >
            Features
          </a>

          <a
            href="#pricing"
            className="hover:text-white transition"
            onClick={() => setMenuOpen(false)}
          >
            Pricing
          </a>

          <a
            href="#testimonials"
            className="hover:text-white transition"
            onClick={() => setMenuOpen(false)}
          >
            Reviews
          </a>
        </div>
      )}
    </nav>
  )
}

export default Navbar