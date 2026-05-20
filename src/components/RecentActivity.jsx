function RecentActivity() {
  const activities = [
    "New booking from Jasmine Carter",
    "Payment received - $120",
    "Client rescheduled appointment",
  ]

  return (
    <div className="bg-[#111827] p-6 rounded-3xl border border-[#E7E1D9] shadow-sm mt-8">
      <h3 className="text-2xl font-semibold text-white mb-6">
        Recent Activity
      </h3>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="p-4 bg-[#F7F4EF] rounded-2xl"
          >
            <p className="text-white">
              {activity}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentActivity