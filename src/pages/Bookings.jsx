import { useEffect, useState } from "react"
import DashboardLayout from "../layouts/DashboardLayout"
import BookingForm from "../components/BookingForm"
import { supabase } from "../lib/supabase"

function Bookings() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  )
  const [monthBookings, setMonthBookings] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [calendarOpen, setCalendarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("availability")

  const getMonthDates = (dateString) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = date.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const startDate = new Date(firstDay)
    startDate.setDate(firstDay.getDate() - firstDay.getDay())

    const endDate = new Date(lastDay)
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()))

    const dates = []
    const current = new Date(startDate)

    while (current <= endDate) {
      dates.push(current.toISOString().split("T")[0])
      current.setDate(current.getDate() + 1)
    }

    return dates
  }

  const monthDates = getMonthDates(selectedDate)

  const selectedMonthLabel = new Date(selectedDate).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  )

  const selectedDayLabel = new Date(selectedDate).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
    }
  )

  const fetchMonthBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .gte("date", monthDates[0])
      .lte("date", monthDates[monthDates.length - 1])
      .order("date", { ascending: true })
      .order("time", { ascending: true })

    if (error) {
      console.log(error)
      return
    }

    setMonthBookings(data || [])
  }

  useEffect(() => {
    fetchMonthBookings()
  }, [selectedDate])

  const goToPreviousMonth = () => {
    const current = new Date(selectedDate)
    current.setMonth(current.getMonth() - 1)
    setSelectedDate(current.toISOString().split("T")[0])
  }

  const goToNextMonth = () => {
    const current = new Date(selectedDate)
    current.setMonth(current.getMonth() + 1)
    setSelectedDate(current.toISOString().split("T")[0])
  }

  const selectDay = (date) => {
    setSelectedDate(date)
    setCalendarOpen(false)
  }

  const isCurrentMonth = (dateString) => {
    const current = new Date(selectedDate)
    const date = new Date(dateString)

    return (
      current.getMonth() === date.getMonth() &&
      current.getFullYear() === date.getFullYear()
    )
  }

  const isToday = (dateString) => {
    return dateString === new Date().toISOString().split("T")[0]
  }

  const getBookingsForDate = (dateString) => {
    return monthBookings.filter((booking) => booking.date === dateString)
  }

  const getInitials = (name) => {
    if (!name) return "?"

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }

  const formatShortDate = (dateString) => {
    if (!dateString) return "No date"

    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusPillClass = (status) => {
    if (status === "Confirmed") {
      return "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-300"
    }

    if (status === "Pending") {
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300"
    }

    if (status === "Cancelled") {
      return "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300"
    }

    if (status === "Completed") {
      return "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-300"
    }

    return "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-300"
  }

  const getStatusDot = (status) => {
    if (status === "Confirmed") return "bg-green-400"
    if (status === "Pending") return "bg-yellow-400"
    if (status === "Cancelled") return "bg-red-400"
    if (status === "Completed") return "bg-purple-400"
    return "bg-blue-400"
  }

  const getBookingCardClass = (status) => {
    if (status === "Confirmed") {
      return "border-green-500/25 bg-green-500/5"
    }

    if (status === "Pending") {
      return "border-yellow-500/25 bg-yellow-500/5"
    }

    if (status === "Cancelled") {
      return "border-red-500/25 bg-red-500/5"
    }

    if (status === "Completed") {
      return "border-purple-500/25 bg-purple-500/5"
    }

    return "border-blue-500/25 bg-blue-500/5"
  }

  const selectedDayBookings = getBookingsForDate(selectedDate)

  const recentBookings = [...monthBookings]
    .sort((a, b) => {
      const dateA = new Date(`${a.date || ""}T${a.time || "00:00"}`)
      const dateB = new Date(`${b.date || ""}T${b.time || "00:00"}`)
      return dateB - dateA
    })
    .slice(0, 6)

  return (
    <DashboardLayout>
      <div className="min-h-screen w-full overflow-x-hidden bg-[var(--ownly-background)] text-[var(--ownly-text)] transition-colors duration-200">
        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold tracking-wide text-[var(--ownly-primary)]">
            Schedule
          </p>

          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            Bookings
          </h1>

          <p className="mt-3 text-[var(--ownly-muted)]">
            Manage your appointments and clients.
          </p>
        </header>

        <section className="w-full rounded-3xl border border-[var(--ownly-border)] bg-[var(--ownly-surface)] p-4 shadow-sm transition-colors duration-200 sm:p-6">
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-2xl border border-[var(--ownly-border)] bg-[var(--ownly-surface-soft)] p-1">
            <button
              type="button"
              onClick={() => setActiveTab("availability")}
              className={`rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                activeTab === "availability"
                  ? "border border-blue-500/40 bg-blue-500/15 text-[var(--ownly-text)] shadow-sm"
                  : "text-[var(--ownly-muted)] hover:bg-blue-500/10 hover:text-[var(--ownly-text)]"
              }`}
            >
              Availability
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("recent")}
              className={`rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                activeTab === "recent"
                  ? "border border-blue-500/40 bg-blue-500/15 text-[var(--ownly-text)] shadow-sm"
                  : "text-[var(--ownly-muted)] hover:bg-blue-500/10 hover:text-[var(--ownly-text)]"
              }`}
            >
              Recent
            </button>
          </div>

          {activeTab === "availability" && (
            <>
              <div className="rounded-3xl border border-[var(--ownly-border)] bg-[var(--ownly-surface-soft)] p-3 transition-colors duration-200 sm:p-6">
                <div className="mb-6 grid grid-cols-[44px_1fr_44px] items-center gap-3">
                  <button
                    type="button"
                    onClick={goToPreviousMonth}
                    aria-label="Previous month"
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--ownly-border)] bg-[var(--ownly-surface)] text-[var(--ownly-text)] transition hover:border-blue-500/50 hover:bg-blue-500/10"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    onClick={() => setCalendarOpen(!calendarOpen)}
                    className="rounded-xl px-3 py-2 text-center text-lg font-semibold text-[var(--ownly-text)] transition hover:bg-blue-500/10 sm:text-xl"
                  >
                    {selectedMonthLabel}{" "}
                    <span className="text-[var(--ownly-primary)]">
                      {calendarOpen ? "⌃" : "⌄"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={goToNextMonth}
                    aria-label="Next month"
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--ownly-border)] bg-[var(--ownly-surface)] text-[var(--ownly-text)] transition hover:border-blue-500/50 hover:bg-blue-500/10"
                  >
                    →
                  </button>
                </div>

                {calendarOpen && (
                  <>
                    <div className="mb-3 grid grid-cols-7 gap-1 text-center text-xs text-[var(--ownly-muted)] sm:gap-2">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day) => (
                          <p key={day}>{day}</p>
                        )
                      )}
                    </div>

                    <div className="grid grid-cols-7 gap-1 sm:gap-2">
                      {monthDates.map((date) => {
                        const bookingsForDay = getBookingsForDate(date)
                        const selected = date === selectedDate

                        return (
                          <button
                            type="button"
                            key={date}
                            onClick={() => selectDay(date)}
                            className={`flex min-h-12 flex-col items-center justify-center rounded-xl border p-1 transition-all duration-200 sm:min-h-14 sm:rounded-2xl sm:p-2 ${
                              selected
                                ? "border-blue-500/60 bg-blue-500/15 text-[var(--ownly-text)] shadow-sm"
                                : "border-transparent hover:border-blue-500/20 hover:bg-blue-500/10"
                            } ${
                              isCurrentMonth(date)
                                ? "text-[var(--ownly-text)]"
                                : "text-[var(--ownly-subtle)] opacity-60"
                            }`}
                          >
                            <span
                              className={`flex text-sm font-semibold ${
                                isToday(date) && !selected
                                  ? "h-7 w-7 items-center justify-center rounded-full border border-blue-500/40 bg-blue-500/10 text-[var(--ownly-primary)]"
                                  : ""
                              }`}
                            >
                              {new Date(date).getDate()}
                            </span>

                            <div className="mt-1 flex min-h-2 gap-1">
                              {bookingsForDay.slice(0, 3).map((booking) => (
                                <span
                                  key={booking.id}
                                  className={`h-2 w-2 rounded-full ${getStatusDot(
                                    booking.status
                                  )}`}
                                />
                              ))}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="mb-1 text-sm text-[var(--ownly-muted)]">
                      Selected day
                    </p>

                    <h3 className="break-words text-xl font-semibold leading-tight text-[var(--ownly-text)]">
                      {selectedDayLabel}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const form = document.getElementById("create-booking")
                      form?.scrollIntoView({ behavior: "smooth" })
                    }}
                    className="w-full rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm font-semibold text-[var(--ownly-primary)] transition hover:border-blue-500/50 hover:bg-blue-500/20 sm:w-auto"
                  >
                    + Booking
                  </button>
                </div>

                <BookingCards
                  bookings={selectedDayBookings}
                  setSelectedBooking={setSelectedBooking}
                  getInitials={getInitials}
                  formatShortDate={formatShortDate}
                  getStatusPillClass={getStatusPillClass}
                  getBookingCardClass={getBookingCardClass}
                  emptyMessage="No bookings for this day."
                />
              </div>
            </>
          )}

          {activeTab === "recent" && (
            <div className="rounded-3xl border border-[var(--ownly-border)] bg-[var(--ownly-surface-soft)] p-4 transition-colors duration-200 sm:p-6">
              <h2 className="text-2xl font-semibold text-[var(--ownly-text)]">
                Recent Appointments
              </h2>

              <p className="mb-5 mt-1 text-[var(--ownly-muted)]">
                Your most recent bookings.
              </p>

              <BookingCards
                bookings={recentBookings}
                setSelectedBooking={setSelectedBooking}
                getInitials={getInitials}
                formatShortDate={formatShortDate}
                getStatusPillClass={getStatusPillClass}
                getBookingCardClass={getBookingCardClass}
                emptyMessage="No recent bookings yet."
              />
            </div>
          )}
        </section>

        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
            <div className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[var(--ownly-border)] bg-[var(--ownly-surface)] p-5 text-[var(--ownly-text)] shadow-2xl transition-colors duration-200 sm:p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <Avatar
                    name={selectedBooking.client_name}
                    getInitials={getInitials}
                  />

                  <div className="min-w-0">
                    <h2 className="truncate text-2xl font-bold">
                      {selectedBooking.client_name}
                    </h2>

                    <p className="mt-1 truncate text-[var(--ownly-muted)]">
                      {selectedBooking.service}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  aria-label="Close booking details"
                  className="text-2xl text-[var(--ownly-muted)] transition hover:text-[var(--ownly-text)]"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoCard
                  label="Date"
                  value={formatShortDate(selectedBooking.date)}
                />

                <InfoCard
                  label="Time"
                  value={selectedBooking.time || "No time"}
                />

                <InfoCard
                  label="Phone"
                  value={selectedBooking.phone || "No phone"}
                />

                <InfoCard
                  label="Email"
                  value={selectedBooking.email || "No email"}
                />

                <InfoCard
                  label="Status"
                  value={selectedBooking.status || "Pending"}
                />

                <InfoCard
                  label="Amount"
                  value={`$${selectedBooking.amount || 0}`}
                />
              </div>
            </div>
          </div>
        )}

        <div
          id="create-booking"
          className="mt-8 w-full max-w-full overflow-hidden"
        >
          <BookingForm />
        </div>
      </div>
    </DashboardLayout>
  )
}

function Avatar({ name, getInitials }) {
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-xl font-semibold text-[var(--ownly-primary)]">
      {getInitials(name)}
    </div>
  )
}

function BookingCards({
  bookings,
  setSelectedBooking,
  getInitials,
  formatShortDate,
  getStatusPillClass,
  getBookingCardClass,
  emptyMessage,
}) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--ownly-border)] bg-[var(--ownly-surface-soft)] p-5 text-center">
        <p className="font-semibold text-[var(--ownly-text)]">
          Nothing scheduled
        </p>

        <p className="mt-1 text-sm text-[var(--ownly-muted)]">
          {emptyMessage}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => (
        <button
          type="button"
          key={booking.id}
          onClick={() => setSelectedBooking(booking)}
          className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/40 hover:shadow-md ${getBookingCardClass(
            booking.status
          )}`}
        >
          <div className="flex items-center gap-4">
            <Avatar
              name={booking.client_name}
              getInitials={getInitials}
            />

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-[var(--ownly-text)]">
                {booking.client_name || "No name"}
              </p>

              <p className="truncate text-sm text-[var(--ownly-muted)]">
                {booking.service || "No service"}
              </p>

              <div className="mt-2 flex flex-col gap-1 text-xs text-[var(--ownly-muted)]">
                <span>{formatShortDate(booking.date)}</span>
                <span>{booking.time || "No time"}</span>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
              <span
                className={`rounded-xl border px-3 py-1.5 text-xs ${getStatusPillClass(
                  booking.status
                )}`}
              >
                {booking.status || "Pending"}
              </span>

              <span className="text-xl text-[var(--ownly-muted)]">›</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-[var(--ownly-border)] bg-[var(--ownly-surface-soft)] p-4">
      <p className="text-sm text-[var(--ownly-muted)]">{label}</p>

      <p className="mt-1 break-words text-[var(--ownly-text)]">{value}</p>
    </div>
  )
}

export default Bookings