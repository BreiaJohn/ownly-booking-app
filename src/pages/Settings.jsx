import { useEffect, useState } from "react"
import DashboardLayout from "../layouts/DashboardLayout"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"

function Settings() {
  const { session } = useAuth()

  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("18:00")
  const [appointmentLength, setAppointmentLength] = useState("30")
  const [bufferTime, setBufferTime] = useState("0")

  const [blockedDate, setBlockedDate] = useState("")
  const [blockedTime, setBlockedTime] = useState("")
  const [blockedReason, setBlockedReason] = useState("")
  const [blockedList, setBlockedList] = useState([])

  useEffect(() => {
    if (session?.user?.id) {
      fetchSettings()
      fetchBlockedTimes()
    }
  }, [session])

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("business_settings")
      .select("*")
      .eq("user_id", session.user.id)
      .single()

    if (error) {
      console.log(error)
      return
    }

    if (data) {
      setStartTime(data.start_time || "09:00")
      setEndTime(data.end_time || "18:00")
      setAppointmentLength(data.appointment_length || "30")
      setBufferTime(data.buffer_time || "0")
    }
  }

  const fetchBlockedTimes = async () => {
    const { data, error } = await supabase
      .from("blocked_times")
      .select("*")
      .eq("user_id", session.user.id)
      .order("date", { ascending: true })

    if (error) {
      console.log(error)
      return
    }

    setBlockedList(data || [])
  }

  const handleSaveSettings = async () => {
    const { error } = await supabase
      .from("business_settings")
      .upsert(
        {
          user_id: session.user.id,
          start_time: startTime,
          end_time: endTime,
          appointment_length: appointmentLength,
          buffer_time: bufferTime,
        },
        {
          onConflict: "user_id",
        }
      )

    if (error) {
      toast.error("Failed to save settings")
      console.log(error)
      return
    }

    toast.success("Settings saved!")
  }

  const handleAddBlockedTime = async () => {
    if (!blockedDate || !blockedTime) {
      toast.error("Choose a date and time to block")
      return
    }

    const { error } = await supabase.from("blocked_times").insert([
      {
        user_id: session.user.id,
        date: blockedDate,
        time: blockedTime,
        reason: blockedReason,
      },
    ])

    if (error) {
      toast.error("Failed to block time")
      console.log(error)
      return
    }

    toast.success("Time blocked!")
    setBlockedDate("")
    setBlockedTime("")
    setBlockedReason("")
    fetchBlockedTimes()
  }

  const handleDeleteBlockedTime = async (id) => {
    const { error } = await supabase
      .from("blocked_times")
      .delete()
      .eq("id", id)

    if (error) {
      toast.error("Failed to remove blocked time")
      console.log(error)
      return
    }

    toast.success("Blocked time removed!")
    setBlockedList((prev) =>
      prev.filter((blocked) => blocked.id !== id)
    )
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0F172A] text-white overflow-x-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
         <section className="w-full max-w-full overflow-hidden bg-white/5 backdrop-blur-md border border-[#334155] rounded-3xl p-5 sm:p-6 md:p-8 shadow-sm">
            <div className="mb-8">
<p className="text-blue-300 text-sm font-semibold mb-2 tracking-wide">
  Availability
</p>
              <h1 className="text-3xl md:text-5xl font-bold text-white">
                Settings
              </h1>

              <p className="text-[#94A3B8] mt-3 max-w-xl">
                Customize your booking hours, appointment length, buffer time,
                and unavailable slots.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-[#CBD5E1] mb-2">
                  Start Time
                </label>

                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  style={{ colorScheme: "dark" }}
                  className="w-full max-w-full box-border bg-[#0F172A] border border-[#334155] rounded-2xl px-4 py-4 text-white outline-none focus:ring-2 focus:ring-[#B79A82"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#CBD5E1] mb-2">
                  End Time
                </label>

                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  style={{ colorScheme: "dark" }}
                  className="
  w-full
  bg-[#0F172A]
  border
  border-[#334155]
  rounded-2xl
  px-4
  py-4
  text-white
  outline-none
  focus:border-blue-400
  focus:ring-2
  focus:ring-blue-400/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#CBD5E1] mb-2">
                  Appointment Length
                </label>

                <select
                  value={appointmentLength}
                  onChange={(e) => setAppointmentLength(e.target.value)}
                  className="w-full max-w-full box-border bg-[#0F172A] border border-[#334155] rounded-2xl px-4 py-4 text-white outline-none focus:ring-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">1 Hour</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#CBD5E1] mb-2">
                  Buffer Time
                </label>

                <select
                  value={bufferTime}
                  onChange={(e) => setBufferTime(e.target.value)}
                  className="w-full max-w-full box-border bg-[#0F172A] border border-[#334155] rounded-2xl px-4 py-4 text-white outline-none focus:ring-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                >
                  <option value="0">No Buffer</option>
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveSettings}
              className="w-full mt-8 bg-white/10 border border-white/20 text-white py-4 rounded-2xl font-semibold hover:bg-white/15 hover:border-[#B79A82]/60 hover:shadow-[0_0_25px_rgba(183,154,130,0.22)] transition duration-300">
              Save Settings
            </button>
          </section>

          <section className="w-full max-w-full overflow-hidden bg-white/5 backdrop-blur-md border border-[#334155] rounded-3xl p-5 sm:p-6 md:p-8 shadow-sm">
            <div className="mb-6">


              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Block Time
              </h2>

              <p className="text-[#94A3B8] mt-2">
                Block specific dates and times so clients cannot book them.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="date"
                value={blockedDate}
                onChange={(e) => setBlockedDate(e.target.value)}
                style={{ colorScheme: "dark" }}
                className="w-full max-w-full box-border bg-[#0F172A] border border-[#334155] rounded-2xl px-4 py-4 text-white outline-none focus:ring-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
              />

              <input
                type="time"
                value={blockedTime}
                onChange={(e) => setBlockedTime(e.target.value)}
                style={{ colorScheme: "dark" }}
                className="w-full max-w-full box-border bg-[#0F172A] border border-[#334155] rounded-2xl px-4 py-4 text-white outline-none focus:ring-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
              />

              <input
                type="text"
                placeholder="Reason optional"
                value={blockedReason}
                onChange={(e) => setBlockedReason(e.target.value)}
                className="w-full max-w-full box-border bg-[#0F172A] border border-[#334155] rounded-2xl px-4 py-4 text-white placeholder:text-[#94A3B8] outline-none focus:ring-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
              />
            </div>

            <button
              type="button"
              onClick={handleAddBlockedTime}
              className="w-full mt-5 bg-white/10 border border-white/20 text-white py-4 rounded-2xl font-semibold hover:bg-white/15 hover:border-[#B79A82]/60 transition"
            >
              Block Time
            </button>

            <div className="mt-6 space-y-3">
              {blockedList.length === 0 ? (
                <p className="text-[#94A3B8] text-sm">
                  No blocked times yet.
                </p>
              ) : (
                blockedList.map((blocked) => (
                  <div
                    key={blocked.id}
                    className="bg-[#0F172A] border border-[#334155] rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div>
                      <p className="font-semibold text-white">
                        {blocked.date}
                      </p>

                      <p className="text-[#94A3B8]">
                        {blocked.time}
                      </p>

                      {blocked.reason && (
                        <p className="text-sm text-[#64748B]">
                          {blocked.reason}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteBlockedTime(blocked.id)}
                      className="bg-red-500/15 border border-red-500/30 text-red-300 px-4 py-2 rounded-xl hover:bg-red-500/25 transition"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Settings