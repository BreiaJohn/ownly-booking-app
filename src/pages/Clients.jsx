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
      (data || []).reduce((acc, booking) => {
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

        if (
          booking.service &&
          !acc[clientKey].services.includes(booking.service)
        ) {
          acc[clientKey].services.push(booking.service)
        }

        if (
          booking.date &&
          booking.date > acc[clientKey].lastAppointment
        ) {
          acc[clientKey].lastAppointment = booking.date
        }

        return acc
      }, {})
    )

    setClients(groupedClients)
  }

  const getInitials = (name) => {
    if (!name) return "?"

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
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(
        3,
        6
      )}-${cleaned.slice(6)}`
    }

    return String(phone)
  }

  const formatDate = (date) => {
    if (!date) return "No date"

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
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

  const getStatusClass = (status) => {
    if (status === "VIP") {
      return "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-300"
    }

    if (status === "Returning") {
      return "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-300"
    }

    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300"
  }

  const getBookingStatusClass = (status) => {
    if (status === "Confirmed") {
      return "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-300"
    }

    if (status === "Cancelled") {
      return "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300"
    }

    if (status === "Completed") {
      return "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-300"
    }

    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300"
  }

  const filteredClients = clients.filter((client) => {
    const search = searchTerm.toLowerCase()

    return (
      client.name?.toLowerCase().includes(search) ||
      client.phone?.toLowerCase().includes(search) ||
      client.email?.toLowerCase().includes(search)
    )
  })

  const totalBookings = clients.reduce(
    (sum, client) => sum + client.totalBookings,
    0
  )

  const returningClients = clients.filter(
    (client) => client.totalBookings > 1
  ).length

  return (
    <DashboardLayout>
      <div className="min-h-screen w-full overflow-x-hidden bg-[var(--ownly-background)] text-[var(--ownly-text)] transition-colors duration-200">
        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold tracking-wide text-[var(--ownly-primary)]">
            Relationships
          </p>

          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            Clients
          </h1>

          <p className="mt-3 text-[var(--ownly-muted)]">
            View your client list, loyalty, and booking history.
          </p>
        </header>

        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard label="Total Clients" value={clients.length} />

          <StatCard label="Total Bookings" value={totalBookings} />

          <StatCard label="Returning Clients" value={returningClients} />
        </section>

        <section className="mb-6">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clients by name, phone, or email..."
            className="block w-full rounded-2xl border border-[var(--ownly-border)] bg-[var(--ownly-surface)] px-5 py-4 text-[var(--ownly-text)] outline-none transition-colors duration-200 placeholder:text-[var(--ownly-muted)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </section>

        {filteredClients.length > 0 ? (
          <section className="overflow-hidden rounded-3xl border border-[var(--ownly-border)] bg-[var(--ownly-surface)] shadow-sm transition-colors duration-200">
            {filteredClients.map((client, index) => {
              const status = getClientStatus(client)
              const favoriteService = getFavoriteService(client)
              const loyaltyPercentage = Math.min(
                client.totalBookings * 20,
                100
              )

              return (
                <button
                  type="button"
                  key={`${client.name}-${client.phone}-${client.email}`}
                  onClick={() => setSelectedClient(client)}
                  className={`w-full px-5 py-6 text-left transition-colors duration-200 hover:bg-[var(--ownly-surface-soft)] sm:px-6 ${
                    index !== filteredClients.length - 1
                      ? "border-b border-[var(--ownly-border)]"
                      : ""
                  }`}
                >
                  <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1.4fr_0.7fr_1fr_auto]">
                    <div className="flex min-w-0 items-center gap-4">
                      <Avatar
                        name={client.name}
                        getInitials={getInitials}
                      />

                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold text-[var(--ownly-text)]">
                          {client.name}
                        </h3>

                        <p className="mt-1 text-sm text-[var(--ownly-muted)]">
                          {client.totalBookings} booking
                          {client.totalBookings !== 1 ? "s" : ""} · Last
                          visit {formatDate(client.lastAppointment)}
                        </p>

                        <p className="mt-2 text-sm text-[var(--ownly-muted)]">
                          Favorite:{" "}
                          <span className="font-medium text-purple-600 dark:text-purple-300">
                            {favoriteService}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
                          status
                        )}`}
                      >
                        <span className="h-2 w-2 rounded-full bg-current" />
                        {status}
                      </span>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm text-[var(--ownly-muted)]">
                        <span>Client Loyalty</span>
                        <span>{client.totalBookings}</span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full border border-[var(--ownly-border)] bg-[var(--ownly-surface-soft)]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500"
                          style={{
                            width: `${loyaltyPercentage}%`,
                          }}
                        />
                      </div>

                      <p className="mt-2 text-xs text-[var(--ownly-subtle)]">
                        {loyaltyPercentage >= 100
                          ? "Top client status achieved ✨"
                          : "Keep it up! Building loyalty ✨"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 lg:justify-end">
                      <div className="flex items-center gap-3 rounded-2xl border border-[var(--ownly-border)] bg-[var(--ownly-surface-soft)] px-4 py-3">
                        <span className="text-lg">📅</span>

                        <p className="whitespace-nowrap text-sm font-medium text-[var(--ownly-text)]">
                          {formatDate(client.lastAppointment)}
                        </p>
                      </div>

                      <span className="text-2xl text-[var(--ownly-muted)]">
                        ›
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </section>
        ) : (
          <section className="rounded-3xl border border-dashed border-[var(--ownly-border)] bg-[var(--ownly-surface)] p-10 text-center">
            <p className="text-xl font-semibold text-[var(--ownly-text)]">
              No clients found
            </p>

            <p className="mt-2 text-[var(--ownly-muted)]">
              Try searching by a different name, phone number, or email.
            </p>
          </section>
        )}

        {selectedClient && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
            onClick={() => setSelectedClient(null)}
          >
            <div
              className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[var(--ownly-border)] bg-[var(--ownly-surface)] p-5 text-[var(--ownly-text)] shadow-2xl transition-colors duration-200 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <Avatar
                    name={selectedClient.name}
                    getInitials={getInitials}
                    large
                  />

                  <div className="min-w-0">
                    <h2 className="truncate text-2xl font-bold">
                      {selectedClient.name}
                    </h2>

                    <p className="mt-1 text-[var(--ownly-muted)]">
                      {selectedClient.totalBookings} booking
                      {selectedClient.totalBookings !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedClient(null)}
                  aria-label="Close client details"
                  className="text-2xl text-[var(--ownly-muted)] transition hover:text-[var(--ownly-text)]"
                >
                  ×
                </button>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <DetailCard
                  label="Phone"
                  value={formatPhone(selectedClient.phone)}
                />

                <DetailCard
                  label="Email"
                  value={selectedClient.email || "No email"}
                />

                <DetailCard
                  label="Last Visit"
                  value={formatDate(selectedClient.lastAppointment)}
                />

                <div className="rounded-2xl border border-[var(--ownly-border)] bg-[var(--ownly-surface-soft)] p-4">
                  <p className="text-sm text-[var(--ownly-muted)]">
                    Services
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedClient.services.length > 0 ? (
                      selectedClient.services.map((service) => (
                        <span
                          key={service}
                          className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-sm text-purple-600 dark:text-purple-300"
                        >
                          {service}
                        </span>
                      ))
                    ) : (
                      <p className="text-[var(--ownly-text)]">
                        No services
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">
                  Booking History
                </h3>

                <span className="text-sm text-[var(--ownly-muted)]">
                  {selectedClient.bookings.length} total
                </span>
              </div>

              <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
                {selectedClient.bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col gap-4 rounded-2xl border border-[var(--ownly-border)] bg-[var(--ownly-surface-soft)] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-[var(--ownly-text)]">
                        {booking.service || "Service"}
                      </p>

                      <p className="mt-1 text-sm text-[var(--ownly-muted)]">
                        {formatDate(booking.date)} at{" "}
                        {booking.time || "No time"}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full border px-3 py-1 text-sm ${getBookingStatusClass(
                        booking.status
                      )}`}
                    >
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

function StatCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-[var(--ownly-border)] bg-[var(--ownly-surface)] p-5 shadow-sm transition-colors duration-200">
      <p className="text-sm text-[var(--ownly-muted)]">{label}</p>

      <p className="mt-2 text-3xl font-bold text-[var(--ownly-text)]">
        {value}
      </p>
    </div>
  )
}

function Avatar({ name, getInitials, large = false }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 font-semibold text-[var(--ownly-primary)] ${
        large ? "h-16 w-16 text-2xl" : "h-14 w-14 text-lg"
      }`}
    >
      {getInitials(name)}
    </div>
  )
}

function DetailCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-[var(--ownly-border)] bg-[var(--ownly-surface-soft)] p-4">
      <p className="text-sm text-[var(--ownly-muted)]">{label}</p>

      <p className="mt-1 break-words text-[var(--ownly-text)]">
        {value}
      </p>
    </div>
  )
}

export default Clients