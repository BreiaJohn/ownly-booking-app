import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import toast from "react-hot-toast"

function SetupServices() {
  const navigate = useNavigate()

  const [services, setServices] = useState([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [duration, setDuration] = useState("60")
  const [description, setDescription] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      navigate("/login")
      return
    }

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })

    if (error) {
      console.error(error)
      toast.error("Could not load services.")
      return
    }

    setServices(data || [])
  }

  const handleAddService = async (event) => {
    event.preventDefault()

    if (!name.trim()) {
      toast.error("Enter a service name.")
      return
    }

    if (!price || Number(price) < 0) {
      toast.error("Enter a valid price.")
      return
    }

    if (!duration || Number(duration) < 15) {
      toast.error("Enter a valid duration.")
      return
    }

    setIsSaving(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Please log in again.")
      }

      const { data, error } = await supabase
        .from("services")
        .insert({
          user_id: user.id,
          name: name.trim(),
          price: Number(price),
          duration: Number(duration),
          description: description.trim(),
          active: true,
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      setServices((current) => [...current, data])
      setName("")
      setPrice("")
      setDuration("60")
      setDescription("")

      toast.success("Service added!")
    } catch (error) {
      console.error(error)
      toast.error(error.message || "Could not add service.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteService = async (serviceId) => {
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", serviceId)

    if (error) {
      console.error(error)
      toast.error("Could not remove service.")
      return
    }

    setServices((current) =>
      current.filter((service) => service.id !== serviceId)
    )

    toast.success("Service removed.")
  }

  const handleContinue = () => {
    if (services.length === 0) {
      toast.error("Add at least one service before continuing.")
      return
    }

   navigate("/setup/availability")
  }

  return (
    <main className="min-h-screen bg-[#020617] px-4 py-10 text-white">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-blue-400">
            yorly
          </p>

          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
            Add your services
          </h1>

          <p className="mt-3 text-slate-400">
            Add the appointments your clients will be able to book.
          </p>
        </header>

        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-semibold text-blue-400">
              Step 2 of 4
            </span>

            <span className="text-slate-500">
              Services
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-2/4 rounded-full bg-blue-500" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <section className="rounded-3xl border border-blue-400/20 bg-[#0F172A] p-6 shadow-2xl sm:p-8">
            <h2 className="text-xl font-bold">
              New service
            </h2>

            <form
              onSubmit={handleAddService}
              className="mt-6 space-y-5"
            >
              <div>
                <label
                  htmlFor="serviceName"
                  className="mb-2 block text-sm font-semibold text-slate-300"
                >
                  Service name
                </label>

                <input
                  id="serviceName"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Silk Press"
                  required
                  className="w-full rounded-2xl border border-blue-400/20 bg-[#020617]/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="price"
                    className="mb-2 block text-sm font-semibold text-slate-300"
                  >
                    Price
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                      $
                    </span>

                    <input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(event) => setPrice(event.target.value)}
                      placeholder="85"
                      required
                      className="w-full rounded-2xl border border-blue-400/20 bg-[#020617]/60 py-3 pl-8 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="duration"
                    className="mb-2 block text-sm font-semibold text-slate-300"
                  >
                    Duration
                  </label>

                  <select
                    id="duration"
                    value={duration}
                    onChange={(event) => setDuration(event.target.value)}
                    className="w-full rounded-2xl border border-blue-400/20 bg-[#020617] px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40"
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1 hour 30 minutes</option>
                    <option value="120">2 hours</option>
                    <option value="180">3 hours</option>
                    <option value="240">4 hours</option>
                    <option value="300">5 hours</option>
                    <option value="360">6 hours</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="serviceDescription"
                  className="mb-2 block text-sm font-semibold text-slate-300"
                >
                  Description
                </label>

                <textarea
                  id="serviceDescription"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Tell clients what is included."
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-blue-400/20 bg-[#020617]/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full rounded-2xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Adding service..." : "Add service"}
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-blue-400/20 bg-[#0F172A] p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Your services
              </h2>

              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-semibold text-blue-400">
                {services.length}
              </span>
            </div>

            {services.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-700 p-8 text-center">
                <p className="font-semibold text-slate-300">
                  No services added yet
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Add your first service using the form.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {services.map((service) => (
                  <article
                    key={service.id}
                    className="rounded-2xl border border-blue-400/10 bg-[#020617]/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-white">
                          {service.name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                          ${Number(service.price).toFixed(2)} ·{" "}
                          {service.duration} minutes
                        </p>

                        {service.description && (
                          <p className="mt-2 text-sm text-slate-500">
                            {service.description}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteService(service.id)
                        }
                        className="text-sm font-semibold text-red-400 transition hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={handleContinue}
              className="mt-6 w-full rounded-2xl border border-blue-400/30 bg-blue-500/10 px-5 py-3 font-semibold text-blue-400 transition hover:bg-blue-500/20"
            >
              Continue
            </button>
          </section>
        </div>
      </div>
    </main>
  )
}

export default SetupServices