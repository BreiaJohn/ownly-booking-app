import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import Logo from "../components/Logo"

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
    "w-full rounded-2xl border border-[var(--yorly-border)] bg-[var(--yorly-surface-soft)] px-5 py-4 text-[var(--yorly-text)] outline-none transition-colors duration-200 placeholder:text-[var(--yorly-muted)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--yorly-background)] px-4 py-10 text-[var(--yorly-text)] transition-colors duration-200">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[140px]" />

      <form
        onSubmit={handleLogin}
        className="relative w-full max-w-md rounded-[2rem] border border-[var(--yorly-border)] bg-[var(--yorly-surface)] p-7 shadow-2xl transition-colors duration-200 sm:p-8 md:p-10"
      >
        <div className="mb-8 flex justify-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="Return to Yorly home page"
            className="transition duration-300 hover:scale-105"
          >
            <Logo className="h-16 w-auto" />
          </button>
        </div>

        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold tracking-wide text-[var(--yorly-primary)]">
            Welcome Back
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-[var(--yorly-text)]">
            Login
          </h1>

          <p className="mt-3 text-[var(--yorly-muted)]">
            Sign in to manage your bookings, clients, and payments.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[var(--yorly-muted)]"
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
              className="mb-2 block text-sm font-medium text-[var(--yorly-muted)]"
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
            className="w-full rounded-2xl border border-[var(--yorly-border)] bg-[var(--yorly-surface-soft)] py-4 font-semibold text-[var(--yorly-text)] transition hover:border-blue-500/40"
          >
            Back to Home
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login