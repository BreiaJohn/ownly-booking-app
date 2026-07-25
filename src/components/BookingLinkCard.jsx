import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"

import { useAuth } from "../context/AuthContext"
import { supabase } from "../lib/supabase"

function BookingLinkCard() {
  const { session } = useAuth()
  const user = session?.user

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    fetchBusinessProfile()
  }, [user?.id])

  const fetchBusinessProfile = async () => {
  setLoading(true)


  console.log("Logged-in user:", user)

  const { data, error } = await supabase
    .from("business_profiles")
    .select("username, business_name")
    .eq("user_id", user.id)
    .maybeSingle()

  console.log("Business profile data:", data)
  console.log("Business profile error:", error)

  if (error) {
    console.error("Unable to load booking profile:", error)
    setLoading(false)
    return
  }

  setProfile(data)
  setLoading(false)
}

  const username = profile?.username?.trim()

 const bookingUrl = username
  ? `${window.location.origin}/book/${username}`
  : ""

  const copyBookingLink = async () => {
    if (!bookingUrl) return

    try {
      await navigator.clipboard.writeText(bookingUrl)
      toast.success("Booking link copied")
    } catch (error) {
      console.error("Unable to copy booking link:", error)
      toast.error("Unable to copy booking link")
    }
  }

  if (loading) {
    return (
      <section className="rounded-3xl border border-[var(--yorly-border)] bg-[var(--yorly-surface)] p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-36 rounded bg-[var(--yorly-surface-soft)]" />
          <div className="h-8 w-72 rounded bg-[var(--yorly-surface-soft)]" />
          <div className="h-12 w-full max-w-xl rounded bg-[var(--yorly-surface-soft)]" />
        </div>
      </section>
    )
  }

  if (!username) {
    return (
      <section className="rounded-3xl border border-[var(--yorly-border)] bg-[var(--yorly-surface)] p-6 md:p-8">
        <p className="text-sm font-semibold text-[var(--yorly-primary)]">
          Your Booking Page
        </p>

        <h2 className="mt-3 text-2xl font-bold md:text-3xl">
          Finish setting up your business
        </h2>

        <p className="mt-3 max-w-2xl text-[var(--yorly-muted)]">
          Add a booking username before sharing your page with clients.
        </p>

        <Link
          to="/setup"
          className="mt-6 inline-flex rounded-xl bg-[var(--yorly-primary)] px-6 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Complete Setup
        </Link>
      </section>
    )
  }

  return (
    <section className="rounded-3xl border border-[var(--yorly-border)] bg-[var(--yorly-surface)] p-6 md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-semibold text-[var(--yorly-primary)]">
              Your Booking Page
            </p>

            <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              Live
            </span>
          </div>

          <h2 className="mt-3 text-2xl font-bold md:text-3xl">
            {profile?.business_name || "Your Yorly page"}
          </h2>

          <p className="mt-2 text-[var(--yorly-muted)]">
            Share this link with clients so they can book your services.
          </p>
        </div>

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl text-[var(--yorly-primary)]">
          ↗
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--yorly-border)] bg-[var(--yorly-background)] p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--yorly-muted)]">
          Booking link
        </p>

        <p className="mt-2 break-all font-medium">
          {bookingUrl}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={copyBookingLink}
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-[var(--yorly-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Copy Link
        </button>

        <Link
  to={`/book/${username}`}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex flex-1 items-center justify-center rounded-xl border border-[var(--yorly-border)] px-5 py-3 text-sm font-semibold transition hover:bg-[var(--yorly-surface-soft)]"
>
  Preview Page
</Link>
      </div>
    </section>
  )
}

export default BookingLinkCard