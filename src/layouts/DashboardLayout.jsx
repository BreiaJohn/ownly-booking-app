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
    <div className="relative flex min-h-screen bg-[#0F172A] overflow-x-hidden">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-6 left-4 z-50 md:hidden bg-[#020617] border border-[#334155] text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
      >
        ☰
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:sticky md:top-0 inset-y-0 left-0 z-50 transform transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      {/* Main content */}
<main className="flex-1 min-h-screen overflow-y-auto overflow-x-hidden px-4 py-6 pb-28 md:p-6">
  {children}
</main>

{showScrollTop && (
  <button
    onClick={() =>
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
    className="fixed bottom-6 right-4 z-50 md:hidden bg-[#020617] border border-[#334155] text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
  >
    ↑
  </button>
)}
    </div>
  )
}

export default DashboardLayout