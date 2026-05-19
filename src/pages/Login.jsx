import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    console.log(data)
    console.log(error)

    if (data.user) {
      navigate("/dashboard")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F7F4EF]">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-3xl shadow-sm border border-[#E7E1D9] w-full max-w-md"
      >
        <h1 className="text-4xl font-bold text-[#1E1E1E] mb-8">
          Login
        </h1>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="p-4 rounded-2xl border border-[#E7E1D9] outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="p-4 rounded-2xl border border-[#E7E1D9] outline-none"
          />

          <button
            type="submit"
            className="bg-[#8B6F5A] text-white py-4 rounded-2xl hover:opacity-90 transition"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login