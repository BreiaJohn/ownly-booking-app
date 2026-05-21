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

  return (<div className="min-h-screen flex items-start md:items-center justify-center px-4 pt-10 md:pt-0 bg-[#F7F4EF]">

      <form
        onSubmit={handleLogin}
        className="bg-[#0F172A] w-full max-w-md p-6 md:p-10 rounded-3xl shadow-xl border border-[#334155]"
      >
        <h1 className="text-3xl md:text-3xl md:text-4xl font-bold text-white mb-8">
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
            className="w-full min-w-0 bg-[#020617] border border-[#334155] p-4 rounded-2xl text-white placeholder:text-[#94A3B8] outline-none focus:ring-2 focus:ring-[#C08457]"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full min-w-0 bg-[#020617] border border-[#334155] p-4 rounded-2xl text-white placeholder:text-[#94A3B8] outline-none focus:ring-2 focus:ring-[#C08457]"
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