import { useEffect, useState } from "react"
import DashboardLayout from "../layouts/DashboardLayout"
import { supabase } from "../lib/supabase"
import {
  pageClass,
  containerClass,
  cardClass,
  smallCardClass,
  pillClass,
  mutedTextClass,
} from "../styles/theme"

function Payments() {
  const [payments, setPayments] = useState([])

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("date", { ascending: false })

    if (error) {
      console.log(error)
      return
    }

    setPayments(data || [])
  }

  const totalRevenue = payments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0
  )

  const paidBookings = payments.filter(
    (payment) => payment.payment_status === "Paid"
  ).length

  const pendingPayments = payments.filter(
    (payment) => payment.payment_status !== "Paid"
  ).length

  const statCards = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      helper: "All paid and recorded bookings",
    },
    {
      label: "Paid Bookings",
      value: paidBookings,
      helper: "Bookings marked as paid",
    },
    {
      label: "Pending Payments",
      value: pendingPayments,
      helper: "Bookings waiting for payment",
    },
  ]

  return (
    <DashboardLayout>
      <div className={pageClass}>
        <div className={containerClass}>
          <section className={cardClass}>
            <p className={pillClass}>Revenue</p>

            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[var(--yorly-text)] md:text-5xl">
                  Payments
                </h1>

                <p className={`mt-3 max-w-xl ${mutedTextClass}`}>
                  Track revenue, paid bookings, pending balances, and client
                  payment history.
                </p>
              </div>

              <button
                type="button"
                className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-3 text-sm font-semibold text-[var(--yorly-primary)] transition hover:border-blue-500/60 hover:bg-blue-500/20"
              >
                Stripe Coming Soon
              </button>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {statCards.map((card) => (
              <div key={card.label} className={smallCardClass}>
                <p className="text-sm text-[var(--yorly-muted)]">
                  {card.label}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-[var(--yorly-text)] md:text-4xl">
                  {card.value}
                </h2>

                <p className="mt-3 text-sm text-[var(--yorly-subtle)]">
                  {card.helper}
                </p>
              </div>
            ))}
          </section>

          <section className={cardClass}>
            <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className={pillClass}>History</p>

                <h2 className="text-2xl font-bold text-[var(--yorly-text)]">
                  Payment History
                </h2>
              </div>

              <p className="text-sm text-[var(--yorly-muted)]">
                {payments.length} total booking
                {payments.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="space-y-4">
              {payments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[var(--yorly-border)] bg-[var(--yorly-surface-soft)] p-6 text-center">
                  <p className="font-semibold text-[var(--yorly-text)]">
                    No payments yet
                  </p>

                  <p className="mt-2 text-sm text-[var(--yorly-muted)]">
                    Once bookings have amounts or Stripe payments, they will
                    appear here.
                  </p>
                </div>
              ) : (
                payments.map((payment) => {
                  const isPaid = payment.payment_status === "Paid"

                  return (
                    <div
                      key={payment.id}
                      className="flex flex-col gap-5 rounded-2xl border border-[var(--yorly-border)] bg-[var(--yorly-surface-soft)] p-5 transition-colors duration-200 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold text-[var(--yorly-text)]">
                          {payment.client_name || "Client"}
                        </h3>

                        <p className="mt-1 text-sm text-[var(--yorly-muted)]">
                          {payment.service || "Service not listed"}
                        </p>

                        <p className="mt-2 text-sm text-[var(--yorly-subtle)]">
                          {payment.date || "No date"}{" "}
                          {payment.time ? `at ${payment.time}` : ""}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 md:items-end">
                        <h2 className="text-3xl font-bold text-[var(--yorly-text)]">
                          ${Number(payment.amount || 0).toFixed(2)}
                        </h2>

                        <span
                          className={`w-fit rounded-full border px-4 py-2 text-sm font-medium ${
                            isPaid
                              ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-300"
                              : "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300"
                          }`}
                        >
                          {payment.payment_status || "Pending"}
                        </span>

                        <p className="text-sm text-[var(--yorly-muted)]">
                          {payment.payment_method || "No payment method"}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Payments