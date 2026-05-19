import { Link } from "react-router-dom"

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-[#E7E1D9] p-6">
      <h1 className="text-3xl font-bold text-[#1E1E1E] mb-12">
        OWNLY
      </h1>

      <nav className="flex flex-col gap-4 text-[#8B6F5A] font-medium">
        <Link to="/dashboard" className="hover:text-[#1E1E1E] transition">
          Dashboard
        </Link>

        <Link to="/bookings" className="hover:text-[#1E1E1E] transition">
          Bookings
        </Link>

        <Link to="/clients" className="hover:text-[#1E1E1E] transition">
          Clients
        </Link>

        <Link to="/payments" className="hover:text-[#1E1E1E] transition">
          Payments
        </Link>

        <Link to="/settings" className="hover:text-[#1E1E1E] transition">
          Settings
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar