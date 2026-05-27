import { useEffect, useState } from "react"
import DashboardLayout from "../layouts/DashboardLayout"
import { supabase } from "../lib/supabase"


function Clients() {
  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)


  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("date", { ascending: false })

    if (error) {
      console.log(error)
      return
    }

    const groupedClients = Object.values(
      data.reduce((acc, booking) => {
        const name = booking.client_name || "Unknown Client"

        if (!acc[name]) {
          acc[name] = {
            name,
            phone: booking.phone,
            email: booking.email,
            totalBookings: 0,
            lastAppointment: booking.date,
            services: [],
            bookings: [],
          }
        }

        acc[name].totalBookings += 1
        acc[name].bookings.push(booking)

        if (booking.service && !acc[name].services.includes(booking.service)) {
          acc[name].services.push(booking.service)
        }

        return acc
      }, {})
    )

    setClients(groupedClients)
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0F172A] text-white">
        <h1 className="text-3xl font-semibold mb-2">
          Clients
        </h1>

        <p className="text-[#94A3B8] mb-8">
          View your client list and booking history.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {clients.map((client) => (
            <button
              key={client.name}
              onClick={() => setSelectedClient(client)}
              className="text-left bg-white/5 border border-[#334155] rounded-3xl p-6 hover:border-[#A68A72] hover:bg-white/10 transition duration-300"
            >
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full bg-[#111827] border border-[#334155] flex items-center justify-center text-3xl font-semibold text-white">
                  {getInitials(client.name)}
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    {client.name}
                  </h2>

                  <p className="text-[#94A3B8] text-lg mt-1">
                    {client.totalBookings} booking
                    {client.totalBookings !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {selectedClient && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-[#0F172A] border border-[#334155] rounded-3xl shadow-xl w-full max-w-2xl p-6">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#111827] border border-[#334155] flex items-center justify-center text-2xl font-semibold text-white">
                    {getInitials(selectedClient.name)}
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedClient.name}
                    </h2>

                    <p className="text-[#94A3B8]">
                      {selectedClient.totalBookings} booking
                      {selectedClient.totalBookings !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedClient(null)}
                  className="text-[#94A3B8] hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 border border-[#334155] rounded-2xl p-4">
                  <p className="text-[#94A3B8] text-sm">Phone</p>
                  <p className="text-white mt-1">
                    {selectedClient.phone || "No phone"}
                  </p>
                </div>

                <div className="bg-white/5 border border-[#334155] rounded-2xl p-4">
                  <p className="text-[#94A3B8] text-sm">Email</p>
                  <p className="text-white mt-1">
                    {selectedClient.email || "No email"}
                  </p>
                </div>

                <div className="bg-white/5 border border-[#334155] rounded-2xl p-4">
                  <p className="text-[#94A3B8] text-sm">Last Visit</p>
                  <p className="text-white mt-1">
                    {selectedClient.lastAppointment || "No date"}
                  </p>
                </div>

                <div className="bg-white/5 border border-[#334155] rounded-2xl p-4">
                  <p className="text-[#94A3B8] text-sm">Services</p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedClient.services.length > 0 ? (
                      selectedClient.services.map((service) => (
                        <span
                          key={service}
                          className="bg-purple-500/20 text-purple-200 border border-purple-400/20 px-3 py-1 rounded-full text-sm"
                        >
                          {service}
                        </span>
                      ))
                    ) : (
                      <p className="text-white">No services</p>
                    )}
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-3">
                Booking History
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {selectedClient.bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white/5 border border-[#334155] rounded-2xl p-4 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="font-medium">
                        {booking.service || "Service"}
                      </p>

                      <p className="text-[#94A3B8] text-sm mt-1">
                        {booking.date || "No date"} at{" "}
                        {booking.time || "No time"}
                      </p>
                    </div>

                    <span className="bg-green-500/20 text-green-200 border border-green-400/20 px-3 py-1 rounded-full text-sm">
                      {booking.status || "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Clients