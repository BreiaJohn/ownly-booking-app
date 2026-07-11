import { NavLink } from "react-router-dom"
import logo from "../assets/ownly-logo.png"
import { useTheme } from "../context/ThemeContext"

function Sidebar() {
  const { theme, toggleTheme } = useTheme()

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

      <nav className="flex flex-col gap-3 text-sm">
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
      </className=>

      <div className="mt-auto border-t border-[var(--ownly-border)] pt-6">
  <div className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--ownly-border)] bg-[var(--ownly-surface-soft)] px-4 py-3">
    <div>
      <p className="text-sm font-semibold text-[var(--ownly-text)]">
        Dark Mode
      </p>

      <p className="text-xs text-[var(--ownly-muted)]">
        Change appearance
      </p>
    </div>

    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      aria-pressed={theme === "dark"}
      className={`relative h-8 w-14 shrink-0 rounded-full transition-colors duration-200 ${
        theme === "dark" ? "bg-blue-500" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-200 ${
          theme === "dark" ? "left-7" : "left-1"
        }`}
      />
    </button>
  </div>
</div>

    </aside>
  )
}

export default Sidebar