import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"
import logo from "../assets/ownly-logo.png"

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
 <div className="relative min-h-screen bg-[#020817] text-white flex items-center justify-center px-4 py-10 overflow-hidden">

    <div className="absolute w-[500px] h-[500px] bg-[#4B5563]/20 blur-[140px] rounded-full"></div>

   <form
  onSubmit={handleLogin}
  className="relative bg-[#0F172A]/70 backdrop-blur-xl w-full max-w-md p-8 md:p-10 rounded-[2rem] shadow-[0_0_40px_rgba(0,0,0,0.35)] border border-[#334155] hover:border-[#4B5563] transition-all duration-500"
>
<div className="flex justify-center mb-8">
  <button
  type="button"
  onClick={() => navigate("/")}
  className="hover:scale-105 transition duration-300"
>
    <img
      src={logo}
      alt="Ownly"
      className="h-20 w-auto"
    />
  </button>
</div>



  <h1 className="text-4xl font-semibold tracking-tight text-white mb-3">
Login
</h1>
      <p className="text-[#64748B] mb-8">
        Welcome back to Ownly.
      </p>

      <div className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#0B1220] border border-[#334155] px-5 py-4 rounded-2xl text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#4B5563] transition-all duration-300"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#0B1220] border border-[#334155] px-5 py-4 rounded-2xl text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#4B5563] transition-all duration-300"
        />

        <button
          type="submit"
          className="w-full bg-[#4B5563] text-white py-4 rounded-2xl hover:bg-[#5B6472] hover:shadow-[0_0_25px_rgba(75,85,99,0.45)] hover:-translate-y-0.5 transition-all duration-300 font-medium"
        >
          Login
        </button>
      </div>
    </form>
  </div>
)
}

export default Login