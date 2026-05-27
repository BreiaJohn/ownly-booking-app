import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import DashboardLayout from "../layouts/DashboardLayout"
import { supabase } from "../lib/supabase"

function Dashboard() {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.log(error)
      return
    }

    setBookings(data)
  }

  const today = new Date().toISOString().split("T")[0]

  const appointmentsToday = bookings.filter(
    (booking) => booking.date === today
  ).length

  const clientsTotal = new Set(
    bookings.map((booking) => booking.client_name)
  ).size

  const revenueThisMonth = bookings.reduce(
    (sum, booking) => sum + Number(booking.amount || 0),
    0
  )

  const bookingsThisMonth = bookings.length

  const recentBookings = bookings.slice(0, 3)

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0F172A] text-white">
        <div className="bg-white/5 backdrop-blur-md border border-[#1E293B] rounded-2xl px-5 py-4 mb-6">
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-transparent outline-none text-white placeholder:text-[#64748B]"
          />
        </div>

        <section className="bg-white/5 backdrop-blur-md border border-[#1E293B] rounded-3xl p-6 mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              Welcome back, Breia 👋
            </h2>

            <p className="text-[#94A3B8] mt-2">
              Here’s what’s happening today.
            </p>
          </div>

          <div className="bg-[#A68A72] text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold">
            BJ
          </div>
        </section>

        <section className="bg-white/5 backdrop-blur-md border border-[#1E293B] rounded-3xl p-6 mb-6">
          <h3 className="text-[#94A3B8] font-semibold mb-5">
            Today’s Overview
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <OverviewCard
              icon="📅"
              value={appointmentsToday}
              label="Appointments Today"
            />

            <OverviewCard
              icon="👥"
              value={clientsTotal}
              label="Clients Total"
            />

            <OverviewCard
              icon="💳"
              value={`$${revenueThisMonth}`}
              label="Revenue Total"
            />

            <OverviewCard
              icon="🕒"
              value={bookingsThisMonth}
              label="Total Bookings"
            />
          </div>
        </section>

        <section className="bg-white/5 backdrop-blur-md border border-[#1E293B] rounded-3xl p-6 mb-6">
          <h3 className="text-[#94A3B8] font-semibold mb-5">
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionCard
              to="/bookings"
              icon="+"
              label="New Booking"
              color="bg-[#B08968]/25 text-[#F3D9C1]"
            />

            <ActionCard
              to="/clients"
              icon="👥"
              label="View Clients"
              color="bg-[#2E5E4E]/25 text-[#9EE6C3]"
            />

            <ActionCard
              to="/payments"
              icon="$"
              label="View Payments"
              color="bg-[#5B4B8A]/25 text-[#C7B8FF]"
            />
          </div>
        </section>

        <section className="bg-white/5 backdrop-blur-md border border-[#1E293B] rounded-3xl p-6">
          <h3 className="text-[#94A3B8] font-semibold mb-5">
            Recent Activity
          </h3>

          <div className="space-y-5">
            {recentBookings.length === 0 ? (
              <p className="text-[#94A3B8]">
                No recent activity yet.
              </p>
            ) : (
              recentBookings.map((booking) => (
                <ActivityItem
                  key={booking.id}
                  color="bg-green-400"
                  title={`New booking from ${booking.client_name}`}
                  subtitle={`${booking.service || "Service"} on ${
                    booking.date || "No date"
                  }`}
                  time={booking.status || "Pending"}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}

function OverviewCard({ icon, value, label }) {
  return (
    <div className="bg-[#0F172A] border border-[#334155] rounded-2xl p-5">
      <div className="mb-5 text-2xl">{icon}</div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-[#94A3B8] mt-2">{label}</p>
    </div>
  )
}

function ActionCard({ to, icon, label, color }) {
  return (
    <Link
      to={to}
      className="group w-full bg-[#0F172A] border border-[#334155] rounded-2xl px-4 py-4 flex items-center justify-between hover:border-[#A68A72] hover:bg-[#111C33] transition duration-300"
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-lg`}
        >
          {icon}
        </div>

        <span className="text-white font-medium whitespace-nowrap">
          {label}
        </span>
      </div>

      <span className="inline-block text-[#64748B] group-hover:translate-x-1 transition-transform duration-300">
        →
      </span>
    </Link>
  )
}

function ActivityItem({ color, title, subtitle, time }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex gap-4">
        <span className={`${color} w-4 h-4 rounded-full mt-1`} />

        <div>
          <p className="font-medium">{title}</p>
          <p className="text-[#94A3B8]">{subtitle}</p>
        </div>
      </div>

      <p className="text-[#94A3B8] text-sm">{time}</p>
    </div>
  )
}

export default Dashboard