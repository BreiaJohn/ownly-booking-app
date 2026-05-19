function AppointmentCard() {
  return (
    <div className="bg-white p-6 rounded-3xl border border-[#E7E1D9] shadow-sm mt-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-[#1E1E1E]">
            Upcoming Appointment
          </h3>

          <p className="text-[#8B6F5A] mt-2">
            Alyssa Williams • Balayage + Treatment
          </p>
        </div>

        <div className="text-right">
          <p className="text-[#1E1E1E] font-semibold">
            Today
          </p>

          <p className="text-[#8B6F5A]">
            2:00 PM
          </p>
        </div>
      </div>
    </div>
  )
}

export default AppointmentCard