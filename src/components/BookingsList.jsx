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

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) {
      setBookings(data)
    }

    console.log(data)
    console.log(error)
    setLoading(false)
  }
  const deleteBooking = async (id) => {
  console.log("DELETE CLICKED", id)

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", id)

  if (!error) {
    fetchBookings()
  }

  if (error) {
  toast.error("Failed to delete booking")
} else {
  toast.success("Booking deleted!")
}
}

const updateBooking = async (id) => {
  const { error } = await supabase
    .from("bookings")
    .update({
      client_name: editedName,
    })
    .eq("id", id)

  if (!error) {
    fetchBookings()
    setEditingId(null)
  }

  if (error) {
  toast.error("Failed to update booking")
} else {
  toast.success("Booking updated!")
}
}

const updateStatus = async (id, status) => {
  const { error } = await supabase
    .from("bookings")
    .update({
      status,
    })
    .eq("id", id)

  if (error) {
    toast.error("Failed to update status")
  } else {
    toast.success(`Booking ${status}`)
    fetchBookings()
  }
}

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
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
)
const totalBookings = bookings.length

const todaysBookings = bookings.filter(
  (booking) =>
    booking.date === new Date().toISOString().split("T")[0]
).length
  return (
   <div className="bg-white p-6 rounded-3xl border border-[#E7E1D9] mt-10">
    <h2 className="text-2xl font-bold text-[#1E1E1E] mb-6">
  Recent Bookings
</h2>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

  <div className="bg-[#FAF7F2] border border-[#E7E1D9] rounded-3xl p-6 shadow-sm">
    <p className="text-gray-500 text-sm">
      Total Bookings
    </p>

    <h3 className="text-4xl font-bold mt-2">
      {totalBookings}
    </h3>
  </div>

  <div className="bg-[#FAF7F2] border border-[#E7E1D9] rounded-3xl p-6 shadow-sm">
    <p className="text-gray-500 text-sm">
      Today's Appointments
    </p>

    <h3 className="text-4xl font-bold mt-2">
      {todaysBookings}
    </h3>
  </div>

</div>
<div className="flex flex-col gap-4">
  <input
  type="text"
  placeholder="Search bookings..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="border border-[#E7E1D9] bg-[#FAF7F2] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#C8B6A6]"
/>
 {bookings.length === 0 ? (
  <div className="border border-dashed border-[#D6C7B8] rounded-3xl p-12 text-center bg-[#FAF7F2]">
    <h3 className="text-2xl font-bold text-[#1E1E1E]">
      No bookings yet ✨
    </h3>

    <p className="text-gray-500 mt-3">
      Your upcoming appointments will appear here.
    </p>
  </div>
) : loading ? (
  <div className="border border-[#E7E1D9] rounded-3xl p-10 bg-[#FAF7F2] animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/5"></div>
  </div>
) : (
 filteredBookings.map((booking) => (
  <div
    key={booking.id}
    className="border border-[#E7E1D9] rounded-3xl p-6 bg-[#FAF7F2] shadow-sm hover:shadow-md transition"
  >
    {editingId === booking.id ? (
      <input
        type="text"
        value={editedName}
        onChange={(e) => setEditedName(e.target.value)}
        className="border p-2 rounded-xl w-full"
      />
    ) : (
      <h3 className="text-2xl font-bold">
        {booking.client_name}
      </h3>
    )}

    <p className="inline-block bg-[#E8D8C4] text-[#6F4E37] px-3 py-1 rounded-full text-sm font-medium mt-2">
      {booking.service}
    </p>
   <p
  className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ml-2
    ${
      booking.status === "Confirmed"
        ? "bg-green-100 text-green-700"
        : booking.status === "Cancelled"
        ? "bg-red-100 text-red-700"
        : "bg-yellow-100 text-yellow-700"
    }`}
>
  {booking.status || "Pending"}
</p>

<p className="text-sm text-gray-500 mt-3">
  {booking.email}
</p>

<p className="text-sm text-gray-500">
  {booking.phone}
</p>

{booking.notes && (
  <div className="mt-4 bg-[#F7F4EF] p-4 rounded-2xl">
    <p className="text-sm text-[#8B6F5A]">
      {booking.notes}
    </p>
  </div>
)}

 <span
  className={`px-4 py-2 rounded-full text-sm font-medium
    ${
      booking.status === "Confirmed"
        ? "bg-green-100 text-green-700"
        : booking.status === "Cancelled"
        ? "bg-red-100 text-red-700"
        : "bg-yellow-100 text-yellow-700"
    }
  `}
>
  {booking.status || "Pending"}
</span>

    <div className="mt-4 flex flex-col gap-2 text-[#4B4B4B]">
      <p>📅 {booking.date}</p>
      <p>⏰ {booking.time}</p>
     <p>
  📞{" "}
  {booking.phone.replace(
    /(\d{3})(\d{3})(\d{4})/,
    "$1-$2-$3"
  )}
</p>
    </div>

    <div className="flex gap-3 mt-6">

 <button
  onClick={() => {
    setSelectedBookingId(booking.id)
    setShowDeleteModal(true)
  }}
  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
>
  Delete
</button>

  <button
  onClick={() => {
    setEditingId(booking.id)
    setEditedName(booking.client_name)
  }}
  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition"
>
  Edit
</button>

<button
  onClick={() =>
    updateStatus(booking.id, "Confirmed")
  }
  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition"
>
  Confirm
</button>

<button
  onClick={() =>
    updateStatus(booking.id, "Cancelled")
  }
  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl transition"
>
  Cancel
</button>

 {editingId === booking.id && (
  <button
    onClick={() => updateBooking(booking.id)}
    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition"
  >
    Save
  </button>

  
)}
</div>
  </div>
))
)}

</div>

{showDeleteModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-3xl shadow-xl w-[90%] max-w-md">
      <h2 className="text-2xl font-bold text-[#1E1E1E]">
        Delete Booking?
      </h2>

      <p className="text-[#6B6B6B] mt-3">
        Are you sure you want to permanently delete this booking?
      </p>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="flex-1 border border-[#D6CFC7] py-3 rounded-2xl"
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