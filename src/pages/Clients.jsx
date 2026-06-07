import { useEffect, useState } from "react"
import DashboardLayout from "../layouts/DashboardLayout"
import { supabase } from "../lib/supabase"

function Clients() {
  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

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
        const phone = booking.phone || "No phone"
        const email = booking.email || "No email"
        const clientKey = `${name}-${phone}-${email}`

        if (!acc[clientKey]) {
          acc[clientKey] = {
            name,
            phone: booking.phone,
            email: booking.email,
            totalBookings: 0,
            lastAppointment: booking.date,
            services: [],
            bookings: [],
          }
        }

        acc[clientKey].totalBookings += 1
        acc[clientKey].bookings.push(booking)

        if (booking.service && !acc[clientKey].services.includes(booking.service)) {
          acc[clientKey].services.push(booking.service)
        }

        if (booking.date && booking.date > acc[clientKey].lastAppointment) {
          acc[clientKey].lastAppointment = booking.date
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

  const formatPhone = (phone) => {
    if (!phone) return "No phone"

    const cleaned = String(phone).replace(/\D/g, "")

    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)} - ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    }

    return String(phone)
  }

  const formatDate = (date) => {
    if (!date) return "No date"

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getClientStatus = (client) => {
    if (client.totalBookings >= 5) return "VIP"
    if (client.totalBookings > 1) return "Returning"
    return "New"
  }

  const getFavoriteService = (client) => {
    return client.services[0] || "No favorite yet"
  }

  const filteredClients = clients.filter((client) => {
    const search = searchTerm.toLowerCase()

    return (
      client.name?.toLowerCase().includes(search) ||
      client.phone?.toLowerCase().includes(search) ||
      client.email?.toLowerCase().includes(search)
    )
  })

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0F172A] text-white">
        <h1 className="text-3xl font-semibold mb-2">Clients</h1>

        <p className="text-[#94A3B8] mb-8">
          View your client list and booking history.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 border border-[#334155] rounded-3xl p-5">
            <p className="text-[#94A3B8] text-sm">Total Clients</p>
            <p className="text-3xl font-semibold mt-2">{clients.length}</p>
          </div>

          <div className="bg-white/5 border border-[#334155] rounded-3xl p-5">
            <p className="text-[#94A3B8] text-sm">Total Bookings</p>
            <p className="text-3xl font-semibold mt-2">
              {clients.reduce((sum, client) => sum + client.totalBookings, 0)}
            </p>
          </div>

          <div className="bg-white/5 border border-[#334155] rounded-3xl p-5">
            <p className="text-[#94A3B8] text-sm">Returning Clients</p>
            <p className="text-3xl font-semibold mt-2">
              {clients.filter((client) => client.totalBookings > 1).length}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clients by name, phone, or email..."
            className="w-full bg-white/5 border border-[#334155] rounded-2xl px-5 py-4 text-white placeholder:text-[#64748B] outline-none focus:border-[#A68A72] transition"
          />
        </div>

        <div className="bg-white/5 border border-[#334155] rounded-3xl overflow-hidden">
          {filteredClients.map((client, index) => {
            const status = getClientStatus(client)
            const favoriteService = getFavoriteService(client)

            return (
              <button
                key={`${client.name}-${client.phone}-${client.email}`}
                onClick={() => setSelectedClient(client)}
                className={`w-full text-left px-6 py-6 hover:bg-white/5 transition ${
                  index !== filteredClients.length - 1
                    ? "border-b border-[#334155]"
                    : ""
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr_1fr_0.8fr] gap-6 items-center">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-full bg-[#111827] border border-[#334155] flex items-center justify-center text-lg font-semibold text-white shrink-0">
                      {getInitials(client.name)}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {client.name}
                      </h3>

                      <p className="text-sm text-[#94A3B8] mt-1">
                        {client.totalBookings} booking
                        {client.totalBookings !== 1 ? "s" : ""} • Last visit{" "}
                        {formatDate(client.lastAppointment)}
                      </p>

                      <p className="text-sm text-[#94A3B8] mt-2">
                        Favorite:{" "}
                        <span className="text-purple-300 font-medium">
                          {favoriteService}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
                        status === "VIP"
                          ? "bg-blue-500/20 text-blue-300 border-blue-400/30"
                          : status === "Returning"
                          ? "bg-green-500/20 text-green-300 border-green-400/30"
                          : "bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current" />
                      {status}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm text-[#94A3B8] mb-2">
                      <span>Client Loyalty</span>
                      <span>{client.totalBookings}</span>
                    </div>

                    <div className="h-2 bg-[#111827] rounded-full overflow-hidden border border-[#334155]">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full"
                        style={{
                          width: `${Math.min(client.totalBookings * 20, 100)}%`,
                        }}
                      />
                    </div>

                    <p className="text-xs text-[#64748B] mt-2">
                      Keep it up! Building loyalty ✨
                    </p>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-4">
                    <div className="flex items-center gap-3 border border-[#334155] bg-white/5 px-4 py-3 rounded-2xl">
                      <span className="text-lg">📅</span>

                      <p className="text-sm text-white font-medium whitespace-nowrap">
                        Last visit: {formatDate(client.lastAppointment)}
                      </p>
                    </div>

                    <span className="text-[#94A3B8] text-2xl">›</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {filteredClients.length === 0 && (
          <div className="bg-white/5 border border-[#334155] rounded-3xl p-10 text-center mt-6">
            <p className="text-2xl mb-2">No clients found</p>
            <p className="text-[#94A3B8]">
              Try searching by a different name, phone number, or email.
            </p>
          </div>
        )}

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
                    {formatPhone(selectedClient.phone)}
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
                    {formatDate(selectedClient.lastAppointment)}
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

              <h3 className="text-lg font-semibold mb-3">Booking History</h3>

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