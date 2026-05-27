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

        <section className="bg-white/5 border border-[#334155] rounded-3xl p-6 mb-8">
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

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {weekDates.map((date) => {
              const bookingsForDay = weekBookings.filter(
                (booking) => booking.date === date
              )

              return (
                <div
                  key={date}
                  className="bg-[#0F172A] border border-[#334155] rounded-2xl p-4 min-h-40"
                >
                  <h3 className="font-semibold mb-4">
                    {formatDay(date)}
                  </h3>

                  <div className="space-y-3">
                    {bookingsForDay.length === 0 ? (
                      <p className="text-[#64748B] text-sm">
                        No bookings
                      </p>
                    ) : (
                      bookingsForDay.map((booking) => (
                        <div
                          key={booking.id}
                          className="bg-white/5 border border-[#334155] rounded-xl p-3"
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
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <BookingForm />

        <div className="mt-8">
          <BookingsList />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Bookings