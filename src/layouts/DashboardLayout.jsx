import { useState, useEffect } from "react"
import Sidebar from "../components/Sidebar"

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="relative flex min-h-screen overflow-x-hidden bg-[var(--ownly-background)] text-[var(--ownly-text)] transition-colors duration-200">
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open navigation menu"
        className="fixed bottom-6 left-4 z-50 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--ownly-border)] bg-[var(--ownly-surface)] text-[var(--ownly-text)] shadow-lg transition-colors duration-200 md:hidden"
      >
        ☰
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:sticky md:top-0 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <main className="min-h-screen min-w-0 flex-1 overflow-x-hidden bg-[var(--ownly-background)] px-4 pb-28 pt-8 transition-colors duration-200 md:p-6">
        <div className="w-full max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>

      {showScrollTop && (
        <button
          type="button"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          aria-label="Scroll to top"
          className="fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--ownly-border)] bg-[var(--ownly-surface)] text-[var(--ownly-text)] shadow-lg transition-colors duration-200 md:hidden"
        >
          ↑
        </button>
      )}
    </div>
  )
}

export default DashboardLayout