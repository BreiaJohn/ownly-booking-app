import { useNavigate } from "react-router-dom"
import logo from "../assets/ownly-logo.png"

function Navbar() {
  const navigate = useNavigate()

  return (
<nav className="flex items-center justify-between px-6 md:px-10 py-3 bg-[#0F172A] border-b border-[#1E293B] relative">
      <div className="flex items-center gap-3">

  <img
  src={logo}
  alt="Ownly Logo"
  className="h-30 w-auto object-contain"
/>
</div>

     <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6 text-xs md:text-sm">
       <a
  href="#features"
  className="px-4 py-2 rounded-xl text-[#64748B] hover:text-white hover:bg-white/5 hover:bg-[#111827]/5 transition-all duration-300"
>
  Features
</a>

        <a href="#pricing" className="px-4 py-2 rounded-xl text-[#64748B] hover:text-white hover:bg-white/5 hover:bg-[#111827]/5 transition-all duration-300">
          Pricing
        </a>

        <a href="#testimonials" className="px-4 py-2 rounded-xl text-[#64748B] hover:text-white hover:bg-white/5 hover:bg-[#111827]/5 transition-all duration-300">
          Reviews
        </a>
      </div>

    </nav>
  )
}

export default Navbar