import Sidebar from "../components/Sidebar"
import MobileNavbar from "../components/MobileNavbar"

function DashboardLayout({ children }) {
  return (
    <div className="bg-[#0F172A] min-h-screen">
      <MobileNavbar />

      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 md:p-10">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout