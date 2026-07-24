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

  const [instagram, setInstagram] = useState("")
const [facebook, setFacebook] = useState("")
const [tiktok, setTiktok] = useState("")
const [website, setWebsite] = useState("")
const [googleReviewLink, setGoogleReviewLink] = useState("")
const [savingSocials, setSavingSocials] = useState(false)

  const [blockedDate, setBlockedDate] = useState("")
  const [blockedTime, setBlockedTime] = useState("")
  const [blockedReason, setBlockedReason] = useState("")
  const [blockedList, setBlockedList] = useState([])

  const { theme, toggleTheme } = useTheme()

const fieldClass =
  "block w-full min-w-0 appearance-none rounded-2xl border border-[var(--yorly-border)] bg-[var(--yorly-surface-soft)] px-4 py-4 text-[var(--yorly-text)] outline-none transition-colors duration-200 placeholder:text-[var(--yorly-muted)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"

  const buttonClass =
    "w-full rounded-2xl border border-white/20 bg-white/10 py-4 font-semibold text-[var(--yorly-text)] transition duration-300 hover:border-blue-400/50 hover:bg-white/15 hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]"

  useEffect(() => {
    if (session?.user?.id) {
      fetchSettings()
      fetchBlockedTimes()
      fetchSocialLinks()
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

  const fetchSocialLinks = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "instagram, facebook, tiktok, website, google_review_link"
    )
    .eq("id", session.user.id)
    .single()

  if (error) {
    console.error("Social links error:", error)
    return
  }

  setInstagram(data?.instagram || "")
  setFacebook(data?.facebook || "")
  setTiktok(data?.tiktok || "")
  setWebsite(data?.website || "")
  setGoogleReviewLink(data?.google_review_link || "")
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


    const handleSaveSocialLinks = async () => {
  setSavingSocials(true)

  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        instagram: instagram.trim(),
        facebook: facebook.trim(),
        tiktok: tiktok.trim(),
        website: website.trim(),
        google_review_link: googleReviewLink.trim(),
      })
      .eq("id", session.user.id)

    if (error) {
      throw error
    }

    toast.success("Social links saved!")
  } catch (error) {
    console.error("Social links save error:", error)
    toast.error("Could not save your social links.")
  } finally {
    setSavingSocials(false)
  }
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
    <div className="min-h-screen w-full overflow-x-hidden bg-[var(--yorly-background)] px-4 py-6 text-[var(--yorly-text)] transition-colors duration-200 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">

        <Card>
          <div className="flex items-center justify-between gap-5">
            <div>
              <p className="mb-2 text-sm font-semibold tracking-wide text-[var(--yorly-primary)]">
                Appearance
              </p>

              <h2 className="text-xl font-bold text-[var(--yorly-text)] sm:text-2xl">
                Dark Mode
              </h2>

              <p className="mt-2 text-sm text-[var(--yorly-muted)]">
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

    <Card>
  <div className="mb-6">
    <p className="mb-2 text-sm font-semibold tracking-wide text-[var(--yorly-primary)]">
      Business Profile
    </p>

    <h2 className="text-2xl font-bold text-[var(--yorly-text)] md:text-3xl">
      Social Media & Reviews
    </h2>

    <p className="mt-2 max-w-2xl text-[var(--yorly-muted)]">
      Add links clients can use to view your work, visit your website,
      or leave a review.
    </p>
  </div>

  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
    <div>
      <label
        htmlFor="instagram"
        className="mb-2 block text-sm font-medium text-[var(--yorly-muted)]"
      >
        Instagram
      </label>

      <input
        id="instagram"
        type="url"
        value={instagram}
        onChange={(event) => setInstagram(event.target.value)}
        placeholder="https://instagram.com/yourbusiness"
        className={fieldClass}
      />
    </div>

    <div>
      <label
        htmlFor="facebook"
        className="mb-2 block text-sm font-medium text-[var(--yorly-muted)]"
      >
        Facebook
      </label>

      <input
        id="facebook"
        type="url"
        value={facebook}
        onChange={(event) => setFacebook(event.target.value)}
        placeholder="https://facebook.com/yourbusiness"
        className={fieldClass}
      />
    </div>

    <div>
      <label
        htmlFor="tiktok"
        className="mb-2 block text-sm font-medium text-[var(--yorly-muted)]"
      >
        TikTok
      </label>

      <input
        id="tiktok"
        type="url"
        value={tiktok}
        onChange={(event) => setTiktok(event.target.value)}
        placeholder="https://tiktok.com/@yourbusiness"
        className={fieldClass}
      />
    </div>

    <div>
      <label
        htmlFor="website"
        className="mb-2 block text-sm font-medium text-[var(--yorly-muted)]"
      >
        Website
      </label>

      <input
        id="website"
        type="url"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
        placeholder="https://yourbusiness.com"
        className={fieldClass}
      />
    </div>

    <div className="md:col-span-2">
      <label
        htmlFor="googleReviewLink"
        className="mb-2 block text-sm font-medium text-[var(--yorly-muted)]"
      >
        Google review link
      </label>

      <input
        id="googleReviewLink"
        type="url"
        value={googleReviewLink}
        onChange={(event) =>
          setGoogleReviewLink(event.target.value)
        }
        placeholder="Paste your Google review link"
        className={fieldClass}
      />

      <p className="mt-2 text-xs text-[var(--yorly-muted)]">
        This will later power the “Leave a Review” button clients see
        after completed appointments.
      </p>
    </div>
  </div>

  <button
    type="button"
    onClick={handleSaveSocialLinks}
    disabled={savingSocials}
    className={`${buttonClass} mt-6 disabled:cursor-not-allowed disabled:opacity-60`}
  >
    {savingSocials ? "Saving..." : "Save Social Links"}
  </button>
</Card>

        <section className="w-full overflow-hidden rounded-3xl border border-[#334155] bg-white/5 p-5 shadow-sm backdrop-blur-md sm:p-6 md:p-8">
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold tracking-wide text-[var(--yorly-primary)]">
              Availability
            </p>

            <h1 className="text-3xl font-bold text-[var(--yorly-text)] md:text-5xl">
              Settings
            </h1>

              <p className="mt-3 max-w-xl text-[var(--yorly-muted)]">
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
              <p className="mb-2 text-sm font-semibold tracking-wide text-[var(--yorly-primary)]">
                Calendar Control
              </p>

              <h2 className="text-2xl font-bold text-[var(--yorly-text)] md:text-3xl">
                Block Time
              </h2>

              <p className="mt-2 text-[var(--yorly-muted)]">
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
                <p className="text-sm text-[var(--yorly-muted)]">
                  No blocked times yet.
                </p>
              ) : (
                blockedList.map((blocked) => (
                  <div
                    key={blocked.id}
                    className="flex flex-col gap-4 rounded-2xl border border-[#334155] bg-[#020617]/60 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-[var(--yorly-text)]">
                        {blocked.date}
                      </p>

                      <p className="text-[var(--yorly-muted)]">{blocked.time}</p>

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