import { useEffect, useState } from "react"
import DashboardLayout from "../layouts/DashboardLayout"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"


function Settings() {

  const { session } = useAuth()

  const [startTime, setStartTime] =
    useState("09:00")

  const [endTime, setEndTime] =
    useState("18:00")

  const [appointmentLength, setAppointmentLength] =
    useState("30")

  const [bufferTime, setBufferTime] = useState("0")

const [blockedDate, setBlockedDate] = useState("")
const [blockedTime, setBlockedTime] = useState("")
const [blockedReason, setBlockedReason] = useState("")

   useEffect(() => {
  if (session?.user?.id) {
    fetchSettings()
  }
}, [session])

const fetchSettings = async () => {
  const { data, error } = await supabase
    .from("business_settings")
    .select("*")
    .eq("user_id", session.user.id)
    .single()

  if (data) {
    setStartTime(data.start_time)
    setEndTime(data.end_time)
    setAppointmentLength(data.appointment_length)
    setBufferTime(data.buffer_time || "0")
  }

  if (error) {
    console.log(error)
  }
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
  } else {
    toast.success("Settings saved!")
  }
}
const handleAddBlockedTime = async () => {
  if (!blockedDate || !blockedTime) {
    toast.error("Choose a date and time to block")
    return
  }

  const { error } = await supabase
    .from("blocked_times")
    .insert([
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
  } else {
    toast.success("Time blocked!")
    setBlockedDate("")
    setBlockedTime("")
    setBlockedReason("")
  }
}

  return (
    <DashboardLayout>
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl p-6 md:p-8 shadow-sm">

        <h1 className="text-3xl md:text-5xl font-bold text-[#0F172A]">
          Settings
        </h1>

        <p className="text-[#64748B] mt-3">
          Customize your booking availability.
        </p>

        <div className="mt-8 flex flex-col gap-6">

          <div>
            <label className="block text-sm font-medium text-[#334155] mb-2">
              Start Time
            </label>

            <input
              type="time"
              value={startTime}
              onChange={(e) =>
                setStartTime(e.target.value)
              }
              className="w-full border border-[#CBD5E1] rounded-2xl p-4 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#334155] mb-2">
              End Time
            </label>

            <input
              type="time"
              value={endTime}
              onChange={(e) =>
                setEndTime(e.target.value)
              }
              className="w-full border border-[#CBD5E1] rounded-2xl p-4 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#334155] mb-2">
              Appointment Length
            </label>

            <select
              value={appointmentLength}
              onChange={(e) =>
                setAppointmentLength(
                  e.target.value
                )
              }
              className="w-full border border-[#CBD5E1] rounded-2xl p-4 outline-none"
            >
              <option value="15">
                15 Minutes
              </option>

              <option value="30">
                30 Minutes
              </option>

              <option value="60">
                1 Hour
              </option>
            </select>
          </div>
<div>
  <label className="block text-sm font-medium text-[#334155] mb-2">
    Buffer Time
  </label>

  <select
    value={bufferTime}
    onChange={(e) =>
      setBufferTime(e.target.value)
    }
    className="w-full border border-[#CBD5E1] rounded-2xl p-4 outline-none"
  >
    <option value="0">
      No Buffer
    </option>

    <option value="15">
      15 Minutes
    </option>

    <option value="30">
      30 Minutes
    </option>
  </select>
</div>
         <button
        type="button"
        onClick={handleSaveSettings}
        className="bg-[#8B6F5A] hover:opacity-90 text-white py-4 rounded-2xl transition"
>
  Save Settings
</button>
<div className="border-t border-[#E2E8F0] pt-6 mt-4">
  <h2 className="text-2xl font-bold text-[#0F172A] mb-4">
    Block Time
  </h2>

  <div className="flex flex-col gap-4">
    <input
      type="date"
      value={blockedDate}
      onChange={(e) => setBlockedDate(e.target.value)}
      className="w-full border border-[#CBD5E1] rounded-2xl p-4 outline-none"
    />

    <input
      type="time"
      value={blockedTime}
      onChange={(e) => setBlockedTime(e.target.value)}
      className="w-full border border-[#CBD5E1] rounded-2xl p-4 outline-none"
    />

    <input
      type="text"
      placeholder="Reason optional"
      value={blockedReason}
      onChange={(e) => setBlockedReason(e.target.value)}
      className="w-full border border-[#CBD5E1] rounded-2xl p-4 outline-none"
    />

    <button
      type="button"
      onClick={handleAddBlockedTime}
      className="bg-[#0F172A] text-white py-4 rounded-2xl hover:opacity-90 transition"
    >
      Block Time
    </button>
  </div>
</div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Settings