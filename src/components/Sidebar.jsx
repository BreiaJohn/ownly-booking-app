import { NavLink, useNavigate } from "react-router-dom"
import logo from "../assets/ownly-logo.png"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { supabase } from "../lib/supabase"
import toast from "react-hot-toast"

function Sidebar({ closeSidebar }) {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { session } = useAuth()

  const user = session?.user

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Ownly User"

  const initials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const handleNavigation = () => {
    closeSidebar?.()
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      toast.error("Unable to log out")
      console.log(error)
      return
    }

    toast.success("Logged out successfully")
    closeSidebar?.()
    navigate("/")
  }

  const linkClass = ({ isActive }) =>
    `rounded-2xl px-4 py-3 font-medium transition-all duration-300 ${
      isActive
        ? "border border-[var(--ownly-border)] bg-[var(--ownly-surface-soft)] text-[var(--ownly-text)] shadow-sm"
        : "text-[var(--ownly-muted)] hover:translate-x-1 hover:bg-[var(--ownly-surface-soft)] hover:text-[var(--ownly-text)]"
    }`

  return (
    <aside className="flex h-[100dvh] w-72 flex-col overflow-y-auto border-r border-[var(--ownly-border)] bg-[var(--ownly-surface)] px-6 py-6 text-[var(--ownly-text)] transition-colors duration-200">
      <div className="mb-8 flex items-center justify-center md:justify-start">
        <button
          type="button"
          onClick={() => {
            navigate("/")
            closeSidebar?.()
          }}
          aria-label="Go to Ownly home page"
          className="transition duration-300 hover:scale-105"
        >
          <img
            src={logo}
            alt="Ownly Logo"
            className="h-20 w-auto object-contain"
          />
        </button>
      </div>

      <nav className="flex flex-col gap-3 text-sm">
        <NavLink
          to="/dashboard"
          className={linkClass}
          onClick={handleNavigation}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/bookings"
          className={linkClass}
          onClick={handleNavigation}
        >
          Bookings
        </NavLink>

        <NavLink
          to="/clients"
          className={linkClass}
          onClick={handleNavigation}
        >
          Clients
        </NavLink>

        <NavLink
          to="/payments"
          className={linkClass}
          onClick={handleNavigation}
        >
          Payments
        </NavLink>

        <NavLink
          to="/settings"
          className={linkClass}
          onClick={handleNavigation}
        >
          Settings
        </NavLink>
      </nav>

      <div className="mt-auto space-y-4 border-t border-[var(--ownly-border)] bg-[var(--ownly-surface)] pb-4 pt-5">
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--ownly-border)] bg-[var(--ownly-surface-soft)] px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-[var(--ownly-text)]">
  {theme === "dark" ? "Dark Mode" : "Light Mode"}
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

        <div className="rounded-2xl border border-[var(--ownly-border)] bg-[var(--ownly-surface-soft)] p-4">
          <div className="mb-4 flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 font-semibold text-[var(--ownly-primary)]">
              {initials}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--ownly-text)]">
                {displayName}
              </p>

              <p className="truncate text-xs text-[var(--ownly-muted)]">
                {user?.email || "Business owner"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600 transition hover:border-red-500/40 hover:bg-red-500/20 dark:text-red-300"
          >
            Log Out
          </button>
        </div>

        <p className="text-center text-xs text-[var(--ownly-subtle)]">
          Ownly v1.0
        </p>
      </div>
    </aside>
  )
}

export default Sidebar