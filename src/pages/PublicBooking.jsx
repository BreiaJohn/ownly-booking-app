import { useState } from "react"
import { supabase } from "../lib/supabase"
import toast from "react-hot-toast"

function PublicBooking() {
  const [clientName, setClientName] = useState("")
  const [service, setService] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [notes, setNotes] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleBooking = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from("bookings").insert([
      {
        client_name: clientName,
        service,
        date,
        time,
        email,
        phone,
        notes,
        status: "Pending",
      },
    ])

    setLoading(false)

    if (error) {
      console.log(error)
      toast.error("Failed to create booking")
      return
    }

    toast.success("Booking submitted!")
    setSubmitted(true)

    setClientName("")
    setService("")
    setDate("")
    setTime("")
    setEmail("")
    setPhone("")
    setNotes("")
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#A68A72]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#334155]/30 rounded-full blur-3xl" />
      </div>

      {submitted ? (
        <div className="relative bg-[#111827]/90 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-[#334155] w-full max-w-xl text-center shadow-xl">
          <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-3xl">
            ✓
          </div>

          <h1 className="text-3xl md:text-4xl font-semibold">
            Booking Submitted
          </h1>

          <p className="text-[#94A3B8] mt-4">
            Your appointment request has been sent successfully.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleBooking}
          className="relative bg-[#111827]/90 backdrop-blur-md rounded-3xl p-6 md:p-10 border border-[#334155] w-full max-w-xl shadow-xl"
        >
          <p className="text-[#A68A72] uppercase tracking-[0.3em] text-xs mb-3">
            Ownly Booking
          </p>

          <h1 className="text-3xl md:text-4xl font-semibold">
            Book an Appointment
          </h1>

          <p className="text-[#94A3B8] mt-3 mb-8">
            Choose your service and preferred appointment time.
          </p>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              required
              placeholder="Your Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="bg-[#0F172A] text-white placeholder:text-[#64748B] p-4 rounded-2xl border border-[#334155] outline-none focus:border-[#A68A72]"
            />

            <select
              required
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="bg-[#0F172A] text-white p-4 rounded-2xl border border-[#334155] outline-none focus:border-[#A68A72]"
            >
              <option value="">Select a service</option>
              <option value="Silk Press">Silk Press</option>
              <option value="Braids">Braids</option>
              <option value="Twists">Twists</option>
              <option value="Loc Maintenance">Loc Maintenance</option>
              <option value="Consultation">Consultation</option>
            </select>

            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-[#0F172A] text-white p-4 rounded-2xl border border-[#334155] outline-none focus:border-[#A68A72]"
            />

            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-[#0F172A] text-white p-4 rounded-2xl border border-[#334155] outline-none focus:border-[#A68A72]"
            />

            <input
              type="email"
              required
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#0F172A] text-white placeholder:text-[#64748B] p-4 rounded-2xl border border-[#334155] outline-none focus:border-[#A68A72]"
            />

            <input
              type="text"
              required
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-[#0F172A] text-white placeholder:text-[#64748B] p-4 rounded-2xl border border-[#334155] outline-none focus:border-[#A68A72]"
            />

            <textarea
              placeholder="Special requests or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              className="bg-[#0F172A] text-white placeholder:text-[#64748B] p-4 rounded-2xl border border-[#334155] outline-none focus:border-[#A68A72] resize-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-[#A68A72] text-white py-4 rounded-2xl hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Booking"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default PublicBooking