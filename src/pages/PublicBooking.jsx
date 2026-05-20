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

  const handleBooking = async (e) => {
    e.preventDefault()

    const { error } = await supabase
      .from("bookings")
      .insert([
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

    if (error) {
      toast.error("Failed to create booking")
    } else {
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

    console.log(error)
  }

  return (
    <div className="min-h-screen bg-[#F7F4EF] flex items-center justify-center p-6">
     {submitted ? (
  <div className="bg-white rounded-3xl p-10 shadow-sm border border-[#E7E1D9] w-full max-w-xl text-center">
    <h1 className="text-4xl font-bold text-[#1E1E1E]">
      Booking Confirmed 🎉
    </h1>

    <p className="text-[#8B6F5A] mt-4">
      Your appointment request has been submitted successfully.
    </p>
  </div>
) : (
 
      <form
        onSubmit={handleBooking}
        className="bg-white rounded-3xl p-10 shadow-sm border border-[#E7E1D9] w-full max-w-xl"
      >
        <h1 className="text-4xl font-bold text-[#1E1E1E]">
          Book an Appointment
        </h1>

        <p className="text-[#8B6F5A] mt-3 mb-8">
          Choose your service and preferred time.
        </p>

        <div className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Your Name"
            value={clientName}
            onChange={(e) =>
              setClientName(e.target.value)
            }
            className="p-4 rounded-2xl border border-[#E7E1D9] outline-none"
          />

          <input
            type="text"
            placeholder="Service"
            value={service}
            onChange={(e) =>
              setService(e.target.value)
            }
            className="p-4 rounded-2xl border border-[#E7E1D9] outline-none"
          />

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            className="p-4 rounded-2xl border border-[#E7E1D9] outline-none"
          />

          <input
            type="time"
            value={time}
            onChange={(e) =>
              setTime(e.target.value)
            }
            className="p-4 rounded-2xl border border-[#E7E1D9] outline-none"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
  className="p-4 rounded-2xl border border-[#E7E1D9] outline-none"
/>

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            className="p-4 rounded-2xl border border-[#E7E1D9] outline-none"
          />
          <textarea
  placeholder="Special requests or notes..."
  value={notes}
  onChange={(e) =>
    setNotes(e.target.value)
  }
  rows="4"
  className="p-4 rounded-2xl border border-[#E7E1D9] outline-none resize-none"
/>
          <button
            type="submit"
            className="bg-[#8B6F5A] text-white py-4 rounded-2xl hover:opacity-90 transition"
          >
            Submit Booking
          </button>

        </div>
            </form>
    )}
    </div>
  )
}
export default PublicBooking