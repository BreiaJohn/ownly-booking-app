import { Link } from "react-router-dom"

function Sidebar() {
  return (
    <aside className="w-full md:w-64 bg-[#111827] border-b md:border-r border-[#1E293B] p-4 md:p-6">
      <h1 className="text-3xl font-bold text-white mb-12">
        OWNLY
      </h1>

      <nav className="flex flex-row md:flex-col flex-wrap gap-4 text-[#8B6F5A] font-medium">
        <Link to="/dashboard" className="hover:text-white transition">
          Dashboard
        </Link>

        <Link to="/bookings" className="hover:text-white transition">
          Bookings
        </Link>

        <Link to="/clients" className="hover:text-white transition">
          Clients
        </Link>

        <Link to="/payments" className="hover:text-white transition">
          Payments
        </Link>

        <Link to="/settings" className="hover:text-white transition">
          Settings
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar