import DashboardLayout from "../layouts/DashboardLayout"
import BookingForm from "../components/BookingForm"
import BookingsList from "../components/BookingsList"
import logo from "../assets/ownly-logo.png"

function Bookings() {
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

        <BookingForm />

        <div className="mt-8">
          <BookingsList />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Bookings
