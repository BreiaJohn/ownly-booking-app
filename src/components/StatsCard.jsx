function StatsCard({ title, value }) {
  return (
    <div className="bg-[#111827] p-6 rounded-3xl border border-[#E7E1D9] shadow-sm">
      <p className="text-[#8B6F5A]">{title}</p>

      <h2 className="text-4xl font-bold text-white mt-3">
        {value}
      </h2>
    </div>
  )
}

export default StatsCard