import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import toast from "react-hot-toast"

const defaultDays = [
  {
    dayOfWeek: 0,
    name: "Sunday",
    isAvailable: false,
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    dayOfWeek: 1,
    name: "Monday",
    isAvailable: true,
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    dayOfWeek: 2,
    name: "Tuesday",
    isAvailable: true,
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    dayOfWeek: 3,
    name: "Wednesday",
    isAvailable: true,
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    dayOfWeek: 4,
    name: "Thursday",
    isAvailable: true,
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    dayOfWeek: 5,
    name: "Friday",
    isAvailable: true,
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    dayOfWeek: 6,
    name: "Saturday",
    isAvailable: false,
    startTime: "09:00",
    endTime: "17:00",
  },
]

function SetupAvailability() {
  const navigate = useNavigate()

  const [days, setDays] = useState(defaultDays)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadAvailability()
  }, [])

  const loadAvailability = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        navigate("/login")
        return
      }

      const { data, error } = await supabase
        .from("availability")
        .select("*")
        .eq("user_id", user.id)
        .order("day_of_week", { ascending: true })

      if (error) {
        throw error
      }

      if (data?.length) {
        setDays(
          defaultDays.map((day) => {
            const savedDay = data.find(
              (item) => item.day_of_week === day.dayOfWeek
            )

            if (!savedDay) {
              return day
            }

            return {
              ...day,
              isAvailable: savedDay.is_available,
              startTime: savedDay.start_time?.slice(0, 5) || "09:00",
              endTime: savedDay.end_time?.slice(0, 5) || "17:00",
            }
          })
        )
      }
    } catch (error) {
      console.error(error)
      toast.error("Could not load your availability.")
    } finally {
      setIsLoading(false)
    }
  }

  const updateDay = (dayOfWeek, field, value) => {
    setDays((currentDays) =>
      currentDays.map((day) =>
        day.dayOfWeek === dayOfWeek
          ? {
              ...day,
              [field]: value,
            }
          : day
      )
    )
  }

  const handleSave = async () => {
    const availableDays = days.filter((day) => day.isAvailable)

    if (availableDays.length === 0) {
      toast.error("Choose at least one available day.")
      return
    }

    const hasInvalidTime = availableDays.some(
      (day) => day.startTime >= day.endTime
    )

    if (hasInvalidTime) {
      toast.error("Closing time must be later than opening time.")
      return
    }

    setIsSaving(true)

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error("Please log in again.")
      }

      const availabilityRows = days.map((day) => ({
        user_id: user.id,
        day_of_week: day.dayOfWeek,
        is_available: day.isAvailable,
        start_time: day.isAvailable ? day.startTime : null,
        end_time: day.isAvailable ? day.endTime : null,
      }))

      const { error: availabilityError } = await supabase
        .from("availability")
        .upsert(availabilityRows, {
          onConflict: "user_id,day_of_week",
        })

      if (availabilityError) {
        throw availabilityError
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          setup_complete: true,
        })
        .eq("id", user.id)

      if (profileError) {
        throw profileError
      }

      toast.success("Your business is ready!")
      navigate("/dashboard")
    } catch (error) {
      console.error(error)
      toast.error(error.message || "Could not save your availability.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020617] text-white">
        <p className="text-slate-400">Loading availability...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#020617] px-4 py-10 text-white">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-blue-400">
            yorly
          </p>

          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
            Set your availability
          </h1>

          <p className="mt-3 text-slate-400">
            Choose the days and hours clients can request appointments.
          </p>
        </header>

        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-semibold text-blue-400">
              Step 3 of 4
            </span>

            <span className="text-slate-500">Availability</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-3/4 rounded-full bg-blue-500" />
          </div>
        </div>

        <section className="rounded-3xl border border-blue-400/20 bg-[#0F172A] p-6 shadow-2xl sm:p-8">
          <div className="space-y-4">
            {days.map((day) => (
              <article
                key={day.dayOfWeek}
                className="rounded-2xl border border-blue-400/10 bg-[#020617]/60 p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex min-w-40 items-center justify-between gap-4">
                    <div>
                      <h2 className="font-semibold text-white">
                        {day.name}
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        {day.isAvailable ? "Available" : "Closed"}
                      </p>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={day.isAvailable}
                      onClick={() =>
                        updateDay(
                          day.dayOfWeek,
                          "isAvailable",
                          !day.isAvailable
                        )
                      }
                      className={`relative h-7 w-12 rounded-full transition ${
                        day.isAvailable
                          ? "bg-blue-500"
                          : "bg-slate-700"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                          day.isAvailable ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex flex-1 items-center gap-3">
                    <div className="flex-1">
                      <label
                        htmlFor={`start-${day.dayOfWeek}`}
                        className="mb-2 block text-xs font-semibold text-slate-400"
                      >
                        Opens
                      </label>

                      <input
                        id={`start-${day.dayOfWeek}`}
                        type="time"
                        value={day.startTime}
                        disabled={!day.isAvailable}
                        onChange={(event) =>
                          updateDay(
                            day.dayOfWeek,
                            "startTime",
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-blue-400/20 bg-[#020617] px-3 py-2.5 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 disabled:cursor-not-allowed disabled:opacity-30"
                      />
                    </div>

                    <span className="mt-6 text-slate-600">to</span>

                    <div className="flex-1">
                      <label
                        htmlFor={`end-${day.dayOfWeek}`}
                        className="mb-2 block text-xs font-semibold text-slate-400"
                      >
                        Closes
                      </label>

                      <input
                        id={`end-${day.dayOfWeek}`}
                        type="time"
                        value={day.endTime}
                        disabled={!day.isAvailable}
                        onChange={(event) =>
                          updateDay(
                            day.dayOfWeek,
                            "endTime",
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-blue-400/20 bg-[#020617] px-3 py-2.5 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 disabled:cursor-not-allowed disabled:opacity-30"
                      />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/setup/services")}
              className="w-full rounded-2xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:border-slate-500 sm:w-auto"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="w-full flex-1 rounded-2xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Finishing setup..." : "Finish setup"}
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}

export default SetupAvailability