import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"
import { generateTimeSlots } from "../utils/generateTimeSlots"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

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

  const fieldClass =
    "block w-full min-w-0 rounded-2xl border border-[var(--ownly-border)] bg-[var(--ownly-surface-soft)] px-4 py-4 text-[var(--ownly-text)] outline-none transition-colors duration-200 placeholder:text-[var(--ownly-muted)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"

  const timeSlots = generateTimeSlots(
    businessSettings?.start_time || "09:00",
    businessSettings?.end_time || "17:00",
    businessSettings?.appointment_length || 60,
    businessSettings?.buffer_time || 0
  ).filter(
    (slot) => !bookedTimes.includes(slot) && !blockedTimes.includes(slot)
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

    setBookedTimes((data || []).map((booking) => booking.time))
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

    setBlockedTimes((data || []).map((blocked) => blocked.time))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!clientName || !service || !date || !time || !phone) {
      toast.error("Please fill out all required fields")
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
      console.log(error)
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
      className="mt-6 w-full max-w-full overflow-hidden rounded-3xl border border-[var(--ownly-border)] bg-[var(--ownly-surface)] p-5 text-[var(--ownly-text)] shadow-sm transition-colors duration-200 sm:p-6"
    >
      <div className="mb-6">
        <p className="mb-2 text-sm font-semibold tracking-wide text-[var(--ownly-primary)]">
          New Appointment
        </p>

        <h2 className="text-2xl font-bold text-[var(--ownly-text)]">
          Create Booking
        </h2>

        <p className="mt-2 text-sm text-[var(--ownly-muted)]">
          Add a new client appointment to your calendar.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Client Name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className={fieldClass}
        />

        <input
          type="text"
          placeholder="Service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className={fieldClass}
        />

        <div className="w-full">
          <DatePicker
            selected={date ? new Date(`${date}T00:00:00`) : null}
            onChange={(selectedDate) => {
              if (!selectedDate) {
                setDate("")
                return
              }

              const year = selectedDate.getFullYear()
              const month = String(selectedDate.getMonth() + 1).padStart(2, "0")
              const day = String(selectedDate.getDate()).padStart(2, "0")

              setDate(`${year}-${month}-${day}`)
            }}
            placeholderText="Choose Date"
            dateFormat="MMM d, yyyy"
            className={fieldClass}
            wrapperClassName="w-full"
            calendarClassName="ownly-datepicker"
          />
        </div>

        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className={`${fieldClass} appearance-none`}
        >
          <option value="">Select Time</option>

          {timeSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={fieldClass}
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClass}
        />

        <button
          type="submit"
          className={`w-full rounded-2xl border px-5 py-4 font-semibold transition-all duration-300 ${
            isSaved
              ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-600 shadow-[0_0_25px_rgba(16,185,129,0.18)] dark:text-emerald-300"
              : "border-blue-600 bg-blue-600 text-white hover:border-blue-700 hover:bg-blue-700 hover:shadow-[0_0_25px_rgba(37,99,235,0.20)]"
          }`}
        >
          {isSaved ? "Booking Saved ✓" : "Save Booking"}
        </button>
      </div>
    </form>
  )
}

export default BookingForm