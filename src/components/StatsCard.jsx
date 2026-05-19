function StatsCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-[#E7E1D9] shadow-sm">
      <p className="text-[#8B6F5A]">{title}</p>

      <h2 className="text-4xl font-bold text-[#1E1E1E] mt-3">
        {value}
      </h2>
    </div>
  )
}

export default StatsCard