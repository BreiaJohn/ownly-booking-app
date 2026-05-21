import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"

import toast from "react-hot-toast"

function BookingForm() {
  const { session } = useAuth()

 const [clientName, setClientName] = useState("")
const [service, setService] = useState("")
const [date, setDate] = useState("")
const [time, setTime] = useState("")
const [phone, setPhone] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { data, error } = await supabase
  .from("bookings")
  .insert([
    {
      client_name: clientName,
      service: service,
      date: date,
      time: time,
      phone: phone,
      user_id: session.user.id,
    },
  ])
    if (error) {
  toast.error("Failed to create booking")
} else {
  toast.success("Booking created!")
}

    setClientName("")
    setService("")
    setDate("")
    setTime("")
    setPhone("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#F8FAFC] p-4 md:p-6 rounded-3xl border border-[#E2E8F0] mt-10 shadow-sm"
    >
      <h2 className="text-2xl font-bold text-[#0F172A] mb-6">
        Create Booking
      </h2>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Client Name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="w-full min-w-0 bg-white border border-[#CBD5E1] rounded-2xl px-4 py-4 text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:ring-2 focus:ring-[#C08457]"
        />

        <input
          type="text"
          placeholder="Service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="w-full min-w-0 bg-white border border-[#CBD5E1] rounded-2xl px-4 py-4 text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:ring-2 focus:ring-[#C08457]"
        />

        <input
  type="date"
  value={date}
  onChange={(e) => setDate(e.target.value)}
  className="w-full min-w-0 bg-white border border-[#CBD5E1] rounded-2xl px-4 py-4 text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:ring-2 focus:ring-[#C08457]"
/>

<input
  type="time"
  value={time}
  onChange={(e) => setTime(e.target.value)}
  className="w-full min-w-0 bg-white border border-[#CBD5E1] rounded-2xl px-4 py-4 text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:ring-2 focus:ring-[#C08457]"
/>

<input
  type="text"
  placeholder="Phone Number"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
 className="w-full min-w-0 bg-white border border-[#CBD5E1] rounded-2xl px-4 py-4 text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:ring-2 focus:ring-[#C08457]"
/>

        <button
          type="submit"
          className="bg-[#8B6F5A] text-[#0F172A] py-4 rounded-2xl hover:opacity-90 transition"
        >
          Save Booking
        </button>
      </div>
    </form>
  )
}

export default BookingForm