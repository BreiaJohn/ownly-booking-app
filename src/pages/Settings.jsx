import { useEffect, useState } from "react"
import DashboardLayout from "../layouts/DashboardLayout"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"
import { useTheme } from "../context/ThemeContext"
import Card from "../components/ui/Card"

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

  const { theme, toggleTheme } = useTheme()

const fieldClass =
  "block w-full min-w-0 appearance-none rounded-2xl border border-[var(--ownly-border)] bg-[var(--ownly-surface-soft)] px-4 py-4 text-[var(--ownly-text)] outline-none transition-colors duration-200 placeholder:text-[var(--ownly-muted)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"

  const buttonClass =
    "w-full rounded-2xl border border-white/20 bg-white/10 py-4 font-semibold text-[var(--ownly-text)] transition duration-300 hover:border-blue-400/50 hover:bg-white/15 hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]"

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
    const { error } = await supabase.from("business_settings").upsert(
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
    const { error } = await supabase.from("blocked_times").delete().eq("id", id)

    if (error) {
      toast.error("Failed to remove blocked time")
      console.log(error)
      return
    }

    toast.success("Blocked time removed!")
    setBlockedList((prev) => prev.filter((blocked) => blocked.id !== id))
  }


  return (
  <DashboardLayout>
    <div className="min-h-screen w-full overflow-x-hidden bg-[var(--ownly-background)] px-4 py-6 text-[var(--ownly-text)] transition-colors duration-200 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">

        <Card>
          <div className="flex items-center justify-between gap-5">
            <div>
              <p className="mb-2 text-sm font-semibold tracking-wide text-[var(--ownly-primary)]">
                Appearance
              </p>

              <h2 className="text-xl font-bold text-[var(--ownly-text)] sm:text-2xl">
                Dark Mode
              </h2>

              <p className="mt-2 text-sm text-[var(--ownly-muted)]">
                Switch between light and dark appearance.
              </p>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              aria-pressed={theme === "dark"}
              className={`relative h-8 w-14 shrink-0 rounded-full transition-colors duration-200 ${
                theme === "dark" ? "bg-blue-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-200 ${
                  theme === "dark" ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
        </Card>

        <section className="w-full overflow-hidden rounded-3xl border border-[#334155] bg-white/5 p-5 shadow-sm backdrop-blur-md sm:p-6 md:p-8">
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold tracking-wide text-[var(--ownly-primary)]">
              Availability
            </p>

            <h1 className="text-3xl font-bold text-[var(--ownly-text)]text-[var(--ownly-text)] md:text-5xl">
              Settings
            </h1>

              <p className="mt-3 max-w-xl text-[var(--ownly-muted)]">
                Customize your booking hours, appointment length, buffer time,
                and unavailable slots.
              </p>
            </div>

            <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
              <div className="min-w-0">
                <label className="mb-2 block text-sm font-medium text-[#CBD5E1]">
                  Start Time
                </label>

                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  style={{ colorScheme: "dark" }}
                  className={fieldClass}
                />
              </div>

              <div className="min-w-0">
                <label className="mb-2 block text-sm font-medium text-[#CBD5E1]">
                  End Time
                </label>

                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  style={{ colorScheme: "dark" }}
                  className={fieldClass}
                />
              </div>

              <div className="min-w-0">
                <label className="mb-2 block text-sm font-medium text-[#CBD5E1]">
                  Appointment Length
                </label>

                <select
                  value={appointmentLength}
                  onChange={(e) => setAppointmentLength(e.target.value)}
                  className={fieldClass}
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">1 Hour</option>
                </select>
              </div>

              <div className="min-w-0">
                <label className="mb-2 block text-sm font-medium text-[#CBD5E1]">
                  Buffer Time
                </label>

                <select
                  value={bufferTime}
                  onChange={(e) => setBufferTime(e.target.value)}
                  className={fieldClass}
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
              className={`${buttonClass} mt-8`}
            >
              Save Settings
            </button>
          </section>

          <Card>
            <div className="mb-6">
              <p className="mb-2 text-sm font-semibold tracking-wide text-[var(--ownly-primary)]">
                Calendar Control
              </p>

              <h2 className="text-2xl font-bold text-[var(--ownly-text)] md:text-3xl">
                Block Time
              </h2>

              <p className="mt-2 text-[var(--ownly-muted)]">
                Block specific dates and times so clients cannot book them.
              </p>
            </div>

            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
              <div className="min-w-0">
                <label className="mb-2 block text-sm font-medium text-[#CBD5E1]">
                  Date
                </label>

                <input
                  type="date"
                  value={blockedDate}
                  onChange={(e) => setBlockedDate(e.target.value)}
                  style={{ colorScheme: "dark" }}
                  className={fieldClass}
                />
              </div>

              <div className="min-w-0">
                <label className="mb-2 block text-sm font-medium text-[#CBD5E1]">
                  Time
                </label>

                <input
                  type="time"
                  value={blockedTime}
                  onChange={(e) => setBlockedTime(e.target.value)}
                  style={{ colorScheme: "dark" }}
                  className={fieldClass}
                />
              </div>

              <div className="min-w-0">
                <label className="mb-2 block text-sm font-medium text-[#CBD5E1]">
                  Reason
                </label>

                <input
                  type="text"
                  placeholder="Reason optional"
                  value={blockedReason}
                  onChange={(e) => setBlockedReason(e.target.value)}
                  className={fieldClass}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddBlockedTime}
              className={`${buttonClass} mt-5`}
            >
              Block Time
            </button>

            <div className="mt-6 space-y-3">
              {blockedList.length === 0 ? (
                <p className="text-sm text-[var(--ownly-muted)]">
                  No blocked times yet.
                </p>
              ) : (
                blockedList.map((blocked) => (
                  <div
                    key={blocked.id}
                    className="flex flex-col gap-4 rounded-2xl border border-[#334155] bg-[#020617]/60 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-[var(--ownly-text)]">
                        {blocked.date}
                      </p>

                      <p className="text-[var(--ownly-muted)]">{blocked.time}</p>

                      {blocked.reason && (
                        <p className="text-sm text-[#64748B]">
                          {blocked.reason}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteBlockedTime(blocked.id)}
                      className="rounded-xl border border-red-500/30 bg-red-500/15 px-4 py-2 text-red-300 transition hover:bg-red-500/25"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Settings