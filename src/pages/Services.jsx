import { useEffect, useState } from "react"
import toast from "react-hot-toast"

import Sidebar from "../components/Sidebar"
import { useAuth } from "../context/AuthContext"
import { supabase } from "../lib/supabase"

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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState(emptyService)

  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    fetchServices()
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

    const payload = {
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
        .update(payload)
        .eq("id", editingService.id)
        .eq("owner_id", user.id)
        .select()
        .single()
    } else {
      result = await supabase
        .from("services")
        .insert(payload)
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
      console.error("Unable to update service:", error)
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
        ? "Service is now active"
        : "Service is now inactive"
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

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(price || 0))

  return (
    <div className="min-h-screen bg-[var(--yorly-bg)] text-[var(--yorly-text)]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      <main className="min-h-screen md:ml-72">
        <header className="border-b border-[var(--yorly-border)] px-5 py-5 md:px-8">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--yorly-primary)]">
                Your offerings
              </p>

              <h1 className="mt-1 text-2xl font-bold md:text-3xl">
                Services
              </h1>

              <p className="mt-2 text-sm text-[var(--yorly-muted)]">
                Manage the services clients can book through your Yorly page.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-[var(--yorly-border)] px-4 py-2 text-sm font-semibold md:hidden"
            >
              Menu
            </button>
          </div>
        </header>

        <div className="px-5 py-8 md:px-8">
          <div className="mx-auto w-full max-w-6xl space-y-6">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--yorly-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <span className="text-lg leading-none">+</span>
                Add Service
              </button>
            </div>

            {loading ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--yorly-border)] border-t-[var(--yorly-primary)]" />
              </div>
            ) : services.length === 0 ? (
              <section className="flex min-h-[420px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-[var(--yorly-border)] bg-[var(--yorly-surface)] px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl text-[var(--yorly-primary)]">
                  ✦
                </div>

                <h2 className="mt-6 text-xl font-bold">
                  Add your first service
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-[var(--yorly-muted)]">
                  Create a service with a price and duration so clients can
                  begin booking with you.
                </p>

                <button
                  type="button"
                  onClick={openAddModal}
                  className="mt-6 rounded-xl bg-[var(--yorly-primary)] px-5 py-3 text-sm font-semibold text-white"
                >
                  Add Your First Service
                </button>
              </section>
            ) : (
              <>
                <section className="rounded-2xl border border-[var(--yorly-border)] bg-[var(--yorly-surface)] px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-medium">
                      {services.length}{" "}
                      {services.length === 1 ? "service" : "services"}
                    </p>

                    <p className="text-sm text-[var(--yorly-muted)]">
                      {
                        services.filter(
                          (service) => service.active ?? true
                        ).length
                      }{" "}
                      active
                    </p>
                  </div>
                </section>

                <section className="grid gap-5 lg:grid-cols-2">
                  {services.map((service) => {
                    const isActive = service.active ?? true

                    return (
                      <article
                        key={service.id}
                        className={`rounded-[1.5rem] border border-[var(--yorly-border)] bg-[var(--yorly-surface)] p-6 shadow-sm ${
                          isActive ? "" : "opacity-65"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                              <h2 className="truncate text-xl font-bold">
                                {service.name}
                              </h2>

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  isActive
                                    ? "bg-emerald-500/10 text-emerald-500"
                                    : "bg-slate-500/10 text-[var(--yorly-muted)]"
                                }`}
                              >
                                {isActive ? "Active" : "Inactive"}
                              </span>
                            </div>

                            <p className="mt-3 text-sm leading-6 text-[var(--yorly-muted)]">
                              {service.description ||
                                "No description added"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                          <div className="rounded-xl bg-[var(--yorly-surface-soft)] px-4 py-3">
                            <p className="text-xs uppercase tracking-wider text-[var(--yorly-muted)]">
                              Price
                            </p>

                            <p className="mt-1 text-lg font-bold">
                              {formatPrice(service.price)}
                            </p>
                          </div>

                          <div className="rounded-xl bg-[var(--yorly-surface-soft)] px-4 py-3">
                            <p className="text-xs uppercase tracking-wider text-[var(--yorly-muted)]">
                              Duration
                            </p>

                            <p className="mt-1 text-lg font-bold">
                              {service.duration} min
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3 border-t border-[var(--yorly-border)] pt-5">
                          <button
                            type="button"
                            onClick={() => openEditModal(service)}
                            className="flex-1 rounded-xl border border-[var(--yorly-border)] px-4 py-2.5 text-sm font-semibold transition hover:bg-[var(--yorly-surface-soft)]"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleServiceStatus(service)}
                            className="flex-1 rounded-xl border border-[var(--yorly-border)] px-4 py-2.5 text-sm font-semibold transition hover:bg-[var(--yorly-surface-soft)]"
                          >
                            {isActive ? "Deactivate" : "Activate"}
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteService(service)}
                            className="rounded-xl border border-red-500/25 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-500/10"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    )
                  })}
                </section>
              </>
            )}
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[2rem] border border-[var(--yorly-border)] bg-[var(--yorly-surface)] shadow-2xl">
            <div className="flex items-start justify-between border-b border-[var(--yorly-border)] px-6 py-5">
              <div>
                <h2 className="text-xl font-bold">
                  {editingService ? "Edit Service" : "Add Service"}
                </h2>

                <p className="mt-1 text-sm text-[var(--yorly-muted)]">
                  {editingService
                    ? "Update this service."
                    : "Create a new service clients can book."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close service form"
                className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-[var(--yorly-muted)] hover:bg-[var(--yorly-surface-soft)]"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold"
                >
                  Service Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Silk press"
                  className="w-full rounded-xl border border-[var(--yorly-border)] bg-[var(--yorly-surface-soft)] px-4 py-3 outline-none focus:border-[var(--yorly-primary)]"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell clients what is included."
                  className="w-full resize-none rounded-xl border border-[var(--yorly-border)] bg-[var(--yorly-surface-soft)] px-4 py-3 outline-none focus:border-[var(--yorly-primary)]"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="price"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Price
                  </label>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="85.00"
                    className="w-full rounded-xl border border-[var(--yorly-border)] bg-[var(--yorly-surface-soft)] px-4 py-3 outline-none focus:border-[var(--yorly-primary)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="duration"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Duration
                  </label>

                  <select
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[var(--yorly-border)] bg-[var(--yorly-surface-soft)] px-4 py-3 outline-none focus:border-[var(--yorly-primary)]"
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

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[var(--yorly-border)] p-4">
                <div>
                  <p className="text-sm font-semibold">
                    Available for Booking
                  </p>

                  <p className="mt-1 text-xs text-[var(--yorly-muted)]">
                    Inactive services will not appear publicly.
                  </p>
                </div>

                <input
                  name="active"
                  type="checkbox"
                  checked={formData.active}
                  onChange={handleChange}
                  className="h-5 w-5 accent-blue-600"
                />
              </label>

              <div className="flex flex-col-reverse gap-3 border-t border-[var(--yorly-border)] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-[var(--yorly-border)] px-5 py-3 text-sm font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[var(--yorly-primary)] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingService
                      ? "Save Changes"
                      : "Add Service"}
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