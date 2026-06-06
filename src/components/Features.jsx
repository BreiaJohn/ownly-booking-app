function Features() {
  return (
    <section id="features" className="bg-[#020617] py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
   <div className="text-center mb-16">
  <span className="inline-flex items-center px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-300 text-sm mb-6">
    Features
  </span>

  <h2 className="text-5xl font-bold text-white">
    Everything you need
  </h2>

         
  <p className="mt-4 text-[#94A3B8] text-lg">
             Built for beauty professionals, creatives, and entrepreneurs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="bg-[#111827]/80 border border-[#334155] rounded-[32px] p-6 hover:border-[#94A3B8]/70 transition duration-300 flex flex-col">
            <div className="bg-[#0F172A] border border-[#334155] rounded-3xl p-5 mb-8 min-h-[220px]">
              <p className="text-white font-medium mb-5">Upcoming</p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center text-white">
                  AW
                </div>

                <div>
                  <h4 className="text-white font-semibold">
                    Alyssa Williams
                  </h4>
                  <p className="text-[#94A3B8] text-sm">
                    Silk Press · 2:00 PM
                  </p>
                  <div className="mt-2">
  <span className="text-xs bg-green-500/10 text-green-300 border border-green-500/20 px-2 py-1 rounded-full">
    Confirmed
  </span>
</div>
                </div>
              </div>
            </div>


            <h3 className="text-2xl font-semibold text-white mb-3">
              Booking Management
            </h3>

            <p className="text-[#94A3B8] leading-relaxed">
              Track requests, confirmations, cancellations, and upcoming
              appointments from one clean dashboard.
            </p>
          </div>

          <div className="bg-[#111827]/80 border border-[#334155] rounded-[32px] p-6 hover:border-[#94A3B8]/70 transition duration-300">
            <div className="bg-[#0F172A] border border-[#334155] rounded-3xl p-5 mb-8 min-h-[220px]">
              <p className="text-[#94A3B8] text-sm mb-2">
                This month
              </p>

              <h4 className="text-4xl font-bold text-white mb-5">
                $1,840
              </h4>


              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#94A3B8]">Deposits</span>
                  <span className="text-white">$620</span>
                </div>

               <div className="w-full h-3 bg-[#1E293B] rounded-full overflow-hidden">
  <div className="w-[60%] h-3 rounded-full bg-gradient-to-r from-green-500/30 to-green-400/60 backdrop-blur-sm"></div>
</div>

                <div className="flex justify-between text-sm">
                  <span className="text-[#94A3B8]">Completed services</span>
                  <span className="text-white">18</span>
                </div>
              </div>
            </div>


            <h3 className="text-2xl font-semibold text-white mb-3">
              Revenue Tracking
            </h3>

            <p className="text-[#94A3B8] leading-relaxed">
              See deposits, completed services, and estimated revenue without
              digging through messages.
            </p>
          </div>

          <div className="bg-[#111827]/80 border border-[#334155] rounded-[32px] p-6 hover:border-[#94A3B8]/70 transition duration-300">
            <div className="bg-[#0F172A] border border-[#334155] rounded-3xl p-5 mb-8 min-h-[220px]">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center text-white">
                  JC
                </div>

                <div>
                  <h4 className="text-white font-semibold">
                    Jasmine Carter
                  </h4>
                 <div className="flex items-center gap-2 mt-1">
  <p className="text-[#94A3B8] text-sm">
    12 visits
  </p>

  <span className="text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-1 rounded-full">
    VIP
  </span>
</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="h-20 rounded-2xl bg-[#1E293B] border border-[#334155]"></div>
                <div className="h-20 rounded-2xl bg-[#1E293B] border border-[#334155]"></div>
                <div className="h-20 rounded-2xl bg-[#1E293B] border border-[#334155]"></div>
              </div>
            </div>


           <h3 className="text-2xl font-semibold text-white mt-4 mb-4">
  Client Profiles
</h3>

            <p className="text-[#94A3B8] leading-relaxed">
              Keep client details, appointment history, notes, and portfolio
              work organized in one branded space.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features