function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl border border-[#334155] bg-white/5 p-6 shadow-sm backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  )
}

export default Card