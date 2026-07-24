import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"

function BookingLinkCard() {
  const { session } = useAuth()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) {
        setProfile(null)
        setLoading(false)
        return
      }

      setLoading(true)

      const { data, error } = await supabase
        .from("profiles")
        .select("username, business_name, setup_complete")
        .eq("id", session.user.id)
        .maybeSingle()

      if (error) {
        console.error("Booking link profile error:", error)
        toast.error("Unable to load your booking link.")
        setLoading(false)
        return
      }

      setProfile(data)
      setLoading(false)
    }

    fetchProfile()
  }, [session?.user?.id])

  const bookingUrl = profile?.username
    ? `${window.location.origin}/book/${profile.username}`
    : ""

  const copyBookingLink = async () => {
    if (!bookingUrl) {
      toast.error("Finish setting up your booking username first.")
      return
    }

    try {
      await navigator.clipboard.writeText(bookingUrl)
      toast.success("Booking link copied!")
    } catch (error) {
      console.error(error)
      toast.error("Unable to copy booking link.")
    }
  }

  if (loading) {
    return (
      <section className="rounded-3xl border border-[var(--yorly-border)] bg-[var(--yorly-surface)] p-6">
        <p className="text-[var(--yorly-muted)]">
          Loading booking link...
        </p>
      </section>
    )
  }

  if (!profile?.username) {
    return (
      <section className="rounded-3xl border border-[var(--yorly-border)] bg-[var(--yorly-surface)] p-6 shadow-sm">
        <p className="text-sm font-semibold tracking-wide text-[var(--yorly-primary)]">
          Your Booking Page
        </p>

        <h2 className="mt-2 text-2xl font-bold text-[var(--yorly-text)]">
          Finish setting up your business
        </h2>

        <p className="mt-2 text-[var(--yorly-muted)]">
          Add a booking username before sharing your page with clients.
        </p>

        <Link
          to="/setup"
          className="mt-5 inline-flex rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Complete Setup
        </Link>
      </section>
    )
  }

  return (
    <section className="rounded-3xl border border-[var(--yorly-border)] bg-[var(--yorly-surface)] p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-wide text-[var(--yorly-primary)]">
            Your Booking Page
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[var(--yorly-text)]">
            Share {profile.business_name || "your business"}
          </h2>

          <p className="mt-2 max-w-2xl text-[var(--yorly-muted)]">
            Send this link to clients or add it to Instagram, Facebook,
            and your website.
          </p>
        </div>

        {profile.setup_complete && (
          <span className="w-fit rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
            Live
          </span>
        )}
      </div>

      <div className="mt-5 rounded-2xl border border-[var(--yorly-border)] bg-[var(--yorly-surface-soft)] p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--yorly-muted)]">
          Booking link
        </p>

        <p className="mt-2 break-all text-sm font-medium text-[var(--yorly-text)]">
          {bookingUrl}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={copyBookingLink}
          className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Copy Link
        </button>

        <a
          href={bookingUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl border border-[var(--yorly-border)] bg-[var(--yorly-surface-soft)] px-5 py-3 text-center font-semibold text-[var(--yorly-text)] transition hover:border-blue-500/40 hover:bg-blue-500/5"
        >
          Open Booking Page
        </a>
      </div>
    </section>
  )
}

export default BookingLinkCard