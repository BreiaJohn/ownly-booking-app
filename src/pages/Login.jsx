import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import logo from "../assets/ownly-logo.png"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Enter your email and password")
      return
    }

    setIsLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setIsLoading(false)

    if (error) {
      toast.error(error.message || "Unable to log in")
      return
    }

    if (data.user) {
      toast.success("Welcome back!")
      navigate("/dashboard")
    }
  }

  const fieldClass =
    "w-full rounded-2xl border border-[var(--ownly-border)] bg-[var(--ownly-surface-soft)] px-5 py-4 text-[var(--ownly-text)] outline-none transition-colors duration-200 placeholder:text-[var(--ownly-muted)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--ownly-background)] px-4 py-10 text-[var(--ownly-text)] transition-colors duration-200">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[140px]" />

      <form
        onSubmit={handleLogin}
        className="relative w-full max-w-md rounded-[2rem] border border-[var(--ownly-border)] bg-[var(--ownly-surface)] p-7 shadow-2xl transition-colors duration-200 sm:p-8 md:p-10"
      >
        <div className="mb-8 flex justify-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="Return to Ownly home page"
            className="transition duration-300 hover:scale-105"
          >
            <img
              src={logo}
              alt="Ownly"
              className="h-20 w-auto object-contain"
            />
          </button>
        </div>

        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold tracking-wide text-[var(--ownly-primary)]">
            Welcome Back
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-[var(--ownly-text)]">
            Login
          </h1>

          <p className="mt-3 text-[var(--ownly-muted)]">
            Sign in to manage your bookings, clients, and payments.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[var(--ownly-muted)]"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[var(--ownly-muted)]"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={fieldClass}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full rounded-2xl bg-blue-600 py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_0_25px_rgba(37,99,235,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Signing In..." : "Login"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full rounded-2xl border border-[var(--ownly-border)] bg-[var(--ownly-surface-soft)] py-4 font-semibold text-[var(--ownly-text)] transition hover:border-blue-500/40"
          >
            Back to Home
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login