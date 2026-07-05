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
  const [email, setEmail] = useState("")
  const [businessSettings, setBusinessSettings] = useState(null)
  const [blockedTimes, setBlockedTimes] = useState([])
  const [bookedTimes, setBookedTimes] = useState([])
  const [isSaved, setIsSaved] = useState(false)

  const timeSlots = generateTimeSlots(
    businessSettings?.start_time || "09:00",
    businessSettings?.end_time || "17:00",
    businessSettings?.appointment_length || 60,
    businessSettings?.buffer_time || 0
  ).filter(
    (slot) =>
      !bookedTimes.includes(slot) &&
      !blockedTimes.includes(slot)
  )

  useEffect(() => {
    if (session?.user?.id) {
      fetchBusinessSettings()
    }
  }, [session])

  useEffect(() => {
    if (date) {
      fetchBookedTimes()
      fetchBlockedTimes()
      setTime("")
    } else {
      setBookedTimes([])
      setBlockedTimes([])
      setTime("")
    }
  }, [date])

  const fetchBusinessSettings = async () => {
    const { data, error } = await supabase
      .from("business_settings")
      .select("*")
      .eq("user_id", session.user.id)
      .single()

    if (error) {
      console.log(error)
      return
    }

    setBusinessSettings(data)
  }

  const fetchBookedTimes = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("time")
      .eq("date", date)

    if (error) {
      console.log(error)
      return
    }

    setBookedTimes(data.map((booking) => booking.time))
  }

  const fetchBlockedTimes = async () => {
    const { data, error } = await supabase
      .from("blocked_times")
      .select("time")
      .eq("date", date)
      .eq("user_id", session.user.id)

    if (error) {
      console.log(error)
      return
    }

    setBlockedTimes(data.map((blocked) => blocked.time))
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
      .maybeSingle()

    if (existingBooking) {
      toast.error("That time is already booked")
      return
    }

    const { error } = await supabase.from("bookings").insert([
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
      return
    }

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

  return (
    <form
      onSubmit={handleSubmit}
   className="w-full max-w-full overflow-hidden bg-white/5 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-[#334155] mt-6 shadow-sm"
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

<div className="relative w-full">
  <label className="block text-sm text-[#94A3B8] mb-2">
    Choose Date
  </label>
  <input
    type="date"
    value={date}
    onChange={(e) => setDate(e.target.value)}
    style={{ colorScheme: "dark" }}
    className={`w-full appearance-none bg-[#0F172A] border border-[#334155] rounded-2xl px-4 py-4 pr-12 outline-none focus:ring-2 focus:ring-blue-400 ${
      date ? "text-white" : "text-[#94A3B8]"
    }`}
  />
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
          className={`w-full py-4 rounded-2xl font-semibold border backdrop-blur-md transition duration-300 ${
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