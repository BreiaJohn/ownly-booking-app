import { useEffect, useState } from "react"
import DashboardLayout from "../layouts/DashboardLayout"
import BookingForm from "../components/BookingForm"
import BookingsList from "../components/BookingsList"
import logo from "../assets/ownly-logo.png"
import { supabase } from "../lib/supabase"

function Bookings() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  )

  const [weekBookings, setWeekBookings] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showCalendar, setShowCalendar] = useState(true)

  const timeGrid = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ]

  const getWeekDates = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDay()
    const sunday = new Date(date)

    sunday.setDate(date.getDate() - day)

    return Array.from({ length: 7 }, (_, index) => {
      const current = new Date(sunday)

      current.setDate(sunday.getDate() + index)

      return current.toISOString().split("T")[0]
    })
  }

  const weekDates = getWeekDates(selectedDate)

  useEffect(() => {
    fetchWeekBookings()
  }, [selectedDate])

  const fetchWeekBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .gte("date", weekDates[0])
      .lte("date", weekDates[6])
      .order("date", { ascending: true })
      .order("time", { ascending: true })

    if (error) {
      console.log(error)
      return
    }

    setWeekBookings(data)
  }

  const formatDay = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const convertTime = (time) => {
    const [hours, minutes] = time.split(":")

    const date = new Date()

    date.setHours(hours)
    date.setMinutes(minutes)

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0F172A] text-white">
        <div className="flex items-center justify-between mb-8">
          <div>
            <img
              src={logo}
              alt="Ownly Logo"
              className="h-16 w-auto object-contain mb-4"
            />

            <h1 className="text-3xl font-semibold tracking-tight">
              Bookings
            </h1>

            <p className="text-[#94A3B8] mt-2">
              Manage your appointments and clients.
            </p>
          </div>
        </div>

        <div className="bg-white/5 border border-[#334155] rounded-3xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
  <div>
    <h2 className="text-2xl font-semibold">
      Weekly Calendar
    </h2>

    <p className="text-[#94A3B8] mt-1">
      View bookings for the selected week.
    </p>
  </div>

  <button
    onClick={() => setShowCalendar(!showCalendar)}
    className="bg-[#020617] border border-[#334155] px-4 py-2 rounded-xl hover:border-[#A68A72] transition"
  >
    {showCalendar ? "Hide Calendar" : "Show Calendar"}
  </button>
</div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold">
                Weekly Calendar
              </h2>

              <p className="text-[#94A3B8] mt-1">
                View bookings for the selected week.
              </p>
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ colorScheme: "dark" }}
              className="bg-[#020617] border border-[#334155] text-white rounded-2xl px-4 py-3 outline-none"
            />
          </div>
<div
  className={`transition-all duration-500 ease-in-out overflow-hidden ${
    showCalendar
      ? "max-h-[2000px] opacity-100 mt-6"
      : "max-h-0 opacity-0"
  }`}
>
          <div className="min-w-[1100px]">
            <div className="grid grid-cols-8 gap-4 mb-4">
              <div />

              {weekDates.map((date) => (
                <div
                  key={date}
                  className="text-center font-semibold text-sm"
                >
                  {formatDay(date)}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {timeGrid.map((time) => (
                <div
                  key={time}
                  className="grid grid-cols-8 gap-4"
                >
                  <div className="text-[#94A3B8] text-sm pt-4">
                    {convertTime(time)}
                  </div>

                  {weekDates.map((date) => {
                    const booking = weekBookings.find(
                      (booking) =>
                        booking.date === date &&
                        booking.time?.startsWith(time.split(":")[0])
                    )

                    return (
                      <div
                        key={date + time}
                       className={`min-h-[90px] border rounded-2xl p-2 ${
  date === new Date().toISOString().split("T")[0]
    ? "border-[#A68A72] bg-[#1E293B]/70 shadow-[0_0_20px_rgba(166,138,114,0.12)]"
    : "border-[#334155] bg-[#0F172A]"
}`}
                      >
                        {booking && (
                          <button
                            onClick={() =>
                              setSelectedBooking(booking)
                            }
                            className="w-full text-left bg-[#1E293B] border border-[#334155] rounded-xl p-3 hover:border-[#A68A72] transition"
                          >
                            <p className="font-medium text-sm">
                              {booking.client_name}
                            </p>

                            <p className="text-[#94A3B8] text-xs mt-1">
                              {booking.service}
                            </p>

                            <p className="text-[#94A3B8] text-xs mt-2">
                              🕒 {booking.time}
                            </p>
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
  </div>
     
 </div>

        {selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-[#0F172A] border border-[#334155] rounded-3xl shadow-xl w-full max-w-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedBooking.client_name}
                  </h2>

                  <p className="text-[#94A3B8] mt-1">
                    {selectedBooking.service}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-[#94A3B8] hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  label="Date"
                  value={
                    selectedBooking.date
                      ? new Date(
                          selectedBooking.date
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "No date"
                  }
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

              {selectedBooking.notes && (
                <div className="bg-white/5 border border-[#334155] rounded-2xl p-4 mt-4">
                  <p className="text-[#94A3B8] text-sm">
                    Notes
                  </p>

                  <p className="text-white mt-1">
                    {selectedBooking.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <BookingForm />

        <div className="mt-8">
          <BookingsList />
        </div>
      </div>
    </DashboardLayout>
  )
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-white/5 border border-[#334155] rounded-2xl p-4">
      <p className="text-[#94A3B8] text-sm">{label}</p>
      <p className="text-white mt-1">{value}</p>
    </div>
  )
}

export default Bookings