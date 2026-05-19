import { Link } from "react-router-dom"

function Sidebar() {
  return (
    <aside className="w-full md:w-64 bg-white border-b md:border-r border-[#E7E1D9] p-4 md:p-6">
      <h1 className="text-3xl font-bold text-[#1E1E1E] mb-12">
        OWNLY
      </h1>

      <nav className="flex flex-row md:flex-col flex-wrap gap-4 text-[#8B6F5A] font-medium">
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