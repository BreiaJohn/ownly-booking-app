import Sidebar from "../components/Sidebar"

function DashboardLayout({ children }) {
  return (
    <div className="flex bg-[#0F172A] h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 h-screen overflow-y-auto p-4 md:p-10">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout