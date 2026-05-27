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
  const [dayBookings, setDayBookings] = useState([])

  useEffect(() => {
    fetchDayBookings()
  }, [selectedDate])

  const fetchDayBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("date", selectedDate)
      .order("time", { ascending: true })

    if (error) {
      console.log(error)
      return
    }

    setDayBookings(data)
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
                Calendar View
              </h2>

              <p className="text-[#94A3B8] mt-1">
                View bookings by selected date.
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

          <div className="space-y-4">
            {dayBookings.length === 0 ? (
              <div className="border border-dashed border-[#334155] rounded-2xl p-8 text-center">
                <p className="text-[#94A3B8]">
                  No bookings for this date.
                </p>
              </div>
            ) : (
              dayBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-[#0F172A] border border-[#334155] rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <h3 className="font-semibold text-lg">
                      {booking.client_name}
                    </h3>

                    <p className="text-[#94A3B8]">
                      {booking.service}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[#94A3B8]">
                      🕒 {booking.time}
                    </span>

                    <span className="bg-green-500/20 text-green-200 border border-green-400/20 px-3 py-1 rounded-full text-sm">
                      {booking.status || "Pending"}
                    </span>
                  </div>
                </div>
              ))
            )}
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