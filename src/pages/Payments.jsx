import { useEffect, useState } from "react"
import DashboardLayout from "../layouts/DashboardLayout"
import { supabase } from "../lib/supabase"

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

    setPayments(data)
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

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0F172A] text-white">
        <h1 className="text-3xl font-semibold mb-2">
          Payments
        </h1>

        <p className="text-[#94A3B8] mb-8">
          Track your revenue and payment history.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white/5 border border-[#334155] rounded-3xl p-6">
            <p className="text-[#94A3B8] text-sm">
              Total Revenue
            </p>

            <h2 className="text-4xl font-bold mt-3">
              ${totalRevenue}
            </h2>
          </div>

          <div className="bg-white/5 border border-[#334155] rounded-3xl p-6">
            <p className="text-[#94A3B8] text-sm">
              Paid Bookings
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {paidBookings}
            </h2>
          </div>

          <div className="bg-white/5 border border-[#334155] rounded-3xl p-6">
            <p className="text-[#94A3B8] text-sm">
              Pending Payments
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {pendingPayments}
            </h2>
          </div>
        </div>

        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="bg-white/5 border border-[#334155] rounded-3xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
            >
              <div>
                <h3 className="text-xl font-semibold">
                  {payment.client_name}
                </h3>

                <p className="text-[#94A3B8] mt-1">
                  {payment.service || "Service"}
                </p>

                <p className="text-[#94A3B8] mt-2 text-sm">
                  {payment.date || "No date"}
                </p>
              </div>

              <div className="flex flex-col md:items-end gap-3">
                <h2 className="text-3xl font-bold">
                  ${payment.amount || 0}
                </h2>

                <span
                  className={`px-4 py-2 rounded-full text-sm border ${
                    payment.payment_status === "Paid"
                      ? "bg-green-500/20 text-green-200 border-green-400/20"
                      : "bg-yellow-500/20 text-yellow-200 border-yellow-400/20"
                  }`}
                >
                  {payment.payment_status || "Pending"}
                </span>

                <p className="text-[#94A3B8] text-sm">
                  {payment.payment_method || "No payment method"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Payments
