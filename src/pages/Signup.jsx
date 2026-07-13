import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import toast from "react-hot-toast"

function Signup() {
  const navigate = useNavigate()

  const [ownerName, setOwnerName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (!data.user) {
        throw new Error("Your account could not be created.")
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          owner_name: ownerName,
          business_email: email,
          setup_complete: false,
        })

      if (profileError) {
        throw profileError
      }

      toast.success("Your account was created!")

      if (data.session) {
        navigate("/setup")
      } else {
        navigate("/login")
        toast.success("Check your email to confirm your account.")
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message || "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020617] px-4 py-12">
      <section className="w-full max-w-md rounded-3xl border border-blue-400/20 bg-[#0F172A] p-6 shadow-2xl sm:p-8">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
            Ownly
          </p>

          <h1 className="text-3xl font-bold text-white">
            Create your business account
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            Set up your services, availability, and client booking link.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label
              htmlFor="ownerName"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Your name
            </label>

            <input
              id="ownerName"
              type="text"
              value={ownerName}
              onChange={(event) => setOwnerName(event.target.value)}
              placeholder="Tasha Johnson"
              required
              className="w-full rounded-2xl border border-blue-400/20 bg-[#020617]/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="owner@example.com"
              required
              className="w-full rounded-2xl border border-blue-400/20 bg-[#020617]/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
              minLength={6}
              required
              className="w-full rounded-2xl border border-blue-400/20 bg-[#020617]/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-blue-500 px-4 py-3 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-400 hover:text-blue-300"
          >
            Log in
          </Link>
        </p>
      </section>
    </main>
  )
}

export default Signup