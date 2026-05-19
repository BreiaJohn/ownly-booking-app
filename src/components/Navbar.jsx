import { useNavigate } from "react-router-dom"

function Navbar() {
  const navigate = useNavigate()

  return (
   <nav className="flex flex-col md:flex-row items-center justify-between px-6 md:px-8 py-6 max-w-7xl mx-auto gap-4">
      <h1 className="text-3xl font-bold text-[#1E1E1E] tracking-wide">
        OWNLY
      </h1>

     <div className="flex items-center gap-4 text-sm md:text-base flex-wrap">
        <a href="#features" className="hover:text-[#8B6F5A] transition">
          Features
        </a>

        <a href="#pricing" className="hover:text-[#8B6F5A] transition">
          Pricing
        </a>

        <a href="#testimonials" className="hover:text-[#8B6F5A] transition">
          Reviews
        </a>
      </div>

      <button
        onClick={() => navigate("/login")}
        className="bg-[#8B6F5A] text-white px-5 py-2 rounded-xl hover:opacity-90 transition"
      >
        Login
      </button>
    </nav>
  )
}

export default Navbar