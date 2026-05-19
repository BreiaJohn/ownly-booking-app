import Sidebar from "../components/Sidebar"

function DashboardLayout({ children }) {
  return (
   <div className="flex flex-col md:flex-row bg-[#F7F4EF] min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 md:p-10">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout