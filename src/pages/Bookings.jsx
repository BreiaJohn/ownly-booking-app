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
    { month: "long", year: "numeric" }
  )

  const selectedDayLabel = new Date(selectedDate).toLocaleDateString(
    "en-US",
    { weekday: "long", month: "long", day: "numeric" }
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
      return "bg-green-500/10 border-green-400/30 text-green-300"
    }

    if (status === "Pending") {
      return "bg-yellow-500/10 border-yellow-400/30 text-yellow-300"
    }

    if (status === "Cancelled") {
      return "bg-red-500/10 border-red-400/30 text-red-300"
    }

    if (status === "Completed") {
      return "bg-purple-500/10 border-purple-400/30 text-purple-300"
    }

    return "bg-blue-500/10 border-blue-400/30 text-blue-300"
  }

  const getStatusDot = (status) => {
    if (status === "Confirmed") return "bg-green-400"
    if (status === "Pending") return "bg-yellow-400"
    if (status === "Cancelled") return "bg-red-400"
    if (status === "Completed") return "bg-purple-400"
    return "bg-blue-400"
  }

  const getBookingCardClass = (status) => {
    if (status === "Confirmed") return "border-green-400/30 bg-green-500/5"
    if (status === "Pending") return "border-yellow-400/30 bg-yellow-500/5"
    if (status === "Cancelled") return "border-red-400/30 bg-red-500/5"
    if (status === "Completed") return "border-purple-400/30 bg-purple-500/5"
    return "border-blue-400/30 bg-blue-500/5"
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
      <div className="w-full min-h-screen bg-[#0F172A] text-white overflow-x-hidden">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Bookings
          </h1>

          <p className="text-[#94A3B8] mt-2">
            Manage your appointments and clients.
          </p>
        </div>

        <section className="w-full bg-white/5 border border-blue-400/20 rounded-3xl p-3 sm:p-5 mb-8 backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-2 bg-[#020617]/60 border border-blue-400/10 rounded-2xl p-1 mb-5">
            <button
              onClick={() => setActiveTab("availability")}
              className={`rounded-xl px-3 py-3 text-sm font-medium transition ${
                activeTab === "availability"
                  ? "bg-blue-500/20 border border-blue-300/40 text-[#DBEAFE]"
                  : "text-[#CBD5E1] hover:bg-blue-500/10"
              }`}
            >
              Availability
            </button>

            <button
              onClick={() => setActiveTab("recent")}
              className={`rounded-xl px-3 py-3 text-sm font-medium transition ${
                activeTab === "recent"
                  ? "bg-blue-500/20 border border-blue-300/40 text-[#DBEAFE]"
                  : "text-[#CBD5E1] hover:bg-blue-500/10"
              }`}
            >
              Recent
            </button>
          </div>

          {activeTab === "availability" && (
            <>
              <div className="bg-[#020617]/40 border border-blue-400/20 rounded-3xl p-3 sm:p-6 backdrop-blur-xl">
                <div className="grid grid-cols-[44px_1fr_44px] items-center gap-3 mb-6">
                  <button
                    onClick={goToPreviousMonth}
                    className="bg-white/5 border border-blue-400/20 w-11 h-11 rounded-2xl"
                  >
                    ←
                  </button>

                  <button
                    onClick={() => setCalendarOpen(!calendarOpen)}
                    className="text-lg sm:text-xl font-semibold text-center"
                  >
                    {selectedMonthLabel}{" "}
                    <span className="text-[#93C5FD]">
                      {calendarOpen ? "⌃" : "⌄"}
                    </span>
                  </button>

                  <button
                    onClick={goToNextMonth}
                    className="bg-white/5 border border-blue-400/20 w-11 h-11 rounded-2xl"
                  >
                    →
                  </button>
                </div>

                {calendarOpen && (
                  <>
                    <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs text-[#94A3B8] mb-3">
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
                            key={date}
                            onClick={() => selectDay(date)}
                            className={`min-h-12 sm:min-h-14 rounded-xl sm:rounded-2xl p-1 sm:p-2 flex flex-col items-center justify-center transition ${
                              selected
                                ? "bg-blue-500/20 border border-blue-300/50 text-white"
                                : "border border-transparent hover:bg-blue-500/10"
                            } ${
                              isCurrentMonth(date)
                                ? "text-white"
                                : "text-[#64748B] opacity-60"
                            }`}
                          >
                            <span
                              className={`text-sm font-semibold ${
                                isToday(date) && !selected
                                  ? "bg-blue-500/10 border border-blue-400/40 rounded-full w-7 h-7 flex items-center justify-center text-[#93C5FD]"
                                  : ""
                              }`}
                            >
                              {new Date(date).getDate()}
                            </span>

                            <div className="flex gap-1 mt-1 min-h-2">
                              {bookingsForDay.slice(0, 3).map((booking) => (
                                <span
                                  key={booking.id}
                                  className={`w-2 h-2 rounded-full ${getStatusDot(
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <h3 className="text-xl font-semibold leading-tight">
                    Bookings for {selectedDayLabel}
                  </h3>

                  <button
                    onClick={() => {
                      const form = document.getElementById("create-booking")
                      form?.scrollIntoView({ behavior: "smooth" })
                    }}
                    className="w-full sm:w-auto bg-blue-500/10 border border-blue-400/30 text-[#93C5FD] px-4 py-3 rounded-2xl text-sm hover:bg-blue-500/20 transition"
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
            <div className="bg-[#020617]/40 border border-blue-400/20 rounded-3xl p-4 sm:p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-semibold">
                Recent Appointments
              </h2>

              <p className="text-[#94A3B8] mt-1 mb-5">
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-[#0F172A]/95 border border-blue-400/20 rounded-3xl shadow-xl w-full max-w-xl max-h-[85vh] overflow-y-auto p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-4 min-w-0">
                  <Avatar
                    name={selectedBooking.client_name}
                    getInitials={getInitials}
                  />

                  <div className="min-w-0">
                    <h2 className="text-2xl font-bold truncate">
                      {selectedBooking.client_name}
                    </h2>

                    <p className="text-[#94A3B8] mt-1 truncate">
                      {selectedBooking.service}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-[#94A3B8] hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard label="Date" value={formatShortDate(selectedBooking.date)} />
                <InfoCard label="Time" value={selectedBooking.time || "No time"} />
                <InfoCard label="Phone" value={selectedBooking.phone || "No phone"} />
                <InfoCard label="Email" value={selectedBooking.email || "No email"} />
                <InfoCard label="Status" value={selectedBooking.status || "Pending"} />
                <InfoCard label="Amount" value={`$${selectedBooking.amount || 0}`} />
              </div>
            </div>
          </div>
        )}

        <div id="create-booking" className="w-full overflow-hidden">
          <BookingForm />
        </div>
      </div>
    </DashboardLayout>
  )
}

function Avatar({ name, getInitials }) {
  return (
    <div className="shrink-0 w-14 h-14 rounded-full bg-blue-500/10 border border-blue-400/40 text-[#93C5FD] flex items-center justify-center text-xl font-semibold">
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
      <p className="text-[#94A3B8] bg-[#020617]/50 border border-blue-400/10 rounded-2xl p-4">
        {emptyMessage}
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => (
        <button
          key={booking.id}
          onClick={() => setSelectedBooking(booking)}
          className={`w-full text-left rounded-2xl border p-4 backdrop-blur-xl hover:border-blue-400/50 hover:bg-blue-500/10 transition ${getBookingCardClass(
            booking.status
          )}`}
        >
          <div className="flex items-center gap-4">
            <Avatar name={booking.client_name} getInitials={getInitials} />

            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">
                {booking.client_name || "No name"}
              </p>

              <p className="text-[#94A3B8] text-sm truncate">
                {booking.service || "No service"}
              </p>

              <div className="flex flex-col gap-2 mt-2 text-xs text-[#94A3B8]">
                <span>{formatShortDate(booking.date)}</span>
                <span>{booking.time || "No time"}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              <span
                className={`text-xs px-3 py-1.5 rounded-xl border ${getStatusPillClass(
                  booking.status
                )}`}
              >
                {booking.status || "Pending"}
              </span>

              <span className="text-[#94A3B8] text-xl">›</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-white/5 border border-blue-400/20 rounded-2xl p-4">
      <p className="text-[#94A3B8] text-sm">{label}</p>
      <p className="text-white mt-1 break-words">{value}</p>
    </div>
  )
}

export default Bookings