import DashboardLayout from "../layouts/DashboardLayout"

import StatsCard from "../components/StatsCard"

import AppointmentCard from "../components/AppointmentCard"

import RecentActivity from "../components/RecentActivity"

import BookingForm from "../components/BookingForm"

import BookingsList from "../components/BookingsList"

function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl md:text-5xl font-bold text-[#1E1E1E]">
        Welcome Back
      </h1>

      <p className="text-[#8B6F5A] mt-3">
        Here’s what’s happening with your business today.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 md:mt-10">
        <StatsCard title="Appointments" value="24" />

        <StatsCard title="Revenue" value="$1,840" />

        <StatsCard title="Clients" value="156" />
      </div>

      <AppointmentCard />

      <RecentActivity />

      <BookingForm />

      <BookingsList />

    </DashboardLayout>

  )
}

export default Dashboard