import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"

const emptyService = {
  name: "",
  description: "",
  price: "",
  duration: "60",
  active: true,
}

function Services() {
  const { session } = useAuth()
  const user = session?.user

  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState(emptyService)

  useEffect(() => {
    if (user?.id) {
      fetchServices()
    }
  }, [user?.id])

  const fetchServices = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Unable to load services:", error)
      toast.error("Unable to load your services")
      setLoading(false)
      return
    }

    setServices(data || [])
    setLoading(false)
  }

  const openAddModal = () => {
    setEditingService(null)
    setFormData(emptyService)
    setIsModalOpen(true)
  }

  const openEditModal = (service) => {
    setEditingService(service)

    setFormData({
      name: service.name || "",
      description: service.description || "",
      price: service.price ?? "",
      duration: String(service.duration || 60),
      active: service.active ?? true,
    })

    setIsModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return

    setIsModalOpen(false)
    setEditingService(null)
    setFormData(emptyService)
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const serviceName = formData.name.trim()
    const description = formData.description.trim()
    const price = Number(formData.price)
    const duration = Number(formData.duration)

    if (!serviceName) {
      toast.error("Enter a service name")
      return
    }

    if (
      formData.price === "" ||
      Number.isNaN(price) ||
      price < 0
    ) {
      toast.error("Enter a valid price")
      return
    }

    if (Number.isNaN(duration) || duration < 5) {
      toast.error("Enter a valid duration")
      return
    }

    setSaving(true)

    const servicePayload = {
      owner_id: user.id,
      name: serviceName,
      description,
      price,
      duration,
      active: formData.active,
    }

    let result

    if (editingService) {
      result = await supabase
        .from("services")
        .update(servicePayload)
        .eq("id", editingService.id)
        .eq("owner_id", user.id)
        .select()
        .single()
    } else {
      result = await supabase
        .from("services")
        .insert(servicePayload)
        .select()
        .single()
    }

    const { data, error } = result

    if (error) {
      console.error("Unable to save service:", error)
      toast.error(
        editingService
          ? "Unable to update the service"
          : "Unable to add the service"
      )

      setSaving(false)
      return
    }

    if (editingService) {
      setServices((current) =>
        current.map((service) =>
          service.id === data.id ? data : service
        )
      )

      toast.success("Service updated")
    } else {
      setServices((current) => [...current, data])
      toast.success("Service added")
    }

    setSaving(false)
    closeModal()
  }

  const toggleServiceStatus = async (service) => {
    const newStatus = !(service.active ?? true)

    const { data, error } = await supabase
      .from("services")
      .update({ active: newStatus })
      .eq("id", service.id)
      .eq("owner_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Unable to update service status:", error)
      toast.error("Unable to update service status")
      return
    }

    setServices((current) =>
      current.map((item) =>
        item.id === service.id ? data : item
      )
    )

    toast.success(
      newStatus
        ? "Service is now bookable"
        : "Service hidden from booking"
    )
  }

  const deleteService = async (service) => {
    const confirmed = window.confirm(
      `Delete "${service.name}"? This cannot be undone.`
    )

    if (!confirmed) return

    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", service.id)
      .eq("owner_id", user.id)

    if (error) {
      console.error("Unable to delete service:", error)
      toast.error("Unable to delete the service")
      return
    }

    setServices((current) =>
      current.filter((item) => item.id !== service.id)
    )

    toast.success("Service deleted")
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(price || 0))
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-purple-600" />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-500">
            Your offerings
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            Services
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Manage the services clients can view and book through your Yorly
            page.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 transition hover:bg-purple-700"
        >
          <span className="text-lg leading-none">+</span>
          Add service
        </button>
      </section>

      {/* Service count */}
      {services.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {services.length}{" "}
              {services.length === 1 ? "service" : "services"} created
            </p>

            <p className="text-sm text-slate-500">
              {
                services.filter(
                  (service) => service.active ?? true
                ).length
              }{" "}
              currently bookable
            </p>
          </div>
        </section>
      )}

      {/* Empty state */}
      {services.length === 0 ? (
        <section className="flex min-h-[420px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 text-center dark:border-slate-700 dark:bg-slate-900">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-3xl dark:bg-purple-500/10">
            ✦
          </div>

          <h2 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
            Add your first service
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">
            Create a service with a price and duration so clients can begin
            booking with you.
          </p>

          <button
            type="button"
            onClick={openAddModal}
            className="mt-6 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            Add your first service
          </button>
        </section>
      ) : (
        <section className="grid gap-5 md:grid-cols-2">
          {services.map((service) => {
            const isActive = service.active ?? true

            return (
              <article
                key={service.id}
                className={`rounded-[1.5rem] border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900 ${
                  isActive
                    ? "border-slate-200 dark:border-slate-800"
                    : "border-slate-200 opacity-70 dark:border-slate-800"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="truncate text-xl font-bold text-slate-900 dark:text-white">
                        {service.name}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          isActive
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {service.description ? (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {service.description}
                      </p>
                    ) : (
                      <p className="mt-3 text-sm italic text-slate-400">
                        No description added
                      </p>
                    )}
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-lg text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                    ✦
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-950/60">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Price
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                      {formatPrice(service.price)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-950/60">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Duration
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                      {service.duration} min
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => openEditModal(service)}
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-purple-400 hover:text-purple-600 dark:border-slate-700 dark:text-slate-300"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleServiceStatus(service)}
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-purple-400 hover:text-purple-600 dark:border-slate-700 dark:text-slate-300"
                  >
                    {isActive ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteService(service)}
                    className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </article>
            )
          })}
        </section>
      )}

      {/* Add/Edit modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl dark:bg-slate-900">
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingService ? "Edit service" : "Add a service"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingService
                    ? "Update how this service appears to clients."
                    : "Create a new service clients can book."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close service form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Service name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Silk press"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell clients what is included in this service."
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="price"
                    className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Price
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                      $
                    </span>

                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="85.00"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-8 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="duration"
                    className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Duration
                  </label>

                  <select
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="75">1 hour 15 minutes</option>
                    <option value="90">1 hour 30 minutes</option>
                    <option value="120">2 hours</option>
                    <option value="150">2 hours 30 minutes</option>
                    <option value="180">3 hours</option>
                  </select>
                </div>
              </div>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Available for booking
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Inactive services will not appear on your public booking
                    page.
                  </p>
                </div>

                <input
                  name="active"
                  type="checkbox"
                  checked={formData.active}
                  onChange={handleChange}
                  className="h-5 w-5 accent-purple-600"
                />
              </label>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingService
                      ? "Save changes"
                      : "Add service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Services