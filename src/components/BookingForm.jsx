import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"

import toast from "react-hot-toast"
import { generateTimeSlots } from "../utils/generateTimeSlots"



function BookingForm() {
  const { session } = useAuth()

 const [clientName, setClientName] = useState("")
const [service, setService] = useState("")
const [date, setDate] = useState("")
const [time, setTime] = useState("")
const [phone, setPhone] = useState("")
const [businessSettings, setBusinessSettings] = useState(null)
const [blockedTimes, setBlockedTimes] = useState([])
const [bookedTimes, setBookedTimes] = useState([])
const [isSaved, setIsSaved] = useState(false)
const [email, setEmail] = useState("")


const timeSlots = businessSettings
  ? generateTimeSlots(
  businessSettings.start_time,
  businessSettings.end_time,
  businessSettings.appointment_length,
  businessSettings.buffer_time || "0"
).filter(
  (slot) =>
    !bookedTimes.includes(slot) &&
    !blockedTimes.includes(slot)
)
  : []

  useEffect(() => {
  if (session?.user?.id) {
    fetchBusinessSettings()
  }
}, [session])

useEffect(() => {
  if (date) {
    fetchBookedTimes()
  }
}, [date])

useEffect(() => {
  if (date) {
    fetchBlockedTimes()
  }
}, [date])
const fetchBusinessSettings = async () => {
  const { data, error } = await supabase
    .from("business_settings")
    .select("*")
    .eq("user_id", session.user.id)
    .single()

  if (data) {
    setBusinessSettings(data)
  }

  if (error) {
    console.log(error)
  }
}

const fetchBookedTimes = async () => {
  const { data, error } = await supabase
    .from("bookings")
    .select("time")
    .eq("date", date)

  if (data) {
    setBookedTimes(data.map((booking) => booking.time))
  }

  if (error) {
    console.log(error)
  }
}

const fetchBlockedTimes = async () => {
  const { data, error } = await supabase
    .from("blocked_times")
    .select("time")
    .eq("date", date)
    .eq("user_id", session.user.id)

  if (data) {
    setBlockedTimes(data.map((blocked) => blocked.time))
  }

  if (error) {
    console.log(error)
  }
}

  const handleSubmit = async (e) => {
  e.preventDefault()

  if (!clientName || !service || !date || !time || !phone) {
    toast.error("Please fill out all fields")
    return
  }

  const { data: existingBooking } = await supabase
    .from("bookings")
    .select("*")
    .eq("date", date)
    .eq("time", time)
    .single()

  if (existingBooking) {
    toast.error("That time is already booked")
    return
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert([
      {
        client_name: clientName,
        service,
        date,
        time,
        phone,
        email,
        user_id: session.user.id,
      },
    ])

  if (error) {
    toast.error("Failed to create booking")
  } else {
    toast.success("Booking created!")
    setIsSaved(true)

    setTimeout(() => {
      setIsSaved(false)
    }, 2000)

    setClientName("")
    setService("")
    setDate("")
    setTime("")
    setPhone("")
    setEmail("")
  }
}

  return (
    <form
      onSubmit={handleSubmit}
     className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-[#334155] mt-10 shadow-sm"
    >
      <h2 className="text-2xl font-bold text-white mb-6">
        Create Booking
      </h2>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Client Name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="w-full min-w-0 bg-[#0F172A] border border-[#334155] rounded-2xl px-4 py-4 text-white placeholder:text-[#94A3B8] outline-none focus:ring-2 focus:ring-[#A68A72]"
        />

        <input
          type="text"
          placeholder="Service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="w-full min-w-0 bg-[#0F172A] border border-[#334155] rounded-2xl px-4 py-4 text-white placeholder:text-[#94A3B8] outline-none focus:ring-2 focus:ring-[#A68A72]"
        />

 <div className="relative">
  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
    {!date && "Select Date"}
  </span>
  
<div className="relative">
  <input
    type="date"
    value={date}
    onChange={(e) => setDate(e.target.value)}
    style={{
      colorScheme: "dark",
      WebkitAppearance: "none",
    }}
    className="w-full min-w-0 bg-[#0F172A] border border-[#334155] rounded-2xl px-4 py-4 text-white outline-none focus:ring-2 focus:ring-[#A68A72]"
  />
</div>

</div>

<select
  value={time}
  onChange={(e) => setTime(e.target.value)}
className="w-full min-w-0 bg-[#0F172A] border border-[#334155] rounded-2xl px-4 py-4 text-white appearance-none outline-none focus:ring-2 focus:ring-[#A68A72]"
>
  <option value="">Select Time</option>

  {timeSlots.map((slot) => (
    <option key={slot} value={slot}>
      {slot}
    </option>
  ))}
</select>

<input
  type="text"
  placeholder="Phone Number"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
className="w-full min-w-0 bg-[#0F172A] border border-[#334155] rounded-2xl px-4 py-4 text-white placeholder:text-[#94A3B8] outline-none focus:ring-2 focus:ring-[#A68A72]"
/>

<input
  type="email"
  placeholder="Email Address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full min-w-0 bg-[#0F172A] border border-[#334155] rounded-2xl px-4 py-4 text-white placeholder:text-[#94A3B8] outline-none focus:ring-2 focus:ring-[#A68A72]"
/>

        <button
  type="submit"
  className={`w-full py-4 rounded-2xl font-semibold border backdrop-blur-md transition duration-300
    ${
      isSaved
        ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-200 shadow-[0_0_25px_rgba(16,185,129,0.25)]"
        : "bg-white/10 border-white/20 text-white hover:bg-white/15 hover:border-[#A68A72]/60 hover:shadow-[0_0_25px_rgba(166,138,114,0.22)] hover:scale-[1.01]"
    }`}
>
  {isSaved ? "Booking Saved ✓" : "Save Booking"}
</button>
      </div>
    </form>
  )
}

export default BookingForm