import { NavLink } from "react-router-dom"
import logo from "../assets/ownly-logo.png"

function Sidebar() {
  const linkClass = ({ isActive }) =>
    `rounded-2xl px-4 py-3 transition-all duration-300 ${
      isActive
        ? "border border-[var(--ownly-border)] bg-[var(--ownly-surface-soft)] text-[var(--ownly-text)] shadow-sm"
        : "text-[var(--ownly-muted)] hover:translate-x-1 hover:bg-[var(--ownly-surface-soft)] hover:text-[var(--ownly-text)] hover:shadow-lg"
    }`

  return (
    <aside className="flex h-screen w-72 flex-col overflow-y-auto border-r border-[var(--ownly-border)] bg-[var(--ownly-surface)] px-6 py-8 text-[var(--ownly-text)] transition-colors duration-200">
      <div className="mb-14 flex items-center justify-center md:justify-start">
        <img
          src={logo}
          alt="Ownly Logo"
          className="h-24 w-auto object-contain"
        />
      </div>

      <nav className="flex flex-col gap-3 pb-20 text-sm">
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/bookings" className={linkClass}>
          Bookings
        </NavLink>

        <NavLink to="/clients" className={linkClass}>
          Clients
        </NavLink>

        <NavLink to="/payments" className={linkClass}>
          Payments
        </NavLink>

        <NavLink to="/settings" className={linkClass}>
          Settings
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar