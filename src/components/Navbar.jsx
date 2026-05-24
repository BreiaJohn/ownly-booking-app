import { useNavigate } from "react-router-dom"
import logo from "../assets/ownly-logo.png"

function Navbar() {
  const navigate = useNavigate()

  return (
<nav className="hidden md:flex items-center justify-between h-24 px-16 bg-[#0F172A] border-b border-[#1E293B]">
  <img
    src={logo}
    alt="Ownly Logo"
    className="h-20 w-auto object-contain"
  />

  <div className="flex items-center gap-12 text-sm text-[#94A3B8]">
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
</nav>
  )
}

export default Navbar