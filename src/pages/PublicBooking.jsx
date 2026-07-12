import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"
import toast from "react-hot-toast"
import logo from "../assets/ownly-logo.png"

const services = [
  {
    name: "Silk Press",
    description: "Smooth, sleek styling with a polished finish.",
  },
  {
    name: "Braids",
    description: "Protective braided styling customized for you.",
  },
  {
    name: "Twists",
    description: "A versatile protective style with a natural finish.",
  },
  {
    name: "Loc Maintenance",
    description: "Retwist and maintenance for healthy, refreshed locs.",
  },
  {
    name: "Consultation",
    description: "Discuss your goals before selecting a full service.",
  },
]

function PublicBooking() {
  const { username } = useParams()

  const [business, setBusiness] = useState(null)

  const [clientName, setClientName] = useState("")
  const [service, setService] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [notes, setNotes] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [businessError, setBusinessError] = useState("")

  const [submittedBooking, setSubmittedBooking] = useState(null)

  const today = new Date().toISOString().split("T")[0]

  const fieldClass =
    "block w-full min-w-0 rounded-2xl border border-[var(--ownly-border)] bg-[var(--ownly-surface-soft)] px-4 py-4 text-[var(--ownly-text)] outline-none transition-colors duration-200 placeholder:text-[var(--ownly-muted)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"

  const resetForm = () => {
    setClientName("")
    setService("")
    setDate("")
    setTime("")
    setPhone("")
    setEmail("")
    setNotes("")
  }

useEffect(() => {
  fetchBusiness()
}, [username])

const fetchBusiness = async () => {
  setBusinessError("")

  const { data, error } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("username", username)
    .eq("is_public", true)
    .maybeSingle()

  if (error) {
    console.error(error)
    setBusinessError("Unable to load this booking page.")
    return
  }

  if (!data) {
    setBusinessError("This booking page could not be found.")
    return
  }

  setBusiness(data)
}

const formatBookingDate = (dateString) => {
  if (!dateString) return ""

  return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

const formatBookingTime = (timeString) => {
  if (!timeString) return ""

  const [hours, minutes] = timeString.split(":")
  const date = new Date()

  date.setHours(Number(hours), Number(minutes))

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })
}

  const handleBooking = async (e) => {
    e.preventDefault()

    if (!clientName || !service || !date || !time || !phone || !email) {
      toast.error("Please complete all required fields")
      return
    }

    setLoading(true)

const { data: existingBooking, error: bookingCheckError } =
  await supabase
    .from("bookings")
    .select("id")
    .eq("user_id", business.user_id)
    .eq("date", date)
    .eq("time", time)
    .maybeSingle()

    if (bookingCheckError) {
      console.log(bookingCheckError)
      toast.error("Unable to check appointment availability")
      setLoading(false)
      return
    }

    if (existingBooking) {
      toast.error("That appointment time is no longer available")
      setLoading(false)
      return
    }

    const { error } = await supabase.from("bookings").insert([
  {
    user_id: business.user_id,
    client_name: clientName.trim(),
    service,
    date,
    time,
    email: email.trim(),
    phone: phone.trim(),
    notes: notes.trim(),
    status: "Pending",
    payment_status: "Pending",
  },
])

    setSubmittedBooking({
      clientName,
      service,
      date,
      time,
      email,
      phone,
})

    setLoading(false)

    if (error) {
      console.log(error)
      toast.error("Failed to submit your booking")
      return
    }

    toast.success("Booking request submitted!")
    setSubmitted(true)
    resetForm()
  }

if (submitted && submittedBooking) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--ownly-background)] px-4 py-10 text-[var(--ownly-text)] transition-colors duration-200">
      <div className="pointer-events-none absolute left-[-8rem] top-[-8rem] h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="pointer-events-none absolute bottom-[-10rem] right-[-8rem] h-[28rem] w-[28rem] rounded-full bg-purple-500/10 blur-[140px]" />

      <section className="relative w-full max-w-xl rounded-[2rem] border border-[var(--ownly-border)] bg-[var(--ownly-surface)] p-7 text-center shadow-2xl transition-colors duration-200 sm:p-10">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10 text-4xl text-green-600 dark:text-green-300">
          ✓
        </div>

        <p className="mb-2 text-sm font-semibold tracking-wide text-[var(--ownly-primary)]">
          Appointment Requested
        </p>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Request received!
        </h1>

        <p className="mx-auto mt-4 max-w-md text-[var(--ownly-muted)]">
          Your request was sent to {business.business_name}. You’ll be
          contacted once the appointment is confirmed.
        </p>

        <div className="mt-8 rounded-2xl border border-[var(--ownly-border)] bg-[var(--ownly-surface-soft)] p-5 text-left">
          <h2 className="mb-4 font-semibold text-[var(--ownly-text)]">
            Appointment details
          </h2>

          <div className="space-y-4">
            <ConfirmationRow
              label="Business"
              value={business.business_name}
            />

            <ConfirmationRow
              label="Service"
              value={submittedBooking.service}
            />

            <ConfirmationRow
              label="Date"
              value={formatBookingDate(submittedBooking.date)}
            />

            <ConfirmationRow
              label="Time"
              value={formatBookingTime(submittedBooking.time)}
            />

            <ConfirmationRow
              label="Name"
              value={submittedBooking.clientName}
            />

            <ConfirmationRow
              label="Email"
              value={submittedBooking.email}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSubmitted(false)
            setSubmittedBooking(null)
          }}
          className="mt-8 w-full rounded-2xl bg-blue-600 px-5 py-4 font-semibold text-white transition hover:bg-blue-700"
        >
          Book Another Appointment
        </button>
      </section>
    </main>
  )
}

  if (businessError) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--ownly-background)] px-4 text-[var(--ownly-text)]">
      <div className="w-full max-w-md rounded-3xl border border-[var(--ownly-border)] bg-[var(--ownly-surface)] p-8 text-center">
        <h1 className="text-2xl font-bold">Booking page unavailable</h1>

        <p className="mt-3 text-[var(--ownly-muted)]">
          {businessError}
        </p>
      </div>
    </div>
  )
}

  if (!business) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-white">
      Loading business...
    </div>
  )
}

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--ownly-background)] px-4 py-8 text-[var(--ownly-text)] transition-colors duration-200 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-[-10rem] top-[-10rem] h-[30rem] w-[30rem] rounded-full bg-blue-500/10 blur-[140px]" />

      <div className="pointer-events-none absolute bottom-[-12rem] right-[-10rem] h-[32rem] w-[32rem] rounded-full bg-purple-500/10 blur-[150px]" />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex flex-col rounded-[2rem] border border-[var(--ownly-border)] bg-[var(--ownly-surface)] p-6 shadow-sm transition-colors duration-200 sm:p-8 lg:p-10">
          <div className="mb-10">
            <img
              src={logo}
              alt="Ownly"
              className="h-20 w-auto object-contain"
            />
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold tracking-wide text-[var(--ownly-primary)]">
  {business.business_name}
</p>

<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
  Book with {business.business_name}
</h1>

<p className="mt-5 max-w-lg text-lg leading-8 text-[var(--ownly-muted)]">
  {business.description ||
    "Select your preferred service, date, and time. Your appointment will be submitted for confirmation."}
</p>

{business.location && (
  <p className="mt-4 text-sm text-[var(--ownly-muted)]">
    📍 {business.location}
  </p>
)}
          </div>

          <div className="mt-10 space-y-4">
            <BusinessDetail
              icon="✓"
              title="Simple scheduling"
              description="Choose the service and time that works for you."
            />

            <BusinessDetail
              icon="◷"
              title="Quick confirmation"
              description="The business will review and confirm your request."
            />

            <BusinessDetail
              icon="🔒"
              title="Your information is secure"
              description="Your contact information is used only for your booking."
            />
          </div>

          <div className="mt-auto pt-10">
            <p className="text-sm text-[var(--ownly-subtle)]">
              Booking powered by Ownly
            </p>
          </div>
        </section>

        <form
          onSubmit={handleBooking}
          className="rounded-[2rem] border border-[var(--ownly-border)] bg-[var(--ownly-surface)] p-5 shadow-xl transition-colors duration-200 sm:p-8 lg:p-10"
        >
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold tracking-wide text-[var(--ownly-primary)]">
              Appointment Details
            </p>

            <h2 className="text-3xl font-bold tracking-tight">
              Reserve your time
            </h2>

            <p className="mt-3 text-[var(--ownly-muted)]">
              Fields marked required must be completed before submitting.
            </p>
          </div>

          <div className="space-y-6">
            <FormField label="Choose a service" required>
              <select
                required
                value={service}
                onChange={(e) => setService(e.target.value)}
                className={`${fieldClass} appearance-none`}
              >
                <option value="">Select a service</option>

                {services.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>

              {service && (
                <p className="mt-2 text-sm text-[var(--ownly-muted)]">
                  {
                    services.find((item) => item.name === service)
                      ?.description
                  }
                </p>
              )}
            </FormField>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Preferred date" required>
                <input
                  type="date"
                  required
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{ colorScheme: "inherit" }}
                  className={fieldClass}
                />
              </FormField>

              <FormField label="Preferred time" required>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  style={{ colorScheme: "inherit" }}
                  className={fieldClass}
                />
              </FormField>
            </div>

            <div className="border-t border-[var(--ownly-border)] pt-6">
              <h3 className="text-xl font-semibold">Your information</h3>

              <p className="mt-1 text-sm text-[var(--ownly-muted)]">
                We’ll use this information to contact you about your booking.
              </p>
            </div>

            <FormField label="Full name" required>
              <input
                type="text"
                required
                autoComplete="name"
                placeholder="Enter your full name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className={fieldClass}
              />
            </FormField>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Email address" required>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldClass}
                />
              </FormField>

              <FormField label="Phone number" required>
                <input
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="(555) 555-5555"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={fieldClass}
                />
              </FormField>
            </div>

            <FormField label="Notes">
              <textarea
                placeholder="Special requests, questions, or details..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className={`${fieldClass} resize-none`}
              />
            </FormField>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-blue-600 px-5 py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_0_25px_rgba(37,99,235,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting Booking..." : "Request Appointment"}
            </button>

            <p className="text-center text-xs leading-5 text-[var(--ownly-subtle)]">
              Submitting this form sends an appointment request. Your
              appointment is not final until it is confirmed.
            </p>
          </div>
        </form>
      </div>
    </main>
  )
}

function FormField({ label, required = false, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[var(--ownly-text)]">
        {label}
        {required && (
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  )
}

function BusinessDetail({ icon, title, description }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-[var(--ownly-border)] bg-[var(--ownly-surface-soft)] p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 font-semibold text-[var(--ownly-primary)]">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold text-[var(--ownly-text)]">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-[var(--ownly-muted)]">
          {description}
        </p>
      </div>
    </div>
  )
}

function ConfirmationRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-[var(--ownly-border)] pb-3 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-[var(--ownly-muted)]">{label}</span>

      <span className="font-medium text-[var(--ownly-text)] sm:text-right">
        {value}
      </span>
    </div>
  )
}
export default PublicBooking