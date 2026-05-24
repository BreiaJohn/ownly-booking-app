import { Link } from "react-router-dom"
import logo from "../assets/ownly-logo.png"

function Sidebar() {
  return (
<aside className="w-full md:w-72 h-screen overflow-y-auto bg-[#111827] border-b md:border-r border-[#1E293B] px-6 py-8">
  <div className="mb-14 flex items-center justify-center md:justify-start">
  <img
    src={logo}
    alt="Ownly Logo"
    className="h-24 w-auto object-contain"
  />
</div>
      <nav className="flex flex-col gap-3 text-sm pb-20">
  <Link
    to="/dashboard"
    className="px-4 py-3 rounded-2xl text-white bg-white/5 border border-[#334155] hover:bg-white/10 transition-all duration-200"
  >
    Dashboard
  </Link>

  <Link
    to="/bookings"
    className="px-4 py-3 rounded-2xl text-[#94A3B8] hover:text-white hover:bg-white/5 hover:translate-x-1 hover:shadow-lg transition-all duration-300"
  >
    Bookings
  </Link>

  <Link
    to="/clients"
    className="px-4 py-3 rounded-2xl text-[#94A3B8] hover:text-white hover:bg-white/5 hover:translate-x-1 hover:shadow-lg transition-all duration-300"
  >
    Clients
  </Link>

  <Link
    to="/payments"
    className="px-4 py-3 rounded-2xl text-[#94A3B8] hover:text-white hover:bg-white/5 hover:translate-x-1 hover:shadow-lg transition-all duration-300"
  >
    Payments
  </Link>

  <Link
    to="/settings"
    className="px-4 py-3 rounded-2xl text-[#94A3B8] hover:text-white hover:bg-white/5 hover:translate-x-1 hover:shadow-lg transition-all duration-300"
  >
    Settings
  </Link>
</nav>
    </aside>
  )
}

export default Sidebar