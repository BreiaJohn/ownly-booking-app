import { Link } from "react-router-dom"

function PaymentSuccess() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F4EF] px-4">
      <section className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600">
          ✓
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-blue-600">
          Payment successful
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
          Your payment was received
        </h1>

        <p className="mx-auto mt-4 max-w-md text-slate-600">
              Your payment was received and your appointment is confirmed.
              A confirmation email will be sent shortly.
        </p>

        <Link
          to="/"
          className="mt-8 inline-block rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Return Home
        </Link>
      </section>
    </main>
  )
}

export default PaymentSuccess