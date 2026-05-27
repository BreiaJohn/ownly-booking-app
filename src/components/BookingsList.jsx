import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import toast from "react-hot-toast"


function BookingsList() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editedName, setEditedName] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [openMenuId, setOpenMenuId] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)

  const formatTime = (time) => {
    if (!time) return ""

    const date = new Date(`2000-01-01T${time}`)

    if (isNaN(date.getTime())) {
      return time
    }

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatPhone = (phone) => {
    if (!phone) return ""

    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
  }

  const getInitials = (name) => {
    if (!name) return "?"

    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }

  const fetchBookings = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) {
      setBookings(data)
    }

    if (error) {
      console.log(error)
    }

    setLoading(false)
  }

  const deleteBooking = async (id) => {
    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id)

    if (error) {
      toast.error("Failed to delete booking")
    } else {
      toast.success("Booking deleted!")
      fetchBookings()
    }
  }

  const updateBooking = async (id) => {
    const { error } = await supabase
      .from("bookings")
      .update({
        client_name: editedName,
      })
      .eq("id", id)

    if (error) {
      toast.error("Failed to update booking")
    } else {
      toast.success("Booking updated!")
      setEditingId(null)
      fetchBookings()
    }
  }

  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id)

    if (error) {
      toast.error("Failed to update status")
    } else {
      toast.success(`Booking ${status}`)
      setOpenMenuId(null)
      fetchBookings()
    }
  }

  const updateFullBooking = async () => {
  const { error } = await supabase
    .from("bookings")
    .update({
      client_name: selectedBooking.client_name,
      service: selectedBooking.service,
      date: selectedBooking.date,
      time: selectedBooking.time,
      phone: selectedBooking.phone,
      status: selectedBooking.status,
      notes: selectedBooking.notes,
      amount: selectedBooking.amount,
payment_status: selectedBooking.payment_status,
payment_method: selectedBooking.payment_method,
    })
    .eq("id", selectedBooking.id)

  if (error) {
    toast.error("Failed to update booking")
  } else {
    toast.success("Booking updated!")
    setShowEditModal(false)
    setSelectedBooking(null)
    fetchBookings()
  }
}

  const getStatusClass = (status) => {
    if (status === "Confirmed") {
      return "bg-green-500/20 text-green-200 border-green-400/20"
    }

    if (status === "Pending") {
      return "bg-yellow-500/20 text-yellow-200 border-yellow-400/20"
    }

    if (status === "Cancelled") {
      return "bg-red-500/20 text-red-200 border-red-400/20"
    }

    if (status === "Completed") {
      return "bg-purple-500/20 text-purple-200 border-purple-400/20"
    }

    return "bg-[#334155] text-white border-[#475569]"
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel("bookings-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        () => {
          fetchBookings()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const filteredBookings = bookings.filter((booking) =>
    booking.client_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  const totalBookings = bookings.length

  const todaysBookings = bookings.filter(
    (booking) =>
      booking.date === new Date().toISOString().split("T")[0]
  ).length

  return (
    <div className="bg-[#0F172A] p-6 rounded-3xl border border-[#334155] mt-10 overflow-visible">
      <h2 className="text-2xl font-bold text-white mb-6">
        Recent Bookings
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#111C34] border border-[#334155] rounded-2xl p-4 shadow-sm hover:border-[#A68A72] transition duration-300">
          <p className="text-[#94A3B8] text-sm font-normal">
            Total Bookings
          </p>

          <h3 className="text-4xl font-bold text-white mt-2">
            {totalBookings}
          </h3>
        </div>

        <div className="bg-[#111C34] border border-[#334155] rounded-2xl p-4 shadow-sm hover:border-[#A68A72] transition duration-300">
          <p className="text-[#94A3B8] text-sm font-normal">
            Today&apos;s Appointments
          </p>

          <h3 className="text-4xl font-bold text-white mt-2">
            {todaysBookings}
          </h3>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-visible">
        <input
          type="text"
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#020617] border border-[#334155] text-white placeholder:text-[#94A3B8] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#C08457]"
        />

        {bookings.length === 0 ? (
          <div className="border border-dashed border-[#334155] rounded-3xl p-12 text-center bg-white/5">
            <h3 className="text-2xl font-bold text-white">
              No bookings yet ✨
            </h3>

            <p className="text-[#94A3B8] mt-3">
              Your upcoming appointments will appear here.
            </p>
          </div>
        ) : loading ? (
          <div className="bg-white/5 backdrop-blur-md border border-[#334155] rounded-3xl p-6 animate-pulse">
            <div className="h-8 bg-[#334155] rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-[#334155] rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-[#334155] rounded w-1/4"></div>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="relative bg-white/5 backdrop-blur-md border border-[#334155] rounded-3xl p-6 md:p-8 shadow-sm hover:border-[#A68A72] transition duration-300"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex items-start gap-4 w-full md:w-1/2">
                  <div className="bg-[#111827] border border-[#334155] w-16 h-16 rounded-full flex items-center justify-center font-normal text-white text-2xl">
                    {getInitials(booking.client_name)}
                  </div>

                  <div>
                    {editingId === booking.id ? (
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) =>
                          setEditedName(e.target.value)
                        }
                        className="bg-[#0F172A] border border-[#334155] text-white p-2 rounded-xl w-full"
                      />
                    ) : (
                      <h3 className="text-xl font-medium text-white tracking-tight">
                        {booking.client_name}
                      </h3>
                    )}

                    <div className="flex flex-wrap gap-3 mt-3">
                      <span className="bg-purple-500/20 text-purple-200 border border-purple-400/20 px-4 py-1 rounded-full text-sm">
                        {booking.service || "Service"}
                      </span>

                      <span
                        className={`px-4 py-1 rounded-full text-sm border ${getStatusClass(
                          booking.status
                        )}`}
                      >
                        {booking.status || "Pending"}
                      </span>
                    </div>

                    <p className="text-[#94A3B8] mt-6">
                      {booking.email}
                    </p>

                    {booking.notes && (
                      <p className="text-[#94A3B8] mt-4">
                        {booking.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="hidden md:block h-32 w-px bg-[#334155]" />

                <div className="flex flex-row gap-4 w-full md:w-1/2 justify-between border-t md:border-t-0 md:border-l border-[#334155] pt-4 md:pt-0 md:pl-6">
                  <div className="flex flex-col gap-4 text-[#94A3B8] text-base md:text-lg">
                    <p>
                      📅{" "}
                      {booking.date
                        ? new Date(booking.date).toLocaleDateString(
                            "en-US"
                          )
                        : "No date"}
                    </p>
                    <p>🕒 {formatTime(booking.time)}</p>
                    <p>📞 {formatPhone(booking.phone)}</p>
                  </div>

                  <div className="relative z-[9999]">
                    <button
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === booking.id
                            ? null
                            : booking.id
                        )
                      }
                      className="bg-white/5 border border-[#334155] hover:border-[#A68A72] text-white px-4 py-2 rounded-xl transition"
                    >
                      ⋮
                    </button>

                    {openMenuId === booking.id && (
                      <div className="absolute right-0 bottom-full mb-2 w-44 bg-[#0F172A] border border-[#334155] rounded-2xl shadow-xl z-[9999] overflow-hidden">
                        <button
  onClick={() => {
    setSelectedBooking(booking)
    setShowEditModal(true)
    setOpenMenuId(null)
  }}
  className="flex w-full items-center gap-3 text-left px-4 py-3 text-white hover:bg-[#1E293B]"
>
  <span>✎</span>
  Edit
</button>

                        <button
                          onClick={() =>
                            updateStatus(booking.id, "Confirmed")
                          }
                          className="flex w-full items-center gap-3 text-left px-4 py-3 text-white hover:bg-[#1E293B]"
                        >
                          <span>✓</span>
                          Confirmed
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(booking.id, "Completed")
                          }
                          className="flex w-full items-center gap-3 text-left px-4 py-3 text-white hover:bg-[#1E293B]"
                        >
                          <span>✔</span>
                          Completed
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(booking.id, "Pending")
                          }
                          className="flex w-full items-center gap-3 text-left px-4 py-3 text-white hover:bg-[#1E293B]"
                        >
                          <span>⏳</span>
                          Pending
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(booking.id, "Cancelled")
                          }
                          className="flex w-full items-center gap-3 text-left px-4 py-3 text-white hover:bg-[#1E293B]"
                        >
                          <span>×</span>
                          Cancelled
                        </button>

                        <button
                          onClick={() => {
                            setSelectedBookingId(booking.id)
                            setShowDeleteModal(true)
                            setOpenMenuId(null)
                          }}
                          className="flex w-full items-center gap-3 text-left px-4 py-3 text-red-300 hover:bg-[#3F1D1D] border-t border-[#334155]"
                        >
                          <span>🗑</span>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {editingId === booking.id && (
                <button
                  onClick={() => updateBooking(booking.id)}
                  className="mt-6 px-4 py-2 rounded-xl bg-[#132F24] border border-[#1F6F50] text-[#86EFAC] hover:bg-[#18392C] transition-all duration-200 text-sm"
                >
                  Save
                </button>
              )}
            </div>
          ))
        )}
      </div>
  

      {showEditModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[#0F172A] border border-[#334155] rounded-3xl shadow-xl w-full max-w-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Edit Booking
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={selectedBooking.client_name || ""}
                onChange={(e) =>
                  setSelectedBooking({
                    ...selectedBooking,
                    client_name: e.target.value,
                  })
                }
                className="bg-[#020617] border border-[#334155] text-white rounded-2xl px-4 py-3 outline-none"
              />

              <input
                type="text"
                value={selectedBooking.service || ""}
                onChange={(e) =>
                  setSelectedBooking({
                    ...selectedBooking,
                    service: e.target.value,
                  })
                }
                className="bg-[#020617] border border-[#334155] text-white rounded-2xl px-4 py-3 outline-none"
              />

              <input
                type="date"
                value={selectedBooking.date || ""}
                onChange={(e) =>
                  setSelectedBooking({
                    ...selectedBooking,
                    date: e.target.value,
                  })
                }
                style={{ colorScheme: "dark" }}
                className="bg-[#020617] border border-[#334155] text-white rounded-2xl px-4 py-3 outline-none"
              />

              <input
                type="time"
                value={selectedBooking.time || ""}
                onChange={(e) =>
                  setSelectedBooking({
                    ...selectedBooking,
                    time: e.target.value,
                  })
                }
                style={{ colorScheme: "dark" }}
                className="bg-[#020617] border border-[#334155] text-white rounded-2xl px-4 py-3 outline-none"
              />

              <input
                type="text"
                value={selectedBooking.phone || ""}
                onChange={(e) =>
                  setSelectedBooking({
                    ...selectedBooking,
                    phone: e.target.value,
                  })
                }
                className="bg-[#020617] border border-[#334155] text-white rounded-2xl px-4 py-3 outline-none"
              />

              <select
                value={selectedBooking.status || "Pending"}
                onChange={(e) =>
                  setSelectedBooking({
                    ...selectedBooking,
                    status: e.target.value,
                  })
                }
                className="bg-[#020617] border border-[#334155] text-white rounded-2xl px-4 py-3 outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <input
  type="number"
  placeholder="Amount"
  value={selectedBooking.amount || ""}
  onChange={(e) =>
    setSelectedBooking({
      ...selectedBooking,
      amount: e.target.value,
    })
  }
  className="bg-[#020617] border border-[#334155] text-white rounded-2xl px-4 py-3 outline-none"
/>

<select
  value={selectedBooking.payment_status || "Pending"}
  onChange={(e) =>
    setSelectedBooking({
      ...selectedBooking,
      payment_status: e.target.value,
    })
  }
  className="bg-[#020617] border border-[#334155] text-white rounded-2xl px-4 py-3 outline-none"
>
  <option value="Pending">Pending</option>
  <option value="Paid">Paid</option>
  <option value="Unpaid">Unpaid</option>
</select>

<select
  value={selectedBooking.payment_method || ""}
  onChange={(e) =>
    setSelectedBooking({
      ...selectedBooking,
      payment_method: e.target.value,
    })
  }
  className="bg-[#020617] border border-[#334155] text-white rounded-2xl px-4 py-3 outline-none"
>
  <option value="">Payment Method</option>
  <option value="Cash">Cash</option>
  <option value="Card">Card</option>
  <option value="Apple Pay">Apple Pay</option>
  <option value="Cash App">Cash App</option>
  <option value="Zelle">Zelle</option>
</select>

              <textarea
                value={selectedBooking.notes || ""}
                onChange={(e) =>
                  setSelectedBooking({
                    ...selectedBooking,
                    notes: e.target.value,
                  })
                }
                placeholder="Notes"
                className="md:col-span-2 bg-[#020617] border border-[#334155] text-white rounded-2xl px-4 py-3 outline-none min-h-28"
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedBooking(null)
                }}
                className="flex-1 border border-[#334155] text-white py-3 rounded-2xl"
              >
                Cancel
              </button>

              <button
                onClick={updateFullBooking}
                className="flex-1 bg-[#4B5563] hover:bg-[#5B6472] text-white py-3 rounded-2xl transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[#0F172A] p-8 rounded-3xl shadow-xl w-[90%] max-w-md">
            <h2 className="text-2xl font-bold text-white">
              Delete Booking?
            </h2>

            <p className="text-[#94A3B8] mt-3">
              Are you sure you want to permanently delete this booking?
            </p>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 border border-[#334155] text-white py-3 rounded-2xl"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await deleteBooking(selectedBookingId)
                  setShowDeleteModal(false)
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingsList