function DashboardPreview() {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-xl border border-[#E7E1D9]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-semibold text-[#1E1E1E]">
            Dashboard
          </h3>

          <p className="text-[#8B6F5A] mt-1">
            Manage your business effortlessly.
          </p>
        </div>
        <button className="bg-[#8B6F5A] text-white px-4 py-2 rounded-xl text-sm">
          + Booking
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#F7F4EF] rounded-2xl p-4">
          <p className="text-sm text-[#8B6F5A]">Appointments</p>
          <h2 className="text-3xl font-bold text-[#1E1E1E] mt-2">24</h2>
        </div>

        <div className="bg-[#F7F4EF] rounded-2xl p-4">
          <p className="text-sm text-[#8B6F5A]">Revenue</p>
          <h2 className="text-3xl font-bold text-[#1E1E1E] mt-2">$1,840</h2>
        </div>
      </div>
 <div className="mt-6 bg-[#F7F4EF] rounded-2xl p-4">
        <p className="text-[#8B6F5A] text-sm mb-3">
          Upcoming Appointment
        </p>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-[#1E1E1E]">
              Alyssa Williams
            </h4>

            <p className="text-sm text-[#8B6F5A]">
              Balayage + Treatment
            </p>
          </div>

          <span className="text-sm font-medium text-[#1E1E1E]">
            2:00 PM
          </span>
        </div>
          </div>
    </div>
  )
}

export default DashboardPreview