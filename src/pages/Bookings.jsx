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
    return "bg-green-500/10 border-green-400/30 text-green-300 shadow-green-500/10"
  }

  if (status === "Pending") {
    return "bg-yellow-500/10 border-yellow-400/30 text-yellow-300 shadow-yellow-500/10"
  }

  if (status === "Cancelled") {
    return "bg-red-500/10 border-red-400/30 text-red-300 shadow-red-500/10"
  }

  if (status === "Completed") {
    return "bg-purple-500/10 border-purple-400/30 text-purple-300 shadow-purple-500/10"
  }

  return "bg-blue-500/10 border-blue-400/30 text-blue-300 shadow-blue-500/10"
}

const getStatusDot = (status) => {
  if (status === "Confirmed") {
    return "bg-green-400/70 border-green-200/40 shadow-[0_0_10px_rgba(74,222,128,0.45)]"
  }

  if (status === "Pending") {
    return "bg-yellow-400/70 border-yellow-200/40 shadow-[0_0_10px_rgba(250,204,21,0.45)]"
  }

  if (status === "Cancelled") {
    return "bg-red-400/70 border-red-200/40 shadow-[0_0_10px_rgba(248,113,113,0.45)]"
  }

  if (status === "Completed") {
    return "bg-purple-400/70 border-purple-200/40 shadow-[0_0_10px_rgba(192,132,252,0.45)]"
  }

  return "bg-blue-400/70 border-blue-200/40 shadow-[0_0_10px_rgba(96,165,250,0.45)]"
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
      <div className="w-full max-w-full min-h-screen bg-[#0F172A] text-white overflow-x-hidden">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Bookings
          </h1>

          <p className="text-[#94A3B8] mt-2">
            Manage your appointments and clients.
          </p>
        </div>

        <div className="w-full bg-white/5 border border-blue-400/20 rounded-3xl p-3 mb-8 backdrop-blur-xl shadow-[0_0_40px_rgba(59,130,246,0.08)]">
          <div className="grid grid-cols-2 gap-2 bg-[#020617]/60 border border-blue-400/10 rounded-2xl p-1 mb-5">
            <button
              onClick={() => setActiveTab("availability")}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                activeTab === "availability"
                  ? "bg-blue-500/20 border border-blue-300/40 text-[#DBEAFE] shadow-[0_0_25px_rgba(59,130,246,0.2)] backdrop-blur-xl"
                  : "text-[#CBD5E1] hover:bg-blue-500/10"
              }`}
            >
             <svg
  xmlns="http://www.w3.org/2000/svg"
  className="w-4 h-4"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M8 7V3m8 4V3m-9 8h10m-13 9h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v11a2 2 0 002 2z"
  />
</svg>
              <span>Availability</span>
            </button>

            <button
              onClick={() => setActiveTab("recent")}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                activeTab === "recent"
                  ? "bg-blue-500/20 border border-blue-300/40 text-[#DBEAFE] shadow-[0_0_25px_rgba(59,130,246,0.2)] backdrop-blur-xl"
                  : "text-[#CBD5E1] hover:bg-blue-500/10"
              }`}
            >
             <svg
  xmlns="http://www.w3.org/2000/svg"
  className="w-4 h-4"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
  />
</svg>
              <span>Recent</span>
            </button>
          </div>

          {activeTab === "availability" && (
            <div>
              <div className="bg-[#020617]/40 border border-blue-400/20 rounded-3xl p-4 md:p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={goToPreviousMonth}
                    className="bg-white/5 border border-blue-400/20 w-11 h-11 rounded-2xl hover:border-blue-400 hover:bg-blue-500/10 transition"
                  >
                    ←
                  </button>

                  <button
                    onClick={() => setCalendarOpen(!calendarOpen)}
                    className="flex items-center gap-2 text-xl font-semibold hover:text-[#93C5FD] transition"
                  >
                    {selectedMonthLabel}
                    <span className="text-[#93C5FD]">
                      {calendarOpen ? "⌃" : "⌄"}
                    </span>
                  </button>

                  <button
                    onClick={goToNextMonth}
                    className="bg-white/5 border border-blue-400/20 w-11 h-11 rounded-2xl hover:border-blue-400 hover:bg-blue-500/10 transition"
                  >
                    →
                  </button>
                </div>

                {calendarOpen && (
                  <>
                    <div className="grid grid-cols-7 gap-2 text-center text-xs text-[#94A3B8] mb-3">
                      <p>Sun</p>
                      <p>Mon</p>
                      <p>Tue</p>
                      <p>Wed</p>
                      <p>Thu</p>
                      <p>Fri</p>
                      <p>Sat</p>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {monthDates.map((date) => {
                        const bookingsForDay = getBookingsForDate(date)
                        const selected = date === selectedDate

                        return (
                          <button
                            key={date}
                            onClick={() => selectDay(date)}
                            className={`min-h-14 rounded-2xl p-2 flex flex-col items-center justify-center transition-all duration-300 ${
                              selected
                                ? "bg-blue-500/20 border border-blue-300/50 text-white shadow-[0_0_25px_rgba(59,130,246,0.25)] backdrop-blur-xl"
                                : "bg-transparent border border-transparent hover:bg-blue-500/10 hover:border-blue-400/20"
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

                            <div className="flex items-center justify-center gap-1 mt-2 min-h-2">
                              {bookingsForDay.slice(0, 3).map((booking) => (
                              <span
  key={booking.id}
  className={`w-2.5 h-2.5 rounded-full border backdrop-blur-md ${getStatusDot(
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
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h3 className="text-lg font-semibold">
                    Bookings for {selectedDayLabel}
                  </h3>

                  <button
                    onClick={() => {
                      const form = document.getElementById("create-booking")
                      form?.scrollIntoView({ behavior: "smooth" })
                    }}
                    className="bg-blue-500/10 border border-blue-400/30 text-[#93C5FD] px-4 py-2 rounded-2xl text-sm hover:bg-blue-500/20 transition"
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
            </div>
          )}

          {activeTab === "recent" && (
            <div className="bg-[#020617]/40 border border-blue-400/20 rounded-3xl p-4 md:p-6 backdrop-blur-xl">
              <div className="mb-5">
                <h2 className="text-2xl font-semibold">
                  Recent Appointments
                </h2>

                <p className="text-[#94A3B8] mt-1">
                  Your most recent bookings.
                </p>
              </div>

              <BookingCards
                bookings={recentBookings}
                setSelectedBooking={setSelectedBooking}
                getInitials={getInitials}
                formatShortDate={formatShortDate}
                getStatusPillClass={getStatusPillClass}
                getBookingCardClass={getBookingCardClass}
                emptyMessage="No recent bookings yet."
              />

              <button
                onClick={() => setActiveTab("availability")}
                className="w-full mt-4 bg-blue-500/10 border border-blue-400/20 text-[#93C5FD] rounded-2xl py-4 hover:bg-blue-500/20 transition"
              >
                View Availability
              </button>
            </div>
          )}
        </div>

        {selectedBooking && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-[#0F172A]/95 border border-blue-400/20 rounded-3xl shadow-xl w-full max-w-xl max-h-[85vh] overflow-y-auto p-5 md:p-6">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <Avatar name={selectedBooking.client_name} getInitials={getInitials} />

                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedBooking.client_name}
                    </h2>

                    <p className="text-[#94A3B8] mt-1">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard label="Date" value={formatShortDate(selectedBooking.date)} />
                <InfoCard label="Time" value={selectedBooking.time || "No time"} />
                <InfoCard label="Phone" value={selectedBooking.phone || "No phone"} />
                <InfoCard label="Email" value={selectedBooking.email || "No email"} />
                <InfoCard label="Status" value={selectedBooking.status || "Pending"} />
                <InfoCard label="Amount" value={`$${selectedBooking.amount || 0}`} />
              </div>

              {selectedBooking.notes && (
                <div className="bg-white/5 border border-blue-400/20 rounded-2xl p-4 mt-4">
                  <p className="text-[#94A3B8] text-sm">Notes</p>
                  <p className="text-white mt-1">{selectedBooking.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div id="create-booking">
          <BookingForm />
        </div>


      </div>
    </DashboardLayout>
  )
}

function Avatar({ name, getInitials }) {
  return (
    <div className="shrink-0 w-14 h-14 rounded-full bg-blue-500/10 border border-blue-400/40 text-[#93C5FD] flex items-center justify-center text-xl font-semibold shadow-[0_0_25px_rgba(59,130,246,0.15)] backdrop-blur-xl">
      {getInitials(name)}
    </div>
  )
}

function StatusKey({ label, color }) {
  const styles = {
    green: "bg-green-500/10 border-green-400/20 text-green-300",
    yellow: "bg-yellow-500/10 border-yellow-400/20 text-yellow-300",
    red: "bg-red-500/10 border-red-400/20 text-red-300",
  }

  const dotStyles = {
    green: "bg-green-400",
    yellow: "bg-yellow-400",
    red: "bg-red-400",
  }

  return (
    <div
      className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 border backdrop-blur-md ${styles[color]}`}
    >
      <span className={`w-2 h-2 rounded-full ${dotStyles[color]}`} />
      {label}
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
          className={`w-full text-left rounded-2xl border p-4 backdrop-blur-xl hover:border-blue-400/50 hover:bg-blue-500/10 transition-all duration-300 ${getBookingCardClass(
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
  <div className="flex items-center gap-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10m-13 9h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v11a2 2 0 002 2z"
      />
    </svg>

    <span>{formatShortDate(booking.date)}</span>
  </div>

  <div className="flex items-center gap-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>

    <span>{booking.time || "No time"}</span>
  </div>
</div>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              <span
                className={`text-xs px-3 py-1.5 rounded-xl border shadow-lg backdrop-blur-md ${getStatusPillClass(
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