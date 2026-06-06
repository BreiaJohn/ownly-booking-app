function DashboardPreview() {
  return (
    <div className="bg-[#111827] rounded-3xl shadow-xl p-6 w-full max-w-xl border border-[#334155]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-semibold text-white">
            Dashboard
          </h3>

          <p className="text-[#94A3B8] mt-1">
            Manage your business effortlessly.
          </p>
        </div>

        <div className="flex items-center gap-3">
       

         <button className="border border-blue-500/30 bg-blue-500/10 text-blue-300 px-5 py-2 rounded-2xl text-sm hover:bg-blue-500/20 transition">
  + Booking
</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#0F172A] rounded-2xl p-4 border border-[#334155]">
          <p className="text-sm text-[#94A3B8]">
            Appointments
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            24
          </h2>
        </div>

        <div className="bg-[#0F172A] rounded-2xl p-4 border border-[#334155]">
          <p className="text-[#94A3B8] text-sm mb-3">
            Revenue
          </p>

         <div className="flex items-center gap-3">
  <span className="text-xs bg-green-500/10 text-green-300 border border-green-500/20 px-2 py-1 rounded-full">
    +18%
  </span>

<h2 className="text-3xl font-bold text-[#CBD5E1]">
  $1,840
</h2>
</div>
        </div>
      </div>

      <div className="mt-6 bg-[#0F172A] rounded-2xl p-4 border border-[#334155]">
        <div className="flex items-center gap-3 mb-3">
  <p className="text-[#94A3B8] text-sm">
    Upcoming Appointment
  </p>

  <span className="text-xs bg-green-500/10 text-green-300 border border-green-500/20 px-3 py-1 rounded-full">
    Confirmed
  </span>
</div>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-white">
              Alyssa Williams
            </h4>

            <p className="text-sm text-[#94A3B8]">
              Balayage + Treatment
            </p>
          </div>

          <span className="text-sm font-medium text-white">
            2:00 PM
          </span>
        </div>
      </div>
    </div> 
  )
}

export default DashboardPreview