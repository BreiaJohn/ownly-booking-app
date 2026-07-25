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
}

function Services() {
  const { session } = useAuth()
  const user = session?.user

  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
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
      .eq("user_id", user.id)
      .order("name", { ascending: true })

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
    setModalOpen(true)
  }

  const openEditModal = (service) => {
    setEditingService(service)

    setFormData({
      name: service.name || "",
      description: service.description || "",
      price: service.price ?? "",
      duration: String(service.duration || 60),
    })

    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return

    setModalOpen(false)
    setEditingService(null)
    setFormData(emptyService)
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const name = formData.name.trim()
    const price = Number(formData.price)
    const duration = Number(formData.duration)

    if (!name) {
      toast.error("Enter a service name")
      return false
    }

    if (
      formData.price === "" ||
      Number.isNaN(price) ||
      price < 0
    ) {
      toast.error("Enter a valid price")
      return false
    }

    if (Number.isNaN(duration) || duration < 5) {
      toast.error("Enter a valid duration")
      return false
    }

    return true
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!user?.id || !validateForm()) return

    setSaving(true)

    const payload = {
      user_id: user.id,
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      duration: Number(formData.duration),
    }

    let query

    if (editingService) {
      query = supabase
        .from("services")
        .update(payload)
        .eq("id", editingService.id)
        .eq("user_id", user.id)
        .select()
        .single()
    } else {
      query = supabase
        .from("services")
        .insert(payload)
        .select()
        .single()
    }

    const { data, error } = await query

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
      setServices((current) =>
        [...current, data].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      )

      toast.success("Service added")
    }

    setSaving(false)
    closeModal()
  }

  const handleDelete = async (service) => {
    const confirmed = window.confirm(
      `Delete "${service.name}"? This cannot be undone.`
    )

    if (!confirmed || !user?.id) return

    setDeletingId(service.id)

    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", service.id)
      .eq("user_id", user.id)

    if (error) {
      console.error("Unable to delete service:", error)
      toast.error("Unable to delete the service")
      setDeletingId(null)
      return
    }

    setServices((current) =>
      current.filter((item) => item.id !== service.id)
    )

    toast.success("Service deleted")
    setDeletingId(null)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(price || 0))
  }

  return (
    <div className="min-h-screen bg-[var(--yorly-bg)] text-[var(--yorly-text)]">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <main className="min-h-screen md:ml-72">
        <header className="border-b border-[var(--yorly-border)]">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-5 px-5 py-6 md:px-8">
            <div>
              <p className="text-sm font-semibold text-[var(--yorly-primary)]">
                Business management
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                Services
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--yorly-muted)]">
                View and manage the services clients can book through your
                Yorly page.
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

        <div className="mx-auto w-full max-w-7xl px-5 py-8 md:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Your services
              </h2>

              <p className="mt-1 text-sm text-[var(--yorly-muted)]">
                {services.length}{" "}
                {services.length === 1 ? "service" : "services"} available
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--yorly-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <span className="text-xl leading-none">+</span>
              Add Service
            </button>
          </div>

          {loading ? (
            <div className="flex min-h-[420px] items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--yorly-border)] border-t-[var(--yorly-primary)]" />
            </div>
          ) : services.length === 0 ? (
            <section className="flex min-h-[440px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-[var(--yorly-border)] bg-[var(--yorly-surface)] px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl text-[var(--yorly-primary)]">
                ✦
              </div>

              <h2 className="mt-6 text-2xl font-bold">
                No services yet
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-[var(--yorly-muted)]">
                Add the services your clients can select when booking an
                appointment.
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
            <section className="grid gap-5 lg:grid-cols-2">
              {services.map((service) => (
                <article
                  key={service.id}
                  className="rounded-[1.5rem] border border-[var(--yorly-border)] bg-[var(--yorly-surface)] p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      <h3 className="truncate text-xl font-bold">
                        {service.name}
                      </h3>

                      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-[var(--yorly-muted)]">
                        {service.description || "No description added"}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-lg font-bold text-[var(--yorly-primary)]">
                      ✦
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-[var(--yorly-surface-soft)] px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--yorly-muted)]">
                        Price
                      </p>

                      <p className="mt-1 text-lg font-bold">
                        {formatPrice(service.price)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[var(--yorly-surface-soft)] px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--yorly-muted)]">
                        Duration
                      </p>

                      <p className="mt-1 text-lg font-bold">
                        {service.duration} minutes
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3 border-t border-[var(--yorly-border)] pt-5">
                    <button
                      type="button"
                      onClick={() => openEditModal(service)}
                      className="flex-1 rounded-xl border border-[var(--yorly-border)] px-4 py-2.5 text-sm font-semibold transition hover:bg-[var(--yorly-surface-soft)]"
                    >
                      Edit Service
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(service)}
                      disabled={deletingId === service.id}
                      className="rounded-xl border border-red-500/25 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === service.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>

      {/* Add/Edit service modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal()
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[2rem] border border-[var(--yorly-border)] bg-[var(--yorly-surface)] shadow-2xl">
            <div className="flex items-start justify-between border-b border-[var(--yorly-border)] px-6 py-5">
              <div>
                <h2 className="text-xl font-bold">
                  {editingService ? "Edit Service" : "Add Service"}
                </h2>

                <p className="mt-1 text-sm text-[var(--yorly-muted)]">
                  {editingService
                    ? "Update the details clients see when booking."
                    : "Create a new service for your booking page."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close service form"
                className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-[var(--yorly-muted)] transition hover:bg-[var(--yorly-surface-soft)]"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label
                  htmlFor="service-name"
                  className="mb-2 block text-sm font-semibold"
                >
                  Service name
                </label>

                <input
                  id="service-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Silk press"
                  autoFocus
                  className="w-full rounded-xl border border-[var(--yorly-border)] bg-[var(--yorly-surface-soft)] px-4 py-3 outline-none transition focus:border-[var(--yorly-primary)]"
                />
              </div>

              <div>
                <label
                  htmlFor="service-description"
                  className="mb-2 block text-sm font-semibold"
                >
                  Description
                </label>

                <textarea
                  id="service-description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell clients what is included."
                  className="w-full resize-none rounded-xl border border-[var(--yorly-border)] bg-[var(--yorly-surface-soft)] px-4 py-3 outline-none transition focus:border-[var(--yorly-primary)]"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="service-price"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Price
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--yorly-muted)]">
                      $
                    </span>

                    <input
                      id="service-price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="85.00"
                      className="w-full rounded-xl border border-[var(--yorly-border)] bg-[var(--yorly-surface-soft)] py-3 pl-8 pr-4 outline-none transition focus:border-[var(--yorly-primary)]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="service-duration"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Duration
                  </label>

                  <select
                    id="service-duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[var(--yorly-border)] bg-[var(--yorly-surface-soft)] px-4 py-3 outline-none transition focus:border-[var(--yorly-primary)]"
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

              <div className="flex flex-col-reverse gap-3 border-t border-[var(--yorly-border)] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-[var(--yorly-border)] px-5 py-3 text-sm font-semibold transition hover:bg-[var(--yorly-surface-soft)] disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[var(--yorly-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
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