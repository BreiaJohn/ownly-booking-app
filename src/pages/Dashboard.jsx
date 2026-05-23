import DashboardLayout from "../layouts/DashboardLayout"
import BookingForm from "../components/BookingForm"
import BookingsList from "../components/BookingsList"

function Dashboard() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0F172A] text-white">
        <div className="flex items-center justify-between mb-6">
          
          <button className="border border-[#334155] rounded-2xl p-4 text-2xl">
            ☰
          </button>
        </div>

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
            <OverviewCard icon="📅" value="2" label="Appointments Today" />
            <OverviewCard icon="👥" value="8" label="Clients Total" />
            <OverviewCard icon="💳" value="$340" label="Revenue This Month" />
            <OverviewCard icon="🕒" value="12" label="Bookings This Month" />
          </div>
        </section>

       <section className="bg-white/5 backdrop-blur-md border border-[#1E293B] rounded-3xl p-6 mb-6">

  <h3 className="text-[#94A3B8] font-semibold mb-5">
    Quick Actions
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

    <ActionCard
      icon="+"
      label="New Booking"
    />

    <ActionCard
      icon="👥"
      label="View Clients"
    />

    <ActionCard
      icon="$"
      label="View Payments"
    />

  </div>

</section>

        <section className="bg-white/5 backdrop-blur-md border border-[#1E293B] rounded-3xl p-6">
          <h3 className="text-[#94A3B8] font-semibold mb-5">
            Recent Activity
          </h3>

          <div className="space-y-5">
            <ActivityItem
              color="bg-green-400"
              title="New booking from Breia m John"
              subtitle="Hair appointment on May 22, 2026"
              time="2m ago"
            />

            <ActivityItem
              color="bg-blue-400"
              title="Payment received"
              subtitle="$120 for Nail appointment"
              time="1h ago"
            />

            <ActivityItem
              color="bg-purple-400"
              title="Client Breia m John updated"
              subtitle="Contact information updated"
              time="3h ago"
            />
          </div>
        </section>

        <div className="mt-8">
          <BookingForm />
        </div>

        <div className="mt-8">
          <BookingsList />
        </div>
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

function ActionCard({ icon, label }) {
  return (
   <button className="group w-full bg-[#0F172A] border border-[#334155] rounded-2xl px-4 py-4 flex items-center justify-between hover:border-[#A68A72] hover:bg-[#111C33] transition duration-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#A68A72]/20 flex items-center justify-center text-[#E7D3BE] text-lg">
          {icon}
        </div>

        <span className="text-white font-medium whitespace-nowrap">
          {label}
        </span>
      </div>

      <span className="inline-block text-[#64748B] group-hover:translate-x-1 transition-transform duration-300">
  →
</span>
    </button>
  )
}

function AppointmentRow({ name, service, status, date, time }) {
  return (
    <div className="bg-[#0F172A] border border-[#334155] rounded-2xl p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="bg-[#A68A72] w-12 h-12 rounded-full flex items-center justify-center font-bold">
          BJ
        </div>

        <div>
          <p className="font-semibold">{name}</p>
          <div className="flex gap-2 mt-1">
            <span className="bg-[#E8D8C4] text-[#6F4E37] px-3 py-1 rounded-full text-xs">
              {service}
            </span>

            <span className="bg-green-900/50 text-green-300 px-3 py-1 rounded-full text-xs">
              {status}
            </span>
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-6 text-[#94A3B8]">
        <span>📅 {date}</span>
        <span>🕒 {time}</span>
      </div>

      <span className="text-[#94A3B8]">›</span>
    </div>
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